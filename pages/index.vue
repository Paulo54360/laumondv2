<template>
  <div class="homepage">
    <!-- Hero Section - Approche contemplative -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">{{ $t('homepage.hero_title') }}</h1>
          <div class="hero-metahisme">{{ $t('homepage.hero_metahisme') }}</div>
        </div>
        <div class="hero-visual">
          <div class="viewer-360">
            <iframe
              ref="iframe360"
              class="video"
              src="https://tm3.co/Y2xddo"
              allowfullscreen
              :title="$t('homepage.video_hint')"
            ></iframe>
            <button
              class="fullscreen-button"
              @click="openFullscreen"
              :aria-label="$t('homepage.fullscreen_button')"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
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
          <div class="biography-text">
            <div class="biography-intro">
              <p>{{ biographyText }}</p>
            </div>
            <div class="biography-timeline">
              <div class="timeline-item">
                <span class="year">2000</span>
                <span class="event">{{ $t('homepage.timeline_2000') }}</span>
              </div>
              <div class="timeline-item">
                <span class="year">2010</span>
                <span class="event">{{ $t('homepage.timeline_2010') }}</span>
              </div>
              <div class="timeline-item">
                <span class="year">2020</span>
                <span class="event">{{ $t('homepage.timeline_2020') }}</span>
              </div>
            </div>
          </div>
          <div class="biography-visual">
            <div class="portrait-showcase">
              <img
                src="https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/10.jpg"
                :alt="$t('homepage.portrait_name')"
                class="portrait-artwork"
              />
              <div class="portrait-overlay">
                <h4>{{ $t('homepage.portrait_name') }}</h4>
                <p>{{ $t('homepage.portrait_caption') }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="section-link">
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
          <div class="metahisme-text">
            <div class="metahisme-definition">
              <p>{{ metahismeText }}</p>
            </div>
          </div>
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
        </div>
        <div class="section-link">
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

  // Fonction pour ouvrir en plein écran
  const openFullscreen = async (): Promise<void> => {
    const viewer = iframe360.value?.parentElement;
    if (!viewer) return;

    try {
      if (viewer.requestFullscreen) {
        await viewer.requestFullscreen();
      } else if ('webkitRequestFullscreen' in viewer) {
        // Safari
        const safariViewer = viewer as HTMLElement & { webkitRequestFullscreen: () => Promise<void> };
        await safariViewer.webkitRequestFullscreen();
      } else if ('mozRequestFullScreen' in viewer) {
        // Firefox
        const firefoxViewer = viewer as HTMLElement & { mozRequestFullScreen: () => Promise<void> };
        await firefoxViewer.mozRequestFullScreen();
      } else if ('msRequestFullscreen' in viewer) {
        // IE/Edge
        const msViewer = viewer as HTMLElement & { msRequestFullscreen: () => Promise<void> };
        await msViewer.msRequestFullscreen();
      }
    } catch (error) {
      console.error("Erreur lors de l'ouverture en plein écran:", error);
    }
  };

  // Générer les liens avec la locale actuelle
  const localePath = (path: string): string => {
    const localeFromPath = route.path?.match(/^\/(fr|en)/)?.[1] || locale.value || 'fr';
    return `/${localeFromPath}${path}`;
  };

  // Texte biographie et Métahisme - utilisation des traductions
  const biographyText = computed(() => t('homepage.biography_text'));
  const metahismeText = computed(() => t('homepage.metahisme_text'));

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
    background: var(--color-background);
    color: var(--color-text);
    padding-top: calc(var(--header-height) + 1rem);
  }

  // Sections générales
  .section {
    padding: 2rem 2rem 3rem;
    min-height: auto;
    display: flex;
    align-items: flex-start;

    .section-container {
      max-width: var(--max-width-content);
      margin: 0 auto;
      width: 100%;
      padding-top: 1rem;
      padding-bottom: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: auto;
    }

    .section-header {
      text-align: left;
      margin-bottom: 2rem;
      margin-top: 0;

      .section-title {
        font-size: 2.5rem;
        font-weight: 300;
        margin-bottom: 1rem;
        color: var(--color-text);
        letter-spacing: 0.05em;
        display: flex;
        align-items: center;
      }

      .section-divider {
        width: 60px;
        height: 2px;
        background: var(--color-text);
        margin: 0;
      }
    }

    .section-link {
      text-align: left;
      margin-top: 3rem;
      margin-bottom: 1rem;
    }
  }

  // Hero Section - Contemplatif
  .hero-section {
    background: var(--color-background);
    color: var(--color-text);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 2rem;
    position: relative;
    min-height: auto;

    .hero-content {
      max-width: var(--max-width-content);
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: center;
      width: 100%;

      .hero-text {
        text-align: left;

        .hero-title {
          font-size: 4rem;
          font-weight: 200;
          margin-bottom: 1.5rem;
          color: var(--color-text);
          letter-spacing: 0.02em;
          line-height: 1.2;
        }

        .hero-metahisme {
          font-size: 1.2rem;
          font-weight: 300;
          color: var(--color-text-light);
          letter-spacing: 0.1em;
        }
      }

      .hero-visual {
        position: relative;
        width: 100%;

        .viewer-360 {
          width: 100%;
          aspect-ratio: 16/9;
          position: relative;
          border: none;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;

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
            transition: background 0.2s ease, transform 0.2s ease;
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
      }
    }
  }

  // Biography Section
  .biography-section {
    background: white;

    .biography-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: center;

      .biography-text {
        .biography-intro {
          margin-bottom: 2rem;

          p {
            font-size: 1.1rem;
            line-height: 1.8;
            color: var(--color-text-light);
            white-space: pre-line;
          }
        }

        .biography-timeline {
          .timeline-item {
            display: flex;
            align-items: center;
            margin-bottom: 1.5rem;

            .year {
              font-size: 1.2rem;
              font-weight: 600;
              color: var(--color-text);
              margin-right: 2rem;
              min-width: 60px;
            }

            .event {
              font-size: 0.9rem;
              color: var(--color-text-light);
            }
          }
        }
      }

      .biography-visual {
        .portrait-showcase {
          position: relative;
          overflow: hidden;
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 4px;

          .portrait-artwork {
            width: 100%;
            height: 400px;
            object-fit: cover;
            transition: transform var(--transition-medium);
            border-radius: 4px;
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

    .metahisme-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: center;

      .metahisme-text {
        .metahisme-definition {
          p {
            font-size: 1.1rem;
            line-height: 1.8;
            color: var(--color-text-light);
            white-space: pre-line;
          }
        }
      }

      .metahisme-visual {
        .artwork-showcase {
          position: relative;
          overflow: hidden;
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 4px;

          .metahisme-artwork {
            width: 100%;
            height: 400px;
            object-fit: cover;
            transition: transform var(--transition-medium);
            border-radius: 4px;
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
      gap: 2rem;
      align-items: start;

      .artwork-item {
        position: relative;

        .artwork-link {
          text-decoration: none;
          color: inherit;
          display: block;

          &:hover {
            .artwork-frame img {
              transform: scale(1.03);
            }
          }
        }

        .artwork-frame {
          background: white;
          padding: 0;
          border: none;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

          img {
            width: 100%;
            height: 450px;
            object-fit: cover;
            transition: transform var(--transition-medium);
          }
        }

        .artwork-info {
          .artwork-title {
            font-size: 1.1rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
            color: var(--color-text);
          }

          .artwork-author {
            font-size: 0.9rem;
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
      gap: 3rem;

      .analysis-item {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
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
            height: 400px;
            object-fit: cover;
            border-radius: 4px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          }
        }

        .analysis-text-content {
          .analysis-title {
            font-size: 1.8rem;
            font-weight: 500;
            margin-bottom: 1rem;
            color: var(--color-text);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .analysis-excerpt {
            p {
              font-size: 1rem;
              line-height: 1.8;
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

  // Responsive
  @media (max-width: 768px) {
    .homepage {
      padding-top: calc(var(--header-height) + 20px);
    }

    .hero-section {
      padding: 3rem 1rem 2rem;
      min-height: auto;

      .hero-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .hero-text {
        text-align: left;

        .hero-title {
          font-size: 2.5rem;
          line-height: 1.2;
          margin-bottom: 1rem;
        }

        .hero-metahisme {
          font-size: 1rem;
        }
      }

      .hero-visual {
        .viewer-360 {
          aspect-ratio: 16/9;
        }
      }
    }

    .section {
      padding: 3rem 1rem;
      min-height: auto;
    }

    .section-header {
      margin-bottom: 2rem;

      .section-title {
        font-size: 1.8rem;
        margin-bottom: 0.8rem;
      }

      .section-divider {
        width: 40px;
      }
    }

    .section-link {
      margin-top: 2rem;
    }

    .oeuvres-section {
      .artworks-showcase {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        .artwork-item {
          width: 100%;

          .artwork-frame {
            img {
              height: 250px;
            }
          }
        }
      }
    }

    .biography-content,
    .metahisme-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .analyses-content {
      gap: 4rem;

      .analysis-item {
        display: flex;
        flex-direction: column;
        gap: 2rem;

        &.analysis-reverse {
          direction: ltr;
        }
      }
    }

    .artistic-link {
      padding: 0.8rem 1.5rem;
      font-size: 0.85rem;
    }
  }

  @media (max-width: 480px) {
    .homepage {
      padding-top: calc(var(--header-height) + 10px);
    }

    .hero-section {
      padding: 2rem 1rem 1.5rem;

      .hero-content {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .hero-text {
        .hero-title {
          font-size: 2rem;
          margin-bottom: 0.8rem;
        }

        .hero-metahisme {
          font-size: 0.9rem;
        }
      }

      .hero-visual {
        .viewer-360 {
          aspect-ratio: 16/9;
        }
      }
    }

    .section {
      padding: 2rem 0.8rem;
    }

    .section-header .section-title {
      font-size: 1.6rem;
    }

    .artistic-link {
      padding: 0.7rem 1.2rem;
      font-size: 0.8rem;
    }
  }
</style>
