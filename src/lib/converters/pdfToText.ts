export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const { extractText } = await import('unpdf');

  const uint8Array = new Uint8Array(buffer);
  const { text, totalPages } = await extractText(uint8Array, { mergePages: false });

  // text is string[] when mergePages is false — one entry per page
  const pages = text as unknown as string[];

  const formattedPages = pages.map((pageText) => {
    return pageText
      // Normalize multiple spaces to single space but keep newlines
      .replace(/[ \t]+/g, ' ')
      // Add newline when a sentence ends and next word starts with capital (paragraph detection)
      .replace(/([.!?])\s+([A-Z])/g, '$1\n\n$2')
      // Preserve lines that look like headings (short, no period at end)
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        // Detect heading-like lines: short, no trailing punctuation
        if (line.length < 80 && !line.endsWith('.') && !line.endsWith(',') && !line.endsWith(';')) {
          return `\n${line}\n`;
        }
        return line;
      })
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  });

  return formattedPages.join('\n\n---\n\n');
}