import { computed, ref, type ComputedRef, type Ref } from 'vue';

import { useAdminAuth } from '~/composables/useAdminAuth';

// Types (mirrored from server)
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

type UseAdminAnalyticsReturn = {
  // Overview state
  overview: ComputedRef<OverviewData | null>;
  overviewLoading: ComputedRef<boolean>;
  overviewError: ComputedRef<string | null>;

  // Date range
  startDate: Ref<string>;
  endDate: Ref<string>;

  // Methods
  fetchOverview: () => Promise<void>;
  setDateRange: (start: string, end: string) => void;
  setPreset: (preset: '7d' | '30d' | '90d' | '1y') => void;
};

// Helper pour formater une date en YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Helper pour calculer une date relative
function getRelativeDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return formatDate(date);
}

export function useAdminAnalytics(): UseAdminAnalyticsReturn {
  const { getSession } = useAdminAuth();

  // Overview state
  const overview = ref<OverviewData | null>(null);
  const overviewLoading = ref(false);
  const overviewError = ref<string | null>(null);

  // Date range (défaut: 7 derniers jours)
  const startDate = ref<string>(getRelativeDate(7));
  const endDate = ref<string>(formatDate(new Date()));

  async function fetchOverview(): Promise<void> {
    overviewLoading.value = true;
    overviewError.value = null;

    try {
      const session = await getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      const data = await $fetch<OverviewData>('/api/admin/analytics/overview', {
        headers: { Authorization: `Bearer ${token}` },
        query: {
          startDate: startDate.value,
          endDate: endDate.value,
        },
      });

      overview.value = data;
    } catch (err: unknown) {
      console.error('Erreur fetch overview analytics', err);
      const fetchErr = err as { statusMessage?: string; message?: string };
      overviewError.value =
        fetchErr.statusMessage ||
        fetchErr.message ||
        'Impossible de charger les statistiques.';
    } finally {
      overviewLoading.value = false;
    }
  }

  function setDateRange(start: string, end: string): void {
    startDate.value = start;
    endDate.value = end;
    fetchOverview();
  }

  function setPreset(preset: '7d' | '30d' | '90d' | '1y'): void {
    const today = formatDate(new Date());
    let daysAgo = 7;

    switch (preset) {
      case '7d':
        daysAgo = 7;
        break;
      case '30d':
        daysAgo = 30;
        break;
      case '90d':
        daysAgo = 90;
        break;
      case '1y':
        daysAgo = 365;
        break;
    }

    startDate.value = getRelativeDate(daysAgo);
    endDate.value = today;
    fetchOverview();
  }

  return {
    // Overview
    overview: computed(() => overview.value),
    overviewLoading: computed(() => overviewLoading.value),
    overviewError: computed(() => overviewError.value),

    // Date range
    startDate,
    endDate,

    // Methods
    fetchOverview,
    setDateRange,
    setPreset,
  };
}
