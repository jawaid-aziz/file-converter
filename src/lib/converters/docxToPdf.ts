import mammoth from "mammoth";

export async function docxToPdf(buffer: Buffer): Promise<Buffer> {
  const { value: htmlContent } = await mammoth.convertToHtml({ buffer });

  const jsPDFModule = await import("jspdf");
  const jsPDF = jsPDFModule.default;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  // Strip HTML tags to plain text, preserving structure
  const text = htmlContent
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n[H1] $1\n")
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n[H2] $1\n")
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n[H3] $1\n")
    .replace(/<li[^>]*>(.*?)<\/li>/gi, "• $1\n")
    .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");

  const lines = text.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") {
      y += 4;
      continue;
    }

    if (trimmed.startsWith("[H1] ")) {
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      const wrapped = doc.splitTextToSize(
        trimmed.replace("[H1] ", ""),
        maxWidth,
      );
      if (y + 10 * wrapped.length > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(wrapped, margin, y);
      y += 10 * wrapped.length + 4;
    } else if (trimmed.startsWith("[H2] ")) {
      doc.setFontSize(17);
      doc.setFont("helvetica", "bold");
      const wrapped = doc.splitTextToSize(
        trimmed.replace("[H2] ", ""),
        maxWidth,
      );
      if (y + 8 * wrapped.length > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(wrapped, margin, y);
      y += 8 * wrapped.length + 3;
    } else if (trimmed.startsWith("[H3] ")) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      const wrapped = doc.splitTextToSize(
        trimmed.replace("[H3] ", ""),
        maxWidth,
      );
      if (y + 7 * wrapped.length > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(wrapped, margin, y);
      y += 7 * wrapped.length + 3;
    } else {
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      const wrapped = doc.splitTextToSize(trimmed, maxWidth);
      if (y + 6 * wrapped.length > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(wrapped, margin, y);
      y += 6 * wrapped.length + 2;
    }
  }

  return Buffer.from(doc.output("arraybuffer"));
}
