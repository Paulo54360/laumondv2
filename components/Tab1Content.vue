<template>
  <div class="text-container">
    <div class="img-fluid">
      <div v-for="(url, i) in imageUrls2" :key="i" class="image-gallery-item">
        <img :src="url" :alt="titles[url]" @click="openModal(i)" />
      </div>
      <div class="modal" :class="{ show: currentImageIndex !== null }" @click="closeModal">
        <div class="modal-content">
          <img 
            class="modal-image" 
            :src="currentImageIndex !== null ? imageUrls2[currentImageIndex] : ''"
            :alt="currentImageIndex !== null ? titles[imageUrls2[currentImageIndex]] : ''" 
          />
        </div>
      </div>
    </div>

    <h3 class="titre">Le mobile d'ouverture des univers parallèles - Espace Labasse - Saint-Viance, 2023</h3>
    
    <div class="content-container">
      <h2>{{ $t('Analyses.TitreCDA') }}</h2>
      <p>{{ $t('Analyses.Texte1CDA') }}</p>
      <p>{{ $t('Analyses.Texte2CDA') }}</p>
      <p>{{ $t('Analyses.Texte3CDA') }}</p>
      <p id="Ziclo">{{ $t('Analyses.AuteurCDA') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'

const config = useRuntimeConfig()
const imageUrls2 = ref([])
const titles = ref({})
const currentImageIndex = ref(null)

onMounted(async () => {
  const baseUrl = config.public.apiUrl
  const urls = [
    `${baseUrl}/Deployments/00/06.jpg`
  ]
  
  imageUrls2.value = urls
  
  titles.value = urls.reduce((acc, url) => {
    acc[url] = url.split('/').pop()
    return acc
  }, {})
})

const openModal = (index) => {
  currentImageIndex.value = index
}

const closeModal = () => {
  currentImageIndex.value = null
}
</script>

<style scoped>
.text-container {
  width: 90%;
  margin: auto;
  font-size: 1.2em;
  line-height: 1.5em;
  padding: 0;
}

h3{
      color: #525252;
      font-size: 11px;
      margin-bottom: 5%;
      padding-left: 5px;
      white-space: wrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      text-align: start;
    }

.img-fluid {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  margin-top: 1em;
  justify-content: center;
}

.image-gallery-item {
  width: 100x;
  height: 500px;
  object-fit: contain;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  background-color: #f5f5f5;
  margin-right: 20px;
}

.image-gallery-item img:hover {
  transform: scale(1.05);
}

.image-gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
}

.modal.show {
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  max-width: 90%;
  max-height: 90vh;
}

.modal-image {
  width: 100%;
  height: auto;
}
</style>