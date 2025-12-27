const { PDFDocument } = PDFLib;
const { jsPDF } = window.jspdf;

const content = document.getElementById("content");
const progressBar = document.getElementById("progressBar");
const historyStack = [];

/* ---------------- NAVIGATION ---------------- */

function navigate(page) {
  if (!page) return;
  historyStack.push(page);
  renderPage(page);
}

function goHome() {
  historyStack.length = 0;
  renderHome();
}

function goBack() {
  historyStack.pop();
  const last = historyStack.pop();
  last ? renderPage(last) : renderHome();
}

function renderHome() {
  content.innerHTML = `
    <div class="page">
      <h2>Select a Tool</h2>
      <button onclick="navigate('compress')">Compress PDF</button>
      <button onclick="navigate('merge')">Merge PDFs</button>
      <button onclick="navigate('images')">Images → PDF</button>
      <button onclick="navigate('split')">Split PDF</button>
      <button onclick="navigate('unlock')">Unlock PDF</button>
    </div>`;
}

/* ---------------- PAGES ---------------- */

function renderPage(p) {
  const pages = {
    compress: `
      <div class="page">
        <h2>Compress PDF</h2>
        <input type="file" id="compressPdf">
        <button onclick="compressPDF()">Compress</button>
      </div>`,

    merge: `
      <div class="page">
        <h2>Merge PDFs</h2>
        <input type="file" id="mergePdf" multiple>
        <button onclick="mergePDFs()">Merge</button>
      </div>`,

    images: `
      <div class="page">
        <h2>Images → PDF</h2>
        <input type="file" id="images" multiple>
        <button onclick="imagesToPDF()">Create PDF</button>
      </div>`,

    split: `
      <div class="page">
        <h2>Split PDF</h2>
        <input type="file" id="splitPdf">
        <input type="text" id="range" placeholder="1-3,5">
        <button onclick="splitPDF()">Split</button>
      </div>`,

    unlock: `
      <div class="page">
        <h2>Unlock PDF</h2>
        <input type="file" id="lockedPdf">
        <input type="password" id="password" placeholder="Password">
        <button onclick="unlockPDF()">Unlock</button>
      </div>`
  };

  content.innerHTML = pages[p];
}

/* ---------------- FUNCTIONALITY ---------------- */

async function compressPDF() {
  const file = document.getElementById("compressPdf").files[0];
  if (!file) return alert("Upload PDF");

  const worker = new Worker("worker.js");
  worker.postMessage(await file.arrayBuffer());
  worker.onmessage = e => download(e.data, "compressed.pdf");
}

async function mergePDFs() {
  const files = document.getElementById("mergePdf").files;
  if (files.length < 2) return alert("Upload ≥2 PDFs");

  const merged = await PDFDocument.create();
  for (let f of files) {
    const pdf = await PDFDocument.load(await f.arrayBuffer());
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(p => merged.addPage(p));
  }
  download(await merged.save(), "merged.pdf");
}

async function imagesToPDF() {
  const files = document.getElementById("images").files;
  if (files.length > 30) return alert("Max 30 images");

  const pdf = new jsPDF();
  for (let i = 0; i < files.length; i++) {
    const img = await readImg(files[i]);
    if (i) pdf.addPage();
    pdf.addImage(img, "JPEG", 10, 10, 190, 270);
  }
  pdf.save("images.pdf");
}

async function splitPDF() {
  const file = document.getElementById("splitPdf").files[0];
  const range = document.getElementById("range").value;
  if (!file || !range) return alert("Missing input");

  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const newPdf = await PDFDocument.create();

  parseRange(range).forEach(i => newPdf.addPage(pdf.getPage(i - 1)));
  download(await newPdf.save(), "split.pdf");
}

async function unlockPDF() {
  const file = document.getElementById("lockedPdf").files[0];
  const pwd = document.getElementById("password").value;
  try {
    const pdf = await PDFDocument.load(await file.arrayBuffer(), { password: pwd });
    download(await pdf.save(), "unlocked.pdf");
  } catch {
    alert("Wrong password");
  }
}

/* ---------------- HELPERS ---------------- */

function download(bytes, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([bytes]));
  a.download = name;
  a.click();
}

function readImg(file) {
  return new Promise(r => {
    const fr = new FileReader();
    fr.onload = () => r(fr.result);
    fr.readAsDataURL(file);
  });
}

function parseRange(r) {
  const out = [];
  r.split(",").forEach(p => {
    if (p.includes("-")) {
      const [s, e] = p.split("-").map(Number);
      for (let i = s; i <= e; i++) out.push(i);
    } else out.push(Number(p));
  });
  return out;
}

/* INIT */
renderHome();
