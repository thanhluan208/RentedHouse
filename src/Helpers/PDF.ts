import * as pdfMake from "pdfmake/build/pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";

// Remove the assignment to the vfs property



export const generatePDF = (dd: TDocumentDefinitions) => {
  pdfMake.createPdf(dd).download();
};
