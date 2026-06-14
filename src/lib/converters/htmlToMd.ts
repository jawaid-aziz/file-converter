import TurndownService from 'turndown';

export async function htmlToMd(content: string): Promise<string> {
  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
  });

  return turndown.turndown(content);
}