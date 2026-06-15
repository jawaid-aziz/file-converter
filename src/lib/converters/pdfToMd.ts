import { extractTextFromPdf } from './pdfToText';

export async function pdfToMd(buffer: Buffer): Promise<string> {
  const text = await extractTextFromPdf(buffer);

  const lines = text.split('\n');
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === '') {
      result.push('');
      continue;
    }

    // Page separator
    if (line === '---') {
      result.push('\n---\n');
      continue;
    }

    // Detect heading: short line, no trailing punctuation, not all lowercase
    const isHeading =
      line.length < 80 &&
      !line.endsWith('.') &&
      !line.endsWith(',') &&
      !line.endsWith(';') &&
      !line.endsWith(':') &&
      line !== line.toLowerCase();

    if (isHeading) {
      // All caps = h2, title case or short = h3
      if (line === line.toUpperCase() && line.length > 2) {
        result.push(`## ${line}`);
      } else {
        result.push(`### ${line}`);
      }
    } else {
      result.push(line);
    }
  }

  return result
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}