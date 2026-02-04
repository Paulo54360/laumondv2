import { createClient } from '@supabase/supabase-js';

import { sanitizeMarkdownInput } from '~/utils/markdown';

type Body = {
  contentFr?: string | null;
  contentEn?: string | null;
};

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

  const body = (await readBody(event)) as Body | undefined;
  const rawFr = body?.contentFr;
  const rawEn = body?.contentEn;
  const contentFr =
    rawFr !== undefined ? (rawFr == null ? null : sanitizeMarkdownInput(rawFr) || null) : undefined;
  const contentEn =
    rawEn !== undefined ? (rawEn == null ? null : sanitizeMarkdownInput(rawEn) || null) : undefined;

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

  const { data: existing, error: fetchError } = await supabase
    .from('site_texts')
    .select('id, content_fr, content_en')
    .eq('slug', slug.trim())
    .maybeSingle();

  if (fetchError) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération du texte',
    });
  }

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
    updated_by: userData.user.id,
  };

  if (contentFr !== undefined) {
    updatePayload.content_fr = contentFr;
  }
  if (contentEn !== undefined) {
    updatePayload.content_en = contentEn;
  }

  if (existing) {
    const { error: historyError } = await supabase.from('site_texts_history').insert({
      slug: slug.trim(),
      content_fr: existing.content_fr,
      content_en: existing.content_en,
    });

    if (historyError) {
      throw createError({
        statusCode: 500,
        statusMessage: "Erreur lors de la sauvegarde de l'historique",
      });
    }

    const { error: upsertError } = await supabase
      .from('site_texts')
      .update(updatePayload)
      .eq('id', existing.id);

    if (upsertError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur lors de la mise à jour du texte',
      });
    }
  } else {
    const { error: insertError } = await supabase.from('site_texts').insert({
      slug: slug.trim(),
      content_fr: contentFr ?? null,
      content_en: contentEn ?? null,
      updated_at: updatePayload.updated_at,
      updated_by: updatePayload.updated_by,
    });

    if (insertError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur lors de la création du texte',
      });
    }
  }

  return { success: true };
});
