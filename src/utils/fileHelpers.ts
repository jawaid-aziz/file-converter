import { SupportedFormat, ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from '@/types/conversion';

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function isValidExtension(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ALLOWED_EXTENSIONS.includes(ext as SupportedFormat);
}

export function isValidSize(size: number): boolean {
  return size <= MAX_FILE_SIZE;
}

export function getOutputFileName(originalName: string, targetFormat: SupportedFormat): string {
  const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
  return `${baseName}.${targetFormat}`;
}

export function getMimeType(format: SupportedFormat): string {
  const mimeTypes: Record<SupportedFormat, string> = {
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    md: 'text/markdown',
    pdf: 'application/pdf',
    html: 'text/html',
    txt: 'text/plain',
    csv: 'text/csv',
    json: 'application/json',
  };
  return mimeTypes[format];
}