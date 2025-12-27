importScripts("https://unpkg.com/pdf-lib/dist/pdf-lib.min.js");

self.onmessage = async (e) => {
  const { buffer } = e.data;
  const pdf = await PDFLib.PDFDocument.load(buffer);
  const newPdf = await PDFLib.PDFDocument.create();

  const pages = await newPdf.copyPages(pdf, pdf.getPageIndices());
  pages.forEach(p => newPdf.addPage(p));

  const bytes = await newPdf.save({ compress: true });
  postMessage(bytes);
};
