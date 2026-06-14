export async function csvToPdf(content: string): Promise<Buffer> {
  if (content.startsWith('PK') || content.includes('\u0000\u0000\u0000')) {
    throw new Error('Please upload a plain .csv file, not an Excel (.xlsx) file.');
  }

  const lines = content.split('\n').filter((l) => l.trim() !== '');
  if (lines.length === 0) throw new Error('CSV file is empty.');

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map((line) =>
    line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
  );

  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const colWidth = Math.min((pageWidth - margin * 2) / headers.length, 60);
  let y = margin;

  // Header row
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(59, 130, 246);
  doc.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F');
  doc.setTextColor(255, 255, 255);
  headers.forEach((header, i) => {
    doc.text(header.substring(0, 12), margin + i * colWidth + 2, y);
  });
  y += 8;

  // Data rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  rows.forEach((row, rowIndex) => {
    if (y > pageHeight - margin) { doc.addPage(); y = margin; }

    if (rowIndex % 2 === 0) {
      doc.setFillColor(243, 244, 246);
      doc.rect(margin, y - 4, pageWidth - margin * 2, 7, 'F');
    }

    doc.setTextColor(30, 30, 30);
    row.forEach((cell, i) => {
      doc.text(String(cell).substring(0, 12), margin + i * colWidth + 2, y);
    });
    y += 7;
  });

  return Buffer.from(doc.output('arraybuffer'));
}