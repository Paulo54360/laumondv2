<template>
  <div class="gallery-content">
    <h1>{{ title || t('gallery.default_title') }}</h1>
    <div class="image-grid">
      <div
        v-for="(image, index) in displayedImages"
        :key="index"
        class="image-container"
        @click="openModal(startIndex + index)"
      >
        <img :src="image" :alt="t('gallery.image_alt', { index: startIndex + index + 1 })" />
      </div>
    </div>
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="previousPage">
        {{ t('common.previous') }}
      </button>
      <span>{{
        t('gallery.pagination.page_status', { current: currentPage, total: totalPages })
      }}</span>
      <button :disabled="currentPage === totalPages" @click="nextPage">
        {{ t('common.next') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, inject, type Ref, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  defineProps<{
    title: string;
  }>();

  const imageUrls = inject<Ref<string[]>>('imageUrls', ref([]));
  const openModal = inject<(index: number) => void>('openModal', () => {});
  const itemsPerPage = inject<number>('itemsPerPage', 12);
  const currentPage = inject<Ref<number>>('currentPage', ref(1));
  const totalPages = inject<Ref<number>>('totalPages', ref(1));

  const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
  const endIndex = computed(() =>
    Math.min(startIndex.value + itemsPerPage, imageUrls.value.length)
  );
  const displayedImages = computed(() => imageUrls.value.slice(startIndex.value, endIndex.value));
  const { t } = useI18n();

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
</script>

<style lang="scss" scoped>
  .gallery-content {
    padding: var(--spacing-lg);
    max-width: var(--max-width-content);
    margin: 0 auto;

    h1 {
      text-align: center;
      margin-bottom: var(--spacing-lg);
    }
  }

  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .image-container {
    aspect-ratio: 1;
    overflow: hidden;
    cursor: pointer;
    border-radius: var(--border-radius);
    transition: transform var(--transition-medium);

    &:hover {
      transform: scale(1.05);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-md);

    button {
      padding: var(--spacing-sm) var(--spacing-md);
      background-color: var(--color-ink);
      color: var(--color-white);
      border: none;
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: background-color var(--transition-medium);

      &:hover:not(:disabled) {
        background-color: var(--color-muted-dark);
      }

      &:disabled {
        background-color: var(--color-muted-light);
        cursor: not-allowed;
      }
    }

    span {
      font-size: 0.9rem;
      color: var(--color-muted);
    }
  }
</style>
