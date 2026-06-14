import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx';

export async function txtToDocx(content: string): Promise<Buffer> {
  const lines = content.split('\n');

  const children = lines.map((line) => {
    const trimmed = line.trim();

    if (trimmed === '') {
      return new Paragraph({});
    }

    if (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && trimmed.length < 60) {
      return new Paragraph({
        text: trimmed,
        heading: HeadingLevel.HEADING_2,
      });
    }

    return new Paragraph({
      children: [new TextRun({ text: trimmed, size: 24 })],
    });
  });

  const doc = new Document({ sections: [{ children }] });
  return await Packer.toBuffer(doc);
}