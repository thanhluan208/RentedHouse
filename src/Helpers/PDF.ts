import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;



export const generatePDF = (dd: TDocumentDefinitions) => {
  pdfMake.createPdf(dd).download();
};
