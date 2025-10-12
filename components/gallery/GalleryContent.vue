<template>
  <div class="gallery-content">
    <h1>{{ title }}</h1>
    <div class="image-grid">
      <div
        v-for="(image, index) in displayedImages"
        :key="index"
        class="image-container"
        @click="openModal(startIndex + index)"
      >
        <img :src="image" :alt="`Image ${index + 1}`" />
      </div>
    </div>
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="previousPage">Précédent</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="nextPage">Suivant</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, inject } from 'vue';

  const props = defineProps<{
    title: string;
  }>();

  const imageUrls = inject('imageUrls') as string[];
  const showModal = inject('showModal') as any;
  const openModal = inject('openModal') as (index: number) => void;
  const itemsPerPage = inject('itemsPerPage') as number;
  const currentPage = inject('currentPage') as any;
  const totalPages = inject('totalPages') as any;

  const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
  const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, imageUrls.length));
  const displayedImages = computed(() => imageUrls.slice(startIndex.value, endIndex.value));

  const previousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };
</script>

<style lang="scss" scoped>
  .gallery-content {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;

    h1 {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2rem;
      color: #333;
    }
  }

  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .image-container {
    aspect-ratio: 1;
    overflow: hidden;
    cursor: pointer;
    border-radius: 8px;
    transition: transform 0.3s ease;

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
    gap: 1rem;

    button {
      padding: 0.5rem 1rem;
      background-color: #333;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover:not(:disabled) {
        background-color: #555;
      }

      &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }
    }

    span {
      font-size: 0.9rem;
      color: #666;
    }
  }
</style>
