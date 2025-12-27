const { PDFDocument } = PDFLib;
const { jsPDF } = window.jspdf;

const progressBar = document.getElementById("progressBar");

/* ---------------- DARK MODE ---------------- */
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
};

/* ---------------- DRAG LIST HANDLING ---------------- */
function makeSortable(list) {
  let drag;
  list.addEventListener("dragstart", e => drag = e.target);
  list.addEventListener("dragover", e => e.preventDefault());
  list.addEventListener("drop", e => {
    e.preventDefault();
    if (e.target.tagName === "LI") {
      list.insertBefore(drag, e.target.nextSibling);
    }
  });
}

/* ---------------- COMPRESS (WORKER) ---------------- */
async function compressPDF() {
  const file = document.getElementById("compressPdf").files[0];
  if (!file) return alert("Upload PDF");

  progress(30);
  const worker = new Worker("worker.js");
  worker.postMessage({ buffer: await file.arrayBuffer() });

  worker.onmessage = e => {
    progress(100);
    download(e.data, "compressed.pdf");
  };
}

/* ---------------- MERGE ---------------- */
async function mergePDFs() {
  const files = document.getElementById("mergePdf").files;
  if (files.length < 2) return alert("Upload ≥2 PDFs");

  const merged = await PDFDocument.create();
  for (let f of files) {
    progress(20);
    const pdf = await PDFDocument.load(await f.arrayBuffer());
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(p => merged.addPage(p));
  }
  download(await merged.save(), "merged.pdf");
}

/* ---------------- IMAGES TO PDF ---------------- */
async function imagesToPDF() {
  const files = document.getElementById("images").files;
  if (files.length > 30) return alert("Max 30 images");

  const pdf = new jsPDF();
  for (let i = 0; i < files.length; i++) {
    progress((i / files.length) * 100);
    const img = await readImg(files[i]);
    if (i) pdf.addPage();
    pdf.addImage(img, "JPEG", 10, 10, 190, 270);
  }
  pdf.save("images.pdf");
}

/* ---------------- SPLIT ---------------- */
async function splitPDF() {
  const file = document.getElementById("splitPdf").files[0];
  const range = document.getElementById("pageRange").value;
  if (!file || !range) return alert("Input missing");

  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const newPdf = await PDFDocument.create();

  parseRange(range).forEach(i => newPdf.addPage(pdf.getPage(i - 1)));
  download(await newPdf.save(), "split.pdf");
}

/* ---------------- UNLOCK ---------------- */
async function unlockPDF() {
  const file = document.getElementById("lockedPdf").files[0];
  const pwd = document.getElementById("pdfPassword").value;
  try {
    const pdf = await PDFDocument.load(await file.arrayBuffer(), { password: pwd });
    download(await pdf.save(), "unlocked.pdf");
  } catch {
    alert("Invalid password");
  }
}

/* ---------------- OCR ---------------- */
async function runOCR() {
  const file = document.getElementById("ocrPdf").files[0];
  if (!file) return;

  const worker = Tesseract.createWorker();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  const { data } = await worker.recognize(file);
  document.getElementById("ocrOutput").textContent = data.text;
  worker.terminate();
}

/* ---------------- HELPERS ---------------- */
function progress(p) { progressBar.style.width = p + "%"; }

function download(bytes, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([bytes]));
  a.download = name;
  a.click();
}

function readImg(file) {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.readAsDataURL(file);
  });
}

function parseRange(r) {
  const pages = [];
  r.split(",").forEach(p => {
    if (p.includes("-")) {
      const [s, e] = p.split("-").map(Number);
      for (let i = s; i <= e; i++) pages.push(i);
    } else pages.push(Number(p));
  });
  return pages;
}
