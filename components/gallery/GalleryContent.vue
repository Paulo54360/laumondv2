<template>
  <div class="gallery-content">
    <h1>{{ title || t('gallery.default_title') }}</h1>

    <div class="pagination-bar">
      <div class="items-per-page">
        <label>{{ t('gallery.items_per_page', 'Items per page:') }}</label>
        <select v-model="itemsPerPage" class="items-select">
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
          <option :value="100">{{ t('gallery.all', 'All') }}</option>
        </select>
      </div>

      <div class="pagination-controls">
        <span class="pagination-info">
          {{ paginationStart }} - {{ paginationEnd }} {{ t('gallery.of', 'of') }} {{ totalItems }}
        </span>
        <button :disabled="currentPage === 1" class="nav-btn" @click="previousPage">
          &larr; {{ t('common.previous', 'Previous') }}
        </button>
        <button :disabled="currentPage === totalPages" class="nav-btn" @click="nextPage">
          {{ t('common.next', 'Next') }} &rarr;
        </button>
      </div>
    </div>

    <div class="image-grid">
      <div
        v-for="(image, index) in displayedImages"
        :key="index"
        class="image-item"
        @click="openModal(startIndex + index)"
      >
        <div class="image-wrapper">
          <img :src="image" :alt="extractTitle(image)" />
        </div>
        <div class="image-title">
          {{ extractTitle(image) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, inject, type Ref, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';

  defineProps<{
    title: string;
  }>();

  const { t } = useI18n();
  const imageUrls = inject<Ref<string[]>>('imageUrls', ref([]));
  const openModal = inject<(index: number) => void>('openModal', () => {});

  // Optional injected pagination (e.g. for tests); fallback to local state
  const injectedItemsPerPage = inject<Ref<number>>('itemsPerPage');
  const injectedCurrentPage = inject<Ref<number>>('currentPage');
  const itemsPerPage = injectedItemsPerPage ?? ref(10);
  const currentPage = injectedCurrentPage ?? ref(1);
  const titles = ref<Record<string, string>>({}); // Cache for titles

  const totalItems = computed(() => imageUrls.value.length);
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

  // Reset page when items per page changes
  watch(itemsPerPage, () => {
    currentPage.value = 1;
  });

  const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
  const endIndex = computed(() =>
    Math.min(startIndex.value + itemsPerPage.value, totalItems.value)
  );

  const paginationStart = computed(() => (totalItems.value === 0 ? 0 : startIndex.value + 1));
  const paginationEnd = computed(() => endIndex.value);

  const displayedImages = computed(() => imageUrls.value.slice(startIndex.value, endIndex.value));

  // Fetch titles for displayed images
  const fetchTitlesForImages = async (images: string[]): Promise<void> => {
    await Promise.all(
      images.map(async (url) => {
        if (titles.value[url] !== undefined || !url) return; // Already fetched or invalid

        try {
          // Replace extension with .txt
          const txtUrl = url.replace(/\.(jpg|jpeg|png|webp)$/i, '.txt');
          const response = await fetch(txtUrl);
          if (response.ok) {
            const text = await response.text();
            titles.value[url] = text && text.trim() ? text.trim() : '';
          } else {
            titles.value[url] = ''; // Mark as visited/empty
          }
        } catch (e) {
          console.error('Error fetching title for', url, e);
          titles.value[url] = '';
        }
      })
    );
  };

  // Watch for changes in displayed images to fetch their titles
  watch(
    displayedImages,
    (newImages) => {
      if (newImages && newImages.length > 0) {
        fetchTitlesForImages(newImages);
      }
    },
    { immediate: true }
  );

  const previousPage = (): void => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  const nextPage = (): void => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  // Helper to extract a displayable title from the URL provided
  const extractTitle = (url: string): string => {
    // Use fetched title if available
    if (titles.value[url]) {
      return titles.value[url].toUpperCase();
    }

    // Fallback to filename while loading or if no title
    if (!url) return '';
    const parts = url.split('/');
    const filename = parts.pop() || '';
    const name = filename.replace(/\.[^/.]+$/, ''); // remove extension
    return `ŒUVRE ${name}`;
  };
</script>

<style lang="scss" scoped>
  .gallery-content {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    font-family: 'Inter', sans-serif;

    h1 {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 1.8rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-weight: 400;
      color: var(--color-ink);
    }
  }

  .pagination-bar {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    gap: 2rem;
    color: var(--color-text-light);
    font-size: 0.9rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .items-per-page {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    label {
      color: var(--color-text-light);
    }

    .items-select {
      border: 1px solid var(--color-border);
      padding: 0.3rem 0.5rem;
      border-radius: 4px;
      color: var(--color-ink);
      background: white;
      cursor: pointer;

      &:focus {
        outline: none;
        border-color: var(--color-muted);
      }
    }
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .nav-btn {
    background: white;
    border: 1px solid var(--color-border);
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    color: var(--color-text-light);
    transition: all 0.2s;
    font-size: 0.85rem;

    &:hover:not(:disabled) {
      background: var(--color-surface);
      color: var(--color-ink);
      border-color: var(--color-border);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .image-item {
    display: flex;
    flex-direction: column;
    cursor: pointer;

    &:hover .image-wrapper img {
      transform: scale(1.02);
    }
  }

  .image-wrapper {
    width: 100%;
    aspect-ratio: 4/3; /* Adjust based on typical artwork ratio */
    overflow: hidden;
    background: var(--color-background-alt);
    margin-bottom: 1rem;
    border-radius: 2px;

    img {
      width: 100%;
      height: 100%;
      /* cover usually safer for grids */
      object-fit: cover;
      transition: transform 0.4s ease;
      display: block;
    }
  }

  .image-title {
    font-size: 0.75rem;
    text-align: center;
    color: var(--color-text);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    line-height: 1.4;
  }
</style>
