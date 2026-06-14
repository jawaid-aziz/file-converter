export async function txtToPdf(content: string): Promise<Buffer> {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '') {
      y += 4;
      continue;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const wrapped = doc.splitTextToSize(trimmed, maxWidth);

    if (y + 6 * wrapped.length > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }

    doc.text(wrapped, margin, y);
    y += 6 * wrapped.length + 2;
  }

  return Buffer.from(doc.output('arraybuffer'));
}