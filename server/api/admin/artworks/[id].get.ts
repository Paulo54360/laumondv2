import { createClient } from '@supabase/supabase-js';

type ArtworkRow = {
  id: number;
  title: string | null;
  title_en: string | null;
  description: string | null;
  description_fr: string | null;
  description_en: string | null;
  category_id: number | null;
  folder_path: string | null;
  subcategory: string | null;
  image_urls: string | string[] | null;
  created_at: string | null;
  updated_at: string | null;
  categories?: { name: string | null } | null;
};

type ImageRow = {
  id: string;
  url: string;
  filename: string | null;
  position: number;
};

function ensureArray(val: string | string[] | null | undefined): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter((u) => typeof u === 'string');
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val) as unknown;
      return Array.isArray(parsed)
        ? parsed.filter((u): u is string => typeof u === 'string')
        : val.trim().startsWith('http')
          ? [val.trim()]
          : [];
    } catch {
      return val.trim().startsWith('http') ? [val.trim()] : [];
    }
  }
  return [];
}

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Non authentifié' });
  }

  const id = getRouterParam(event, 'id');
  const artworkId = id ? Number(id) : NaN;
  if (!id || Number.isNaN(artworkId)) {
    throw createError({ statusCode: 400, statusMessage: 'ID œuvre invalide' });
  }

  const config = useRuntimeConfig();
  const supabaseUrl = config.supabaseUrl;
  const serviceRoleKey = config.supabaseServiceRoleKey;

  if (!supabaseUrl || !serviceRoleKey) {
    throw createError({ statusCode: 500, statusMessage: 'Configuration Supabase manquante' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    throw createError({ statusCode: 401, statusMessage: 'Session invalide' });
  }

  const { data: artwork, error: artworkError } = await supabase
    .from('artworks')
    .select(
      `
      id,
      title,
      title_en,
      description,
      description_fr,
      description_en,
      category_id,
      folder_path,
      subcategory,
      image_urls,
      created_at,
      updated_at,
      categories:categories(name)
    `
    )
    .eq('id', artworkId)
    .is('deleted_at', null)
    .single();

  if (artworkError || !artwork) {
    if (artworkError?.code === 'PGRST116') {
      throw createError({ statusCode: 404, statusMessage: 'Œuvre introuvable' });
    }
    console.error('Erreur fetch artwork admin', artworkError);
    throw createError({ statusCode: 500, statusMessage: 'Erreur chargement œuvre' });
  }

  const { data: images, error: imagesError } = await supabase
    .from('artwork_images')
    .select('id, url, filename, position')
    .eq('artwork_id', artworkId)
    .is('deleted_at', null)
    .order('position', { ascending: true });

  let imageList: Array<{ id: string; url: string; filename: string | null; position: number }> = [];
  if (!imagesError && images && images.length > 0) {
    imageList = (images as ImageRow[]).map((r) => ({
      id: r.id,
      url: r.url,
      filename: r.filename ?? null,
      position: r.position,
    }));
  } else {
    const urls = ensureArray((artwork as ArtworkRow).image_urls);
    imageList = urls.map((url, idx) => ({
      id: `legacy-${idx}`,
      url,
      filename: null,
      position: idx,
    }));
  }

  const row = artwork as ArtworkRow;
  return {
    id: row.id,
    title: row.title ?? '',
    description: row.description ?? row.description_fr ?? row.description_en ?? '',
    categoryId: row.category_id ?? null,
    categoryName: row.categories?.name ?? null,
    folderPath: row.folder_path ?? null,
    subcategory: row.subcategory ?? null,
    images: imageList,
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  };
});
