<!-- Page admin textes éditoriaux — Story S2.1 -->
<template>
  <div class="admin-texts">
    <AdminHeader
      :title="t('admin.texts.title')"
      :subtitle="t('admin.texts.subtitle')"
      @logout="onLogout"
    />

    <div v-if="loading" class="admin-texts__status">{{ t('admin.texts.loading') }}</div>
    <div v-else-if="error" class="admin-texts__status admin-texts__status--error">
      {{ error }}
    </div>
    <div v-else class="admin-texts__body">
      <div class="admin-texts__category-tabs">
        <button
          v-for="group in sectionGroups"
          :key="group.category"
          type="button"
          :class="[
            'admin-texts__category-tab',
            { 'admin-texts__category-tab--active': activeCategory === group.category },
          ]"
          @click="activeCategory = group.category"
        >
          {{ group.categoryLabel }}
        </button>
      </div>
      <div class="admin-texts__sections">
        <template v-for="section in currentGroupSections" :key="section.slug">
          <section class="admin-texts__section">
            <h3 class="admin-texts__section-title">{{ section.label }}</h3>
            <div class="admin-texts__tabs">
              <button
                type="button"
                :class="['admin-texts__tab', { 'admin-texts__tab--active': activeTab === 'fr' }]"
                @click="activeTab = 'fr'"
              >
                {{ t('admin.texts.tab_fr') }}
              </button>
              <button
                type="button"
                :class="['admin-texts__tab', { 'admin-texts__tab--active': activeTab === 'en' }]"
                @click="activeTab = 'en'"
              >
                {{ t('admin.texts.tab_en') }}
              </button>
              <button
                type="button"
                :class="[
                  'admin-texts__tab',
                  { 'admin-texts__tab--active': activeTab === 'preview' },
                ]"
                @click="activeTab = 'preview'"
              >
                {{ t('admin.texts.preview') }}
              </button>
            </div>
            <p class="admin-texts__hint">{{ t('admin.texts.markdown_hint') }}</p>
          <textarea
            v-show="activeTab === 'fr'"
            v-model="section.draftFr"
            class="admin-texts__textarea"
            :rows="SHORT_SLUGS.has(section.slug) ? 2 : 12"
            :data-slug="section.slug"
            data-lang="fr"
          />
          <textarea
            v-show="activeTab === 'en'"
            v-model="section.draftEn"
            class="admin-texts__textarea"
            :rows="SHORT_SLUGS.has(section.slug) ? 2 : 12"
            :data-slug="section.slug"
            data-lang="en"
          />
            <div
              v-show="activeTab === 'preview'"
              class="admin-texts__preview admin-texts__textarea"
              data-testid="markdown-preview"
            >
              <div
                v-for="(lang, key) in { fr: section.draftFr, en: section.draftEn }"
                :key="key"
                class="admin-texts__preview-block"
              >
                <h4 class="admin-texts__preview-lang">
                  {{ key === 'fr' ? t('admin.texts.tab_fr') : t('admin.texts.tab_en') }}
                </h4>
                <!-- eslint-disable vue/no-v-html -->
                <div
                  class="admin-texts__preview-content"
                  :data-lang="key"
                  v-html="markdownToSafeHtml(lang)"
                />
                <!-- eslint-enable vue/no-v-html -->
              </div>
            </div>
            <div class="admin-texts__actions">
              <BaseButton
                variant="outline"
                :is-loading="savingSlug === section.slug"
                :disabled="!section.hasChanges"
                @click="saveSection(section)"
              >
                {{
                  savingSlug === section.slug
                    ? t('admin.texts.save_loading')
                    : t('admin.texts.save')
                }}
              </BaseButton>
              <BaseButton
                variant="outline"
                size="sm"
                :is-loading="restoringSlug === section.slug"
                @click="restoreSection(section)"
              >
                {{
                  restoringSlug === section.slug
                    ? t('admin.texts.restore_loading')
                    : t('admin.texts.restore')
                }}
              </BaseButton>
            </div>
          </section>
        </template>
      </div>
    </div>

    <p v-if="successMessage" class="admin-texts__toast admin-texts__toast--success">
      {{ successMessage }}
    </p>
    <p v-if="saveError" class="admin-texts__toast admin-texts__toast--error">
      {{ saveError }}
    </p>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { markdownToSafeHtml } from '~/utils/markdown';

  const { t } = useI18n();
  const router = useRouter();
  const localePath = useLocalePath();
  const { items, loading, error, fetchTexts, saveText, restoreText } = useAdminSiteTexts();

  defineOptions({ name: 'AdminTexts' });

  definePageMeta({
    layout: 'default',
    middleware: 'admin-auth',
  });

  const activeTab = ref<'fr' | 'en' | 'preview'>('fr');
  const activeCategory = ref<string>('biography');
  const savingSlug = ref<string | null>(null);
  const restoringSlug = ref<string | null>(null);
  const successMessage = ref('');
  const saveError = ref('');

  const CATEGORY_LABELS: Record<string, string> = {
    biography: 'Biographie',
    metahism: 'Métahisme',
    homepage: 'Accueil',
    analyses: 'Analyses',
  };

  const SLUG_LABELS: Record<string, string> = {
    biography: 'Biographie (page)',
    metahism: 'Métahisme (page)',
    homepage_biography: 'Biographie',
    homepage_metahism: 'Métahisme',
    homepage_hero_title_top: 'Hero titre haut',
    homepage_hero_title_bottom: 'Hero titre bas',
    homepage_hero_descriptions: 'Hero descriptions',
    homepage_biography_title: 'Biographie',
    homepage_portrait_caption: 'Légende portrait',
    homepage_read_biography: 'Lire biographie',
    homepage_metahism_title: 'Métahisme',
    homepage_mobile_ouverture_title: 'Mobile ouverture',
    homepage_metahisme_artwork_caption: 'Légende œuvre',
    homepage_discover_metahisme: 'Découvrir Métahisme',
    homepage_artworks_title: 'Œuvres',
    homepage_browse_artworks: 'Œuvres',
    homepage_analyses_title: 'Analyses',
    homepage_read_analyses: 'Lire analyses',
    homepage_artwork_portant: 'Portant',
    homepage_artwork_portant_author: 'Portant auteur',
    homepage_artwork_concordance: 'Concordance',
    homepage_artwork_concordance_author: 'Concordance auteur',
    homepage_artwork_mobile: 'Mobile',
    homepage_artwork_mobile_author: 'Mobile auteur',
    homepage_analysis_portant_title: 'Portant titre',
    homepage_analysis_portant_excerpt: 'Portant extrait',
    homepage_analysis_concordance_title: 'Concordance titre',
    homepage_analysis_concordance_excerpt: 'Concordance extrait',
    analysis_portant: "Laumond Espace Commines",
    analysis_concordance: 'Concordance Universelle',
    analysis_aimants: 'Comme deux aimants',
    analysis_advienne: "Afin qu'un jour advienne",
  };

  const SHORT_SLUGS = new Set([
    'homepage_hero_title_top', 'homepage_hero_title_bottom', 'homepage_biography_title',
    'homepage_portrait_caption', 'homepage_read_biography', 'homepage_metahism_title',
    'homepage_mobile_ouverture_title', 'homepage_metahisme_artwork_caption',
    'homepage_discover_metahisme', 'homepage_artworks_title', 'homepage_browse_artworks',
    'homepage_analyses_title', 'homepage_read_analyses', 'homepage_artwork_portant',
    'homepage_artwork_portant_author', 'homepage_artwork_concordance',
    'homepage_artwork_concordance_author', 'homepage_artwork_mobile',
    'homepage_artwork_mobile_author', 'homepage_analysis_portant_title',
    'homepage_analysis_concordance_title',
  ]);

  function getSectionLabel(slug: string): string {
    return SLUG_LABELS[slug] ?? t(`admin.texts.section_${slug}`) ?? slug.replace(/_/g, ' ');
  }

  type SectionDraft = {
    slug: string;
    label: string;
    category: string;
    draftFr: string;
    draftEn: string;
    originalFr: string;
    originalEn: string;
    hasChanges: boolean;
  };

  const sections = ref<SectionDraft[]>([]);

  const sectionGroups = computed(() => {
    const order = ['biography', 'metahism', 'homepage', 'analyses'];
    const groups: { category: string; categoryLabel: string; sections: SectionDraft[] }[] = [];
    const byCat = new Map<string, SectionDraft[]>();
    for (const s of sections.value) {
      const arr = byCat.get(s.category) ?? [];
      arr.push(s);
      byCat.set(s.category, arr);
    }
    for (const cat of order) {
      const itemsInCat = byCat.get(cat);
      if (itemsInCat?.length) {
        groups.push({
          category: cat,
          categoryLabel: CATEGORY_LABELS[cat] ?? cat,
          sections: itemsInCat,
        });
      }
    }
    return groups;
  });

  const currentGroupSections = computed(() => {
    const group = sectionGroups.value.find((g) => g.category === activeCategory.value);
    return group?.sections ?? [];
  });

  function buildSections(): void {
    const list: SectionDraft[] = items.value.map((item) => {
      const slug = item.slug;
      const contentFr = item.contentFr ?? '';
      const contentEn = item.contentEn ?? '';
      const existing = sections.value.find((s) => s.slug === slug);
      return {
        slug,
        label: getSectionLabel(slug),
        category: item.category ?? 'homepage',
        draftFr: existing?.draftFr ?? contentFr,
        draftEn: existing?.draftEn ?? contentEn,
        originalFr: contentFr,
        originalEn: contentEn,
        hasChanges: false,
      };
    });
    for (const s of list) {
      s.hasChanges = s.draftFr !== s.originalFr || s.draftEn !== s.originalEn;
    }
    sections.value = list;
  }

  watch(
    () => items.value,
    () => {
      buildSections();
      if (
        sectionGroups.value.length &&
        !sectionGroups.value.some((g) => g.category === activeCategory.value)
      ) {
        activeCategory.value = sectionGroups.value[0]?.category ?? 'biography';
      }
    },
    { deep: true }
  );

  watch(
    sections,
    () => {
      for (const s of sections.value) {
        s.hasChanges = s.draftFr !== s.originalFr || s.draftEn !== s.originalEn;
      }
    },
    { deep: true }
  );

  async function restoreSection(section: SectionDraft): Promise<void> {
    restoringSlug.value = section.slug;
    saveError.value = '';
    successMessage.value = '';
    try {
      const { contentFr, contentEn } = await restoreText(section.slug);
      section.draftFr = contentFr ?? '';
      section.draftEn = contentEn ?? '';
      section.originalFr = section.draftFr;
      section.originalEn = section.draftEn;
      section.hasChanges = false;
      successMessage.value = t('admin.texts.restored');
      setTimeout(() => (successMessage.value = ''), 3000);
    } catch (e: unknown) {
      const err = e as { data?: { statusMessage?: string } };
      saveError.value =
        err?.data?.statusMessage ??
        (e instanceof Error ? e.message : t('admin.texts.restore_error'));
      if (
        saveError.value?.includes('404') ||
        saveError.value?.toLowerCase().includes('aucune') ||
        saveError.value?.toLowerCase().includes('no previous')
      ) {
        saveError.value = t('admin.texts.restore_error');
      }
    } finally {
      restoringSlug.value = null;
    }
  }

  async function saveSection(section: SectionDraft): Promise<void> {
    savingSlug.value = section.slug;
    saveError.value = '';
    successMessage.value = '';
    try {
      await saveText(section.slug, section.draftFr || null, section.draftEn || null);
      section.originalFr = section.draftFr;
      section.originalEn = section.draftEn;
      section.hasChanges = false;
      successMessage.value = t('admin.texts.saved');
      setTimeout(() => (successMessage.value = ''), 3000);
    } catch (e) {
      saveError.value = e instanceof Error ? e.message : t('admin.texts.error');
    } finally {
      savingSlug.value = null;
    }
  }

  function onLogout(): void {
    router.replace(localePath('/admin/login'));
  }

  onMounted(() => {
    fetchTexts();
  });
</script>

<style lang="scss" scoped>
  .admin-texts {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 1rem 2rem;
  }

  .admin-texts__body {
    margin-top: 2.5rem;
  }

  .admin-texts__status {
    margin-top: 2.5rem;
    padding: 1.5rem;
    text-align: center;
    color: var(--color-text-light);
  }

  .admin-texts__status--error {
    color: var(--color-primary);
  }

  .admin-texts__sections {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .admin-texts__section {
    background: #fff;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    padding: 1.75rem;
  }

  .admin-texts__category-tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 2.5rem;
    padding-bottom: 1.25rem;
    overflow-x: auto;
    border-bottom: 1px solid var(--color-border);

    button {
      background: none;
      border: none;
      padding: 0.5rem 1rem 0.5rem 0;
      margin: 0;
      font-size: 0.9rem;
      color: var(--color-text-light);
      cursor: pointer;
      position: relative;
      white-space: nowrap;
      transition: color var(--transition-medium);

      &::after {
        content: '';
        position: absolute;
        bottom: -1rem;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--color-primary);
        transform: scaleX(0);
        transform-origin: left center;
        transition: transform var(--transition-medium);
      }

      &.admin-texts__category-tab--active {
        color: var(--color-primary);
        font-weight: 600;

        &::after {
          transform: scaleX(1);
        }
      }

      &:hover {
        color: var(--color-primary);

        &::after {
          transform: scaleX(1);
        }
      }
    }
  }

  .admin-texts__section-title {
    margin: 0 0 1.25rem;
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .admin-texts__tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }

  .admin-texts__tab {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    background: #fff;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: var(--color-background-alt);
    }

    &--active {
      background: var(--color-primary);
      color: #fff;
      border-color: var(--color-primary);
    }
  }

  .admin-texts__textarea {
    width: 100%;
    padding: 0.75rem;
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.6;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    resize: vertical;
    margin-bottom: 1.25rem;
  }

  .admin-texts__hint {
    margin: 0 0 1rem;
    font-size: 0.85rem;
    color: var(--color-text-light);
  }

  .admin-texts__preview {
    min-height: 200px;
    margin-bottom: 1.25rem;
  }

  .admin-texts__preview-block {
    margin-bottom: 1.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .admin-texts__preview-lang {
    margin: 0 0 0.5rem;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-light);
  }

  .admin-texts__preview-content {
    line-height: 1.7;

    :deep(p) {
      margin: 0 0 0.75rem;
    }

    :deep(a) {
      color: var(--color-primary);
      text-decoration: underline;
    }
  }

  .admin-texts__actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .admin-texts__toast {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    padding: 0.75rem 1.25rem;
    border-radius: var(--border-radius);
    font-size: 0.95rem;
    box-shadow: var(--shadow-md);
  }

  .admin-texts__toast--success {
    background: #e8f5e9;
    color: #2e7d32;
  }

  .admin-texts__toast--error {
    background: #ffebee;
    color: #c62828;
  }
</style>
