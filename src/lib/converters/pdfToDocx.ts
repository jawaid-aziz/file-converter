import { extractTextFromPdf } from './pdfToText';
import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx';

export async function pdfToDocx(buffer: Buffer): Promise<Buffer> {
  const text = await extractTextFromPdf(buffer);
  const lines = text.split('\n');

  const children: Paragraph[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '') {
      children.push(new Paragraph({}));
      continue;
    }

    // Page separator
    if (trimmed === '---') {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: '', break: 1 })],
        })
      );
      continue;
    }

    // All caps short line = Heading 2
    if (trimmed === trimmed.toUpperCase() && trimmed.length > 2 && trimmed.length < 80 && !trimmed.endsWith('.')) {
      children.push(
        new Paragraph({ text: trimmed, heading: HeadingLevel.HEADING_2 })
      );
      continue;
    }

    // Short line without trailing punctuation = Heading 3
    if (
      trimmed.length < 80 &&
      !trimmed.endsWith('.') &&
      !trimmed.endsWith(',') &&
      !trimmed.endsWith(';') &&
      trimmed !== trimmed.toLowerCase()
    ) {
      children.push(
        new Paragraph({ text: trimmed, heading: HeadingLevel.HEADING_3 })
      );
      continue;
    }

    // Normal paragraph
    children.push(
      new Paragraph({
        children: [new TextRun({ text: trimmed, size: 24 })],
        spacing: { after: 120 },
      })
    );
  }

  const doc = new Document({ sections: [{ children }] });
  return await Packer.toBuffer(doc);
}