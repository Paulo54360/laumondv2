import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Types pour les données analytics
export type CountryData = {
  country: string;
  countryCode: string;
  visitors: number;
  percentage: number;
};

export type DeviceData = {
  device: 'desktop' | 'mobile' | 'tablet';
  percentage: number;
};

export type BrowserData = {
  browser: string;
  percentage: number;
};

export type RealtimeData = {
  activeUsers: number;
  timestamp: string;
};

export type OverviewData = {
  startDate: string;
  endDate: string;
  visitors: number;
  pageViews: number;
  avgSessionDuration: number;
  topCountries: CountryData[];
  devices: DeviceData[];
  topBrowsers: BrowserData[];
  cachedAt: string;
};

// Cache mémoire pour les données historiques (5 minutes)
type CacheEntry = {
  data: OverviewData;
  expiresAt: number;
};

const cache: Map<string, CacheEntry> = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Singleton client
let analyticsClient: BetaAnalyticsDataClient | null = null;

/**
 * Récupère ou crée le client Google Analytics
 */
export function getAnalyticsClient(): BetaAnalyticsDataClient {
  if (analyticsClient) {
    return analyticsClient;
  }

  const config = useRuntimeConfig();
  const credentialsJson = config.googleCredentialsJson;

  if (!credentialsJson) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON non configuré');
  }

  try {
    const credentials = JSON.parse(credentialsJson);
    analyticsClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
      projectId: credentials.project_id,
    });
    return analyticsClient;
  } catch (error) {
    throw new Error(`Erreur parsing credentials GA: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Récupère les données temps réel (visiteurs actifs)
 */
export async function runRealtimeReport(propertyId: string): Promise<RealtimeData> {
  const client = getAnalyticsClient();

  const [response] = await client.runRealtimeReport({
    property: `properties/${propertyId}`,
    metrics: [{ name: 'activeUsers' }],
  });

  const activeUsers = response.rows?.[0]?.metricValues?.[0]?.value
    ? parseInt(response.rows[0].metricValues[0].value, 10)
    : 0;

  return {
    activeUsers,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Récupère les données historiques (métriques, pays, appareils, navigateurs)
 * Avec cache mémoire de 5 minutes
 */
export async function runOverviewReport(
  propertyId: string,
  startDate: string,
  endDate: string
): Promise<OverviewData> {
  const cacheKey = `${propertyId}-${startDate}-${endDate}`;
  const now = Date.now();

  // Vérifier le cache
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const client = getAnalyticsClient();

  // Requête principale : métriques globales
  const [metricsResponse] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
    ],
  });

  const visitors = metricsResponse.rows?.[0]?.metricValues?.[0]?.value
    ? parseInt(metricsResponse.rows[0].metricValues[0].value, 10)
    : 0;
  const pageViews = metricsResponse.rows?.[0]?.metricValues?.[1]?.value
    ? parseInt(metricsResponse.rows[0].metricValues[1].value, 10)
    : 0;
  const avgSessionDuration = metricsResponse.rows?.[0]?.metricValues?.[2]?.value
    ? parseFloat(metricsResponse.rows[0].metricValues[2].value)
    : 0;

  // Requête par pays
  const [countryResponse] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'country' }, { name: 'countryId' }],
    metrics: [{ name: 'activeUsers' }],
    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    limit: 5,
  });

  const totalCountryVisitors = countryResponse.rows?.reduce(
    (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0', 10),
    0
  ) || 1;

  const topCountries: CountryData[] = (countryResponse.rows || []).map((row) => {
    const countryVisitors = parseInt(row.metricValues?.[0]?.value || '0', 10);
    return {
      country: row.dimensionValues?.[0]?.value || 'Unknown',
      countryCode: row.dimensionValues?.[1]?.value || 'XX',
      visitors: countryVisitors,
      percentage: Math.round((countryVisitors / visitors) * 100),
    };
  });

  // Requête par appareil
  const [deviceResponse] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'deviceCategory' }],
    metrics: [{ name: 'activeUsers' }],
  });

  const totalDeviceVisitors = deviceResponse.rows?.reduce(
    (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0', 10),
    0
  ) || 1;

  const devices: DeviceData[] = (deviceResponse.rows || []).map((row) => {
    const deviceVisitors = parseInt(row.metricValues?.[0]?.value || '0', 10);
    const deviceName = (row.dimensionValues?.[0]?.value || 'desktop').toLowerCase();
    return {
      device: deviceName as 'desktop' | 'mobile' | 'tablet',
      percentage: Math.round((deviceVisitors / totalDeviceVisitors) * 100),
    };
  });

  // Requête par navigateur
  const [browserResponse] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'browser' }],
    metrics: [{ name: 'activeUsers' }],
    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    limit: 5,
  });

  const totalBrowserVisitors = browserResponse.rows?.reduce(
    (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0', 10),
    0
  ) || 1;

  const topBrowsers: BrowserData[] = (browserResponse.rows || []).map((row) => {
    const browserVisitors = parseInt(row.metricValues?.[0]?.value || '0', 10);
    return {
      browser: row.dimensionValues?.[0]?.value || 'Unknown',
      percentage: Math.round((browserVisitors / totalBrowserVisitors) * 100),
    };
  });

  const data: OverviewData = {
    startDate,
    endDate,
    visitors,
    pageViews,
    avgSessionDuration,
    topCountries,
    devices,
    topBrowsers,
    cachedAt: new Date().toISOString(),
  };

  // Mettre en cache
  cache.set(cacheKey, {
    data,
    expiresAt: now + CACHE_TTL_MS,
  });

  return data;
}
