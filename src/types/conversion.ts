export type SupportedFormat = 'docx' | 'md' | 'pdf' | 'html' | 'txt' | 'csv' | 'json';

export interface ConversionOption {
  from: SupportedFormat;
  to: SupportedFormat;
  label: string;
}

export interface ConversionResult {
  success: boolean;
  fileName?: string;
  error?: string;
}

export const CONVERSION_MAP: Record<SupportedFormat, SupportedFormat[]> = {
  docx: ['md', 'pdf', 'txt'],
  md:   ['pdf', 'html', 'txt', 'docx'],
  pdf:  ['md', 'txt', 'docx'],
  html: [],
  txt:  ['md', 'docx', 'pdf'],
  csv:  ['json', 'pdf'],
  json: ['csv', 'pdf'],
};

export const ALLOWED_EXTENSIONS: SupportedFormat[] = [
  'docx', 'md', 'pdf', 'html', 'txt', 'csv', 'json'
];

export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB