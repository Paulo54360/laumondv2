import { createClient } from '@supabase/supabase-js';

type SiteTextRow = {
  slug: string;
  content_fr: string | null;
  content_en: string | null;
};

type SiteTextPublic = {
  slug: string;
  contentFr: string | null;
  contentEn: string | null;
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const supabaseUrl = config.supabaseUrl;
  const serviceRoleKey = config.supabaseServiceRoleKey;

  if (!supabaseUrl || !serviceRoleKey) {
    throw createError({ statusCode: 500, statusMessage: 'Configuration manquante' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { slug } = getQuery(event);

  let query = supabase
    .from('site_texts')
    .select('slug, content_fr, content_en')
    .order('slug', { ascending: true });

  if (typeof slug === 'string' && slug.trim()) {
    query = query.eq('slug', slug.trim()).maybeSingle();
  }

  const { data, error } = await query;

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des textes',
    });
  }

  const mapRow = (row: SiteTextRow): SiteTextPublic => ({
    slug: row.slug,
    contentFr: row.content_fr,
    contentEn: row.content_en,
  });

  if (Array.isArray(data)) {
    return data.map(mapRow);
  }

  return data ? mapRow(data as SiteTextRow) : null;
});
