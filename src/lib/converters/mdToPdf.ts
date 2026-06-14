import { mdToPdf as convertMdToPdf } from 'md-to-pdf';

export async function mdToPdf(content: string): Promise<Buffer> {
  const pdf = await convertMdToPdf(
    { content },
    {
      pdf_options: {
        format: 'A4',
        margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
      },
    }
  );

  if (!pdf.content) {
    throw new Error('PDF generation failed.');
  }

  return pdf.content;
}