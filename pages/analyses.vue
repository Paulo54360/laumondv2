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

      <div v-if="currentTab">
        <div class="main-image-container">
          <img
            v-if="currentTab.images && currentTab.images.length > 0"
            :src="currentTab.images[0]"
            :alt="currentTab.title"
            class="main-image"
            @click="openModal(0)"
          />
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
                <div v-html="currentTab.translations.fr"></div>
              </div>
              <div class="show-more-arrow" role="button" tabindex="0" @click="toggleShowMore">
                <img
                  v-if="!showFullText"
                  src="~/assets/images/common/Down Arrow Icon.png"
                  alt="Voir plus"
                  class="arrow-img"
                />
                <img
                  v-else
                  src="~/assets/images/common/Fleche Vers Le Haut.png"
                  alt="Voir moins"
                  class="arrow-img up"
                />
              </div>
              <div v-if="!showFullText" class="text-fade"></div>
            </div>
            <div v-if="currentTab.translations.en" class="translation en">
              {{ currentTab.translations.en }}
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
  </NuxtLayout>
</template>

<script setup lang="ts">
  import { useRuntimeConfig } from 'nuxt/app';
  import { ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  const runtimeConfig = useRuntimeConfig();

  const S3_BASE_URL = runtimeConfig.public.apiUrl;

  const { t } = useI18n();

  const tabs = [
    {
      id: 'portant',
      title: 'Le Portant',
      images: [`${S3_BASE_URL}/Deployments/00/10.jpg`, `${S3_BASE_URL}/Deployments/00/11.jpg`],
      translations: {
        fr: `
          <div class="analysis-content">
            <p>${t('LAEC.Texte1LAEC')}</p>
            <p>${t('LAEC.Texte2LAEC')}</p>
            <p>${t('LAEC.Texte3LAEC')}</p>
            <p>${t('LAEC.Texte4LAEC')}</p>
            <p>${t('LAEC.Texte5LAEC')}</p>
            <p>${t('LAEC.Texte6LAEC')}</p>
            <p>${t('LAEC.Texte10LAEC')}</p>
            <p>${t('LAEC.Texte12LAEC')}</p>
            <p>${t('LAEC.Texte13LAEC')}</p>
            <p>${t('LAEC.Texte14LAEC')}</p>
            <p>${t('LAEC.Texte15LAEC')}</p>
            <p>${t('LAEC.Texte16LAEC')}</p>
            <p>${t('LAEC.Texte17LAEC')}</p>
            <p>${t('LAEC.Texte18LAEC')}</p>
            <p>${t('LAEC.Texte19LAEC')}</p>
          </div>
          <p class="analysis-author">${t('LAEC.AuteurLAEC')}</p>
        `,
        en: '',
      },
      author: 'Edith Herlemont-Lassiat',
    },
    {
      id: 'concordance',
      title: 'Concordance Universelle',
      images: [`${S3_BASE_URL}/Deployments/00/02.jpg`, `${S3_BASE_URL}/Deployments/00/04.jpg`],
      translations: {
        fr: `
          <div class="analysis-content">
            <p>${t('CU.TexteCU')}</p>
          </div>
          <p class="analysis-author">${t('CU.AuteurCU')}</p>
        `,
        en: '',
      },
      author: 'Marion Zilio',
    },
    {
      id: 'aimants',
      title: 'Comme deux aimants',
      images: [`${S3_BASE_URL}/Deployments/00/06.jpg`],
      translations: {
        fr: `
          <div class="analysis-content">
            <p>${t('CDA.Texte1CDA')}</p>
            <p>${t('CDA.Texte2CDA')}</p>
            <p>${t('CDA.Texte3CDA')}</p>
          </div>
          <p class="analysis-author">${t('CDA.AuteurCDA')}</p>
        `,
        en: '',
      },
      author: 'Marion Zilio',
    },
    {
      id: 'advienne',
      title: "Afin qu'un jour advienne ",
      images: [`${S3_BASE_URL}/Deployments/00/06.jpg`, `${S3_BASE_URL}/Deployments/00/08.jpg`],
      translations: {
        fr: `
          <div class="analysis-content">
            <p>
              ${t('AQJA.Texte1AQJA')}
              ${t('AQJA.Texte2AQJA')}
              ${t('AQJA.Texte3AQJA')}
              ${t('AQJA.Texte4AQJA')}
              ${t('AQJA.Texte5AQJA')}
              ${t('AQJA.Texte6AQJA')}<br>
              ${t('AQJA.Texte7AQJA')}
              ${t('AQJA.Texte8AQJA')}
              ${t('AQJA.Texte9AQJA')}
              ${t('AQJA.Texte10AQJA')}
            </p>
            <p>
              ${t('AQJA.Texte11AQJA')}
              ${t('AQJA.Texte12AQJA')}<br>
            </p>
            <p>
              ${t('AQJA.Texte13AQJA')}
              ${t('AQJA.Texte14AQJA')}
              ${t('AQJA.Texte15AQJA')}
              ${t('AQJA.Texte16AQJA')}
            </p>
            <p>
              ${t('AQJA.Texte17AQJA')}<br>
            </p>
            <p>
              <br>
              ${t('AQJA.Texte18AQJA')}<br>
            </p>
            <p>
              ${t('AQJA.Texte19AQJA')}<br>
              ${t('AQJA.Texte20AQJA')}<br>
              ${t('AQJA.Texte21AQJA')}<br>
              ${t('AQJA.Texte22AQJA')}<br>
            </p>
            <p>
              ${t('AQJA.Texte23AQJA')}<br>
              ${t('AQJA.Texte24AQJA')}<br>
              ${t('AQJA.Texte25AQJA')}<br>
              ${t('AQJA.Texte26AQJA')}<br>
            </p>
            <p>
              ${t('AQJA.Texte27AQJA')}
              ${t('AQJA.Texte28AQJA')}
              ${t('AQJA.Texte29AQJA')}
              ${t('AQJA.Texte30AQJA')}
              ${t('AQJA.Texte31AQJA')}<br>
            </p>
            <p>
              ${t('AQJA.Texte32AQJA')}<br>
              ${t('AQJA.Texte33AQJA')}<br>
              ${t('AQJA.Texte34AQJA')}
            </p>
          </div>
          <div class="analysis-footnotes">
            <p><sup>1</sup>${t('AQJA.Legende1AQJA')}<br>
            <sup>2</sup>${t('AQJA.Legende2AQJA')}</p>
          </div>
        `,
        en: '',
      },
      author: 'Isabelle de Maison Rouge',
    },
  ];

  const activeTab = ref(tabs[0].id);
  const showModal = ref(false);
  const currentImageIndex = ref(0);
  const showFullText = ref(false);

  // Ajout des URLs des avatars pour simplifier
  const authorAvatars = {
    'Marion Zilio': `${S3_BASE_URL}/authors/marion-zilio.jpg`,
    'Isabelle de Maison Rouge': `${S3_BASE_URL}/authors/isabelle-de-maison-rouge.png`,
    default: `${S3_BASE_URL}/authors/default-avatar.jpg`,
  };

  const currentTab = computed(() => tabs.find((tab) => tab.id === activeTab.value));

  const getAuthor = (tab) => {
    return tab.author || 'Auteur non spécifié';
  };

  const getAuthorAvatar = (tab) => {
    if (!tab || !tab.author) return authorAvatars.default;
    // Utiliser l'image par défaut pour Edith Herlemont-Lassiat
    if (tab.author === 'Edith Herlemont-Lassiat') {
      return authorAvatars.default;
    }
    return authorAvatars[tab.author] || authorAvatars.default;
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
        background-color: #757b7d;
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }

      &.active {
        color: #757b7d;

        &::after {
          transform: scaleX(1);
        }
      }

      &:hover {
        color: #757b7d;
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
          color: #757b7d;
          font-size: 0.8rem;
        }
      }
    }
  }

  .translations {
    margin-bottom: 30px;
    position: relative;

    .translation {
      line-height: 1.3;

      &.fr {
        font-size: 1.05rem;
        position: relative;
        text-align: justify;
      }
    }
  }

  // Styles pour la structure des analyses
  :deep(.analysis-title) {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 30px;
    margin-top: 20px;
    line-height: 1.3;
  }

  :deep(.analysis-content) {
    margin-bottom: 40px;

    p {
      margin-bottom: 6px;
      line-height: 1.3;
      text-align: justify;
      color: #333;
    }
  }

  :deep(.analysis-author) {
    font-weight: bold;
    color: #555;
    margin-top: 30px;
    padding-top: 15px;
    border-top: 1px solid #e0e0e0;
    font-size: 1rem;
  }

  :deep(.analysis-footnotes) {
    margin-top: 30px;
    padding-top: 15px;
    border-top: 1px solid #e0e0e0;
    font-size: 0.9rem;
    color: #666;

    p {
      margin-bottom: 5px;
      line-height: 1.3;
    }

    sup {
      font-weight: bold;
      margin-right: 5px;
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
    color: #757b7d;
    z-index: 2;
    position: relative;
  }

  .text-fade {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
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
