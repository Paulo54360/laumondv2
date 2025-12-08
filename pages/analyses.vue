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
              <div class="analysis-body">
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
      title: "Afin qu'un jouradvienne",
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

<style lang="scss" src="~/assets/css/pages/analyses.scss"></style>
