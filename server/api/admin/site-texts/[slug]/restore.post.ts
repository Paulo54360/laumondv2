import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Non authentifié' });
  }

  const slug = getRouterParam(event, 'slug');
  if (!slug?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Slug manquant' });
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

  const { data: lastHistory, error: historyError } = await supabase
    .from('site_texts_history')
    .select('content_fr, content_en')
    .eq('slug', slug.trim())
    .order('saved_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (historyError) {
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la récupération de l'historique",
    });
  }

  if (!lastHistory) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Aucune version précédente disponible',
    });
  }

  const { data: existing } = await supabase
    .from('site_texts')
    .select('id')
    .eq('slug', slug.trim())
    .maybeSingle();

  if (existing) {
    const { error: updateError } = await supabase
      .from('site_texts')
      .update({
        content_fr: lastHistory.content_fr,
        content_en: lastHistory.content_en,
        updated_at: new Date().toISOString(),
        updated_by: userData.user.id,
      })
      .eq('id', existing.id);

    if (updateError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur lors de la restauration',
      });
    }
  } else {
    const { error: insertError } = await supabase.from('site_texts').insert({
      slug: slug.trim(),
      content_fr: lastHistory.content_fr,
      content_en: lastHistory.content_en,
      updated_at: new Date().toISOString(),
      updated_by: userData.user.id,
    });

    if (insertError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur lors de la restauration',
      });
    }
  }

  return {
    success: true,
    contentFr: lastHistory.content_fr,
    contentEn: lastHistory.content_en,
  };
});
