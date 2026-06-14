export async function txtToMd(content: string): Promise<string> {
  const lines = content.split('\n');

  const converted = lines.map((line) => {
    const trimmed = line.trim();

    // Detect lines that look like headings (short, no punctuation at end)
    if (trimmed.length > 0 && trimmed.length < 60 && !trimmed.endsWith('.') && !trimmed.endsWith(',')) {
      if (trimmed === trimmed.toUpperCase() && trimmed.length > 3) {
        return `## ${trimmed}`;
      }
    }

    return line;
  });

  return converted.join('\n');
}