import { createClient } from '@supabase/supabase-js';

type ArtworkRow = {
  id: string;
  title: string | null;
  category_id: number | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  image_urls: string | string[] | null;
  categories?: {
    name: string | null;
  } | null;
};

type ArtworksResponse = {
  items: Array<{
    id: string;
    title: string;
    categoryId: number | null;
    categoryName: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    deletedAt: string | null;
  }>;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Non authentifié' });
  }

  const { page: rawPage, pageSize: rawPageSize, search, category, trash } = getQuery(event);

  const page = Math.max(1, Number(rawPage ?? 1) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(rawPageSize ?? 20) || 20));
  const offset = (page - 1) * pageSize;

  const searchTerm = typeof search === 'string' ? search.trim() : '';
  const categoryIdRaw =
    typeof category === 'string' && category.trim().length > 0 ? category : null;
  const includeTrash = trash === 'true';

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

  let query = supabase
    .from('artworks')
    .select(
      `
        id,
        title,
        category_id,
        image_urls,
        created_at,
        updated_at,
        deleted_at,
        categories:categories(name)
      `,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (includeTrash) {
    query = query.not('deleted_at', 'is', null);
  } else {
    query = query.is('deleted_at', null);
  }

  if (searchTerm) {
    query = query.ilike('title', `%${searchTerm}%`);
  }

  if (categoryIdRaw) {
    const categoryId = Number(categoryIdRaw);
    if (!Number.isNaN(categoryId)) {
      query = query.eq('category_id', categoryId);
    }
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Erreur liste œuvres admin', error);
    throw createError({ statusCode: 500, statusMessage: 'Erreur lors du chargement des œuvres' });
  }

  const items =
    (data ?? []).map((row: ArtworkRow) => {
      let thumbnailUrl: string | null = null;
      if (Array.isArray(row.image_urls) && row.image_urls.length > 0) {
        thumbnailUrl = String(row.image_urls[0]);
      } else if (typeof row.image_urls === 'string') {
        try {
          const parsed = JSON.parse(row.image_urls);
          if (Array.isArray(parsed) && parsed.length > 0) {
            thumbnailUrl = String(parsed[0]);
          }
        } catch {
          // string could already be a single URL
          if (row.image_urls.startsWith('http')) {
            thumbnailUrl = row.image_urls;
          }
        }
      }

      return {
        id: row.id,
        title: row.title ?? '',
        categoryId: row.category_id ?? null,
        categoryName: row.categories?.name ?? null,
        createdAt: row.created_at ?? null,
        updatedAt: row.updated_at ?? null,
        deletedAt: row.deleted_at ?? null,
        thumbnailUrl,
      };
    }) ?? [];

  const total = count ?? 0;
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1;

  const response: ArtworksResponse = {
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };

  return response;
});
