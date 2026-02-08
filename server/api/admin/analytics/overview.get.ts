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

  // Récupérer les paramètres de période
  const { startDate: rawStartDate, endDate: rawEndDate } = getQuery(event);
  
  // Par défaut : 7 derniers jours
  const today = new Date();
  const defaultEndDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
  const defaultStartDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  
  const startDate = typeof rawStartDate === 'string' && rawStartDate ? rawStartDate : defaultStartDate;
  const endDate = typeof rawEndDate === 'string' && rawEndDate ? rawEndDate : defaultEndDate;

  // Vérifier la configuration GA
  const propertyId = config.ga4PropertyId;
  if (!propertyId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'GA4_PROPERTY_ID non configuré',
    });
  }

  try {
    const data = await runOverviewReport(propertyId, startDate, endDate);
    return data;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('Erreur API Google Analytics (overview):', errMsg, error);
    throw createError({
      statusCode: 500,
      statusMessage: `Impossible de récupérer les statistiques: ${errMsg}`,
    });
  }
});
