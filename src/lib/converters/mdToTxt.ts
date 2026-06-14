export async function mdToTxt(content: string): Promise<string> {
  return content
    .replace(/#{1,6}\s+/g, '')         // Remove headings
    .replace(/\*\*(.*?)\*\*/g, '$1')   // Remove bold
    .replace(/\*(.*?)\*/g, '$1')       // Remove italic
    .replace(/`{3}[\s\S]*?`{3}/g, '')  // Remove code blocks
    .replace(/`(.*?)`/g, '$1')         // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Remove images
    .replace(/^[-*+]\s+/gm, '')        // Remove bullet points
    .replace(/^\d+\.\s+/gm, '')        // Remove numbered lists
    .replace(/^>\s+/gm, '')            // Remove blockquotes
    .replace(/---/g, '')               // Remove horizontal rules
    .replace(/\n{3,}/g, '\n\n')        // Collapse extra blank lines
    .trim();
}