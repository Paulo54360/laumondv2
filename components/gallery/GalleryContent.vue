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
        <button 
          :disabled="currentPage === 1" 
          @click="previousPage"
          class="nav-btn"
        >
          &larr; {{ t('common.previous', 'Previous') }}
        </button>
        <button 
          :disabled="currentPage === totalPages" 
          @click="nextPage"
          class="nav-btn"
        >
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

  // State managed locally for the UI controls
  const itemsPerPage = ref(10);
  const currentPage = ref(1);

  const totalItems = computed(() => imageUrls.value.length);
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

  // Reset page when items per page changes
  watch(itemsPerPage, () => {
    currentPage.value = 1;
  });

  const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
  const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, totalItems.value));

  const paginationStart = computed(() => totalItems.value === 0 ? 0 : startIndex.value + 1);
  const paginationEnd = computed(() => endIndex.value);

  const displayedImages = computed(() => imageUrls.value.slice(startIndex.value, endIndex.value));

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
  // Since we don't have explicit titles yet, we'll format the filename or use a placeholder
  const extractTitle = (url: string): string => {
      // Logic to mimic the "TITLE - LOCATION" format if possible, or just cleanup filename
      // For now, returning a generic title or filename cleaned up
      // Example: .../01.jpg -> "ŒUVRE 01"
      if (!url) return '';
      const parts = url.split('/');
      const filename = parts.pop() || '';
      const name = filename.replace(/\.[^/.]+$/, ''); // remove extension
      // To match design style (Uppercase)
      return `ŒUVRE ${name} - COLLECTION PRIVÉE`; 
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
      color: #333;
    }
  }

  .pagination-bar {
    display: flex;
    justify-content: flex-end; /* Align rights/center as per design? Screenshot shows aligned rightish or centered */
    align-items: center;
    margin-bottom: 2rem;
    gap: 2rem;
    color: #555;
    font-size: 0.9rem;
    flex-wrap: wrap;
    justify-content: center; /* Centering matches the screenshot better actually */
  }

  .items-per-page {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    label {
      color: #666;
    }

    .items-select {
        border: 1px solid #ddd;
        padding: 0.3rem 0.5rem;
        border-radius: 4px;
        color: #333;
        background: white;
        cursor: pointer;
        
        &:focus {
            outline: none;
            border-color: #999;
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
    border: 1px solid #ddd;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    color: #555;
    transition: all 0.2s;
    font-size: 0.85rem;

    &:hover:not(:disabled) {
      background: #f5f5f5;
      color: #333;
      border-color: #ccc;
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
    background: #f9f9f9;
    margin-bottom: 1rem;
    border-radius: 2px;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover; /* or contain, depending on preference. Screenshot looks like cover/contain mix? Cover usually safer for grids */
      transition: transform 0.4s ease;
      display: block;
    }
  }

  .image-title {
    font-size: 0.75rem;
    text-align: center;
    color: #444;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    line-height: 1.4;
  }
</style>
