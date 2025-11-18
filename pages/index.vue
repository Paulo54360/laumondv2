<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="homepage">
    <!-- Hero Section - Approche contemplative -->
    <section class="hero-section">
      <div class="hero-wrapper">
        <div class="hero-visual">
          <div class="viewer-360">
            <iframe
              ref="iframe360"
              class="video"
              src="https://tm3.co/Y2xddo"
              allowfullscreen
              :title="$t('homepage.video_hint')"
            ></iframe>
            <div class="viewer-overlay-top"></div>
          </div>
          <div class="viewer-caption">
            <h3 class="artwork-title">
              Le mobile d'ouverture des univers parallèles, 2022 — Œuvre interactive 360°
            </h3>
          </div>
        </div>
        <div class="hero-text">
          <h1 class="hero-name">
            {{ $t('homepage.hero_title_top') }}<br />{{ $t('homepage.hero_title_bottom') }}
          </h1>
        </div>
      </div>
    </section>

    <!-- Biography Section -->
    <section id="biography" class="section biography-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">{{ $t('homepage.biography_title') }}</h2>
          <div class="section-divider"></div>
        </div>
        <div class="biography-content">
          <div class="biography-visual">
            <div class="portrait-showcase">
              <img
                :src="biographyPortraitUrl"
                :alt="$t('homepage.portrait_name')"
                class="portrait-artwork"
              />
              <div class="portrait-overlay">
                <h4>{{ $t('homepage.portrait_name') }}</h4>
                <p>{{ $t('homepage.portrait_caption') }}</p>
              </div>
            </div>
          </div>
          <div class="biography-text">
            <div class="biography-intro">
              <div class="text-content" :class="{ collapsed: !showFullBiography }">
                <p>{{ biographyText }}</p>
              </div>
              <button class="show-more-button" @click="showFullBiography = !showFullBiography">
                <img
                  v-if="!showFullBiography"
                  src="~/assets/images/common/Down Arrow Icon.png"
                  :alt="$t('analyses.show_more')"
                  class="arrow-img"
                />
                <img
                  v-else
                  src="~/assets/images/common/Fleche Vers Le Haut.png"
                  :alt="$t('analyses.show_less')"
                  class="arrow-img"
                />
              </button>
            </div>
          </div>
        </div>
        <div v-if="showFullBiography" class="section-link">
          <NuxtLink :to="localePath('/biography')" class="artistic-link">{{
            $t('homepage.read_biography')
          }}</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Métahisme Section -->
    <section id="metahisme" class="section metahisme-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">{{ $t('homepage.metahisme_title') }}</h2>
          <div class="section-divider"></div>
        </div>
        <div class="metahisme-content">
          <div class="metahisme-visual">
            <div class="artwork-showcase">
              <img
                :src="mobileOuvertureImageUrl"
                :alt="$t('homepage.metahisme_artwork_title')"
                class="metahisme-artwork"
              />
              <div class="artwork-overlay">
                <h4>{{ $t('homepage.mobile_ouverture_title') }}</h4>
                <p>{{ $t('homepage.metahisme_artwork_caption') }}</p>
              </div>
            </div>
          </div>
          <div class="metahisme-text">
            <div class="metahisme-definition">
              <h3 class="metahisme-declaration-title">{{ metahismeTitle }}</h3>
              <div class="text-content" :class="{ collapsed: !showFullMetahisme }">
                <p>{{ metahismeText }}</p>
              </div>
              <button class="show-more-button" @click="showFullMetahisme = !showFullMetahisme">
                <img
                  v-if="!showFullMetahisme"
                  src="~/assets/images/common/Down Arrow Icon.png"
                  :alt="$t('analyses.show_more')"
                  class="arrow-img"
                />
                <img
                  v-else
                  src="~/assets/images/common/Fleche Vers Le Haut.png"
                  :alt="$t('analyses.show_less')"
                  class="arrow-img"
                />
              </button>
            </div>
          </div>
        </div>
        <div v-if="showFullMetahisme" class="section-link">
          <NuxtLink :to="localePath('/metahism')" class="artistic-link">{{
            $t('homepage.discover_metahisme')
          }}</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Oeuvres Section -->
    <section id="oeuvres" class="section oeuvres-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">{{ $t('homepage.artworks_title') }}</h2>
          <div class="section-divider"></div>
        </div>
        <div class="artworks-showcase">
          <div
            v-for="(artwork, index) in featuredArtworks"
            :key="artwork.id"
            class="artwork-item"
            :class="`artwork-${index + 1}`"
          >
            <NuxtLink :to="localePath('/analyses')" class="artwork-link">
              <div class="artwork-frame">
                <img :src="artwork.imageUrl" :alt="artwork.title" />
              </div>
              <div class="artwork-info">
                <h3 class="artwork-title">{{ artwork.title }}</h3>
                <div class="artwork-author">{{ artwork.author }}</div>
              </div>
            </NuxtLink>
          </div>
        </div>
        <div class="section-link">
          <NuxtLink :to="localePath('/analyses')" class="artistic-link">{{
            $t('homepage.browse_artworks')
          }}</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Analyses Section -->
    <section id="analyses" class="section analyses-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">{{ $t('homepage.analyses_title') }}</h2>
          <div class="section-divider"></div>
        </div>
        <div class="analyses-content">
          <div
            v-for="(analysis, index) in analyses"
            :key="index"
            class="analysis-item"
            :class="{ 'analysis-reverse': index % 2 === 1 }"
          >
            <div class="analysis-image">
              <img :src="analysis.imageUrl" :alt="analysis.title" />
            </div>
            <div class="analysis-text-content">
              <h3 class="analysis-title">{{ analysis.title }}</h3>
              <div class="analysis-excerpt">
                <p>{{ analysis.excerpt }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="section-link">
          <NuxtLink :to="localePath('/analyses')" class="artistic-link">{{
            $t('homepage.read_analyses')
          }}</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const { locale, t } = useI18n();
  const iframe360 = ref<HTMLIFrameElement | null>(null);
  const showFullBiography = ref(false);
  const showFullMetahisme = ref(false);
  const biographyPortraitUrl = ref(
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/10.jpg'
  );
  // Générer les liens avec la locale actuelle
  const localePath = (path: string): string => {
    const localeFromPath = route.path?.match(/^\/(fr|en)/)?.[1] || locale.value || 'fr';
    return `/${localeFromPath}${path}`;
  };

  // Texte biographie et Métahisme - utilisation des traductions
  const biographyText = computed(() => t('homepage.biography_text'));
  const metahismeTextFull = computed(() => t('homepage.metahisme_text'));

  // Séparer le titre "Déclaration non manifestée* du MétaHisme" du reste du texte
  const metahismeTitle = computed(() => {
    const fullText = metahismeTextFull.value;
    const firstLineEnd = fullText.indexOf('\n\n');
    return firstLineEnd !== -1 ? fullText.substring(0, firstLineEnd) : '';
  });

  const metahismeText = computed(() => {
    const fullText = metahismeTextFull.value;
    const firstLineEnd = fullText.indexOf('\n\n');
    return firstLineEnd !== -1 ? fullText.substring(firstLineEnd + 2) : fullText;
  });

  // Image "Le mobile d'ouverture des univers parallèles"
  const mobileOuvertureImageUrl = ref(
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/06.jpg'
  );

  // Données des œuvres en vedette
  const featuredArtworks = computed(() => [
    {
      id: 1,
      title: t('homepage.artwork_portant'),
      author: t('homepage.artwork_portant_author'),
      imageUrl: 'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/10.jpg',
    },
    {
      id: 2,
      title: t('homepage.artwork_concordance'),
      author: t('homepage.artwork_concordance_author'),
      imageUrl: 'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/02.jpg',
    },
    {
      id: 3,
      title: t('homepage.artwork_mobile_ouverture'),
      author: t('homepage.artwork_mobile_author'),
      imageUrl: 'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/06.jpg',
    },
  ]);

  // Analyses avec titres et extraits
  const analyses = computed(() => [
    {
      title: t('homepage.analysis_portant_title'),
      excerpt: t('homepage.analysis_portant_excerpt'),
      imageUrl: 'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/10.jpg',
    },
    {
      title: t('homepage.analysis_concordance_title'),
      excerpt: t('homepage.analysis_concordance_excerpt'),
      imageUrl: 'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/02.jpg',
    },
  ]);
</script>

<style lang="scss" scoped>
  .homepage {
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
    background: var(--color-background);
    color: var(--color-text);
    padding-top: 0;
    scroll-padding-top: 0;

    // Masquer les éléments Viewmake dans les iframes
    iframe {
      pointer-events: auto;
    }
  }

  // Sections générales
  .section {
    padding: clamp(2.5rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 2rem);
    min-height: auto;
    display: flex;
    align-items: flex-start;

    .section-container {
      width: 100%;
      max-width: var(--max-width-content);
      margin: 0 auto;
      padding-top: 0;
      padding-bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: auto;
      box-sizing: border-box;
    }

    .section-header {
      text-align: left;
      margin-bottom: 4rem;
      margin-top: 0;

      .section-title {
        font-size: clamp(2rem, 4vw, 3.2rem);
        font-weight: 300;
        margin-bottom: 1rem;
        color: #5e6266;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        display: inline-flex;
        align-items: baseline;
        line-height: 1.2;
      }

      .section-divider {
        width: 110px;
        height: 3px;
        background: #a20101;
        margin: 0;
      }
    }

    .section-link {
      text-align: left;
      margin-top: 4rem;
      margin-bottom: 0;
    }
  }

  // Hero Section - Contemplatif
  .hero-section {
    background: var(--color-background);
    color: var(--color-text);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(1rem, 3vw, 2rem) clamp(1.5rem, 4vw, 2.5rem) clamp(2.5rem, 5vw, 3.5rem);
    position: relative;
    min-height: 60vh;
    overflow: visible;
    height: auto;

    .hero-wrapper {
      width: 100%;
      max-width: 1400px;
      box-sizing: border-box;
      margin: 0 auto;
      padding: 0 clamp(1rem, 4vw, 3rem);
      display: flex;
      align-items: center;
      gap: clamp(2rem, 5vw, 4rem);
      overflow: visible;

      .hero-visual {
        position: relative;
        flex: 1.2;
        min-width: 0;
        display: flex;
        flex-direction: column;
        order: 2;

        .viewer-360 {
          width: 100%;
          aspect-ratio: 3 / 2;
          min-height: 520px;
          position: relative;
          border: none;
          border-radius: 0;
          overflow: visible;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
          // Overlay pour masquer les contrôles en haut
          .viewer-overlay-top {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: transparent;
            z-index: 999 !important;
            pointer-events: none;
          }

          &:hover {
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
          }

          &:fullscreen {
            width: 100vw;
            height: 100vh;
            aspect-ratio: unset;
            border-radius: 0;
            max-width: 100vw;
            max-height: 100vh;
          }

          &:-webkit-full-screen {
            width: 100vw;
            height: 100vh;
            aspect-ratio: unset;
            border-radius: 0;
            max-width: 100vw;
            max-height: 100vh;
          }

          &:-moz-full-screen {
            width: 100vw;
            height: 100vh;
            aspect-ratio: unset;
            border-radius: 0;
            max-width: 100vw;
            max-height: 100vh;
          }

          &:-ms-fullscreen {
            width: 100vw;
            height: 100vh;
            aspect-ratio: unset;
            border-radius: 0;
            max-width: 100vw;
            max-height: 100vh;
          }

          .video {
            width: 100%;
            height: 100%;
            border: none;
            display: block;
          }

          &:fullscreen .video {
            width: 100vw;
            height: 100vh;
          }

          &:-webkit-full-screen .video {
            width: 100vw;
            height: 100vh;
          }

          &:-moz-full-screen .video {
            width: 100vw;
            height: 100vh;
          }

          &:-ms-fullscreen .video {
            width: 100vw;
            height: 100vh;
          }

          .fullscreen-button {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            padding: 0.75rem;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition:
              background 0.2s ease,
              transform 0.2s ease;
            z-index: 10;

            &:hover {
              background: rgba(0, 0, 0, 0.9);
              transform: scale(1.1);
            }

            svg {
              width: 20px;
              height: 20px;
            }
          }
        }

        .viewer-caption {
          margin-top: 1.25rem;
          text-align: left;

          .artwork-title {
            font-size: 1rem;
            font-weight: 400;
            margin: 0 0 0.5rem 0;
            color: var(--color-text-light);
            transition: color var(--transition-medium);
            text-transform: none;
            letter-spacing: normal;
            line-height: normal;
            word-wrap: break-word;
            overflow-wrap: break-word;
            white-space: normal;
          }
        }
      }

      .hero-text {
        flex: 0.8;
        min-width: 0;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 0;
        order: 1;

        .hero-name {
          margin: 0;
          color: #2d3034;
          text-transform: uppercase;
          font-weight: 400;
          line-height: 1.1;
          font-size: clamp(1.49rem, 3.5vw, 2.69rem);
          letter-spacing: 0.3em;
          text-align: left;
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: normal;
          max-width: 100%;
        }
      }
    }
  }

  // Biography Section
  .biography-section {
    background: white;

    .biography-content {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 2.5rem;
      align-items: flex-start;

      .biography-text {
        max-width: 100%;
        padding-top: 0.5rem;

        .biography-intro {
          margin-bottom: 2rem;

          .text-content {
            p {
              font-size: 1.05rem;
              line-height: 1.9;
              color: var(--color-text-light);
              white-space: pre-line;
              max-width: 100%;
            }
          }

          .text-content.collapsed {
            @media (max-width: 768px) {
              max-height: 150px;
              overflow: hidden;
              position: relative;

              &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 60px;
                background: linear-gradient(transparent, white);
              }
            }
          }

          .show-more-button {
            display: none; /* Caché par défaut sur desktop */
            @media (max-width: 768px) {
              display: flex; /* Affiché sur mobile */
            }
            justify-content: center;
            align-items: center;
            background: none;
            border: none;
            width: 100%;
            margin: 1rem auto 0;
            cursor: pointer;
            padding: 0.5rem;

            .arrow-img {
              width: 32px;
              height: 32px;
              display: block;
              margin: 0 auto;
            }
          }
        }
      }

      .biography-visual {
        position: sticky;
        top: calc(var(--header-height) + 2rem);

        .portrait-showcase {
          position: relative;
          overflow: hidden;
          background: transparent;
          border: none;
          border-radius: 0;
          box-shadow: none;

          .portrait-artwork {
            width: 100%;
            height: 500px;
            object-fit: cover;
            transition: transform var(--transition-medium);
            border-radius: 0;
          }

          .portrait-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
            color: white;
            padding: 2rem;
            transform: translateY(100%);
            transition: transform var(--transition-medium);

            h4 {
              font-size: 1.3rem;
              font-weight: 500;
              margin-bottom: 0.5rem;
            }

            p {
              font-size: 0.9rem;
              opacity: 0.9;
            }
          }

          &:hover {
            .portrait-artwork {
              transform: scale(1.05);
            }

            .portrait-overlay {
              transform: translateY(0);
            }
          }
        }
      }
    }
  }

  // Métahisme Section
  .metahisme-section {
    background: var(--color-background-alt);

    .section-header {
      margin-top: 0.75rem;

      .section-title {
        font-size: 2.2rem;
        font-weight: 400;
      }
    }

    .metahisme-content {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 4rem;
      align-items: flex-start;

      .metahisme-text {
        .metahisme-definition {
          margin-top: 0.5rem;

          .metahisme-declaration-title {
            font-size: clamp(1.5rem, 3vw, 2rem);
            font-weight: 400;
            margin-bottom: 1.5rem;
            color: #5e6266;
            letter-spacing: 0.05em;
            line-height: 1.3;
          }

          .text-content {
            p {
              font-size: 1.05rem;
              line-height: 1.9;
              color: var(--color-text-light);
              white-space: pre-line;
            }
          }

          .text-content.collapsed {
            @media (max-width: 768px) {
              max-height: 150px;
              overflow: hidden;
              position: relative;

              &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 60px;
                background: linear-gradient(transparent, var(--color-background-alt));
              }
            }
          }

          .show-more-button {
            display: none; /* Caché par défaut sur desktop */
            @media (max-width: 768px) {
              display: flex; /* Affiché sur mobile */
            }
            justify-content: center;
            align-items: center;
            background: none;
            border: none;
            width: 100%;
            margin: 1rem auto 0;
            cursor: pointer;
            padding: 0.5rem;

            .arrow-img {
              width: 32px;
              height: 32px;
              display: block;
              margin: 0 auto;
            }
          }
        }
      }

      .metahisme-visual {
        position: sticky;
        top: calc(var(--header-height) + 2rem);

        .artwork-showcase {
          position: relative;
          overflow: hidden;
          background: transparent;
          border: none;
          border-radius: 0;
          box-shadow: none;

          .metahisme-artwork {
            width: 100%;
            height: 500px;
            object-fit: cover;
            transition: transform var(--transition-medium);
            border-radius: 0;
          }

          .artwork-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
            color: white;
            padding: 2rem;
            transform: translateY(100%);
            transition: transform var(--transition-medium);

            h4 {
              font-size: 1.3rem;
              font-weight: 500;
              margin-bottom: 0.5rem;
            }

            p {
              font-size: 0.9rem;
              opacity: 0.9;
            }
          }

          &:hover {
            .metahisme-artwork {
              transform: scale(1.05);
            }

            .artwork-overlay {
              transform: translateY(0);
            }
          }
        }
      }
    }
  }

  // Oeuvres Section
  .oeuvres-section {
    background: var(--color-background-alt);

    .artworks-showcase {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 3rem;
      align-items: start;

      .artwork-item {
        position: relative;

        .artwork-link {
          text-decoration: none;
          color: inherit;
          display: block;

          &:hover {
            .artwork-frame img {
              transform: scale(1.05);
            }

            .artwork-info {
              .artwork-title {
                color: var(--color-primary);
              }
            }
          }
        }

        .artwork-frame {
          background: transparent;
          padding: 0;
          border: none;
          border-radius: 0;
          margin-bottom: 0.5rem;
          overflow: hidden;
          box-shadow: none;
          transition: none;

          img {
            width: 100%;
            display: block;
            height: 500px;
            object-fit: cover;
            transition: transform var(--transition-medium);
          }
        }

        .artwork-info {
          .artwork-title {
            font-size: 1rem;
            font-weight: 400;
            margin-bottom: 0.5rem;
            color: var(--color-text-light);
            transition: color var(--transition-medium);
          }

          .artwork-author {
            font-size: 0.95rem;
            color: var(--color-text-light);
            font-style: italic;
          }
        }
      }
    }
  }

  // Analyses Section
  .analyses-section {
    background: white;

    .analyses-content {
      display: flex;
      flex-direction: column;
      gap: 4rem;

      .analysis-item {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        align-items: center;

        &.analysis-reverse {
          direction: rtl;

          > * {
            direction: ltr;
          }
        }

        .analysis-image {
          img {
            width: 100%;
            height: 520px;
            object-fit: cover;
            border-radius: 0;
            box-shadow: none;
            display: block;
            transition: transform var(--transition-medium);

            &:hover {
              transform: scale(1.02);
            }
          }
        }

        .analysis-text-content {
          .analysis-title {
            font-size: 2rem;
            font-weight: 400;
            margin-bottom: 1.5rem;
            color: var(--color-text);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            line-height: 1.3;
          }

          .analysis-excerpt {
            p {
              font-size: 1.05rem;
              line-height: 1.9;
              color: var(--color-text-light);
              white-space: pre-line;
            }
          }
        }
      }
    }
  }

  // Liens artistiques - Style bouton
  .artistic-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: var(--color-text);
    font-size: 0.9rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 0.75rem 1.5rem;
    border: 1px solid var(--color-border);
    background: transparent;
    border-radius: var(--border-radius);
    transition: all var(--transition-medium);
    cursor: pointer;

    &:hover {
      background: var(--color-background-alt);
      border-color: var(--color-text);
    }
  }

  // Responsive - Tablette
  @media (max-width: 1024px) {
    .hero-section {
      .hero-wrapper {
        flex-direction: column;
        gap: 2.5rem;
        padding: 0 1.5rem;

        .hero-visual {
          flex: 1;
          order: 2;
        }
      }

      .hero-text {
        flex: 1;
        padding: 0;
        min-height: auto;
        order: 1;

        .hero-name {
          font-size: 2.19rem;
          text-align: left;
        }
      }
    }

    .section {
      padding: 1.5rem clamp(1rem, 3vw, 1.5rem) 3rem;
    }

    .biography-content,
    .metahisme-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;

      .biography-visual,
      .metahisme-visual {
        order: 1;
        position: static;
      }

      .biography-text,
      .metahisme-text {
        order: 2;
      }
    }

    .analyses-content .analysis-item {
      gap: 3rem;
    }

    .oeuvres-section .artworks-showcase {
      grid-template-columns: repeat(2, 1fr);
      gap: 2.5rem;
    }
  }

  // Responsive - Mobile
  @media (max-width: 768px) {
    .homepage {
      padding-top: 0;
      scroll-padding-top: 0;
    }

    .hero-section {
      padding: 3rem 0 0.5rem;
      min-height: auto;
      overflow: visible;
      height: auto;

      .hero-wrapper {
        flex-direction: column;
        gap: 2.5rem;
        padding: 0;
        max-width: 100%;
        overflow: visible;

        .hero-visual {
          flex: 1;
          order: 2;
        }

        .hero-text {
          order: 1;
          padding-top: 2rem;
        }
      }

      .hero-visual {
        padding: 0 1rem;
        box-sizing: border-box;
        overflow: visible;
        width: 100%;

        .viewer-360 {
          aspect-ratio: 16/9;
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;
          box-shadow: none;
          border-radius: 0;
          overflow: visible;

          .video {
            width: 100%;
            height: 100%;
            max-width: 100%;
          }
        }

        .viewer-caption {
          margin-top: 1.25rem;
          text-align: left;

          .artwork-title {
            font-size: 1rem;
            font-weight: 400;
            margin: 0 0 0.5rem 0;
            color: var(--color-text-light);
            transition: color var(--transition-medium);
            text-transform: none;
            letter-spacing: normal;
            line-height: normal;
            word-wrap: break-word;
            overflow-wrap: break-word;
            white-space: normal;
          }
        }
      }

      .hero-text {
        flex: 1;
        padding: 0;
        min-height: auto;

        .hero-name {
          font-size: 1.49rem;
          text-align: left;
        }
      }
    }

    .section {
      padding: 1.25rem 1rem;
      min-height: auto;

      .section-container {
        max-width: 100%;
        padding: 0.5rem 0 1.5rem;
      }
    }

    .section-header {
      margin-bottom: 1.5rem;

      .section-title {
        font-size: 1.6rem;
        margin-bottom: 0.6rem;
        letter-spacing: 0.12em;
      }

      .section-divider {
        width: 40px;
        height: 2px;
      }
    }

    .section-link {
      margin-top: 1.5rem;
    }

    .biography-content,
    .metahisme-content {
      display: flex !important;
      flex-direction: column !important;
      grid-template-columns: none !important;
      gap: 1.5rem;

      /* Ordre : image en premier, puis texte */
      .biography-visual,
      .metahisme-visual {
        order: 1;
        position: static;
        width: 100%;

        .portrait-showcase,
        .artwork-showcase {
          background: transparent;
          border: none;
          border-radius: 0;
          box-shadow: none;

          .portrait-artwork,
          .metahisme-artwork {
            width: 100%;
            min-height: 300px;
            height: auto;
            border-radius: 0;
          }
        }
      }

      .biography-text,
      .metahisme-text {
        order: 2;
        width: 100%;

        .biography-intro .text-content p,
        .metahisme-definition .text-content p {
          font-size: 0.95rem;
          line-height: 1.7;
        }

        .biography-intro .show-more-button,
        .metahisme-definition .show-more-button {
          display: flex; /* Affiché sur mobile */
        }

        .biography-intro .text-content.collapsed,
        .metahisme-definition .text-content.collapsed {
          max-height: 150px;

          &::after {
            background: linear-gradient(transparent, var(--color-background));
          }
        }
      }
    }

    .oeuvres-section {
      .artworks-showcase {
        display: flex;
        flex-direction: column;
        gap: 2rem;

        .artwork-item {
          width: 100%;

          .artwork-frame {
            margin-bottom: 0.5rem;
            img {
              height: 280px;
            }
          }

          .artwork-info {
            .artwork-title {
              font-size: 1rem;
              margin-bottom: 0.4rem;
            }

            .artwork-author {
              font-size: 0.85rem;
            }
          }
        }
      }
    }

    .analyses-content {
      gap: 3rem;

      .analysis-item {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        &.analysis-reverse {
          direction: ltr;
        }

        .analysis-image img {
          height: 320px;
          border-radius: 0;
          box-shadow: none;
        }

        .analysis-text-content {
          .analysis-title {
            font-size: 1.4rem;
            margin-bottom: 0.8rem;
          }

          .analysis-excerpt p {
            font-size: 0.9rem;
            line-height: 1.7;
          }
        }
      }
    }

    .artistic-link {
      padding: 0.7rem 1.3rem;
      font-size: 0.8rem;
      width: 100%;
      text-align: center;
    }
  }

  // Responsive - Petit mobile
  @media (max-width: 480px) {
    .homepage {
      padding-top: 0;
      scroll-padding-top: 0;
    }

    .hero-section {
      padding: 2.5rem 0 0;
      overflow: visible;
      height: auto;

      .hero-wrapper {
        flex-direction: column;
        gap: 2rem;
        padding: 0;
        max-width: 100%;
        overflow: visible;

        .hero-visual {
          flex: 1;
          order: 2;
        }

        .hero-text {
          order: 1;
          padding-top: 1.5rem;
        }
      }

      .hero-visual {
        padding: 0 0.8rem;
        box-sizing: border-box;
        overflow: visible;
        width: 100%;

        .viewer-360 {
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;
          aspect-ratio: 16/9;
          border-radius: 0;
          box-shadow: none;
          overflow: visible;

          .video {
            width: 100%;
            height: 100%;
            max-width: 100%;
          }

          .fullscreen-button {
            top: 0.4rem;
            right: 0.4rem;
            padding: 0.4rem;

            svg {
              width: 16px;
              height: 16px;
            }
          }
        }
        .viewer-caption {
          margin-top: 1rem;

          .artwork-title {
            font-size: 0.95rem;
            margin: 0 0 0.4rem 0;
            color: var(--color-text-light);
            font-weight: 400;
            text-transform: none;
            letter-spacing: normal;
            line-height: normal;
            word-wrap: break-word;
            overflow-wrap: break-word;
            white-space: normal;
          }
        }
      }
    }

    .section {
      padding: 1.2rem 0.8rem;

      .section-container {
        padding-top: 0;
        padding-bottom: 1rem;
      }
    }

    .section-header {
      margin-bottom: 1.2rem;

      .section-title {
        font-size: 1.4rem;
        margin-bottom: 0.5rem;
        letter-spacing: 0.1em;
      }

      .section-divider {
        width: 35px;
        height: 2px;
      }
    }

    .biography-content,
    .metahisme-content {
      gap: 1.2rem;

      .biography-text .biography-intro p,
      .metahisme-text .metahisme-definition p {
        font-size: 0.9rem;
        line-height: 1.6;
      }

      .biography-visual .portrait-showcase,
      .metahisme-visual .artwork-showcase {
        background: transparent;
        border: none;
        border-radius: 0;
        box-shadow: none;

        .portrait-artwork,
        .metahisme-artwork {
          height: 250px;
          border-radius: 0;
        }
      }

      .biography-timeline .timeline-item {
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 1rem;

        .year {
          margin-right: 0;
          margin-bottom: 0.3rem;
          font-size: 1rem;
        }

        .event {
          font-size: 0.85rem;
        }
      }
    }

    .oeuvres-section {
      .artworks-showcase {
        gap: 1.5rem;

        .artwork-item {
          .artwork-frame {
            margin-bottom: 0.5rem;

            img {
              height: 240px;
            }
          }

          .artwork-info {
            .artwork-title {
              font-size: 0.95rem;
            }

            .artwork-author {
              font-size: 0.8rem;
            }
          }
        }
      }
    }

    .analyses-content {
      gap: 2.5rem;

      .analysis-item {
        gap: 1.2rem;

        .analysis-image img {
          height: 280px;
          border-radius: 0;
          box-shadow: none;
        }

        .analysis-text-content {
          .analysis-title {
            font-size: 1.2rem;
            margin-bottom: 0.6rem;
            letter-spacing: 0.03em;
          }

          .analysis-excerpt p {
            font-size: 0.85rem;
            line-height: 1.6;
          }
        }
      }
    }

    .artistic-link {
      padding: 0.65rem 1rem;
      font-size: 0.75rem;
    }
  }
</style>
