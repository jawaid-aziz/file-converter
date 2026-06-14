import Papa from 'papaparse';

export async function csvToJson(content: string): Promise<string> {
  const result = Papa.parse(content, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  if (result.errors.length > 0) {
    throw new Error(`CSV parsing error: ${result.errors[0].message}`);
  }

  return JSON.stringify(result.data, null, 2);
}