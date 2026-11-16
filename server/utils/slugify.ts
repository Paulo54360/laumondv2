/**
 * Génère un slug propre pour les dossiers et noms de fichiers S3
 * Ex: "Jusqu'Au-Boutisme" -> "jusqu-au-boutisme"
 * Ex: "Le Portant “524C” - Espace Commines" -> "le-portant-524c-espace-commines"
 */
export function slugify(text: string): string {
  if (!text || typeof text !== 'string') return 'oeuvre';
  const slug = text
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);

  return slug || 'oeuvre';
}
