import * as pdfMake from "pdfmake/build/pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import 'pdfmake/build/vfs_fonts';

// eslint-disable-next-lines
(<any>pdfMake).vfs = pdfFonts.pdfMake?.vfs;

// Remove the assignment to the vfs property

export const generatePDF = (dd: TDocumentDefinitions) => {
  pdfMake.createPdf(dd).download();
};
