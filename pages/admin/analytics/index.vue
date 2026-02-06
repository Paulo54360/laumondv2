<template>
  <div class="admin-analytics">
    <AdminHeader
      :title="t('admin.analytics.title')"
      :subtitle="t('admin.analytics.subtitle')"
      @logout="onLogout"
    />

    <!-- Section temps réel -->
    <section class="admin-analytics__realtime">
      <h2 class="admin-analytics__section-title">{{ t('admin.analytics.realtime') }}</h2>
      <div class="admin-analytics__realtime-card">
        <div v-if="realtimeLoading" class="admin-analytics__loading">...</div>
        <div v-else-if="realtimeError" class="admin-analytics__error">
          {{ realtimeError }}
        </div>
        <template v-else>
          <span class="admin-analytics__realtime-value">{{ realtimeActiveUsers }}</span>
          <span class="admin-analytics__realtime-label">{{ t('admin.analytics.activeUsers') }}</span>
        </template>
      </div>
    </section>

    <!-- Toggle période -->
    <div class="admin-analytics__period-toggle">
      <button
        type="button"
        class="admin-analytics__period-btn"
        :class="{ 'admin-analytics__period-btn--active': period === '7d' }"
        @click="setPeriod('7d')"
      >
        {{ t('admin.analytics.period7d') }}
      </button>
      <button
        type="button"
        class="admin-analytics__period-btn"
        :class="{ 'admin-analytics__period-btn--active': period === '30d' }"
        @click="setPeriod('30d')"
      >
        {{ t('admin.analytics.period30d') }}
      </button>
    </div>

    <!-- Erreur overview -->
    <div v-if="overviewError" class="admin-analytics__error admin-analytics__error--block">
      {{ overviewError }}
    </div>

    <!-- Loading overview -->
    <div v-else-if="overviewLoading" class="admin-analytics__loading admin-analytics__loading--block">
      {{ t('admin.analytics.loading') }}
    </div>

    <!-- Contenu principal -->
    <template v-else-if="overview">
      <!-- Cartes métriques principales -->
      <section class="admin-analytics__metrics">
        <div class="admin-analytics__card">
          <span class="admin-analytics__card-value">{{ formatNumber(overview.visitors) }}</span>
          <span class="admin-analytics__card-label">{{ t('admin.analytics.visitors') }}</span>
        </div>
        <div class="admin-analytics__card">
          <span class="admin-analytics__card-value">{{ formatNumber(overview.pageViews) }}</span>
          <span class="admin-analytics__card-label">{{ t('admin.analytics.pageViews') }}</span>
        </div>
        <div class="admin-analytics__card">
          <span class="admin-analytics__card-value">{{ formatDuration(overview.avgSessionDuration) }}</span>
          <span class="admin-analytics__card-label">{{ t('admin.analytics.avgDuration') }}</span>
        </div>
      </section>

      <!-- Grille détails -->
      <section class="admin-analytics__details">
        <!-- Top pays -->
        <div class="admin-analytics__detail-card">
          <h3 class="admin-analytics__detail-title">{{ t('admin.analytics.topCountries') }}</h3>
          <ul class="admin-analytics__detail-list">
            <li
              v-for="country in overview.topCountries"
              :key="country.countryCode"
              class="admin-analytics__detail-item"
            >
              <span class="admin-analytics__detail-name">{{ country.country }}</span>
              <span class="admin-analytics__detail-value">{{ country.percentage }}%</span>
            </li>
          </ul>
          <p v-if="overview.topCountries.length === 0" class="admin-analytics__no-data">
            {{ t('admin.analytics.noData') }}
          </p>
        </div>

        <!-- Appareils -->
        <div class="admin-analytics__detail-card">
          <h3 class="admin-analytics__detail-title">{{ t('admin.analytics.devices') }}</h3>
          <ul class="admin-analytics__detail-list">
            <li
              v-for="device in overview.devices"
              :key="device.device"
              class="admin-analytics__detail-item"
            >
              <span class="admin-analytics__detail-name">{{ getDeviceLabel(device.device) }}</span>
              <span class="admin-analytics__detail-value">{{ device.percentage }}%</span>
            </li>
          </ul>
          <p v-if="overview.devices.length === 0" class="admin-analytics__no-data">
            {{ t('admin.analytics.noData') }}
          </p>
        </div>

        <!-- Navigateurs -->
        <div class="admin-analytics__detail-card">
          <h3 class="admin-analytics__detail-title">{{ t('admin.analytics.browsers') }}</h3>
          <ul class="admin-analytics__detail-list">
            <li
              v-for="browser in overview.topBrowsers"
              :key="browser.browser"
              class="admin-analytics__detail-item"
            >
              <span class="admin-analytics__detail-name">{{ browser.browser }}</span>
              <span class="admin-analytics__detail-value">{{ browser.percentage }}%</span>
            </li>
          </ul>
          <p v-if="overview.topBrowsers.length === 0" class="admin-analytics__no-data">
            {{ t('admin.analytics.noData') }}
          </p>
        </div>
      </section>
    </template>

    <!-- Pas de données -->
    <div v-else class="admin-analytics__no-data admin-analytics__no-data--block">
      {{ t('admin.analytics.noData') }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted } from 'vue';

  import { useAdminAnalytics } from '~/composables/useAdminAnalytics';
  import { useAdminAuth } from '~/composables/useAdminAuth';

  defineOptions({ name: 'AdminAnalytics' });

  definePageMeta({
    layout: 'default',
    middleware: 'admin-auth',
  });

  useHead({
    meta: [{ name: 'robots', content: 'noindex' }],
  });

  const { t } = useI18n();
  const router = useRouter();
  const localePath = useLocalePath();
  const { logout } = useAdminAuth();

  const {
    realtimeActiveUsers,
    realtimeLoading,
    realtimeError,
    overview,
    overviewLoading,
    overviewError,
    period,
    fetchOverview,
    setPeriod,
    startRealtimePolling,
    stopRealtimePolling,
  } = useAdminAnalytics();

  async function onLogout(): Promise<void> {
    await logout();
    await router.replace(localePath('/admin/login'));
  }

  function formatNumber(value: number): string {
    return new Intl.NumberFormat('fr-FR').format(value);
  }

  function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  }

  function getDeviceLabel(device: 'desktop' | 'mobile' | 'tablet'): string {
    const labels: Record<string, string> = {
      desktop: t('admin.analytics.desktop'),
      mobile: t('admin.analytics.mobile'),
      tablet: t('admin.analytics.tablet'),
    };
    return labels[device] || device;
  }

  onMounted(() => {
    startRealtimePolling();
    fetchOverview();
  });

  onBeforeUnmount(() => {
    stopRealtimePolling();
  });
</script>

<style scoped lang="scss">
  .admin-analytics {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1.5rem 3rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .admin-analytics__section-title {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-light);
    margin: 0 0 0.75rem;
  }

  /* Temps réel */
  .admin-analytics__realtime-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--color-primary) 0%, #a20101 100%);
    color: #fff;
    padding: 2rem;
    border-radius: 12px;
    min-height: 120px;
  }

  .admin-analytics__realtime-value {
    font-size: 3rem;
    font-weight: 700;
    line-height: 1;
  }

  .admin-analytics__realtime-label {
    font-size: 1rem;
    margin-top: 0.5rem;
    opacity: 0.9;
  }

  /* Toggle période */
  .admin-analytics__period-toggle {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .admin-analytics__period-btn {
    padding: 0.6rem 1.25rem;
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: 6px;
    background: #fff;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--color-primary);
    }

    &--active {
      background: var(--color-primary);
      color: #fff;
      border-color: var(--color-primary);
    }
  }

  /* Métriques principales */
  .admin-analytics__metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }

  .admin-analytics__card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fff;
    border: 1px solid var(--color-border, #e8e8e8);
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
  }

  .admin-analytics__card-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .admin-analytics__card-label {
    font-size: 0.85rem;
    color: var(--color-text-light);
    margin-top: 0.25rem;
  }

  /* Détails (pays, appareils, navigateurs) */
  .admin-analytics__details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .admin-analytics__detail-card {
    background: #fff;
    border: 1px solid var(--color-border, #e8e8e8);
    border-radius: 12px;
    padding: 1.25rem;
  }

  .admin-analytics__detail-title {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-light);
    margin: 0 0 1rem;
  }

  .admin-analytics__detail-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .admin-analytics__detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.4rem 0;
    border-bottom: 1px solid var(--color-border, #f0f0f0);

    &:last-child {
      border-bottom: none;
    }
  }

  .admin-analytics__detail-name {
    font-size: 0.95rem;
    color: var(--color-text);
  }

  .admin-analytics__detail-value {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  /* États */
  .admin-analytics__loading {
    color: var(--color-text-light);
    font-style: italic;

    &--block {
      text-align: center;
      padding: 2rem;
    }
  }

  .admin-analytics__error {
    color: var(--color-primary);
    font-size: 0.9rem;

    &--block {
      text-align: center;
      padding: 2rem;
      background: rgba(204, 0, 0, 0.05);
      border-radius: 8px;
    }
  }

  .admin-analytics__no-data {
    color: var(--color-text-light);
    font-style: italic;
    font-size: 0.9rem;

    &--block {
      text-align: center;
      padding: 2rem;
    }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .admin-analytics {
      padding: 1.5rem 1rem 2rem;
    }

    .admin-analytics__realtime-value {
      font-size: 2.5rem;
    }

    .admin-analytics__metrics {
      grid-template-columns: 1fr;
    }

    .admin-analytics__details {
      grid-template-columns: 1fr;
    }
  }
</style>
