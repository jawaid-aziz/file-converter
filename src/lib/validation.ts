import { SupportedFormat, CONVERSION_MAP, MAX_FILE_SIZE, ALLOWED_EXTENSIONS } from '@/types/conversion';
import { getFileExtension } from '@/utils/fileHelpers';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFile(file: File): ValidationResult {
  if (!file || file.size === 0) {
    return { valid: false, error: 'File is empty or missing.' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File exceeds the 20MB size limit.' };
  }

  const ext = getFileExtension(file.name);
  if (!ALLOWED_EXTENSIONS.includes(ext as SupportedFormat)) {
    return { valid: false, error: `Unsupported file type: .${ext}` };
  }

  return { valid: true };
}

export function validateConversion(from: string, to: string): ValidationResult {
  const allowedTargets = CONVERSION_MAP[from as SupportedFormat];

  if (!allowedTargets) {
    return { valid: false, error: `Unsupported source format: ${from}` };
  }

  if (!allowedTargets.includes(to as SupportedFormat)) {
    return { valid: false, error: `Cannot convert .${from} to .${to}` };
  }

  return { valid: true };
}