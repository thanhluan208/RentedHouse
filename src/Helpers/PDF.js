import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = null;
const interval = setInterval(() => {
  if (pdfFonts?.pdfMake?.vfs) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    clearInterval(interval);
  } else {
    console.log("Waiting for pdfMake.vfs to be ready...");
  }
}, 200);

export const generatePDF = (dd) => {
  pdfMake.createPdf(dd).download();
};
