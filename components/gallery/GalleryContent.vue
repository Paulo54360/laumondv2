<template>
  <div class="gallery-content">
    <h1>{{ title || t('gallery.default_title') }}</h1>

    <div class="pagination-controls">
      <label for="itemsPerPage">{{ t('gallery.items_per_page') }}</label>
      <select id="itemsPerPage" :value="itemsPerPageValue" @change="(e) => { itemsPerPage.value = Number((e.target as HTMLSelectElement).value); currentPage.value = 0; }">
        <option v-for="option in [5, 10, 15, 20, 25]" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <span>{{
        t('gallery.range', { start: paginationStart, end: paginationEnd, total: paginationTotal })
      }}</span>
      <button :disabled="currentPageValue === 0" @click="previousPage">
        &#8592; {{ t('common.previous') }}
      </button>
      <button :disabled="endIndex.value >= totalItems.value" @click="nextPage">
        {{ t('common.next') }} &#8594;
      </button>
    </div>

    <div class="image-gallery">
      <div
        v-for="(image, index) in displayedImages"
        :key="index"
        class="image-item"
        @click="openModal(startIndex.value + index)"
      >
        <img :src="image" :alt="getTitle(image) || t('gallery.image_alt', { index: startIndex.value + index + 1 })" />
        <h2>{{ getTitle(image) }}</h2>
      </div>
    </div>

    <div v-if="showModal" class="modal" @click="closeModal">
      <img
        :src="modalImageUrl"
        :alt="getTitle(modalImageUrl)"
        class="modal-image"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, inject, type Ref, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  defineProps<{
    title: string;
  }>();

  const imageUrls = inject<Ref<string[]>>('imageUrls', ref([]))!;
  const titles = inject<Ref<Record<string, string>>>('titles', ref({}))!;
  const openModal = inject<(index: number) => void>('openModal', () => {})!;
  const itemsPerPage = inject<Ref<number>>('itemsPerPage', ref(10))!;
  const currentPage = inject<Ref<number>>('currentPage', ref(0))!;
  const totalPages = inject<Ref<number>>('totalPages', ref(1))!;
  const currentImageIndex = inject<Ref<number | null>>('currentImageIndex', ref(null))!;

  const getTitle = (imageUrl: string | undefined): string => {
    if (!titles || !titles.value || !imageUrl) return '';
    const title = titles.value[imageUrl];
    return title ? String(title).trim() : '';
  };

  const startIndex = computed(() => {
    const page = Number(currentPage.value) || 0;
    const perPage = Number(itemsPerPage.value) || 10;
    const result = page * perPage;
    return isNaN(result) ? 0 : result;
  });
  const endIndex = computed(() => {
    const length = Array.isArray(imageUrls.value) ? imageUrls.value.length : 0;
    const perPage = Number(itemsPerPage.value) || 10;
    const start = startIndex.value;
    const result = Math.min(start + perPage, length);
    return isNaN(result) ? 0 : result;
  });
  const totalItems = computed(() => {
    return Array.isArray(imageUrls.value) ? imageUrls.value.length : 0;
  });
  const displayedImages = computed(() => {
    if (!Array.isArray(imageUrls.value) || imageUrls.value.length === 0) return [];
    const start = startIndex.value;
    const end = endIndex.value;
    if (isNaN(start) || isNaN(end) || start < 0 || end < start) return [];
    const images = imageUrls.value.slice(start, end);
    return images.filter((img): img is string => Boolean(img));
  });
  const showModal = computed(() => {
    if (currentImageIndex.value === null || currentImageIndex.value < 0) return false;
    if (!imageUrls.value[currentImageIndex.value]) return false;
    return true;
  });
  const modalImageUrl = computed(() => {
    if (!showModal.value) return '';
    return imageUrls.value[currentImageIndex.value!];
  });
  const itemsPerPageValue = computed(() => Number(itemsPerPage.value) || 10);
  const currentPageValue = computed(() => Number(currentPage.value) || 0);
  const paginationStart = computed(() => {
    const start = Number(startIndex.value) + 1;
    return (isNaN(start) || start < 1) ? 0 : Math.floor(start);
  });
  const paginationEnd = computed(() => {
    const end = Number(endIndex.value);
    return (isNaN(end) || end < 0) ? 0 : Math.floor(end);
  });
  const paginationTotal = computed(() => {
    const total = Number(totalItems.value);
    return (isNaN(total) || total < 0) ? 0 : Math.floor(total);
  });
  const { t } = useI18n();

  const previousPage = (): void => {
    if (currentPage.value > 0) {
      currentPage.value--;
    }
  };

  const nextPage = (): void => {
    if (endIndex.value < totalItems.value) {
      currentPage.value++;
    }
  };

  const closeModal = (): void => {
    currentImageIndex.value = null;
  };
</script>

<style lang="scss" scoped>
  .gallery-content {
    padding: 20px;
    text-align: center;
    font-family: var(--font-family-base);

    h1 {
      text-align: center;
      margin-bottom: var(--spacing-lg);
    }
  }

  .pagination-controls {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;

    label {
      font-size: 1rem;
      color: var(--color-text);
    }

    select,
    button {
      padding: 8px 15px;
      font-size: 1rem;
      border-radius: 5px;
      border: 1px solid var(--color-muted-light);
      cursor: pointer;
      background-color: var(--color-background-alt);
      color: var(--color-text);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    span {
      font-size: 1rem;
      color: var(--color-text);
    }
  }

  .image-gallery {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    align-items: center;
  }

  .image-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100%;

    img {
      width: 100%;
      height: 300px;
      object-fit: contain;
      border-radius: 5px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.117);
      transition: transform 0.3s ease-in-out;
      background-color: var(--color-surface);
      cursor: pointer;

      &:hover {
        transform: scale(1.05);
      }
    }

    h2 {
      margin-top: 10px;
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      color: var(--color-ink);
    }
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-index-modal);
    cursor: pointer;
  }

  .modal-image {
    max-width: 90%;
    max-height: 90%;
    border-radius: 5px;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    .image-gallery {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      padding: 1rem;
    }

    .image-item img {
      height: 250px;
    }

    .image-item h2 {
      font-size: 14px;
      margin-top: 8px;
    }
  }

  @media (max-width: 480px) {
    .image-gallery {
      grid-template-columns: 1fr;
      gap: 1rem;
      padding: 0.8rem;
    }

    .image-item img {
      height: 280px;
    }

    .image-item h2 {
      font-size: 13px;
      margin-top: 6px;
    }

    .modal-image {
      max-width: 95%;
      max-height: 85%;
    }
  }
</style>
