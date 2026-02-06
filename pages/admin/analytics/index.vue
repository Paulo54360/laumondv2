<template>
  <div class="admin-analytics">
    <AdminHeader
      :title="t('admin.analytics.title')"
      :subtitle="t('admin.analytics.subtitle')"
      @logout="onLogout"
    />

    <!-- Sélecteur de période -->
    <div class="admin-analytics__date-selector">
      <!-- Présets rapides -->
      <div class="admin-analytics__presets">
        <button
          v-for="preset in presets"
          :key="preset.value"
          type="button"
          class="admin-analytics__preset-btn"
          :class="{ 'admin-analytics__preset-btn--active': isPresetActive(preset.value) }"
          @click="setPreset(preset.value)"
        >
          {{ preset.label }}
        </button>
      </div>

      <!-- Sélecteur de dates personnalisées -->
      <div class="admin-analytics__custom-dates">
        <div class="admin-analytics__date-field">
          <label class="admin-analytics__date-label">{{ t('admin.analytics.from') }}</label>
          <input
            v-model="localStartDate"
            type="date"
            class="admin-analytics__date-input"
            :max="localEndDate"
          />
        </div>
        <span class="admin-analytics__date-separator">→</span>
        <div class="admin-analytics__date-field">
          <label class="admin-analytics__date-label">{{ t('admin.analytics.to') }}</label>
          <input
            v-model="localEndDate"
            type="date"
            class="admin-analytics__date-input"
            :min="localStartDate"
            :max="today"
          />
        </div>
        <button
          type="button"
          class="admin-analytics__apply-btn"
          @click="applyCustomDates"
        >
          {{ t('admin.analytics.apply') }}
        </button>
      </div>
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

      <!-- Carte des pays (visualisation) -->
      <section class="admin-analytics__map-section">
        <h3 class="admin-analytics__section-title">{{ t('admin.analytics.topCountries') }}</h3>
        <div class="admin-analytics__countries-map">
          <div
            v-for="country in overview.topCountries"
            :key="country.countryCode"
            class="admin-analytics__country-row"
          >
            <div class="admin-analytics__country-info">
              <span class="admin-analytics__country-flag">{{ getCountryFlag(country.countryCode) }}</span>
              <span class="admin-analytics__country-name">{{ country.country }}</span>
            </div>
            <div class="admin-analytics__country-bar-container">
              <div
                class="admin-analytics__country-bar"
                :style="{ width: `${country.percentage}%` }"
              />
            </div>
            <span class="admin-analytics__country-percent">{{ country.percentage }}%</span>
          </div>
          <p v-if="overview.topCountries.length === 0" class="admin-analytics__no-data">
            {{ t('admin.analytics.noData') }}
          </p>
        </div>
      </section>

      <!-- Grille détails (appareils + navigateurs) -->
      <section class="admin-analytics__details">
        <!-- Appareils -->
        <div class="admin-analytics__detail-card">
          <h3 class="admin-analytics__detail-title">{{ t('admin.analytics.devices') }}</h3>
          <div class="admin-analytics__device-grid">
            <div
              v-for="device in overview.devices"
              :key="device.device"
              class="admin-analytics__device-item"
            >
              <span class="admin-analytics__device-icon">{{ getDeviceIcon(device.device) }}</span>
              <span class="admin-analytics__device-label">{{ getDeviceLabel(device.device) }}</span>
              <span class="admin-analytics__device-value">{{ device.percentage }}%</span>
            </div>
          </div>
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
              <div class="admin-analytics__browser-bar-container">
                <div
                  class="admin-analytics__browser-bar"
                  :style="{ width: `${browser.percentage}%` }"
                />
              </div>
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
  import { computed, onMounted, ref } from 'vue';

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
    overview,
    overviewLoading,
    overviewError,
    startDate,
    endDate,
    fetchOverview,
    setDateRange,
    setPreset,
  } = useAdminAnalytics();

  // Présets de période
  const presets = [
    { value: '7d' as const, label: '7j' },
    { value: '30d' as const, label: '30j' },
    { value: '90d' as const, label: '90j' },
    { value: '1y' as const, label: '1 an' },
  ];

  // Date d'aujourd'hui pour le max du date picker
  const today = new Date().toISOString().split('T')[0];

  // Local state pour les date pickers
  const localStartDate = ref(startDate.value);
  const localEndDate = ref(endDate.value);

  // Vérifie si un préset est actif
  function isPresetActive(preset: '7d' | '30d' | '90d' | '1y'): boolean {
    const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
    const expectedStart = new Date();
    expectedStart.setDate(expectedStart.getDate() - daysMap[preset]);
    const expectedStartStr = expectedStart.toISOString().split('T')[0];
    return startDate.value === expectedStartStr && endDate.value === today;
  }

  // Applique les dates personnalisées
  function applyCustomDates(): void {
    setDateRange(localStartDate.value, localEndDate.value);
  }

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

  function getDeviceIcon(device: 'desktop' | 'mobile' | 'tablet'): string {
    const icons: Record<string, string> = {
      desktop: '💻',
      mobile: '📱',
      tablet: '📟',
    };
    return icons[device] || '📱';
  }

  // Convertit le code pays ISO en emoji drapeau
  function getCountryFlag(countryCode: string): string {
    if (!countryCode || countryCode.length !== 2) return '🌍';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  onMounted(() => {
    fetchOverview();
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
    margin: 0 0 1rem;
  }

  /* Sélecteur de dates */
  .admin-analytics__date-selector {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: #fff;
    border: 1px solid var(--color-border, #e8e8e8);
    border-radius: 12px;
    padding: 1.25rem;
  }

  .admin-analytics__presets {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .admin-analytics__preset-btn {
    padding: 0.5rem 1rem;
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: 6px;
    background: #fff;
    font-size: 0.85rem;
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

  .admin-analytics__custom-dates {
    display: flex;
    align-items: flex-end;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .admin-analytics__date-field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .admin-analytics__date-label {
    font-size: 0.75rem;
    color: var(--color-text-light);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .admin-analytics__date-input {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: 6px;
    font-size: 0.9rem;
    min-width: 140px;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }

  .admin-analytics__date-separator {
    color: var(--color-text-light);
    padding-bottom: 0.5rem;
  }

  .admin-analytics__apply-btn {
    padding: 0.5rem 1.25rem;
    background: var(--color-primary);
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: #a20101;
    }
  }

  /* Métriques principales */
  .admin-analytics__metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
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

  /* Section pays avec carte visuelle */
  .admin-analytics__map-section {
    background: #fff;
    border: 1px solid var(--color-border, #e8e8e8);
    border-radius: 12px;
    padding: 1.5rem;
  }

  .admin-analytics__countries-map {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .admin-analytics__country-row {
    display: grid;
    grid-template-columns: 140px 1fr 50px;
    align-items: center;
    gap: 1rem;
  }

  .admin-analytics__country-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .admin-analytics__country-flag {
    font-size: 1.25rem;
  }

  .admin-analytics__country-name {
    font-size: 0.95rem;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .admin-analytics__country-bar-container {
    height: 8px;
    background: var(--color-border, #e8e8e8);
    border-radius: 4px;
    overflow: hidden;
  }

  .admin-analytics__country-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--color-primary) 0%, #a20101 100%);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .admin-analytics__country-percent {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-primary);
    text-align: right;
  }

  /* Détails (appareils, navigateurs) */
  .admin-analytics__details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
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

  /* Appareils en grille */
  .admin-analytics__device-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .admin-analytics__device-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 0.5rem;
    background: var(--color-bg-light, #f8f9fa);
    border-radius: 8px;
    text-align: center;
  }

  .admin-analytics__device-icon {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
  }

  .admin-analytics__device-label {
    font-size: 0.8rem;
    color: var(--color-text-light);
  }

  .admin-analytics__device-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--color-primary);
    margin-top: 0.25rem;
  }

  /* Liste navigateurs avec barres */
  .admin-analytics__detail-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .admin-analytics__detail-item {
    display: grid;
    grid-template-columns: 80px 1fr 45px;
    align-items: center;
    gap: 0.75rem;
  }

  .admin-analytics__detail-name {
    font-size: 0.9rem;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .admin-analytics__browser-bar-container {
    height: 6px;
    background: var(--color-border, #e8e8e8);
    border-radius: 3px;
    overflow: hidden;
  }

  .admin-analytics__browser-bar {
    height: 100%;
    background: var(--color-primary);
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .admin-analytics__detail-value {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-primary);
    text-align: right;
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

    .admin-analytics__metrics {
      grid-template-columns: 1fr;
    }

    .admin-analytics__custom-dates {
      flex-direction: column;
      align-items: stretch;
    }

    .admin-analytics__date-separator {
      display: none;
    }

    .admin-analytics__date-input {
      width: 100%;
    }

    .admin-analytics__country-row {
      grid-template-columns: 100px 1fr 40px;
      gap: 0.5rem;
    }

    .admin-analytics__details {
      grid-template-columns: 1fr;
    }

    .admin-analytics__device-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .admin-analytics__detail-item {
      grid-template-columns: 70px 1fr 40px;
    }
  }
</style>
