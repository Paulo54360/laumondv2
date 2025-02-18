<template>
  <div class="text-container">
    <div class="img-fluid">
      <div v-for="(url, i) in imageUrls3" :key="i" class="image-gallery-item">
        <img :src="url" :alt="titles[url]" @click="openModal(i)" />
      </div>
      <div class="modal" :class="{ show: currentImageIndex !== null }" @click="closeModal">
        <div class="modal-content">
          <img 
            class="modal-image" 
            :src="currentImageIndex !== null ? imageUrls3[currentImageIndex] : ''"
            :alt="currentImageIndex !== null ? titles[imageUrls3[currentImageIndex]] : ''" 
          />
        </div>
      </div>
    </div>

    <h3 class="titre">Le grand Mikado de la pensée humaine</h3>
    
    <div class="content-container">
      <h2>{{ $t('Analyses.TitreAQJA') }}</h2>
      <p>
        {{ $t('Analyses.Texte1AQJA') }}
        {{ $t('Analyses.Texte2AQJA') }}
        {{ $t('Analyses.Texte3AQJA') }}
        {{ $t('Analyses.Texte4AQJA') }}
        {{ $t('Analyses.Texte5AQJA') }}
        {{ $t('Analyses.Texte6AQJA') }}<br>
        {{ $t('Analyses.Texte7AQJA') }}
        {{ $t('Analyses.Texte8AQJA') }}
        {{ $t('Analyses.Texte9AQJA') }}
        {{ $t('Analyses.Texte10AQJA') }}
      </p>
      <p>
        {{ $t('Analyses.Texte11AQJA') }}
        {{ $t('Analyses.Texte12AQJA') }}<br>
      </p>
      <p>
        {{ $t('Analyses.Texte13AQJA') }}
        {{ $t('Analyses.Texte14AQJA') }}
        {{ $t('Analyses.Texte15AQJA') }}
        {{ $t('Analyses.Texte16AQJA') }}
      </p>
      <p>{{ $t('Analyses.Texte17AQJA') }}<br></p>
      <p><br>{{ $t('Analyses.Texte18AQJA') }}<br></p>
      <p>
        {{ $t('Analyses.Texte19AQJA') }}<br>
        {{ $t('Analyses.Texte20AQJA') }}<br>
        {{ $t('Analyses.Texte21AQJA') }}<br>
        {{ $t('Analyses.Texte22AQJA') }}<br>
      </p>
      <p>
        {{ $t('Analyses.Texte23AQJA') }}<br>
        {{ $t('Analyses.Texte24AQJA') }}<br>
        {{ $t('Analyses.Texte25AQJA') }}<br>
        {{ $t('Analyses.Texte26AQJA') }}<br>
      </p>
      <p>
        {{ $t('Analyses.Texte27AQJA') }}
        {{ $t('Analyses.Texte28AQJA') }}
        {{ $t('Analyses.Texte29AQJA') }}
        {{ $t('Analyses.Texte30AQJA') }}
        {{ $t('Analyses.Texte31AQJA') }}<br>
      </p>
      <p>
        <a id="Ziclo">{{ $t('Analyses.Texte32AQJA') }}<br></a>
        {{ $t('Analyses.Texte33AQJA') }}<br>
        {{ $t('Analyses.Texte34AQJA') }}
      </p>
      <br>
      <hr>
      <p>
        <sup>1</sup>{{ $t('Analyses.Legende1AQJA') }}<br>
        <sup>2</sup>{{ $t('Analyses.Legende2AQJA') }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'

const config = useRuntimeConfig()
const imageUrls3 = ref([])
const titles = ref({})
const currentImageIndex = ref(null)

onMounted(async () => {
  const baseUrl = config.public.apiUrl
  const urls = [
    `${baseUrl}/Deployments/00/04.jpg`,
    `${baseUrl}/Deployments/00/05.jpg`
  ]
  
  imageUrls3.value = urls
  
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
/* Mêmes styles que les autres composants */
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
  width: 100%;
  height: 300px;
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