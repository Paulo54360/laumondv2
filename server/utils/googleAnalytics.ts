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

export type VisitorSegment = {
  newUsers: number;
  newUsersPercentage: number;
  returningUsers: number;
  returningUsersPercentage: number;
};

export type PageData = {
  pagePath: string;
  pageTitle: string;
  views: number;
  avgTimeOnPage: number;
  percentage: number;
};

export type OverviewData = {
  startDate: string;
  endDate: string;
  visitors: number;
  pageViews: number;
  avgSessionDuration: number;
  visitorSegment: VisitorSegment;
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

  // Requête principale : métriques globales + nouveaux vs récurrents
  const [metricsResponse] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'newUsers' },
      { name: 'totalUsers' },
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
  const newUsers = metricsResponse.rows?.[0]?.metricValues?.[3]?.value
    ? parseInt(metricsResponse.rows[0].metricValues[3].value, 10)
    : 0;
  const totalUsers = metricsResponse.rows?.[0]?.metricValues?.[4]?.value
    ? parseInt(metricsResponse.rows[0].metricValues[4].value, 10)
    : 0;

  const returningUsers = Math.max(0, totalUsers - newUsers);
  const visitorSegment: VisitorSegment = {
    newUsers,
    newUsersPercentage: totalUsers > 0 ? Math.round((newUsers / totalUsers) * 100) : 0,
    returningUsers,
    returningUsersPercentage: totalUsers > 0 ? Math.round((returningUsers / totalUsers) * 100) : 0,
  };

  // Requête par pays
  const [countryResponse] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'country' }, { name: 'countryId' }],
    metrics: [{ name: 'activeUsers' }],
    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    limit: 5,
  });

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
    visitorSegment,
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

/**
 * Récupère les pages les plus vues avec temps moyen par page
 * Avec option de filtre par pays
 */
export async function runTopPagesReport(
  propertyId: string,
  startDate: string,
  endDate: string,
  countryFilter?: string
): Promise<PageData[]> {
  const cacheKey = `pages-${propertyId}-${startDate}-${endDate}-${countryFilter || 'all'}`;
  const now = Date.now();

  // Vérifier le cache (réutilise le même cache)
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return (cached.data as unknown as { pages: PageData[] }).pages;
  }

  const client = getAnalyticsClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reportRequest: any = {
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
    ],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 10,
  };

  // Construire les filtres
  const filters: Array<{ filter: object }> = [];

  // Exclure les pages admin
  filters.push({
    filter: {
      fieldName: 'pagePath',
      stringFilter: {
        value: '/admin',
        matchType: 'BEGINS_WITH',
        caseSensitive: false,
      },
    },
  });
  filters.push({
    filter: {
      fieldName: 'pagePath',
      stringFilter: {
        value: '/fr/admin',
        matchType: 'BEGINS_WITH',
        caseSensitive: false,
      },
    },
  });
  filters.push({
    filter: {
      fieldName: 'pagePath',
      stringFilter: {
        value: '/en/admin',
        matchType: 'BEGINS_WITH',
        caseSensitive: false,
      },
    },
  });

  // Filtre pays si spécifié
  if (countryFilter) {
    // Combiner exclusion admin + filtre pays
    reportRequest.dimensionFilter = {
      andGroup: {
        expressions: [
          {
            notExpression: {
              orGroup: {
                expressions: filters,
              },
            },
          },
          {
            filter: {
              fieldName: 'country',
              stringFilter: {
                value: countryFilter,
                matchType: 'EXACT',
              },
            },
          },
        ],
      },
    };
  } else {
    // Seulement exclure les pages admin
    reportRequest.dimensionFilter = {
      notExpression: {
        orGroup: {
          expressions: filters,
        },
      },
    };
  }

  const [pagesResponse] = await client.runReport(reportRequest);

  // Calculer le total des vues pour les pourcentages
  const totalViews = pagesResponse.rows?.reduce(
    (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0', 10),
    0
  ) || 1;

  const pages: PageData[] = (pagesResponse.rows || []).map((row) => {
    const views = parseInt(row.metricValues?.[0]?.value || '0', 10);
    const avgTimeOnPage = parseFloat(row.metricValues?.[1]?.value || '0');
    const pagePath = row.dimensionValues?.[0]?.value || '/';
    let pageTitle = row.dimensionValues?.[1]?.value || '';

    // Remplacer "(not set)" par un titre basé sur le chemin
    if (!pageTitle || pageTitle === '(not set)') {
      // Générer un titre lisible depuis le chemin
      const pathParts = pagePath.replace(/^\/(?:fr|en)?/, '').split('/').filter(Boolean);
      if (pathParts.length === 0) {
        pageTitle = 'Accueil';
      } else {
        // Capitaliser le premier segment
        pageTitle = pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1);
      }
    }

    return {
      pagePath,
      pageTitle,
      views,
      avgTimeOnPage,
      percentage: Math.round((views / totalViews) * 100),
    };
  });

  // Mettre en cache (hack: stocker dans le même cache avec wrapper)
  cache.set(cacheKey, {
    data: { pages } as unknown as OverviewData,
    expiresAt: now + CACHE_TTL_MS,
  });

  return pages;
}
