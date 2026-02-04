import { createClient } from '@supabase/supabase-js';

const SLUG_TO_CATEGORY: Record<string, string> = {
  biography: 'biography',
  metahism: 'metahism',
  homepage_biography: 'homepage',
  homepage_metahism: 'homepage',
  homepage_hero_title_top: 'homepage',
  homepage_hero_title_bottom: 'homepage',
  homepage_hero_descriptions: 'homepage',
  homepage_biography_title: 'homepage',
  homepage_portrait_caption: 'homepage',
  homepage_read_biography: 'homepage',
  homepage_metahism_title: 'homepage',
  homepage_mobile_ouverture_title: 'homepage',
  homepage_metahisme_artwork_caption: 'homepage',
  homepage_discover_metahisme: 'homepage',
  homepage_artworks_title: 'homepage',
  homepage_browse_artworks: 'homepage',
  homepage_analyses_title: 'homepage',
  homepage_read_analyses: 'homepage',
  homepage_artwork_portant: 'homepage',
  homepage_artwork_portant_author: 'homepage',
  homepage_artwork_concordance: 'homepage',
  homepage_artwork_concordance_author: 'homepage',
  homepage_artwork_mobile: 'homepage',
  homepage_artwork_mobile_author: 'homepage',
  homepage_analysis_portant_title: 'homepage',
  homepage_analysis_portant_excerpt: 'homepage',
  homepage_analysis_concordance_title: 'homepage',
  homepage_analysis_concordance_excerpt: 'homepage',
  analysis_portant: 'analyses',
  analysis_concordance: 'analyses',
  analysis_aimants: 'analyses',
  analysis_advienne: 'analyses',
};

type SiteTextRow = {
  id: number;
  slug: string;
  content_fr: string | null;
  content_en: string | null;
  updated_at: string | null;
  updated_by: string | null;
};

type SiteTextsResponse = Array<{
  id: number;
  slug: string;
  category: string | null;
  contentFr: string | null;
  contentEn: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
}>;

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Non authentifié' });
  }

  const config = useRuntimeConfig();
  const supabaseUrl = config.supabaseUrl;
  const serviceRoleKey = config.supabaseServiceRoleKey;

  if (!supabaseUrl || !serviceRoleKey) {
    throw createError({ statusCode: 500, statusMessage: 'Configuration Supabase manquante' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Session expirée. Veuillez vous reconnecter.',
    });
  }

  const { slug } = getQuery(event);

  let query = supabase
    .from('site_texts')
    .select('id, slug, content_fr, content_en, updated_at, updated_by')
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

  const mapRow = (
    row: SiteTextRow
  ): {
    id: number;
    slug: string;
    category: string | null;
    contentFr: string | null;
    contentEn: string | null;
    updatedAt: string | null;
    updatedBy: string | null;
  } => ({
    id: row.id,
    slug: row.slug,
    category: SLUG_TO_CATEGORY[row.slug] ?? 'homepage',
    contentFr: row.content_fr,
    contentEn: row.content_en,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  });

  if (Array.isArray(data)) {
    return data.map(mapRow) as SiteTextsResponse;
  }

  return data ? mapRow(data as SiteTextRow) : null;
});
