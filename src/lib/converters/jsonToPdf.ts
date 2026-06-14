export async function jsonToPdf(content: string): Promise<Buffer> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('Invalid JSON format.');
  }

  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('JSON Data', margin, y);
  y += 10;

  doc.setFontSize(9);
  doc.setFont('courier', 'normal');

  const jsonLines = JSON.stringify(parsed, null, 2).split('\n');

  for (const line of jsonLines) {
    const wrapped = doc.splitTextToSize(line, maxWidth);
    if (y + 5 * wrapped.length > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(wrapped, margin, y);
    y += 5 * wrapped.length + 1;
  }

  return Buffer.from(doc.output('arraybuffer'));
}