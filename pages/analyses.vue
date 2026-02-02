<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- Composant multi-mot : AnalysesPage -->
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
      <div
        class="main-image-container"
        :class="{
          'images-side-by-side':
            currentTab.id === 'advienne' && currentTab.images && currentTab.images.length > 1,
        }"
      >
        <template
          v-if="currentTab.id === 'advienne' && currentTab.images && currentTab.images.length > 1"
        >
          <img
            v-for="(image, index) in currentTab.images"
            :key="index"
            class="main-image side-image"
            :src="image"
            :alt="currentTab.title"
            @click="openModal(index)"
          />
        </template>
        <img
          v-else-if="currentTab.images && currentTab.images.length > 0"
          class="main-image"
          :src="currentTab.images[0]"
          :alt="currentTab.title"
          @click="openModal(0)"
        />
      </div>

      <div class="article-title-row">
        <div class="article-title-header">
          <h2 class="article-title">
            {{ currentTab.analysisTitle }}
          </h2>
        </div>
        <div v-if="currentTab.location" class="article-location">{{ currentTab.location }}</div>
        <div class="article-copyright">{{ currentTab.copyright }}</div>
      </div>

      <div class="author-section">
        <div class="author-info">
          <div class="author-avatar">
            <img :src="getAuthorAvatar(currentTab)" :alt="getAuthor(currentTab)" />
          </div>
          <div class="author-details">
            <span class="author-name">{{ getAuthor(currentTab) }}</span>
            <span class="author-title">{{ getAuthorTitle(currentTab) }}</span>
          </div>
        </div>
      </div>

      <div class="translations">
        <div class="translation fr">
          <div class="text-content-wrapper">
            <div class="text-content" :class="{ collapsed: !showFullText }">
              <!-- Contenu de l'analyse avec formatage -->
              <div class="analysis-body" :class="{ 'dense-spacing': currentTab.id === 'advienne' }">
                <h3 class="section-title-in-text">{{ currentTab.title }}</h3>
                <p
                  v-for="(paragraph, index) in currentTab.paragraphs"
                  :key="index"
                  :class="paragraph.type === 'poeticLine' ? 'poetic-line' : 'paragraph-item'"
                >
                  <template v-if="paragraph.type === 'quote'">
                    <span class="quote-text">{{ paragraph.text }}</span>
                  </template>
                  <template v-else-if="paragraph.type === 'citation'">
                    <em class="citation">{{ paragraph.text }}</em>
                  </template>
                  <template v-else-if="paragraph.type === 'emphasis'">
                    <em class="emphasis-text">{{ paragraph.text }}</em>
                  </template>
                  <template v-else>
                    {{ paragraph.text }}
                  </template>
                </p>
              </div>

              <!-- Signature de l'auteur -->
              <div class="author-signature">
                <p class="author-name-signature">{{ currentTab.authorSignature.name }}</p>
                <p v-if="currentTab.authorSignature.title" class="author-title-signature">
                  {{ currentTab.authorSignature.title }}
                </p>
                <p v-if="currentTab.authorSignature.date" class="author-date">
                  {{ currentTab.authorSignature.date }}
                </p>
              </div>

              <!-- Notes de bas de page si présentes -->
              <div v-if="currentTab.footnotes && currentTab.footnotes.length > 0" class="footnotes">
                <hr class="footnotes-separator" />
                <p v-for="(footnote, index) in currentTab.footnotes" :key="index" class="footnote">
                  <sup>{{ footnote.number }}</sup> {{ footnote.text }}
                </p>
              </div>
            </div>
            <div class="show-more-arrow" role="button" tabindex="0" @click="toggleShowMore">
              <img
                v-if="!showFullText"
                src="~/assets/images/common/Down Arrow Icon.png"
                :alt="t('analyses.show_more')"
                class="arrow-img"
              />
              <img
                v-else
                src="~/assets/images/common/Fleche Vers Le Haut.png"
                :alt="t('analyses.show_less')"
                class="arrow-img up"
              />
            </div>
            <div v-if="!showFullText" class="text-fade"></div>
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
  import { useRuntimeConfig } from 'nuxt/app';
  import { ref, computed, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute } from 'vue-router';

  definePageMeta({ layout: 'default' });
  const runtimeConfig = useRuntimeConfig();

  const S3_BASE_URL = runtimeConfig.public.apiUrl;
  const route = useRoute();
  const { t } = useI18n();

  interface IParagraph {
    text: string;
    type?: 'normal' | 'quote' | 'citation' | 'emphasis' | 'poeticLine';
    class?: string;
  }

  interface IAuthorSignature {
    name: string;
    title?: string;
    date?: string;
  }

  interface IFootnote {
    number: string;
    text: string;
  }

  interface ITab {
    id: string;
    title: string;
    images: string[];
    translations: { fr: string; en: string };
    author: string;
    analysisTitle: string;
    paragraphs: IParagraph[];
    authorSignature: IAuthorSignature;
    footnotes?: IFootnote[];
    location?: string;
    copyright: string;
  }

  const tabs: ITab[] = [
    {
      id: 'portant',
      title: "Laumond à l'espace Commines",
      images: [`${S3_BASE_URL}/Deployments/00/10.jpg`, `${S3_BASE_URL}/Deployments/00/11.jpg`],
      translations: {
        fr: '',
        en: '',
      },
      author: 'Edith Herlemont-Lassiat',
      analysisTitle: 'Le portant (524C)',
      location: 'Espace Commines, Paris',
      copyright: '© Philibert Tapissier',
      paragraphs: [
        { text: t('LAEC.Texte1LAEC'), type: 'normal' },
        { text: t('LAEC.Texte2LAEC'), type: 'normal' },
        { text: t('LAEC.Texte3LAEC'), type: 'normal' },
        { text: t('LAEC.Texte4LAEC'), type: 'normal' },
        { text: t('LAEC.Texte5LAEC'), type: 'normal' },
        { text: t('LAEC.Texte6LAEC'), type: 'normal' },
        { text: t('LAEC.Texte10LAEC'), type: 'normal' },
        { text: t('LAEC.Texte12LAEC'), type: 'normal' },
        { text: t('LAEC.Texte13LAEC'), type: 'normal' },
        { text: t('LAEC.Texte14LAEC'), type: 'normal' },
        { text: t('LAEC.Texte15LAEC'), type: 'normal' },
        { text: t('LAEC.Texte16LAEC'), type: 'normal' },
        { text: t('LAEC.Texte17LAEC'), type: 'normal' },
        { text: t('LAEC.Texte18LAEC'), type: 'normal' },
        { text: t('LAEC.Texte19LAEC'), type: 'normal' },
      ],
      authorSignature: {
        name: t('LAEC.AuteurLAEC'),
        title: '',
        date: '',
      },
      footnotes: [],
    },
    {
      id: 'concordance',
      title: "MétaHisme, une tentative d'élargissement des possibles",
      images: [
        `${S3_BASE_URL}/Deployments/00/02.jpg`,
        `${S3_BASE_URL}/Deployments/00/03.jpg`,
        `${S3_BASE_URL}/Deployments/00/04.jpg`,
      ],
      translations: {
        fr: '',
        en: '',
      },
      author: 'Marion Zilio',
      analysisTitle: 'Concordance universelle',
      location: 'Biennale de Venise 2022 — Centre Culturel Européen d’Italie, Palazzo Bembo.',
      copyright: '© Matteo Losurdo',
      paragraphs: [{ text: t('CU.TexteCU'), type: 'normal' }],
      authorSignature: {
        name: t('CU.AuteurCU'),
        title: '',
        date: '',
      },
      footnotes: [],
    },
    {
      id: 'aimants',
      title: 'Comme deux aimants',
      images: [`${S3_BASE_URL}/Deployments/00/06.jpg`],
      translations: {
        fr: '',
        en: '',
      },
      author: 'Marion Zilio',
      analysisTitle: "Le Mobile d'ouverture des univers parallèles",
      location: 'Espace Labasse — Saint-Viance, 2023',
      copyright: '© Philibert Tapissier',
      paragraphs: [
        { text: t('CDA.Texte1CDA'), type: 'normal' },
        { text: t('CDA.Texte2CDA'), type: 'normal' },
        { text: t('CDA.Texte3CDA'), type: 'normal' },
      ],
      authorSignature: {
        name: t('CDA.AuteurCDA'),
        title: '',
        date: '',
      },
      footnotes: [],
    },
    {
      id: 'advienne',
      title: "Afin qu'un jour advienne",
      images: [`${S3_BASE_URL}/Archetypes/02/09.jpg`, `${S3_BASE_URL}/Archetypes/02/10.jpg`],
      translations: {
        fr: '',
        en: '',
      },
      author: 'Isabelle de Maison Rouge',
      analysisTitle: 'Le grand Mikado de la pensée humaine',
      copyright: '© Philibert Tapissier',
      paragraphs: [
        { text: t('AQJA.Texte1AQJA'), type: 'normal' },
        { text: t('AQJA.Texte2AQJA'), type: 'normal' },
        { text: t('AQJA.Texte3AQJA'), type: 'normal' },
        { text: t('AQJA.Texte4AQJA'), type: 'normal' },
        { text: t('AQJA.Texte5AQJA'), type: 'normal' },
        { text: t('AQJA.Texte6AQJA'), type: 'normal' },
        { text: t('AQJA.Texte7AQJA'), type: 'normal' },
        { text: t('AQJA.Texte8AQJA'), type: 'citation' },
        { text: t('AQJA.Texte9AQJA'), type: 'citation' },
        { text: t('AQJA.Texte10AQJA'), type: 'normal' },
        { text: t('AQJA.Texte11AQJA'), type: 'normal' },
        { text: t('AQJA.Texte12AQJA'), type: 'normal' },
        { text: t('AQJA.Texte13AQJA'), type: 'normal' },
        { text: t('AQJA.Texte14AQJA'), type: 'normal' },
        { text: t('AQJA.Texte15AQJA'), type: 'normal' },
        { text: t('AQJA.Texte16AQJA'), type: 'normal' },
        { text: t('AQJA.Texte17AQJA'), type: 'normal' },
        { text: t('AQJA.Texte18AQJA'), type: 'emphasis' },
        { text: t('AQJA.Texte19AQJA'), type: 'poeticLine' },
        { text: t('AQJA.Texte20AQJA'), type: 'poeticLine' },
        { text: t('AQJA.Texte21AQJA'), type: 'poeticLine' },
        { text: t('AQJA.Texte22AQJA'), type: 'poeticLine' },
        { text: t('AQJA.Texte23AQJA'), type: 'poeticLine' },
        { text: t('AQJA.Texte24AQJA'), type: 'poeticLine' },
        { text: t('AQJA.Texte25AQJA'), type: 'poeticLine' },
        { text: t('AQJA.Texte26AQJA'), type: 'poeticLine' },
        { text: t('AQJA.Texte27AQJA'), type: 'normal' },
        { text: t('AQJA.Texte28AQJA'), type: 'citation' },
        { text: t('AQJA.Texte29AQJA'), type: 'citation' },
        { text: t('AQJA.Texte30AQJA'), type: 'citation' },
        { text: t('AQJA.Texte31AQJA'), type: 'normal' },
      ],
      authorSignature: {
        name: t('AQJA.Texte32AQJA'),
        title: t('AQJA.Texte33AQJA'),
        date: t('AQJA.Texte34AQJA'),
      },
      footnotes: [
        { number: '¹', text: t('AQJA.Legende1AQJA') },
        { number: '²', text: t('AQJA.Legende2AQJA') },
      ],
    },
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
    default: `${S3_BASE_URL}/authors/default-avatar.jpg`,
  };

  const currentTab = computed((): ITab | undefined =>
    tabs.find((tab) => tab.id === activeTab.value)
  );

  watch(
    () => route.query.tab,
    (tab) => {
      if (typeof tab === 'string' && tabs.some((entry) => entry.id === tab)) {
        activeTab.value = tab;
      }
    },
    { immediate: true }
  );

  const getAuthor = (tab: ITab): string => {
    return tab.author || t('analyses.unknown_author');
  };

  const getAuthorAvatar = (tab: ITab): string => {
    if (!tab || !tab.author) return authorAvatars.default;
    if (tab.author === 'Edith Herlemont-Lassiat') {
      return authorAvatars.default;
    }
    return authorAvatars[tab.author as string] || authorAvatars.default;
  };

  const getAuthorTitle = (tab: ITab): string => {
    if (!tab || !tab.author) return t('analyses.author_title');
    if (tab.author === 'Edith Herlemont-Lassiat') {
      return `${t('analyses.author_title')} - Exporevue`;
    }
    if (tab.author === 'Marion Zilio') {
      return `${t('analyses.author_title')} - AICA France`;
    }
    return t('analyses.author_title');
  };

  const openModal = (index: number): void => {
    currentImageIndex.value = index;
    showModal.value = true;
  };

  const closeModal = (): void => {
    showModal.value = false;
  };

  const toggleShowMore = (): void => {
    showFullText.value = !showFullText.value;
  };
</script>

<style lang="scss" scoped>
  .analyses-page {
    padding: 2rem 1cm;
  }

  .tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    margin-left: 0;
    margin-right: 0;
    padding-bottom: 1rem;
    padding-left: 0;
    padding-right: 0;
    overflow-x: auto;

    button {
      background: none;
      border: none;
      padding: 0.5rem 1rem 0.5rem 0;
      margin: 0;
      font-size: 0.9rem;
      color: var(--color-muted-dark);
      cursor: pointer;
      position: relative;
      white-space: nowrap;
      transition: color var(--transition-medium);

      &::after {
        content: '';
        position: absolute;
        bottom: -0.5rem;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--color-primary);
        transform: scaleX(0);
        transform-origin: left center;
        transition: transform var(--transition-medium);
      }

      &.active {
        color: var(--color-primary);
        font-weight: 600;

        &::after {
          transform: scaleX(1);
        }
      }

      &:hover {
        color: var(--color-primary);

        &::after {
          transform: scaleX(1);
        }
      }
    }
  }

  .main-image-container {
    width: 100%;
    overflow: hidden;
    margin-bottom: 30px;
    background-color: transparent;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    .main-image {
      width: 100%;
      height: 434px;
      object-fit: cover;
      cursor: pointer;
      transition: transform 0.3s ease;
      box-shadow: none;

      &:hover {
        transform: scale(1.02);
      }
    }

    &.images-side-by-side {
      flex-direction: row;
      gap: 1rem;
      align-items: stretch;

      .side-image {
        width: calc(50% - 0.5rem);
        height: 434px;
        flex: 1 1 calc(50% - 0.5rem);
      }
    }
  }

  .article-title-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 1.5rem 0 2rem;

    .article-title-header {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.2rem;
      width: max-content;
      max-width: 100%;
    }

    .article-title {
      font-size: clamp(1.1rem, 2vw, 1.4rem);
      font-weight: 400;
      margin: 0;
      padding: 0;
      color: var(--color-muted);
      letter-spacing: 0.22em;
      text-transform: uppercase;
      display: inline-block;
      line-height: 1.2;
      text-align: left;
    }

    .article-location {
      font-size: 0.95rem;
      color: var(--color-text-light);
      font-style: italic;
      margin-top: 1rem;
    }

    .article-copyright {
      font-size: 0.85rem;
      color: var(--color-text-light);
    }
  }

  .author-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid var(--color-border);
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
        border: 1px solid var(--color-border);

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
          color: var(--color-muted);
          font-size: 0.8rem;
        }
      }
    }
  }

  .translations {
    margin-bottom: 30px;
    position: relative;

    .translation {
      line-height: 1.8;

      &.fr {
        font-size: 1.05rem;
        position: relative;
        text-align: justify;
      }
    }
  }

  .analysis-main-title {
    font-size: 2.2rem;
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 2rem;
    line-height: 1.3;
    text-align: left;
  }

  .analysis-body {
    margin-bottom: 3rem;

    &.dense-spacing {
      .paragraph-item {
        margin-bottom: 0;
      }
    }

    .section-title-in-text {
      font-family: var(--font-family-heading);
      font-size: clamp(0.6rem, 1.2vw, 0.9rem);
      font-weight: 600;
      color: var(--color-ink);
      letter-spacing: 0.22em;
      text-transform: uppercase;
      display: block;
      line-height: 1.2;
      margin: 0 0 0.5rem 0;
      padding: 0;
      text-align: left;
    }

    .paragraph-item {
      margin-bottom: 0.7em;
      line-height: 1.6;
      color: var(--color-ink);
      text-align: justify;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .poetic-line {
      margin-bottom: 0;
      margin-top: 0;
      line-height: 1.2;
      color: var(--color-ink);
      text-align: left;
      padding: 0;

      &:last-child {
        margin-bottom: 2.5em;
      }
    }

    .analysis-text {
      line-height: 1.7;
      color: var(--color-ink);
      text-align: justify;
      margin: 0;
      padding: 0;
    }

    p {
      margin-bottom: 0.6rem;
      line-height: 1.6;
      color: var(--color-ink);

      &:last-child {
        margin-bottom: 0;
      }
    }

    .quote-text {
      display: inline;
      font-style: italic;
    }
    .quote {
      display: block;
      margin: 1.5rem 0;
      padding: 1rem 1.5rem;
      background: var(--color-background-alt);
      border-left: 4px solid var(--color-muted);
      font-style: italic;
      color: var(--color-text-light);
      line-height: 1.6;
    }

    .citation {
      font-style: italic;
      color: var(--color-text-light);
    }

    .emphasis-text {
      font-style: italic;
      font-weight: 500;
      color: var(--color-text);
    }

    em {
      font-style: italic;
    }
  }

  .author-signature {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid var(--color-border);
    text-align: right;

    .author-name-signature {
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--color-text);
      margin-bottom: 0.3rem;
    }

    .author-title-signature {
      font-style: italic;
      font-size: 0.95rem;
      color: var(--color-muted);
      margin-bottom: 0.2rem;
    }

    .author-date {
      font-size: 0.9rem;
      color: var(--color-muted);
    }
  }

  .footnotes {
    margin-top: 3rem;
    padding-top: 1.5rem;

    .footnotes-separator {
      border: none;
      border-top: 1px solid var(--color-border);
      margin-bottom: 1.5rem;
    }

    .footnote {
      font-size: 0.9rem;
      color: var(--color-text-light);
      line-height: 1.6;
      margin-bottom: 0.8rem;

      sup {
        color: var(--color-muted);
        font-weight: 600;
        margin-right: 0.3rem;
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
    color: var(--color-muted);
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
      padding: 2rem 1rem;
    }

    .tabs {
      flex-wrap: wrap;
      gap: 0.5rem;
      padding: 0.8rem 0;
      padding-left: 0;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      -ms-overflow-style: none;

      &::-webkit-scrollbar {
        display: none;
      }

      button {
        font-size: 0.9rem;
        padding: 0.5rem 0.8rem;
        white-space: nowrap;
        flex-shrink: 0;
      }
    }

    .main-image-container {
      margin-bottom: 1.5rem;
      padding: 0;
      align-items: center;
      text-align: center;

      .main-image {
        height: 266px;
      }

      &.images-side-by-side {
        flex-direction: column;

        .side-image {
          width: 100%;
          height: 266px;
        }
      }
    }
    .article-title-row {
      align-items: flex-start;

      .article-title-header .article-title {
        font-size: 1.3rem;
        text-align: left;
      }
    }

    .author-section {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.8rem;
      margin-bottom: 1.5rem;
    }

    .text-content-wrapper {
      padding: 1rem;
    }

    .nav-button {
      width: 36px;
      height: 36px;
      font-size: 1.2rem;

      &.prev {
        left: 5px;
      }

      &.next {
        right: 5px;
      }
    }

    .modal-content {
      max-width: 95%;
      padding: 1rem;

      img {
        max-height: 75vh;
      }
    }
  }

  @media (max-width: 480px) {
    .analyses-page {
      padding: 2rem 1rem;
    }

    .tabs {
      padding: 0.6rem 0;
      padding-left: 0;
      gap: 0.4rem;
      justify-content: flex-start;

      button {
        font-size: 0.85rem;
        padding: 0.4rem 0.6rem;
      }
    }

    .main-image-container {
      padding: 0;
      margin-bottom: 1rem;
      align-items: center;

      .main-image {
        height: 196px;
      }

      &.images-side-by-side {
        flex-direction: column;

        .side-image {
          width: 100%;
          height: 196px;
        }
      }
    }

    .article-title-row {
      align-items: flex-start;

      .article-title-header .article-title {
        font-size: 1.1rem;
        text-align: left;
      }
    }

    .author-section {
      gap: 0.6rem;
      margin-bottom: 1rem;

      .author-info .author-details {
        .author-name {
          font-size: 0.85rem;
        }

        .author-title {
          font-size: 0.7rem;
        }
      }
    }

    .text-content-wrapper {
      padding: 0.8rem;
    }

    .translations .translation.fr {
      font-size: 0.9rem;
    }

    .nav-button {
      width: 32px;
      height: 32px;
      font-size: 1rem;

      &.prev {
        left: 5px;
      }

      &.next {
        right: 5px;
      }
    }

    .modal-content {
      max-width: 98%;
      padding: 0.5rem;

      img {
        max-height: 70vh;
      }

      .close-button {
        font-size: 1.5rem;
        top: 0.5rem;
        right: 0.5rem;
      }
    }
  }
</style>
