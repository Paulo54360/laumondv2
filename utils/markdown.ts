/**
 * Markdown → HTML avec sanitization (anti XSS).
 * Utilisé pour la prévisualisation admin et le rendu public.
 */
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * Convertit du Markdown en HTML sécurisé (sanitized).
 */
export function markdownToSafeHtml(md: string | null | undefined): string {
  if (!md || typeof md !== 'string') return '';
  const rawHtml = marked.parse(md.trim()) as string;
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'a',
      'ul',
      'ol',
      'li',
      'h1',
      'h2',
      'h3',
      'blockquote',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ADD_ATTR: ['target'],
  });
}

/**
 * Nettoie le contenu Markdown avant stockage : supprime les balises dangereuses.
 */
export function sanitizeMarkdownInput(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=["'][^"']*["']/gi, '');
}
