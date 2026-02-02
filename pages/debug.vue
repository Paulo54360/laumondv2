<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="debug-page">
    <h1>{{ t('debug.title') }}</h1>

    <div>
      <h2>{{ t('debug.section_connection') }}</h2>
      <button class="test-button" @click="testConnection">
        {{ t('debug.action_test_connection') }}
      </button>
      <pre v-if="connectionResults">{{ JSON.stringify(connectionResults, null, 2) }}</pre>
    </div>

    <div>
      <h2>{{ t('debug.section_images') }}</h2>
      <div class="image-test-container">
        <div v-for="(url, index) in testImages" :key="index" class="image-test">
          <h3>{{ t('gallery.image_alt', { index: index + 1 }) }}</h3>
          <div class="image-box">
            <img :src="url" :alt="`Test ${index + 1}`" @error="handleImageError" />
          </div>
          <code>{{ url }}</code>
        </div>
      </div>
    </div>

    <div>
      <h2>{{ t('debug.section_search') }}</h2>
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="t('debug.search_placeholder')"
        class="search-input"
      />
      <button class="test-button" @click="testSearch">{{ t('debug.action_search') }}</button>
      <div v-if="isSearching" class="loading">{{ t('debug.loading') }}</div>

      <div v-if="searchError" class="error">
        <h3>{{ t('debug.error') }}</h3>
        <pre>{{ JSON.stringify(searchError, null, 2) }}</pre>
      </div>

      <div v-if="searchResults && searchResults.length">
        <h3>{{ t('debug.results', { count: searchResults.length }) }}</h3>
        <div class="results-grid">
          <div v-for="result in searchResults" :key="result.id" class="result-card">
            <h4>{{ result.title }}</h4>
            <div v-if="result.imageUrls && result.imageUrls.length">
              <img :src="result.imageUrls[0]" alt="" @error="handleImageError" />
            </div>
            <div v-else class="no-image">{{ t('debug.no_image') }}</div>
            <pre>{{ JSON.stringify(result, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const connectionResults = ref(null);
  const testImages = ref([
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/01/01.jpg',
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/01.jpg',
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/03/01.jpg',
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings+/01/01.jpg',
  ]);

  const { searchArtworks } = useSearch();
  const searchQuery = ref('etude');
  const searchResults = ref([]);
  const searchError = ref(null);
  const isSearching = ref(false);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async function testConnection() {
    try {
      connectionResults.value = await $fetch('/api/test-connection');
    } catch (error) {
      connectionResults.value = {
        error: error.message,
        details: error.data || t('debug.no_details'),
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async function testSearch() {
    if (!searchQuery.value.trim()) return;

    searchResults.value = [];
    searchError.value = null;
    isSearching.value = true;

    try {
      searchResults.value = await searchArtworks(searchQuery.value);
      // console.log('Résultats de recherche:', response);
    } catch (error) {
      console.error('Erreur de recherche:', error);
      searchError.value = {
        message: error.message,
        data: error.data || t('debug.no_details'),
      };
    } finally {
      isSearching.value = false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function handleImageError(event) {
    const img = event.target;
    img.src = 'https://via.placeholder.com/300x200?text=Image+non+disponible';
    img.classList.add('error');
  }

  // Charger les résultats au chargement de la page
  onMounted(() => {
    testConnection();
  });
</script>

<style scoped>
  .debug-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1,
  h2 {
    margin-bottom: 1rem;
  }

  pre {
    background: var(--color-surface);
    padding: 1rem;
    border-radius: 4px;
    overflow: auto;
    max-height: 300px;
  }

  .image-test-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
  }

  .image-test {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 1rem;
  }

  .image-box {
    width: 100%;
    height: 200px;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f0f0;
  }

  .image-box img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  code {
    display: block;
    font-size: 0.8rem;
    word-break: break-all;
    margin-top: 0.5rem;
  }

  .test-button {
    background: #3498db;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 1rem;
  }

  .search-input {
    padding: 0.5rem;
    margin-right: 0.5rem;
    min-width: 300px;
  }

  .loading,
  .error {
    margin: 1rem 0;
  }

  .error {
    color: red;
  }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
  }

  .result-card {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 1rem;
  }

  .result-card img {
    max-width: 100%;
    height: 200px;
    object-fit: contain;
    margin-bottom: 0.5rem;
  }

  .no-image {
    width: 100%;
    height: 200px;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-muted);
  }

  img.error {
    opacity: 0.5;
  }
</style>
