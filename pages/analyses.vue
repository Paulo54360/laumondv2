<template>
  <NuxtLayout name="analysis">
    <div class="analyses-page">
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.title }}
        </button>
      </div>

      <div class="content" v-if="currentTab">
        <div class="image-gallery">
          <div 
            v-for="(image, index) in currentTab.images" 
            :key="index"
            class="image-container"
            @click="openModal(index)"
          >
            <img :src="image" :alt="currentTab.title" />
          </div>
        </div>

        <h2>{{ currentTab.title }}</h2>
        
        <div class="translations">
          <div class="translation fr" v-html="currentTab.translations.fr"></div>
          <div class="translation en" v-if="currentTab.translations.en">
            {{ currentTab.translations.en }}
          </div>
        </div>

        <div v-if="showModal" class="modal" @click="closeModal">
          <div class="modal-content">
            <img 
              :src="currentTab.images[currentImageIndex]" 
              :alt="currentTab.title"
            />
            <button class="close-button" @click="closeModal">&times;</button>
            <button 
              v-if="currentImageIndex > 0" 
              class="nav-button prev"
              @click.stop="currentImageIndex--"
            >
              &lt;
            </button>
            <button 
              v-if="currentImageIndex < currentTab.images.length - 1" 
              class="nav-button next"
              @click.stop="currentImageIndex++"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRuntimeConfig } from '#app';

const { t } = useI18n();
const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;

const tabs = [
  {
    id: 'portant',
    title: "Le Portant",
    images: [`${apiUrl}/Deployments/00/10.jpg`, `${apiUrl}/Deployments/00/11.jpg`],
    translations: {
      fr: [
        t('Analyses.TitreCDA'),
        t('Analyses.Texte1CDA'),
        t('Analyses.Texte2CDA'),
        t('Analyses.Texte3CDA'),
        t('Analyses.AuteurCDA')
      ].join('&lt;br&gt;'),
      en: ''
    }
  },
  {
    id: 'concordance',
    title: 'Concordance Universelle - ECC Italie - Biennale de Venise 2021',
    images: [`${apiUrl}/Deployments/00/02.jpg`, `${apiUrl}/Deployments/00/04.jpg`,],
    translations: {
      fr: [
        t('Analyses.TitreCU'),
        t('Analyses.TexteCU'),
        t('Analyses.AuteurCU')
      ].join('&lt;br&gt;'),
      en: ''
    }
  },
  {
    id: 'aimants',
    title: "Comme deux aimants",
    images: [`${apiUrl}/Deployments/00/06.jpg`],
    translations: {
      fr: [
        t('Analyses.TitreCDA'),
        t('Analyses.Texte1CDA'),
        t('Analyses.Texte2CDA'),
        t('Analyses.Texte3CDA'),
        t('Analyses.AuteurCDA')
      ].join('&lt;br&gt;'),
      en: ''
    }
  },
  {
    id: 'advienne',
    title: "Afin qu'un jour advienne - Le grand Mikado de la pensée humaine",
    images: [`${apiUrl}/Deployments/00/06.jpg`, `${apiUrl}/Deployments/00/08.jpg`],
    translations: {
      fr: [
        t('Analyses.TitreAQJA'),
        t('Analyses.Texte1AQJA'),
        t('Analyses.Texte2AQJA'),
        t('Analyses.Texte3AQJA'),
        t('Analyses.Texte4AQJA'),
        t('Analyses.Texte5AQJA'),
        t('Analyses.Texte6AQJA'),
        t('Analyses.Texte7AQJA'),
        t('Analyses.Texte8AQJA'),
        t('Analyses.Texte9AQJA'),
        t('Analyses.Texte10AQJA'),
        t('Analyses.Texte11AQJA'),
        t('Analyses.Texte12AQJA'),
        t('Analyses.Texte13AQJA'),
        t('Analyses.Texte14AQJA'),
        t('Analyses.Texte15AQJA'),
        t('Analyses.Texte16AQJA'),
        t('Analyses.Texte17AQJA'),
        t('Analyses.Texte18AQJA'),
        t('Analyses.Texte19AQJA'),
        t('Analyses.Texte20AQJA'),
        t('Analyses.Texte21AQJA'),
        t('Analyses.Texte22AQJA'),
        t('Analyses.Texte23AQJA'),
        t('Analyses.Texte24AQJA'),
        t('Analyses.Texte25AQJA'),
        t('Analyses.Texte26AQJA'),
        t('Analyses.Texte27AQJA'),
        t('Analyses.Texte28AQJA'),
        t('Analyses.Texte29AQJA'),
        t('Analyses.Texte30AQJA'),
        t('Analyses.Texte31AQJA'),
        t('Analyses.Texte32AQJA'),
        t('Analyses.Texte33AQJA'),
        t('Analyses.Texte34AQJA'),
        '¹' + t('Analyses.Legende1AQJA'),
        '²' + t('Analyses.Legende2AQJA')
      ].join('&lt;br&gt;'),
      en: ''
    }
  }
];

const activeTab = ref(tabs[0].id);
const showModal = ref(false);
const currentImageIndex = ref(0);

const currentTab = computed(() => tabs.find(tab => tab.id === activeTab.value));

const openModal = (index: number) => {
  currentImageIndex.value = index;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<style lang="scss" scoped>
.analyses-page {
  padding: 2rem;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--color-border);
  padding-bottom: 1rem;
  
  button {
    background: none;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1.1rem;
    color: var(--color-text);
    cursor: pointer;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -1rem;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: red;
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }
    
    &.active {
      color: red;
      
      &::after {
        transform: scaleX(1);
      }
    }
    
    &:hover {
      color: red;
    }
  }
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  width: 100%;
}

.image-container {
  aspect-ratio: 16/9;
  cursor: pointer;
  overflow: hidden;
  border-radius: 0;
  background-color: #f5f5f5;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s ease;
    background-color: white;
    
    &:hover {
      transform: scale(1.02);
    }
  }
}

.translations {
  margin-top: 2rem;
  
  .translation {
    margin-bottom: 2rem;
    
    &.fr {
      font-size: 1.1rem;
      line-height: 1.6;
    }
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 95%;
  max-height: 95vh;
  
  img {
    max-width: 100%;
    max-height: 95vh;
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
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.3);
  border: none;
  color: white;
  padding: 1rem;
  cursor: pointer;
  font-size: 1.5rem;
  border-radius: 50%;
  
  &.prev {
    left: -60px;
  }
  
  &.next {
    right: -60px;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }
}
</style>
