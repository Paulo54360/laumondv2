<script setup>
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
</script>

<template>
  <div class="search-container">
    <div class="search-input-container">
      <input 
        v-model="query"
        @input="search"
        type="text"
        placeholder="Rechercher une œuvre..."
        class="search-input"
      />
      <button class="search-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </div>
    
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Chargement...</p>
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

.search-input-container {
  display: flex;
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 12px 50px 12px 16px;
  font-size: 16px;
  border: 1px solid #757B7D;
  border-radius: 0;
  background: #fff;
  color: #757B7D;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  border-color: #757B7D;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
}

.search-button {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  background: none;
  border: none;
  border-left: 1px solid #757B7D;
  padding: 0 16px;
  color: #757B7D;
  cursor: pointer;
  transition: color 0.3s ease, background-color 0.3s ease;
}

.search-button:hover {
  color: #757B7D;
  background-color: #f5f5f5;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #757B7D;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #757B7D;
  border-radius: 0;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  color: #757B7D;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #757B7D;
  background-color: rgba(117, 123, 125, 0.05);
}

.results {
  margin-top: 20px;
  border: 1px solid #757B7D;
}

.result-item {
  padding: 15px;
  border-bottom: 1px solid #757B7D;
  transition: background-color 0.3s ease;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background-color: #f5f5f5;
}

.result-item h3 {
  margin: 0;
  color: #757B7D;
  font-weight: 500;
}

.result-item p {
  margin: 5px 0 0;
  color: #757B7D;
}

/* Styles responsifs */
@media (max-width: 768px) {
  .search-container {
    max-width: 100%;
  }
  
  .search-input {
    padding: 10px 45px 10px 12px;
    font-size: 14px;
  }
  
  .search-button {
    padding: 0 12px;
  }
}

@media (max-width: 480px) {
  .search-input {
    padding: 10px 40px 10px 12px;
    font-size: 14px;
    height: 40px;
    box-shadow: none;
    border: 1px solid #757B7D;
  }
  
  .search-button {
    width: 40px;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .result-item {
    padding: 12px;
  }
  
  .result-item h3 {
    font-size: 16px;
  }
  
  .result-item p {
    font-size: 13px;
  }
}
</style> 