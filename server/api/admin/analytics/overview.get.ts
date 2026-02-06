import { createClient } from '@supabase/supabase-js';

import { runOverviewReport, type OverviewData } from '~/server/utils/googleAnalytics';

export default defineEventHandler(async (event): Promise<OverviewData> => {
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

  // Récupérer le paramètre de période
  const { period: rawPeriod } = getQuery(event);
  const period: '7d' | '30d' = rawPeriod === '30d' ? '30d' : '7d';

  // Vérifier la configuration GA
  const propertyId = config.ga4PropertyId;
  if (!propertyId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'GA4_PROPERTY_ID non configuré',
    });
  }

  try {
    const data = await runOverviewReport(propertyId, period);
    return data;
  } catch (error) {
    console.error('Erreur API Google Analytics (overview):', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Impossible de récupérer les statistiques',
    });
  }
});
