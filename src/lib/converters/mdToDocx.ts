import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx';

export async function mdToDocx(content: string): Promise<Buffer> {
  const lines = content.split('\n');

  const children = lines.map((line) => {
    const trimmed = line.trim();

    if (trimmed === '') return new Paragraph({});

    if (trimmed.startsWith('# ')) {
      return new Paragraph({ text: trimmed.replace(/^# /, ''), heading: HeadingLevel.HEADING_1 });
    }
    if (trimmed.startsWith('## ')) {
      return new Paragraph({ text: trimmed.replace(/^## /, ''), heading: HeadingLevel.HEADING_2 });
    }
    if (trimmed.startsWith('### ')) {
      return new Paragraph({ text: trimmed.replace(/^### /, ''), heading: HeadingLevel.HEADING_3 });
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: trimmed.replace(/^[-*] /, ''), size: 24 })],
      });
    }

    // Parse inline bold/italic
    const runs: TextRun[] = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|[^*`]+)/g;
    let match;
    while ((match = regex.exec(trimmed)) !== null) {
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        runs.push(new TextRun({ text: token.slice(2, -2), bold: true, size: 24 }));
      } else if (token.startsWith('*') && token.endsWith('*')) {
        runs.push(new TextRun({ text: token.slice(1, -1), italics: true, size: 24 }));
      } else if (token.startsWith('`') && token.endsWith('`')) {
        runs.push(new TextRun({ text: token.slice(1, -1), font: 'Courier New', size: 22 }));
      } else {
        runs.push(new TextRun({ text: token, size: 24 }));
      }
    }

    return new Paragraph({ children: runs });
  });

  const doc = new Document({ sections: [{ children }] });
  return await Packer.toBuffer(doc);
}