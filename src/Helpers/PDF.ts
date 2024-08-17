import * as pdfMake from "pdfmake/build/pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import "pdfmake/build/vfs_fonts";

console.log(pdfFonts.pdfMake?.vfs);
(<any>pdfMake).vfs = null;
const interval = setInterval(() => {
  if (pdfFonts.pdfMake?.vfs) {
    clearInterval(interval);
    (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
  } else {
    console.log("Waiting for pdfMake.vfs to be available");
  }
}, 100);

// Remove the assignment to the vfs property

export const generatePDF: any = (dd: TDocumentDefinitions) => {
  pdfMake.createPdf(dd).download();
};
