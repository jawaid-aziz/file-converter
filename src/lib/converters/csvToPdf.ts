function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export async function csvToPdf(content: string): Promise<Buffer> {
  if (content.startsWith('PK') || content.includes('\u0000\u0000\u0000')) {
    throw new Error('Please upload a plain .csv file, not an Excel (.xlsx) file.');
  }

  const lines = content.split('\n').filter((l) => l.trim() !== '');
  if (lines.length === 0) throw new Error('CSV file is empty.');

  const headers = parseCSVLine(lines[0]).map((h) => h.replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map((line) =>
    parseCSVLine(line).map((v) => v.replace(/^"|"$/g, ''))
  );

  const { jsPDF } = await import('jspdf');

  const orientation = headers.length > 5 ? 'landscape' : 'portrait';
  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const tableWidth = pageWidth - margin * 2;

  // Dynamic column widths based on content
  const colWidths: number[] = headers.map((header, colIndex) => {
    const maxContentLen = Math.max(
      header.length,
      ...rows.map((row) => String(row[colIndex] ?? '').length)
    );
    return Math.max(15, Math.min(maxContentLen * 2.2, 55));
  });

  const totalRaw = colWidths.reduce((a, b) => a + b, 0);
  const scale = tableWidth / Math.max(totalRaw, tableWidth);
  const finalColWidths = colWidths.map((w) => w * scale);

  const rowHeight = 8;
  const headerHeight = 10;
  let y = margin;

  const drawHeader = () => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, tableWidth, headerHeight, 'S');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);

    let x = margin;
    headers.forEach((header, i) => {
      const cellWidth = finalColWidths[i];
      if (i > 0) {
        doc.setDrawColor(0, 0, 0);
        doc.line(x, y, x, y + headerHeight);
      }
      const maxChars = Math.floor(cellWidth / 2.1);
      const text = header.length > maxChars ? header.substring(0, maxChars - 1) + '…' : header;
      doc.text(text, x + 2, y + 6.5);
      x += cellWidth;
    });

    y += headerHeight;
  };

  const drawRow = (row: string[], rowIndex: number) => {
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.1);
    doc.rect(margin, y, tableWidth, rowHeight, 'S');

    doc.setFontSize(8.5);
    doc.setFont('helvetica', rowIndex % 2 === 0 ? 'normal' : 'normal');
    doc.setTextColor(30, 30, 30);

    let x = margin;
    headers.forEach((_, i) => {
      const cellWidth = finalColWidths[i];
      if (i > 0) {
        doc.setDrawColor(180, 180, 180);
        doc.line(x, y, x, y + rowHeight);
      }
      const cellText = String(row[i] ?? '');
      const maxChars = Math.floor(cellWidth / 1.9);
      const text = cellText.length > maxChars ? cellText.substring(0, maxChars - 1) + '…' : cellText;
      doc.text(text, x + 2, y + 5.5);
      x += cellWidth;
    });

    y += rowHeight;
  };

  // Title
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('CSV Data', margin, y);
  y += 4;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`${rows.length} rows · ${headers.length} columns`, margin, y + 2);
  y += 8;

  drawHeader();

  rows.forEach((row, rowIndex) => {
    if (y + rowHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      drawHeader();
    }
    drawRow(row, rowIndex);
  });

  // Page numbers
  const totalPages = doc.internal.pages.length - 1;
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${p} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 5,
      { align: 'right' }
    );
  }

  return Buffer.from(doc.output('arraybuffer'));
}