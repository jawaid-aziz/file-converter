export async function mdToPdf(content: string): Promise<Buffer> {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Heading 1
    if (trimmed.startsWith('# ')) {
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      const text = trimmed.replace(/^# /, '');
      const wrapped = doc.splitTextToSize(text, maxWidth);
      if (y + 10 * wrapped.length > pageHeight - margin) { doc.addPage(); y = margin; }
      doc.text(wrapped, margin, y);
      y += 10 * wrapped.length + 4;

    // Heading 2
    } else if (trimmed.startsWith('## ')) {
      doc.setFontSize(17);
      doc.setFont('helvetica', 'bold');
      const text = trimmed.replace(/^## /, '');
      const wrapped = doc.splitTextToSize(text, maxWidth);
      if (y + 8 * wrapped.length > pageHeight - margin) { doc.addPage(); y = margin; }
      doc.text(wrapped, margin, y);
      y += 8 * wrapped.length + 3;

    // Heading 3
    } else if (trimmed.startsWith('### ')) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      const text = trimmed.replace(/^### /, '');
      const wrapped = doc.splitTextToSize(text, maxWidth);
      if (y + 7 * wrapped.length > pageHeight - margin) { doc.addPage(); y = margin; }
      doc.text(wrapped, margin, y);
      y += 7 * wrapped.length + 3;

    // Bullet points
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const text = '• ' + trimmed.replace(/^[-*] /, '');
      const wrapped = doc.splitTextToSize(text, maxWidth - 5);
      if (y + 6 * wrapped.length > pageHeight - margin) { doc.addPage(); y = margin; }
      doc.text(wrapped, margin + 5, y);
      y += 6 * wrapped.length + 1;

    // Horizontal rule
    } else if (trimmed === '---' || trimmed === '***') {
      if (y + 5 > pageHeight - margin) { doc.addPage(); y = margin; }
      doc.setDrawColor(180, 180, 180);
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;

    // Empty line
    } else if (trimmed === '') {
      y += 4;

    // Normal paragraph
    } else {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      // Strip inline markdown (bold, italic, code)
      const clean = trimmed
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
      const wrapped = doc.splitTextToSize(clean, maxWidth);
      if (y + 6 * wrapped.length > pageHeight - margin) { doc.addPage(); y = margin; }
      doc.text(wrapped, margin, y);
      y += 6 * wrapped.length + 2;
    }
  }

  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}