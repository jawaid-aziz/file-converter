import { NextRequest, NextResponse } from 'next/server';
import { validateFile, validateConversion } from '@/lib/validation';
import { getFileExtension, getOutputFileName, getMimeType } from '@/utils/fileHelpers';
import { SupportedFormat } from '@/types/conversion';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const targetFormat = formData.get('targetFormat') as string | null;

    if (!file) return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    if (!targetFormat) return NextResponse.json({ error: 'No target format specified.' }, { status: 400 });

    const fileValidation = validateFile(file);
    if (!fileValidation.valid) return NextResponse.json({ error: fileValidation.error }, { status: 400 });

    const sourceFormat = getFileExtension(file.name) as SupportedFormat;
    const conversionValidation = validateConversion(sourceFormat, targetFormat);
    if (!conversionValidation.valid) return NextResponse.json({ error: conversionValidation.error }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const textContent = buffer.toString('utf-8');

    let outputBuffer: Buffer | string;

    // DOCX conversions
    if (sourceFormat === 'docx' && targetFormat === 'md') {
      const { docxToMd } = await import('@/lib/converters/docxToMd');
      outputBuffer = await docxToMd(buffer);
    } else if (sourceFormat === 'docx' && targetFormat === 'pdf') {
      const { docxToPdf } = await import('@/lib/converters/docxToPdf');
      outputBuffer = await docxToPdf(buffer);
    } else if (sourceFormat === 'docx' && targetFormat === 'txt') {
      const { docxToTxt } = await import('@/lib/converters/docxToTxt');
      outputBuffer = await docxToTxt(buffer);

    // MD conversions
    } else if (sourceFormat === 'md' && targetFormat === 'html') {
      const { mdToHtml } = await import('@/lib/converters/mdToHtml');
      outputBuffer = await mdToHtml(textContent);
    } else if (sourceFormat === 'md' && targetFormat === 'pdf') {
      const { mdToPdf } = await import('@/lib/converters/mdToPdf');
      outputBuffer = await mdToPdf(textContent);
    } else if (sourceFormat === 'md' && targetFormat === 'txt') {
      const { mdToTxt } = await import('@/lib/converters/mdToTxt');
      outputBuffer = await mdToTxt(textContent);
    } else if (sourceFormat === 'md' && targetFormat === 'docx') {
      const { mdToDocx } = await import('@/lib/converters/mdToDocx');
      outputBuffer = await mdToDocx(textContent);

    // PDF conversions
    } else if (sourceFormat === 'pdf' && targetFormat === 'md') {
      const { pdfToMd } = await import('@/lib/converters/pdfToMd');
      outputBuffer = await pdfToMd(buffer);
    } else if (sourceFormat === 'pdf' && targetFormat === 'txt') {
      const { pdfToTxt } = await import('@/lib/converters/pdfToTxt');
      outputBuffer = await pdfToTxt(buffer);
    } else if (sourceFormat === 'pdf' && targetFormat === 'docx') {
      const { pdfToDocx } = await import('@/lib/converters/pdfToDocx');
      outputBuffer = await pdfToDocx(buffer);

    // TXT conversions
    } else if (sourceFormat === 'txt' && targetFormat === 'md') {
      const { txtToMd } = await import('@/lib/converters/txtToMd');
      outputBuffer = await txtToMd(textContent);
    } else if (sourceFormat === 'txt' && targetFormat === 'docx') {
      const { txtToDocx } = await import('@/lib/converters/txtToDocx');
      outputBuffer = await txtToDocx(textContent);
    } else if (sourceFormat === 'txt' && targetFormat === 'pdf') {
      const { txtToPdf } = await import('@/lib/converters/txtToPdf');
      outputBuffer = await txtToPdf(textContent);

    // CSV conversions
    } else if (sourceFormat === 'csv' && targetFormat === 'json') {
      const { csvToJson } = await import('@/lib/converters/csvToJson');
      outputBuffer = await csvToJson(textContent);
    } else if (sourceFormat === 'csv' && targetFormat === 'pdf') {
      const { csvToPdf } = await import('@/lib/converters/csvToPdf');
      outputBuffer = await csvToPdf(textContent);

    // JSON conversions
    } else if (sourceFormat === 'json' && targetFormat === 'csv') {
      const { jsonToCsv } = await import('@/lib/converters/jsonToCsv');
      outputBuffer = await jsonToCsv(textContent);
    } else if (sourceFormat === 'json' && targetFormat === 'pdf') {
      const { jsonToPdf } = await import('@/lib/converters/jsonToPdf');
      outputBuffer = await jsonToPdf(textContent);

    } else {
      return NextResponse.json({ error: 'Conversion not implemented.' }, { status: 400 });
    }

    const outputFileName = getOutputFileName(file.name, targetFormat as SupportedFormat);
    const mimeType = getMimeType(targetFormat as SupportedFormat);
    const responseBuffer = typeof outputBuffer === 'string'
      ? Buffer.from(outputBuffer, 'utf-8')
      : outputBuffer;

    return new NextResponse(new Uint8Array(responseBuffer), {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${outputFileName}"`,
        'Content-Length': responseBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}