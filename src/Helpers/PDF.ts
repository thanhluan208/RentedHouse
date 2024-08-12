import * as pdfMake from "pdfmake/build/pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

// Remove the assignment to the vfs property



export const generatePDF = (dd: TDocumentDefinitions) => {
  pdfMake.createPdf(dd).download();
};
