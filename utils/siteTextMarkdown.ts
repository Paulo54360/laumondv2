/**
 * Parse markdown-style content from site_texts (## Title\n\nContent)
 * pour le rendu sur les pages Biographie et Métahisme.
 */

export type ParsedSection = {
  id: string;
  title: string | null;
  content: string;
};

function slugify(text: string): string {
  return text
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 50);
}

export function parseMarkdownSections(raw: string): ParsedSection[] {
  if (!raw?.trim()) return [];

  const sections: ParsedSection[] = [];
  const blocks = raw.split(/\n## /);

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]!.trim();
    if (!block) continue;

    if (i === 0 && !raw.trimStart().startsWith('## ')) {
      sections.push({
        id: 'intro',
        title: null,
        content: block.replace(/^\n+/, ''),
      });
      continue;
    }

    const firstNewline = block.indexOf('\n');
    const title = firstNewline >= 0 ? block.slice(0, firstNewline).trim() : block;
    const content = firstNewline >= 0 ? block.slice(firstNewline + 1).trim() : '';
    sections.push({
      id: slugify(title) || `section-${i}`,
      title: title || null,
      content,
    });
  }

  return sections;
}
