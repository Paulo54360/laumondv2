import { describe, expect, it } from 'vitest';

import { markdownToSafeHtml, sanitizeMarkdownInput } from '~/utils/markdown';

describe('markdownToSafeHtml', () => {
  it('retourne une chaîne vide pour null ou undefined', () => {
    expect(markdownToSafeHtml(null)).toBe('');
    expect(markdownToSafeHtml(undefined)).toBe('');
  });

  it('convertit le Markdown en HTML sécurisé', () => {
    expect(markdownToSafeHtml('**gras**')).toContain('<strong>gras</strong>');
    expect(markdownToSafeHtml('*italique*')).toContain('<em>italique</em>');
    expect(markdownToSafeHtml('## Titre')).toContain('<h2>');
  });

  it('supprime le HTML dangereux (XSS)', () => {
    const result = markdownToSafeHtml('<script>alert(1)</script>Bonjour');
    expect(result).not.toContain('<script>');
    expect(result).toContain('Bonjour');
  });
});

describe('sanitizeMarkdownInput', () => {
  it('retourne une chaîne vide pour null ou undefined', () => {
    expect(sanitizeMarkdownInput(null)).toBe('');
    expect(sanitizeMarkdownInput(undefined)).toBe('');
  });

  it('préserve le texte normal', () => {
    const input = 'Texte **gras** et *italique*';
    expect(sanitizeMarkdownInput(input)).toBe(input);
  });

  it('supprime les balises script', () => {
    const input = 'Avant<script>alert(1)</script>Après';
    expect(sanitizeMarkdownInput(input)).not.toContain('<script>');
    expect(sanitizeMarkdownInput(input)).toContain('Avant');
    expect(sanitizeMarkdownInput(input)).toContain('Après');
  });

  it('supprime javascript: des liens', () => {
    const input = 'lien javascript:alert(1) fin';
    expect(sanitizeMarkdownInput(input)).not.toContain('javascript:');
  });
});
