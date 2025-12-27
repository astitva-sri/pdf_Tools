importScripts("https://unpkg.com/pdf-lib/dist/pdf-lib.min.js");

onmessage = async e => {
  const pdf = await PDFLib.PDFDocument.load(e.data);
  const out = await PDFLib.PDFDocument.create();
  const pages = await out.copyPages(pdf, pdf.getPageIndices());
  pages.forEach(p => out.addPage(p));
  postMessage(await out.save({ compress: true }));
};
