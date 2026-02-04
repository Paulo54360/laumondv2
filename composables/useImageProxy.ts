/**
 * Retourne une URL passant par le proxy serveur pour les images S3,
 * afin d'éviter les blocages CORS quand le bucket n'envoie pas les bons en-têtes.
 */
export function useImageProxy(): (url: string | undefined | null) => string {
  const config = useRuntimeConfig();
  const apiUrl = (config.public.apiUrl as string)?.replace(/\/$/, '') || '';

  return (url: string | undefined | null): string => {
    if (!url || typeof url !== 'string' || !url.trim()) return '';
    if (!apiUrl || !url.startsWith(apiUrl)) return url;
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  };
}
