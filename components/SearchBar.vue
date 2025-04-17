import { ref } from 'vue'
import { searchArtworks } from '../db'

const query = ref('')
const results = ref([])
const loading = ref(false)
const error = ref(null)

const search = async () => {
  if (!query.value.trim()) return
  
  loading.value = true
  error.value = null
  
  try {
    results.value = await searchArtworks(query.value)
  } catch (e) {
    error.value = e.message
    console.error('Erreur lors de la recherche:', e)
  } finally {
    loading.value = false
  }
}

// Template
<template>
  <div class="search-container">
    <input 
      v-model="query"
      @input="search"
      type="text"
      placeholder="Rechercher une œuvre..."
      class="search-input"
    />
    
    <div v-if="loading" class="loading">
      Chargement...
    </div>
    
    <div v-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-if="results.length > 0" class="results">
      <div v-for="artwork in results" :key="artwork.id" class="result-item">
        <h3>{{ artwork.title }}</h3>
        <p>Catégorie: {{ artwork.categories?.name }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: red;
  padding: 10px;
  margin-top: 10px;
}

.results {
  margin-top: 20px;
}

.result-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.result-item h3 {
  margin: 0;
  color: #333;
}

.result-item p {
  margin: 5px 0 0;
  color: #666;
}
</style> 