<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="search-page">
    <h1 class="search-title">{{ t('search.title') }}</h1>
    <div class="search-results">
      <div v-if="isLoading" class="loading">
        <div class="loading-spinner"></div>
        <p>{{ t('search.loading') }}</p>
      </div>
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button class="retry-button" @click="fetchResults">{{ t('common.retry') }}</button>
      </div>
      <div v-else-if="artworks.length === 0" class="no-results">
        <p v-if="searchQuery">{{ t('search.empty_with_query', { query: searchQuery }) }}</p>
        <p v-else>{{ t('search.empty_without_query') }}</p>
      </div>
      <div v-else class="artworks-grid">
        <div
          v-for="artwork in artworks"
          :key="artwork.id"
          class="artwork-card"
          @click="openModal(artwork)"
        >
          <div class="artwork-image">
            <img
              v-if="getFirstImageUrl(artwork)"
              :src="getFirstImageUrl(artwork)"
              :alt="artwork.title"
              loading="lazy"
              @error="handleImageError"
            />
            <div v-else class="placeholder-image">
              {{ t('search.image_placeholder') }}
            </div>
          </div>
          <div class="artwork-info">
            <h2>{{ artwork.title }}</h2>
            <p class="category">
              {{ t('search.category_label', { category: artwork.category.name }) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="selectedArtwork" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="closeModal">&times;</button>

        <div class="modal-gallery">
          <img :src="getCurrentImageUrl" :alt="selectedArtwork.title" class="modal-image" />

          <button v-if="currentImageIndex > 0" class="nav-button prev" @click.stop="previousImage">
            &lt;
          </button>

          <button
            v-if="currentImageIndex < getImageUrls(selectedArtwork).length - 1"
            class="nav-button next"
            @click.stop="nextImage"
          >
            &gt;
          </button>
        </div>

        <div class="modal-info">
          <h2>{{ selectedArtwork.title }}</h2>
          <p class="category">
            {{ t('search.category_label', { category: selectedArtwork.category.name }) }}
          </p>
          <p v-if="selectedArtwork.description" class="description">
            {{ selectedArtwork.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute } from 'vue-router';

  interface ICategory {
    id: number;
    name: string;
    path: string;
  }

  interface IArtwork {
    id: number;
    title: string;
    description: string | null;
    imageUrls: string[] | string;
    category: ICategory;
    subcategory: string | null;
    folderPath: string;
    createdAt: Date;
    updatedAt: Date;
  }

  const route = useRoute();
  const { t } = useI18n();
  const searchQuery = ref((route.query.q as string) || '');
  const artworks = ref<IArtwork[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // État de la modal
  const selectedArtwork = ref<IArtwork | null>(null);
  const currentImageIndex = ref(0);

  function getImageUrls(artwork: IArtwork): string[] {
    if (Array.isArray(artwork.imageUrls)) {
      return artwork.imageUrls;
    }

    try {
      return typeof artwork.imageUrls === 'string' ? JSON.parse(artwork.imageUrls) : [];
    } catch (e) {
      console.error('Erreur lors du parsing des URLs:', e);
      return [];
    }
  }

  function getFirstImageUrl(artwork: IArtwork): string | undefined {
    const urls = getImageUrls(artwork);
    return urls[0] || undefined;
  }

  const getCurrentImageUrl = computed((): string | undefined => {
    if (!selectedArtwork.value) return undefined;
    const urls = getImageUrls(selectedArtwork.value);
    return urls[currentImageIndex.value] || undefined;
  });

  function openModal(artwork: IArtwork): void {
    selectedArtwork.value = artwork;
    currentImageIndex.value = 0;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const closeModal = () => {
    selectedArtwork.value = null;
    currentImageIndex.value = 0;
  };

  function previousImage(): void {
    if (currentImageIndex.value > 0) {
      currentImageIndex.value--;
    }
  }

  function nextImage(): void {
    if (!selectedArtwork.value) return;
    const urls = getImageUrls(selectedArtwork.value);
    if (currentImageIndex.value < urls.length - 1) {
      currentImageIndex.value++;
    }
  }

  async function fetchResults(): Promise<void> {
    if (!searchQuery.value) {
      artworks.value = [];
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch<{ artworks: IArtwork[] }>('/api/search', {
        params: {
          q: searchQuery.value,
        },
      });

      artworks.value = response.artworks;
      // console.log('Résultats de recherche:', artworks.value);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      error.value = e.data?.message || t('common.error');
      console.error('Erreur de recherche:', e);
      artworks.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  watch(
    () => route.query.q,
    (newQuery) => {
      searchQuery.value = (newQuery as string) || '';
      fetchResults();
    },
    { immediate: true }
  );

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/300x200?text=Image+non+disponible';
    img.classList.add('error');
  };
</script>

<style lang="scss" scoped>
  .search-page {
    padding: var(--spacing-xl) var(--spacing-lg);
    max-width: var(--max-width-content);
    margin: 0 auto;
  }

  .search-title {
    font-size: 2rem;
    margin-bottom: var(--spacing-xl);
    text-align: center;
    color: var(--color-text);
  }

  .search-results {
    width: 100%;
  }

  .loading,
  .error,
  .no-results {
    text-align: center;
    padding: var(--spacing-xl);
    color: var(--color-text);
  }

  .error {
    color: red;
  }

  .artworks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    padding: 1rem;
  }

  .artwork-card {
    cursor: pointer;
    color: inherit;
    background: var(--color-background);
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--shadow-md);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }
  }

  .artwork-image {
    position: relative;
    width: 100%;
    padding-bottom: 75%; // Ratio 4:3
    overflow: hidden;
    background: var(--color-background-alt);

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  .artwork-info {
    padding: 1.5rem;

    h2 {
      font-size: 1.2rem;
      margin: 0 0 0.5rem;
      color: var(--color-text);
    }

    .category {
      font-size: 0.9rem;
      color: var(--color-text-light);
      text-transform: capitalize;
      margin: 0;
    }
  }

  // Modal styles
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    position: relative;
    width: 90%;
    max-width: 1200px;
    max-height: 90vh;
    background: var(--color-background);
    border-radius: var(--border-radius);
    overflow: hidden;
  }

  .modal-gallery {
    position: relative;
    width: 100%;
    height: 70vh;
    background: var(--color-background-alt);

    .modal-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    color: white;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.8);
    }
  }

  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    border: none;
    color: white;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.8);
    }

    &.prev {
      left: 1rem;
    }

    &.next {
      right: 1rem;
    }
  }

  .modal-info {
    padding: 2rem;

    h2 {
      font-size: 1.5rem;
      margin: 0 0 1rem;
      color: var(--color-text);
    }

    .category {
      font-size: 1rem;
      color: var(--color-text-light);
      margin-bottom: 1rem;
    }

    .description {
      font-size: 1rem;
      line-height: 1.6;
      color: var(--color-text);
    }
  }

  @media (max-width: 768px) {
    .artworks-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .modal-content {
      width: 95%;
    }

    .modal-gallery {
      height: 50vh;
    }

    .nav-button {
      width: 2.5rem;
      height: 2.5rem;
      font-size: 1.2rem;
    }
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--color-background-alt);
    border-top: 4px solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .retry-button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
      background: var(--color-primary-dark);
    }
  }

  .placeholder-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-background-alt);
    color: var(--color-text-light);
    font-size: 0.9rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  img.error {
    opacity: 0.7;
  }
</style>
