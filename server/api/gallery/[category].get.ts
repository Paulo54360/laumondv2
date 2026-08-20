import { createClient } from '@supabase/supabase-js';

type CategoryRow = {
  id: number;
  name: string;
  path: string | null;
};

type ArtworkRow = {
  id: number;
  title: string | null;
  title_en: string | null;
  description: string | null;
  description_fr: string | null;
  description_en: string | null;
  image_urls: string[] | string | null;
  folder_path: string | null;
  subcategory: string | null;
  created_at: string | null;
};

type GalleryResponse = {
  category: CategoryRow;
  items: Array<{
    id: number;
    titleFr: string;
    titleEn: string;
    descriptionFr: string;
    descriptionEn: string;
    images: string[];
    folder: string | null;
    folderPath: string | null;
    textUrl: string | null;
    createdAt: string | null;
  }>;
};

const CATEGORY_ALIASES: Record<string, string[]> = {
  transcriptions: ['transcriptions', 'images/transcriptions'],
  archetypes: ['archetypes', 'archetype', 'archétypes', 'archétype', 'images/archetypes'],
  deployments: ['deployments', 'deployment', 'deploiements', 'deploiement', 'images/deployments'],
  drawings: [
    'drawings',
    'drawing',
    'drawings+',
    'dessins',
    'dessin',
    'images/drawings',
    'drawingsplus',
  ],
};

const CATEGORY_REDIRECTS: Record<string, keyof typeof CATEGORY_ALIASES> = {
  archetype: 'archetypes',
  archetypes: 'archetypes',
  deploiement: 'deployments',
  deploiements: 'deployments',
  deployment: 'deployments',
  deployments: 'deployments',
  drawing: 'drawings',
  drawings: 'drawings',
  transcriptions: 'transcriptions',
};

function normalize(value?: string | null): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\+/g, 'plus')
    .replace(/\s+/g, '')
    .replace(/^images\//, '');
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function ensureArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter(isNonEmptyString);
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(isNonEmptyString);
      }
    } catch {
      return [value];
    }
  }

  return [];
}

function sanitizeBaseUrl(url?: string): string | null {
  if (!url || typeof url !== 'string') return null;
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function buildTextUrl(imageUrl?: string, fallback?: string | null): string | null {
  if (imageUrl) {
    return imageUrl.replace(/\.(jpg|jpeg|png|webp)$/i, '.txt');
  }
  return fallback ?? null;
}

export default defineEventHandler(async (event): Promise<GalleryResponse> => {
  const categoryParam = event.context.params?.category || '';
  const normalizedParam = normalize(categoryParam);
  const aliasKeyCandidate = CATEGORY_REDIRECTS[normalizedParam] ?? normalizedParam;
  const aliasKey = aliasKeyCandidate as keyof typeof CATEGORY_ALIASES;

  if (!CATEGORY_ALIASES[aliasKey]) {
    throw createError({ statusCode: 404, statusMessage: 'Catégorie inconnue' });
  }

  const config = useRuntimeConfig();
  const supabaseUrl = config.supabaseUrl;
  const serviceRoleKey = config.supabaseServiceRoleKey || config.supabaseKey;
  const publicBaseUrl = sanitizeBaseUrl(config.public.apiUrl);

  if (!supabaseUrl || !serviceRoleKey) {
    throw createError({ statusCode: 500, statusMessage: 'Configuration Supabase manquante' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name, path');

  if (categoriesError) {
    throw createError({ statusCode: 500, statusMessage: 'Erreur chargement catégories' });
  }

  const aliases = CATEGORY_ALIASES[aliasKey].map((value) => normalize(value));
  const category =
    categories?.find((row) => {
      const normalizedName = normalize(row.name);
      const normalizedPath = normalize(row.path);
      return aliases.includes(normalizedName) || aliases.includes(normalizedPath);
    }) ?? null;

  if (!category) {
    throw createError({ statusCode: 404, statusMessage: 'Catégorie indisponible' });
  }

  const selectCols =
    'id, title, title_en, description, description_fr, description_en, ' +
    'image_urls, folder_path, subcategory, created_at';
  const { data: artworks, error: artworksError } = await supabase
    .from('artworks')
    .select(selectCols)
    .eq('category_id', category.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (artworksError) {
    throw createError({ statusCode: 500, statusMessage: 'Erreur chargement œuvres' });
  }

  const items =
    artworks?.map((row: ArtworkRow) => {
      const images = ensureArray(row.image_urls);
      if (images.length === 0 && publicBaseUrl && row.folder_path) {
        images.push(`${publicBaseUrl}/${row.folder_path}/01.jpg`);
      }

      const fallbackTextUrl =
        publicBaseUrl && row.folder_path ? `${publicBaseUrl}/${row.folder_path}/01.txt` : null;

      const fallbackTitle = row.title || `Œuvre ${row.subcategory || ''}`.trim();
      const descFr = row.description_fr ?? row.description ?? '';
      const descEn = row.description_en ?? '';

      return {
        id: row.id,
        titleFr: row.title ?? fallbackTitle,
        titleEn: row.title_en ?? fallbackTitle,
        descriptionFr: descFr,
        descriptionEn: descEn,
        images,
        folder: row.subcategory,
        folderPath: row.folder_path,
        textUrl: buildTextUrl(images[0], fallbackTextUrl),
        createdAt: row.created_at,
      };
    }) ?? [];

  return {
    category,
    items: items.filter((item) => item.images.length > 0),
  };
});
