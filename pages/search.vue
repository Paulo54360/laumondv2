<template>
  <div class="search-page">
    <h1 class="search-title">Rechercher une œuvre</h1>
    <div class="search-results">
      <div v-if="isLoading" class="loading">
        <div class="loading-spinner"></div>
        <p>Chargement des résultats...</p>
      </div>
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="fetchResults" class="retry-button">Réessayer</button>
      </div>
      <div v-else-if="artworks.length === 0" class="no-results">
        <p v-if="searchQuery">Aucun résultat trouvé pour "{{ searchQuery }}"</p>
        <p v-else>Veuillez saisir un terme de recherche</p>
      </div>
      <div v-else class="artworks-grid">
        <NuxtLink
          v-for="artwork in artworks"
          :key="artwork.id"
          :to="`/${artwork.category.name}/${artwork.subcategory}`"
          class="artwork-card"
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
              Image non disponible
            </div>
          </div>
          <div class="artwork-info">
            <h2>{{ artwork.title }}</h2>
            <p class="category">{{ artwork.category.name }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ICategory {
  id: number;
  name: string;
  path: string;
}

interface IArtwork {
  id: number;
  title: string;
  description: string | null;
  imageUrls: string;
  category: ICategory;
  subcategory: string | null;
  folderPath: string;
  createdAt: Date;
  updatedAt: Date;
}

const route = useRoute();
const searchQuery = ref(route.query.q as string || '');
const artworks = ref<IArtwork[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

function getFirstImageUrl(artwork: IArtwork): string | null {
  try {
    const urls = JSON.parse(artwork.imageUrls);
    return urls[0] || null;
  } catch (e) {
    console.error('Erreur lors du parsing des URLs:', e);
    return null;
  }
}

async function fetchResults() {
  if (!searchQuery.value) {
    artworks.value = [];
    return;
  }
  
  isLoading.value = true;
  error.value = null;
  
  try {
    const response = await $fetch<{ artworks: IArtwork[] }>('/api/search', {
      params: {
        q: searchQuery.value
      }
    });
    
    artworks.value = response.artworks;
    console.log('Résultats de recherche:', artworks.value);
  } catch (e: any) {
    error.value = e.data?.message || "Une erreur est survenue lors de la recherche";
    console.error('Erreur de recherche:', e);
    artworks.value = [];
  } finally {
    isLoading.value = false;
  }
}

watch(() => route.query.q, (newQuery) => {
  searchQuery.value = newQuery as string || '';
  fetchResults();
}, { immediate: true });

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = '/placeholder.jpg';
  img.classList.add('error');
}
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
  text-decoration: none;
  color: inherit;
  background: var(--color-background);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

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

@media (max-width: 768px) {
  .artworks-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .artwork-info {
    padding: 1rem;

    h2 {
      font-size: 1rem;
    }
  }
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

img.error {
  opacity: 0.7;
}
</style> 