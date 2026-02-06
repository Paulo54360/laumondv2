import { createClient } from '@supabase/supabase-js';

import { runTopPagesReport, type PageData } from '~/server/utils/googleAnalytics';

type PagesResponse = {
  pages: PageData[];
  country: string | null;
  startDate: string;
  endDate: string;
};

export default defineEventHandler(async (event): Promise<PagesResponse> => {
  // Vérification auth
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

  // Récupérer les paramètres
  const { startDate: rawStartDate, endDate: rawEndDate, country: rawCountry } = getQuery(event);

  // Par défaut : 7 derniers jours
  const today = new Date();
  const defaultEndDate = today.toISOString().split('T')[0];
  const defaultStartDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const startDate = typeof rawStartDate === 'string' && rawStartDate ? rawStartDate : defaultStartDate;
  const endDate = typeof rawEndDate === 'string' && rawEndDate ? rawEndDate : defaultEndDate;
  const country = typeof rawCountry === 'string' && rawCountry ? rawCountry : null;

  // Vérifier la configuration GA
  const propertyId = config.ga4PropertyId;
  if (!propertyId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'GA4_PROPERTY_ID non configuré',
    });
  }

  try {
    const pages = await runTopPagesReport(propertyId, startDate, endDate, country || undefined);
    return {
      pages,
      country,
      startDate,
      endDate,
    };
  } catch (error) {
    console.error('Erreur API Google Analytics (pages):', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Impossible de récupérer les pages les plus vues',
    });
  }
});
