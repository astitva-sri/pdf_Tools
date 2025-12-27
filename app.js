const { PDFDocument } = PDFLib;
const { jsPDF } = window.jspdf;

/* ---------------- PDF COMPRESSION ---------------- */
async function compressPDF() {
  const file = document.getElementById("compressPdf").files[0];
  const targetMB = document.getElementById("targetSize").value;

  if (!file) return alert("Upload a PDF");

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);

  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(pdf, pdf.getPageIndices());

  pages.forEach(page => newPdf.addPage(page));

  const compressedBytes = await newPdf.save({
    useObjectStreams: true,
    compress: true
  });

  downloadFile(compressedBytes, "compressed.pdf");
}

/* ---------------- MERGE PDFS ---------------- */
async function mergePDFs() {
  const files = document.getElementById("mergePdf").files;
  if (files.length < 2) return alert("Upload at least 2 PDFs");

  const mergedPdf = await PDFDocument.create();

  for (let file of files) {
    const pdfBytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(pdfBytes);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(p => mergedPdf.addPage(p));
  }

  const mergedBytes = await mergedPdf.save();
  downloadFile(mergedBytes, "merged.pdf");
}

/* ---------------- IMAGES TO PDF ---------------- */
async function imagesToPDF() {
  const files = document.getElementById("images").files;
  if (!files.length) return alert("Upload images");
  if (files.length > 30) return alert("Max 30 images allowed");

  const pdf = new jsPDF();

  for (let i = 0; i < files.length; i++) {
    const imgData = await readImage(files[i]);
    if (i !== 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 10, 10, 190, 270);
  }

  pdf.save("images.pdf");
}

/* ---------------- UNLOCK PDF ---------------- */
async function unlockPDF() {
  const file = document.getElementById("lockedPdf").files[0];
  const password = document.getElementById("pdfPassword").value;

  if (!file || !password) return alert("PDF & password required");

  try {
    const pdfBytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(pdfBytes, { password });

    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(p => newPdf.addPage(p));

    const unlockedBytes = await newPdf.save();
    downloadFile(unlockedBytes, "unlocked.pdf");
  } catch {
    alert("Wrong password or protected PDF");
  }
}

/* ---------------- HELPERS ---------------- */
function downloadFile(bytes, filename) {
  const blob = new Blob([bytes]);
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function readImage(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}
