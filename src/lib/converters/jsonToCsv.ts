import Papa from 'papaparse';

export async function jsonToCsv(content: string): Promise<string> {
  let parsed: object[];

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('Invalid JSON format.');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('JSON must be an array of objects to convert to CSV.');
  }

  return Papa.unparse(parsed);
}