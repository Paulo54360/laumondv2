/**
 * URL relative vers le gestionnaire de médias pour masquer S3 dans l'inspecteur d'élément.
 * Convertit toute URL S3 absolue ou chemin relatif en route anonyme /api/media/...
 */
export function proxyUrlForPublicS3Asset(
  assetUrl: string | null | undefined,
  publicBaseUrl: string
): string {
  if (!assetUrl || typeof assetUrl !== 'string' || !assetUrl.trim()) return '';
  const u = assetUrl.trim();

  // Si c'est déjà une route média locale
  if (u.startsWith('/api/media/')) {
    return u;
  }

  // Si c'est une URL S3 absolue (ex: https://plaumondpicture.s3.eu-west-3.amazonaws.com/...)
  const base = publicBaseUrl ? publicBaseUrl.replace(/\/$/, '') : '';
  if (base && u.startsWith(base)) {
    const relativePath = u.slice(base.length).replace(/^\/+/, '');
    return `/api/media/${relativePath}`;
  }

  // Si c'est une ancienne URL du proxy legacy
  if (u.startsWith('/api/image-proxy?url=')) {
    try {
      const rawUrl = new URL(u, 'http://localhost').searchParams.get('url');
      if (rawUrl) {
        return proxyUrlForPublicS3Asset(rawUrl, publicBaseUrl);
      }
    } catch {
      // Ignore
    }
  }

  // Si c'est déjà une URL HTTP externe d'un autre domaine (non S3)
  if (/^https?:\/\//i.test(u)) {
    return u;
  }

  // Si c'est un chemin relatif pur (ex: Archetypes/02/01.jpg)
  const cleanPath = u.replace(/^\/+/, '');
  return `/api/media/${cleanPath}`;
}

/**
 * Composable Nuxt retournant la fonction de masquage d'URL pour les images
 */
export function useImageProxy(): (url: string | undefined | null) => string {
  const config = useRuntimeConfig();
  const apiUrl = (config.public.apiUrl as string)?.replace(/\/$/, '') || '';

  return (url: string | undefined | null): string => {
    if (!url || typeof url !== 'string' || !url.trim()) return '';
    return proxyUrlForPublicS3Asset(url, apiUrl) || url;
  };
}
