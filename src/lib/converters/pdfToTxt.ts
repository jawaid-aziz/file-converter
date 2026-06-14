import { extractTextFromPdf } from './pdfToText';

export async function pdfToTxt(buffer: Buffer): Promise<string> {
  return await extractTextFromPdf(buffer);
}