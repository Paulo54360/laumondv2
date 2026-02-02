// @ts-expect-error - Provided by Nuxt auto-imports at build time
import { useRuntimeConfig } from '#imports';

/** Œuvre galerie (titre, description, URLs images) utilisée par ArtworkGrid / galerie. */
export interface IGalleryArtwork {
  title: string;
  description: string;
  images: string[];
}

export interface IUseS3Return {
  getArtworks: (category: string) => Promise<IGalleryArtwork[]>;
  getArtworkImages: (category: string, folder: string) => Promise<string[]>;
  getArtworkDescription: (category: string, folder: string) => Promise<string>;
}

export function useS3(): IUseS3Return {
  const config = useRuntimeConfig();
  const bucketUrl = config.public.apiUrl;

  const getArtworkImages = (category: string, folder: string): Promise<string[]> => {
    try {
      // Construire les URLs des images en fonction de la catégorie
      const imageUrls: string[] = [];
      const maxImages = 10; // Nombre maximum d'images à essayer par dossier

      for (let i = 1; i <= maxImages; i++) {
        const num = i.toString().padStart(2, '0');
        const imageUrl = `${bucketUrl}/${category}/${folder}/${num}.jpg`;
        imageUrls.push(imageUrl);
      }

      return Promise.resolve(imageUrls);
    } catch (error) {
      return Promise.resolve([]);
    }
  };

  const getArtworkDescription = async (category: string, folder: string): Promise<string> => {
    try {
      const response = await fetch(`${bucketUrl}/${category}/${folder}/description.txt`);
      if (!response.ok) {
        throw new Error(`Failed to fetch description: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      return '';
    }
  };

  const getArtworks = async (category: string): Promise<IGalleryArtwork[]> => {
    const artworks: IGalleryArtwork[] = [];

    // Liste des dossiers par catégorie
    const folders = {
      transcriptions: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
      ],
      archetype: ['02', '03', '04', '05', '06', '07', '08', '09'],
      deploiement: ['00', '01', '02', '03', '04', '05'],
      drawing: ['01', '02', '03', '04', '05'],
    };

    const categoryFolders = folders[category as keyof typeof folders] || [];

    for (const folder of categoryFolders) {
      try {
        const [description, images] = await Promise.all([
          getArtworkDescription(category, folder),
          getArtworkImages(category, folder),
        ]);

        // Extraire le titre de la première ligne de la description
        const [title, ...descriptionLines] = description.split('\n').filter((line) => line.trim());

        artworks.push({
          title: title || folder,
          description: descriptionLines.join('\n').trim(),
          images,
        });
      } catch (error) {
        // Fail silently for individual artworks to avoid console noise
      }
    }

    return artworks;
  };

  return {
    getArtworks,
    getArtworkImages,
    getArtworkDescription,
  };
}
