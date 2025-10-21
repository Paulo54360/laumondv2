<template>
  <!-- Composant multi-mot : AnalysesPage -->
  <div class="analyses-page">
      <div class="tabs">
        <button v-for="tab in tabs" :key="tab.id" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">
          {{ tab.title }}
        </button>
      </div>

      <div v-if="currentTab">
        <div class="main-image-container">
          <img v-if="currentTab.images && currentTab.images.length > 0" class="main-image" :src="currentTab.images[0]" :alt="currentTab.title" @click="openModal(0)" />
        </div>

        <h2 class="article-title">{{ currentTab.title }}</h2>
        
        <div class="author-section">
          <div class="author-info">
            <div class="author-avatar">
              <img :src="getAuthorAvatar(currentTab)" :alt="getAuthor(currentTab)" />
            </div>
            <div class="author-details">
              <span class="author-name">{{ getAuthor(currentTab) }}</span>
              <span class="author-title">Critique d'art</span>
            </div>
          </div>
        </div>
        
        <div class="translations">
          <div class="translation fr">
            <div class="text-content-wrapper">
              <div class="text-content" :class="{ collapsed: !showFullText }">
                <!-- v-html utilisé ici, assurez-vous que le contenu est sûr -->
                <div v-html="currentTab.translations.fr"></div>
              </div>
              <div class="show-more-arrow" @click="toggleShowMore" role="button" tabindex="0">
                <img v-if="!showFullText" src="~/assets/images/common/Down Arrow Icon.png" alt="Voir plus" class="arrow-img" />
                <img v-else src="~/assets/images/common/Fleche Vers Le Haut.png" alt="Voir moins" class="arrow-img up" />
              </div>
              <div v-if="!showFullText" class="text-fade"></div>
            </div>
            <div v-if="currentTab.translations.en" class="translation en">
              <div v-html="currentTab.translations.en"></div>
            </div>
          </div>
        </div>

        <div v-if="showModal" class="modal" @click="closeModal">
          <div class="modal-content">
            <img :src="currentTab.images[currentImageIndex]" :alt="currentTab.title" />
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRuntimeConfig } from 'nuxt/app';
const runtimeConfig = useRuntimeConfig();

const S3_BASE_URL = runtimeConfig.public.apiUrl;

const { t } = useI18n();


const tabs = [
  {
    id: 'portant',
    title: "Le Portant",
    images: [`${S3_BASE_URL}/Deployments/00/10.jpg`, `${S3_BASE_URL}/Deployments/00/11.jpg`],
    translations: {
      fr: [
        t('LAEC.TitreLAEC'),
        t('LAEC.Texte1LAEC'),
        t('LAEC.Texte2LAEC'),
        t('LAEC.Texte3LAEC'),
        t('LAEC.Texte4LAEC'),
        t('LAEC.Texte5LAEC'),
        t('LAEC.Texte6LAEC'),
        t('LAEC.Texte10LAEC'),
        t('LAEC.Texte12LAEC'),
        t('LAEC.Texte13LAEC'),
        t('LAEC.Texte14LAEC'),
        t('LAEC.Texte15LAEC'),
        t('LAEC.Texte16LAEC'),
        t('LAEC.Texte17LAEC'),
        t('LAEC.Texte18LAEC'),
        t('LAEC.Texte19LAEC'),
        t('LAEC.AuteurLAEC')
      ].join('<br>'),
      en: ''
    },
    author: 'Edith Herlemont-Lassiat'
  },
  {
    id: 'concordance',
    title: 'Concordance Universelle',
    images: [`${S3_BASE_URL}/Deployments/00/02.jpg`, `${S3_BASE_URL}/Deployments/00/04.jpg`,],
    translations: {
      fr: [
        t('CU.TitreCU'),
        t('CU.TexteCU'),
        t('CU.AuteurCU')
      ].join('<br>'),
      en: ''
    },
    author: 'Marion Zilio'
  },
  {
    id: 'aimants',
    title: "Comme deux aimants",
    images: [`${S3_BASE_URL}/Deployments/00/06.jpg`],
    translations: {
      fr: [
        t('CDA.TitreCDA'),
        t('CDA.Texte1CDA'),
        t('CDA.Texte2CDA'),
        t('CDA.Texte3CDA'),
        t('CDA.AuteurCDA')
      ].join('<br>'),
      en: ''
    },
    author: 'Marion Zilio'
  },
  {
    id: 'advienne',
    title: "Afin qu'un jour advienne ",
    images: [`${S3_BASE_URL}/Deployments/00/06.jpg`, `${S3_BASE_URL}/Deployments/00/08.jpg`],
    translations: {
      fr: [
        t('AQJA.TitreAQJA'),
        t('AQJA.Texte1AQJA'),
        t('AQJA.Texte2AQJA'),
        t('AQJA.Texte3AQJA'),
        t('AQJA.Texte4AQJA'),
        t('AQJA.Texte5AQJA'),
        t('AQJA.Texte6AQJA'),
        t('AQJA.Texte7AQJA'),
        t('AQJA.Texte8AQJA'),
        t('AQJA.Texte9AQJA'),
        t('AQJA.Texte10AQJA'),
        t('AQJA.Texte11AQJA'),
        t('AQJA.Texte12AQJA'),
        t('AQJA.Texte13AQJA'),
        t('AQJA.Texte14AQJA'),
        t('AQJA.Texte15AQJA'),
        t('AQJA.Texte16AQJA'),
        t('AQJA.Texte17AQJA'),
        t('AQJA.Texte18AQJA'),
        t('AQJA.Texte19AQJA'),
        t('AQJA.Texte20AQJA'),
        t('AQJA.Texte21AQJA'),
        t('AQJA.Texte22AQJA'),
        t('AQJA.Texte23AQJA'),
        t('AQJA.Texte24AQJA'),
        t('AQJA.Texte25AQJA'),
        t('AQJA.Texte26AQJA'),
        t('AQJA.Texte27AQJA'),
        t('AQJA.Texte28AQJA'),
        t('AQJA.Texte29AQJA'),
        t('AQJA.Texte30AQJA'),
        t('AQJA.Texte31AQJA'),
        t('AQJA.Texte32AQJA'),
        t('AQJA.Texte33AQJA'),
        t('AQJA.Texte34AQJA'),
        '¹' + t('AQJA.Legende1AQJA'),
        '²' + t('AQJA.Legende2AQJA')
      ].join('<br>'),
      en: ''
    },
    author: 'Isabelle de Maison Rouge'
  }
];

const activeTab = ref(tabs[0].id);
const showModal = ref(false);
const currentImageIndex = ref(0);
const showFullText = ref(false);

// Ajout des URLs des avatars pour simplifier
const authorAvatars: Record<string, string> = {
  'Marion Zilio': `${S3_BASE_URL}/authors/marion-zilio.jpg`,
  'Isabelle de Maison Rouge': `${S3_BASE_URL}/authors/isabelle-de-maison-rouge.png`,
  'Edith Herlemont-Lassiat': `${S3_BASE_URL}/authors/default-avatar.jpg`,
  'default': `${S3_BASE_URL}/authors/default-avatar.jpg`
};

const currentTab = computed(() => tabs.find(tab => tab.id === activeTab.value));

interface Tab {
  id: string;
  title: string;
  images: string[];
  translations: { fr: string; en: string };
  author: string;
}

const getAuthor = (tab: Tab): string => {
  return tab.author || 'Auteur non spécifié';
};

const getAuthorAvatar = (tab: Tab): string => {
  if (!tab || !tab.author) return authorAvatars.default;
  if (tab.author === 'Edith Herlemont-Lassiat') {
    return authorAvatars.default;
  }
  return authorAvatars[tab.author as string] || authorAvatars['default'];
};

const openModal = (index: number) => {
  currentImageIndex.value = index;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const toggleShowMore = () => {
  showFullText.value = !showFullText.value;
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
  overflow-x: auto;
  
  button {
    background: none;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1.1rem;
    color: var(--color-text);
    cursor: pointer;
    position: relative;
    white-space: nowrap;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -1rem;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #757B7D;
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }
    
    &.active {
      color: #757B7D;
      
      &::after {
        transform: scaleX(1);
      }
    }
    
    &:hover {
      color: #757B7D;
    }
  }
}

.main-image-container {
  width: 100%;
  overflow: hidden;
  margin-bottom: 30px;
  text-align: center;
  background-color: transparent;
  padding: 20px 0;
  
  .main-image {
    max-width: 100%;
    max-height: 500px;
    object-fit: contain;
    cursor: pointer;
    transition: transform 0.3s ease;
    box-shadow: none;
    
    &:hover {
      transform: scale(1.02);
    }
  }
}

.article-title {
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: #333;
}

.author-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
  
  .author-info {
    display: flex;
    align-items: center;
    
    .author-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;
      border: 1px solid #eee;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .author-details {
      display: flex;
      flex-direction: column;
      
      .author-name {
        font-weight: bold;
        margin-right: 5px;
        font-size: 0.95rem;
      }
      
      .author-title {
        color: #757B7D;
        font-size: 0.8rem;
      }
    }
  }
}

.translations {
  margin-bottom: 30px;
  position: relative;
  
  .translation {
    line-height: 1.6;
    
    &.fr {
      font-size: 1.05rem;
      position: relative;
      text-align: justify;
    }
  }
}

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
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.prev {
    left: -60px;
  }
  
  &.next {
    right: -60px;
  }
}

.text-content-wrapper {
  position: relative;
  width: 100%;
}

.text-content.collapsed {
  max-height: 150px;
  overflow: hidden;
}

.show-more-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  width: 100%;
  margin: 0 auto;
  margin-top: 10px;
  cursor: pointer;
  font-size: 2.2rem;
  color: #757B7D;
  z-index: 2;
  position: relative;
}

.text-fade {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
  pointer-events: none;
  z-index: 3;
}

.arrow-img {
  width: 32px;
  height: 32px;
  display: block;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .analyses-page {
    padding: 1rem;
  }
  
  .tabs {
    flex-wrap: wrap;
    gap: 0.5rem;
    
    button {
      font-size: 1rem;
      padding: 0.4rem 0.8rem;
    }
  }
  
  .main-image-container {
    margin-bottom: 20px;
    
    .main-image {
      max-height: 300px;
    }
  }
  
  .article-title {
    font-size: 1.5rem;
  }
  
  .author-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .nav-button {
    width: 40px;
    height: 40px;
    
    &.prev {
      left: -45px;
    }
    
    &.next {
      right: -45px;
    }
  }
  
  .modal-content {
    max-width: 95%;
    
    img {
      max-height: 80vh;
    }
  }
}

@media (max-width: 480px) {
  .analyses-page {
    padding: 0.5rem;
  }
  
  .tabs {
    button {
      font-size: 0.9rem;
      padding: 0.3rem 0.6rem;
    }
  }
  
  .main-image-container .main-image {
    max-height: 250px;
  }
  
  .article-title {
    font-size: 1.3rem;
  }
  
  .author-section .author-info .author-details {
    .author-name {
      font-size: 0.9rem;
    }
    
    .author-title {
      font-size: 0.7rem;
    }
  }
  
  .translations .translation.fr {
    font-size: 1rem;
  }
  
  .nav-button {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
    
    &.prev {
      left: -40px;
    }
    
    &.next {
      right: -40px;
    }
  }
}
</style>
