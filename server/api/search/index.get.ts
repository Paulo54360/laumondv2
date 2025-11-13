import { createClient } from '@supabase/supabase-js';

const S3_BASE_URL = 'https://plaumondpicture.s3.eu-west-3.amazonaws.com';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const searchTerm = query.q as string;

    if (!searchTerm) {
      return { artworks: [] };
    }

    // Initialisation du client Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Erreur de configuration Supabase');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Recherche dans la base de données
    const { data: artworks, error } = await supabase
      .from('artworks')
      .select(
        `
        id,
        title,
        description,
        image_urls,
        folder_path,
        subcategory,
        created_at,
        updated_at,
        category_id,
        categories (
          id,
          name,
          path
        )
      `
      )
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .limit(20)
      .order('title', { ascending: true });

    if (error) throw error;

    // Formater les données pour qu'elles soient compatibles avec l'interface
    const formattedArtworks =
      artworks?.map((artwork) => {
        // Traiter les URLs d'images
        let urls = [];
        try {
          // Vérifier si image_urls existe
          if (artwork.image_urls) {
            if (typeof artwork.image_urls === 'string') {
              // Si c'est une chaîne JSON, la parser
              if (artwork.image_urls.startsWith('[') && artwork.image_urls.endsWith(']')) {
                urls = JSON.parse(artwork.image_urls);
              }
              // Si c'est une URL unique, l'ajouter au tableau
              else if (artwork.image_urls.trim().startsWith('http')) {
                urls = [artwork.image_urls.trim()];
              }
            }
            // Si c'est déjà un tableau, l'utiliser directement
            else if (Array.isArray(artwork.image_urls)) {
              urls = artwork.image_urls;
            }
          }
        } catch (e) {
          console.error("Erreur de parsing des URLs pour l'artwork", artwork.id, ':', e);
          urls = [];
        }

        // Si nous n'avons pas d'URLs valides mais que nous avons une image_url individuelle dans le format de la capture d'écran
        if (
          urls.length === 0 &&
          typeof artwork.image_urls === 'string' &&
          artwork.image_urls.includes('["https://')
        ) {
          try {
            const match = artwork.image_urls.match(/"(https:\/\/[^"]+)"/);
            if (match && match[1]) {
              urls = [match[1]];
            }
          } catch (e) {
            console.error("Erreur lors de l'extraction de l'URL:", e);
          }
        }

        // S'assurer que toutes les URLs sont valides
        urls = urls.filter((url) => typeof url === 'string' && url.trim().startsWith('http'));

        // Si aucune URL valide n'est trouvée et que nous connaissons le chemin du dossier, essayons de construire une URL
        if (urls.length === 0 && artwork.folder_path && artwork.subcategory) {
          urls = [`${S3_BASE_URL}/${artwork.folder_path}/01.jpg`];
        }

        return {
          id: artwork.id,
          title: artwork.title,
          description: artwork.description,
          imageUrls: urls,
          folderPath: artwork.folder_path,
          subcategory: artwork.subcategory,
          createdAt: artwork.created_at,
          updatedAt: artwork.updated_at,
          categoryId: artwork.category_id,
          // Renommer la propriété categories en category pour compatibilité
          category: artwork.categories,
        };
      }) || [];

    return {
      artworks: formattedArtworks,
    };
  } catch (error) {
    console.error('Erreur de recherche:', error);
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la recherche',
    });
  }
});
