import { createClient } from '@supabase/supabase-js';

import { runRealtimeReport, type RealtimeData } from '~/server/utils/googleAnalytics';

export default defineEventHandler(async (event): Promise<RealtimeData> => {
  // Vérification auth (pattern copié de artworks/index.get.ts)
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

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    throw createError({ statusCode: 401, statusMessage: 'Session invalide' });
  }

  // Vérifier la configuration GA
  const propertyId = config.ga4PropertyId;
  if (!propertyId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'GA4_PROPERTY_ID non configuré',
    });
  }

  try {
    const data = await runRealtimeReport(propertyId);
    return data;
  } catch (error) {
    console.error('Erreur API Google Analytics (realtime):', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Impossible de récupérer les données temps réel',
    });
  }
});
