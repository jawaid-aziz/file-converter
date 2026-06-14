import * as pdfParse from 'pdf-parse';

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const data = await (pdfParse as unknown as (buffer: Buffer) => Promise<{ text: string }>)(buffer);
  return data.text;
}