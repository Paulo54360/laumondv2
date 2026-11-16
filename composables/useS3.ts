// @ts-expect-error - provided by Nuxt auto-imports
import { useRuntimeConfig } from '#imports';

import { proxyUrlForPublicS3Asset } from '~/composables/useImageProxy';

interface IGalleryApiItem {
  id: number;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  images: string[];
  textUrl: string | null;
}

interface IGalleryApiResponse {
  category: {
    id: number;
    name: string;
    path: string | null;
  };
  items: IGalleryApiItem[];
}

/** Œuvre galerie (titres/descriptions FR/EN, URLs images) pour ArtworkGrid / galerie. */
export interface IGalleryArtwork {
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  images: string[];
}

export interface IUseS3Return {
  getArtworks: (category: string) => Promise<IGalleryArtwork[]>;
}

const CATEGORY_SLUGS: Record<string, string> = {
  transcriptions: 'transcriptions',
  archetype: 'archetypes',
  archetypes: 'archetypes',
  deploiement: 'deployments',
  deploiements: 'deployments',
  deployments: 'deployments',
  drawing: 'drawings',
  drawings: 'drawings',
};

async function isImageReachable(url?: string, publicBaseUrl?: string): Promise<boolean> {
  if (!url) return false;
  const fetchUrl = publicBaseUrl && url ? proxyUrlForPublicS3Asset(url, publicBaseUrl) || url : url;

  try {
    const response = await fetch(fetchUrl, { method: 'HEAD' });
    if (response.ok) return true;
    if (response.status === 404) return false;
  } catch (error) {
    console.warn("Impossible de vérifier la disponibilité de l'image via proxy", url, error);
  }

  // Si le proxy échoue ou renvoie une erreur, tester l'URL directe S3 si différente
  if (fetchUrl !== url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) return true;
      if (response.status === 404) return false;
    } catch {
      // Ignorer l'erreur CORS éventuelle sur le HEAD direct
    }
  }

  return true;
}

export function useS3(): IUseS3Return {
  const config = useRuntimeConfig();
  const bucketUrl =
    typeof config.public.apiUrl === 'string' ? config.public.apiUrl.replace(/\/$/, '') : '';

  const getArtworks = async (category: string): Promise<IGalleryArtwork[]> => {
    const slug = CATEGORY_SLUGS[category] || category;
    const artworks: IGalleryArtwork[] = [];

    try {
      const response = await $fetch<IGalleryApiResponse>(
        `/api/gallery/${encodeURIComponent(slug)}`
      );

      for (const item of response.items) {
        const firstImage = item.images?.[0];
        const imageAvailable = await isImageReachable(firstImage, bucketUrl);
        if (!imageAvailable) {
          continue;
        }

        artworks.push({
          titleFr: item.titleFr || '',
          titleEn: item.titleEn || item.titleFr || '',
          descriptionFr: item.descriptionFr || '',
          descriptionEn: item.descriptionEn || '',
          images: item.images,
        });
      }
    } catch (error) {
      console.error('Erreur API galerie', error);
    }

    return artworks;
  };

  return {
    getArtworks,
  };
}
