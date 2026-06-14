import { extractTextFromPdf } from './pdfToText';

export async function pdfToMd(buffer: Buffer): Promise<string> {
  const text = await extractTextFromPdf(buffer);
  const lines = text.split('\n');

  const converted = lines.map((line) => {
    const trimmed = line.trim();
    if (trimmed === '') return '';
    if (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && trimmed.length < 80) {
      return `## ${trimmed}`;
    }
    return trimmed;
  });

  return converted.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}