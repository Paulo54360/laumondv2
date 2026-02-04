// @ts-expect-error - provided by Nuxt auto-imports
import { useRuntimeConfig } from '#imports';

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

const LEGACY_CONFIG = {
  transcriptions: {
    s3Prefix: 'Transcriptions',
    subfolders: [
      '17',
      '16',
      '15',
      '14',
      '13',
      '12',
      '11',
      '10',
      '09',
      '08',
      '07',
      '06',
      '05',
      '04',
      '03',
      '02',
      '01',
    ],
    ranges: [
      [1, 4],
      [1, 9],
      [1, 9],
      [1, 9],
      [1, 9],
      [1, 9],
      [1, 9],
      [1, 9],
      [1, 9],
      [1, 9],
      [1, 9],
      [1, 8],
      [1, 9],
      [1, 9],
      [1, 9],
      [1, 9],
      [1, 9],
    ],
  },
  archetypes: {
    s3Prefix: 'Archetypes',
    subfolders: ['09', '08', '07', '06', '05', '04', '03', '02'],
    ranges: [
      [1, 12],
      [1, 4],
      [1, 8],
      [1, 8],
      [1, 7],
      [1, 7],
      [1, 9],
      [1, 10],
    ],
  },
  deployments: {
    s3Prefix: 'Deployments',
    subfolders: ['05', '04', '03', '02', '01', '00'],
    ranges: [
      [1, 4],
      [1, 2],
      [1, 6],
      [1, 3],
      [1, 4],
      [1, 7],
    ],
  },
  drawings: {
    s3Prefix: 'Drawings+',
    subfolders: ['05', '04', '03', '02', '01'],
    ranges: [
      [1, 8],
      [1, 9],
      [1, 9],
      [1, 9],
      [1, 9],
    ],
  },
} as const;

const LEGACY_ALIASES: Record<string, keyof typeof LEGACY_CONFIG> = {
  transcriptions: 'transcriptions',
  archetype: 'archetypes',
  archetypes: 'archetypes',
  deploiement: 'deployments',
  deploiements: 'deployments',
  deployments: 'deployments',
  drawing: 'drawings',
  drawings: 'drawings',
};

async function fetchTextMetadata(
  textUrl: string | null
): Promise<{ title?: string; description?: string }> {
  if (!textUrl) return {};
  try {
    const response = await fetch(textUrl);
    if (!response.ok) return {};
    const raw = await response.text();
    const lines = raw
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      return {};
    }

    const [title, ...rest] = lines;
    return {
      title,
      description: rest.join('\n').trim(),
    };
  } catch (error) {
    console.error('Impossible de récupérer le fichier texte pour une œuvre', error);
    return {};
  }
}

async function isImageReachable(url?: string): Promise<boolean> {
  if (!url) return false;

  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn("Impossible de vérifier la disponibilité de l'image", url, error);
    return false;
  }
}

export function useS3(): IUseS3Return {
  const config = useRuntimeConfig();
  const bucketUrl =
    typeof config.public.apiUrl === 'string' ? config.public.apiUrl.replace(/\/$/, '') : '';

  const getLegacyArtworks = async (category: string): Promise<IGalleryArtwork[]> => {
    if (!bucketUrl) return [];

    const aliasKey = LEGACY_ALIASES[category] ?? (category as keyof typeof LEGACY_CONFIG);
    const legacyConfig = LEGACY_CONFIG[aliasKey];
    if (!legacyConfig) return [];

    const artworks: IGalleryArtwork[] = [];
    for (let index = 0; index < legacyConfig.subfolders.length; index++) {
      const folder = legacyConfig.subfolders[index];
      const [start, end] = legacyConfig.ranges[index] ?? [1, 1];
      const images: string[] = [];

      for (let i = start; i <= end; i++) {
        const num = i.toString().padStart(2, '0');
        images.push(`${bucketUrl}/${legacyConfig.s3Prefix}/${folder}/${num}.jpg`);
      }

      const firstImage = images[0];
      const textUrl = firstImage?.replace(/\.(jpg|jpeg|png|webp)$/i, '.txt') ?? null;
      const textData = await fetchTextMetadata(textUrl);

      const legacyTitle = textData.title || `Œuvre ${folder}`;
      artworks.push({
        titleFr: legacyTitle,
        titleEn: legacyTitle,
        descriptionFr: textData.description || '',
        descriptionEn: '',
        images,
      });
    }

    return artworks;
  };

  const getArtworks = async (category: string): Promise<IGalleryArtwork[]> => {
    const slug = CATEGORY_SLUGS[category] || category;

    const mergedArtworks = new Map<string, IGalleryArtwork>();

    try {
      const response = await $fetch<IGalleryApiResponse>(
        `/api/gallery/${encodeURIComponent(slug)}`
      );

      await Promise.all(
        response.items.map(async (item) => {
          const firstImage = item.images?.[0];
          const imageAvailable = await isImageReachable(firstImage);
          if (!imageAvailable) {
            return;
          }

          const textData = await fetchTextMetadata(item.textUrl);
          const artwork: IGalleryArtwork = {
            titleFr: textData.title || item.titleFr || '',
            titleEn: item.titleEn || textData.title || item.titleFr || '',
            descriptionFr: textData.description || item.descriptionFr || '',
            descriptionEn: item.descriptionEn || '',
            images: item.images,
          };
          const key = firstImage || `${item.id}:${item.titleFr}`;
          if (artwork.images.length > 0) {
            mergedArtworks.set(key, artwork);
          }
        })
      );
    } catch (error) {
      console.error('Erreur API galerie, utilisation du fallback S3', error);
    }

    const legacyArtworks = await getLegacyArtworks(category);
    legacyArtworks.forEach((artwork) => {
      const key = artwork.images?.[0] || artwork.titleFr;
      if (!mergedArtworks.has(key) && artwork.images.length > 0) {
        mergedArtworks.set(key, artwork);
      }
    });

    return Array.from(mergedArtworks.values());
  };

  return {
    getArtworks,
  };
}
