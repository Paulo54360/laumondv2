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

export type RealtimeData = {
  activeUsers: number;
  timestamp: string;
};

export type OverviewData = {
  period: '7d' | '30d';
  visitors: number;
  pageViews: number;
  avgSessionDuration: number;
  topCountries: CountryData[];
  devices: DeviceData[];
  topBrowsers: BrowserData[];
  cachedAt: string;
};

type UseAdminAnalyticsReturn = {
  // Realtime state
  realtimeActiveUsers: ComputedRef<number>;
  realtimeLoading: ComputedRef<boolean>;
  realtimeError: ComputedRef<string | null>;
  realtimeTimestamp: ComputedRef<string | null>;

  // Overview state
  overview: ComputedRef<OverviewData | null>;
  overviewLoading: ComputedRef<boolean>;
  overviewError: ComputedRef<string | null>;

  // Period
  period: Ref<'7d' | '30d'>;

  // Methods
  fetchRealtime: () => Promise<void>;
  fetchOverview: () => Promise<void>;
  setPeriod: (newPeriod: '7d' | '30d') => void;
  startRealtimePolling: () => void;
  stopRealtimePolling: () => void;
};

export function useAdminAnalytics(): UseAdminAnalyticsReturn {
  const { getSession } = useAdminAuth();

  // Realtime state
  const realtimeActiveUsers = ref(0);
  const realtimeLoading = ref(false);
  const realtimeError = ref<string | null>(null);
  const realtimeTimestamp = ref<string | null>(null);

  // Overview state
  const overview = ref<OverviewData | null>(null);
  const overviewLoading = ref(false);
  const overviewError = ref<string | null>(null);

  // Period
  const period = ref<'7d' | '30d'>('7d');

  // Polling
  let pollingInterval: ReturnType<typeof setInterval> | null = null;

  async function fetchRealtime(): Promise<void> {
    realtimeLoading.value = true;
    realtimeError.value = null;

    try {
      const session = await getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      const data = await $fetch<RealtimeData>('/api/admin/analytics/realtime', {
        headers: { Authorization: `Bearer ${token}` },
      });

      realtimeActiveUsers.value = data.activeUsers;
      realtimeTimestamp.value = data.timestamp;
    } catch (err: unknown) {
      console.error('Erreur fetch realtime analytics', err);
      const fetchErr = err as { statusMessage?: string; message?: string };
      realtimeError.value =
        fetchErr.statusMessage ||
        fetchErr.message ||
        'Impossible de charger les données temps réel.';
    } finally {
      realtimeLoading.value = false;
    }
  }

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
        query: { period: period.value },
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

  function setPeriod(newPeriod: '7d' | '30d'): void {
    if (period.value !== newPeriod) {
      period.value = newPeriod;
      fetchOverview();
    }
  }

  function startRealtimePolling(): void {
    if (pollingInterval) {
      return; // Already polling
    }
    // Fetch immediately then every 30 seconds
    fetchRealtime();
    pollingInterval = setInterval(() => {
      fetchRealtime();
    }, 30000);
  }

  function stopRealtimePolling(): void {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  }

  return {
    // Realtime
    realtimeActiveUsers: computed(() => realtimeActiveUsers.value),
    realtimeLoading: computed(() => realtimeLoading.value),
    realtimeError: computed(() => realtimeError.value),
    realtimeTimestamp: computed(() => realtimeTimestamp.value),

    // Overview
    overview: computed(() => overview.value),
    overviewLoading: computed(() => overviewLoading.value),
    overviewError: computed(() => overviewError.value),

    // Period
    period,

    // Methods
    fetchRealtime,
    fetchOverview,
    setPeriod,
    startRealtimePolling,
    stopRealtimePolling,
  };
}
