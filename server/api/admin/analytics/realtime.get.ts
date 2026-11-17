import { runRealtimeReport, type RealtimeData } from '~/server/utils/googleAnalytics';

export default defineEventHandler(async (event): Promise<RealtimeData> => {
  await requireAdminUser(event);

  // Vérifier la configuration GA
  const config = useRuntimeConfig();
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
