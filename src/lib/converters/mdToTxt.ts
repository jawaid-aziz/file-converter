import { extractTextFromPdf } from './pdfToText';

export async function pdfToTxt(buffer: Buffer): Promise<string> {
  const text = await extractTextFromPdf(buffer);

  return text
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}