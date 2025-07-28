<template>
  <div class="gallery-layout">
    <TheHeader />
    <main>
      <slot />
    </main>

    <!-- Modal -->
    <div v-if="showModal" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="closeModal">&times;</button>
        <button class="nav-button prev" @click="previousImage" :disabled="currentImageIndex === 0">&lt;</button>
        <img :src="currentImage" :alt="`Image ${currentImageIndex + 1}`" />
        <button class="nav-button next" @click="nextImage" :disabled="currentImageIndex === imageUrls.length - 1">&gt;</button>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        Previous
      </button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue';
import TheHeader from '~/components/layout/TheHeader.vue';

const runtimeConfig = useRuntimeConfig();
const S3_BASE_URL = runtimeConfig.public.apiUrl;

const imageUrls = ref<string[]>([
  // Images de galerie - à remplacer par tes vraies images S3
  `${S3_BASE_URL}/gallery/image1.jpg`,
  `${S3_BASE_URL}/gallery/image2.jpg`,
  `${S3_BASE_URL}/gallery/image3.jpg`,
  // Add more images here
]);

const itemsPerPage = 12;
const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(imageUrls.value.length / itemsPerPage));

const showModal = ref(false);
const currentImageIndex = ref(0);
const currentImage = computed(() => imageUrls.value[currentImageIndex.value]);

const openModal = (index: number) => {
  currentImageIndex.value = index;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

const nextImage = () => {
  if (currentImageIndex.value < imageUrls.value.length - 1) {
    currentImageIndex.value++;
  }
};

// Provide values to child components
provide('imageUrls', imageUrls.value);
provide('showModal', showModal);
provide('openModal', openModal);
provide('itemsPerPage', itemsPerPage);
provide('currentPage', currentPage);
provide('totalPages', totalPages);
</script>

<style lang="scss" scoped>
.gallery-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  main {
    flex: 1;
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90vh;

  img {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
  }
}

.close-button {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 2rem;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.prev {
    left: -60px;
  }

  &.next {
    right: -60px;
  }
}

.pagination {
  position: fixed;
  bottom: var(--spacing-md);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  background-color: var(--color-background);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);

  button {
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: opacity var(--transition-fast);

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:not(:disabled):hover {
      opacity: 0.9;
    }
  }

  span {
    color: var(--color-text);
  }
}
</style> 