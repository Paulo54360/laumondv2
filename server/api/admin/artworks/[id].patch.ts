import { createClient } from '@supabase/supabase-js';

type Body = { action: 'trash' | 'restore' };

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

  const body = (await readBody(event)) as Body | undefined;
  const action = body?.action;
  if (action !== 'trash' && action !== 'restore') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Action invalide. Utilisez "trash" ou "restore".',
    });
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

  const { error } = await supabase
    .from('artworks')
    .update({
      deleted_at: action === 'trash' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', artworkId);

  if (error) {
    if (error.code === 'PGRST116') {
      throw createError({ statusCode: 404, statusMessage: 'Œuvre introuvable' });
    }
    console.error('Erreur PATCH artwork', error);
    throw createError({ statusCode: 500, statusMessage: 'Erreur lors de la mise à jour' });
  }

  return {
    success: true,
    action,
    data: { artworkId },
  };
});
