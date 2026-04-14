/**
 * URL relative vers le proxy Nitro pour les assets sous NUXT_PUBLIC_API_URL (S3).
 * Utilisable pour les images et les .txt (titres) afin d'éviter le CORS navigateur.
 */
export function proxyUrlForPublicS3Asset(
  assetUrl: string | null | undefined,
  publicBaseUrl: string
): string {
  if (!assetUrl || typeof assetUrl !== 'string' || !assetUrl.trim()) return '';
  const base = publicBaseUrl.replace(/\/$/, '');
  const u = assetUrl.trim();
  if (!base || !u.startsWith(base)) return u;
  return `/api/image-proxy?url=${encodeURIComponent(u)}`;
}

/**
 * Retourne une URL passant par le proxy serveur pour les images S3,
 * afin d'éviter les blocages CORS quand le bucket n'envoie pas les bons en-têtes.
 */
export function useImageProxy(): (url: string | undefined | null) => string {
  const config = useRuntimeConfig();
  const apiUrl = (config.public.apiUrl as string)?.replace(/\/$/, '') || '';

  return (url: string | undefined | null): string => {
    if (!url || typeof url !== 'string' || !url.trim()) return '';
    return proxyUrlForPublicS3Asset(url, apiUrl) || url;
  };
}
