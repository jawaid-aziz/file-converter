function sanitize(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[^\x00-\x7F]/g, (char) => {
      const replacements: Record<string, string> = {
        '\u2018': "'", '\u2019': "'", '\u201C': '"', '\u201D': '"',
        '\u2013': '-', '\u2014': '--', '\u2026': '...', '\u00A0': ' ',
        '\u00E9': 'e', '\u00E8': 'e', '\u00EA': 'e', '\u00EB': 'e',
        '\u00E0': 'a', '\u00E2': 'a', '\u00E4': 'a', '\u00F9': 'u',
        '\u00FB': 'u', '\u00FC': 'u', '\u00EE': 'i', '\u00EF': 'i',
        '\u00F4': 'o', '\u00F6': 'o', '\u00E7': 'c', '\u00F1': 'n',
      };
      return replacements[char] ?? '';
    })
    .replace(/%/g, 'pct')
    .trim();
}

export async function mdToPdf(content: string): Promise<Buffer> {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const addPageIfNeeded = (height: number) => {
    if (y + height > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Heading 1
    if (trimmed.startsWith('# ')) {
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      const text = sanitize(trimmed.replace(/^# /, ''));
      const wrapped = doc.splitTextToSize(text, maxWidth);
      addPageIfNeeded(10 * wrapped.length + 4);
      doc.text(wrapped, margin, y);
      y += 10 * wrapped.length + 6;

    // Heading 2
    } else if (trimmed.startsWith('## ')) {
      doc.setFontSize(17);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      const text = sanitize(trimmed.replace(/^## /, ''));
      const wrapped = doc.splitTextToSize(text, maxWidth);
      addPageIfNeeded(8 * wrapped.length + 3);
      doc.text(wrapped, margin, y);
      y += 8 * wrapped.length + 5;

    // Heading 3
    } else if (trimmed.startsWith('### ')) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      const text = sanitize(trimmed.replace(/^### /, ''));
      const wrapped = doc.splitTextToSize(text, maxWidth);
      addPageIfNeeded(7 * wrapped.length + 3);
      doc.text(wrapped, margin, y);
      y += 7 * wrapped.length + 4;

    // Bullet points
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 30, 30);
      const text = '- ' + sanitize(trimmed.replace(/^[-*] /, ''));
      const wrapped = doc.splitTextToSize(text, maxWidth - 8);
      addPageIfNeeded(6 * wrapped.length + 1);
      doc.text(wrapped, margin + 5, y);
      y += 6 * wrapped.length + 2;

    // Numbered list
    } else if (/^\d+\.\s/.test(trimmed)) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 30, 30);
      const text = sanitize(trimmed);
      const wrapped = doc.splitTextToSize(text, maxWidth - 8);
      addPageIfNeeded(6 * wrapped.length + 1);
      doc.text(wrapped, margin + 5, y);
      y += 6 * wrapped.length + 2;

    // Blockquote
    } else if (trimmed.startsWith('> ')) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(80, 80, 80);
      const text = sanitize(trimmed.replace(/^> /, ''));
      const wrapped = doc.splitTextToSize(text, maxWidth - 10);
      addPageIfNeeded(6 * wrapped.length + 2);
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.5);
      doc.line(margin + 2, y - 4, margin + 2, y + 6 * wrapped.length - 2);
      doc.text(wrapped, margin + 6, y);
      y += 6 * wrapped.length + 3;

    // Horizontal rule
    } else if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      addPageIfNeeded(6);
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

    // Code block (opening/closing ```)
    } else if (trimmed.startsWith('```')) {
      y += 2;

    // Empty line
    } else if (trimmed === '') {
      y += 4;

    // Normal paragraph
    } else {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 30, 30);
      const clean = sanitize(trimmed);
      if (!clean) continue;
      const wrapped = doc.splitTextToSize(clean, maxWidth);
      addPageIfNeeded(6 * wrapped.length + 2);
      doc.text(wrapped, margin, y);
      y += 6 * wrapped.length + 3;
    }
  }

  return Buffer.from(doc.output('arraybuffer'));
}