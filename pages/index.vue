<template>
  <div class="homepage">
    <!-- Hero Section - Approche contemplative -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">{{ $t('homepage.hero_title') }}</h1>
          <div class="hero-subtitle">
            <span class="subtitle-line">{{ $t('homepage.hero_subtitle_1') }}</span>
            <span class="subtitle-line">{{ $t('homepage.hero_subtitle_2') }}</span>
          </div>
          <div class="hero-description">
            <p>{{ $t('homepage.hero_description_1') }}</p>
            <p>{{ $t('homepage.hero_description_2') }}</p>
            <p>{{ $t('homepage.hero_description_3') }}</p>
          </div>
        </div>
        <div class="hero-visual">
          <div class="video-container" @click="openFullscreen">
            <iframe
              ref="videoIframe"
              class="video"
              src="https://tm3.co/Y2xddo"
              allowfullscreen
            ></iframe>
            <div class="video-overlay">
              <div class="play-icon">
                <i class="fas fa-expand"></i>
              </div>
              <p class="video-hint">{{ $t('homepage.video_hint') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Biography Section - Portrait artistique -->
    <section id="biography" class="section biography-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">{{ $t('homepage.biography_title') }}</h2>
          <div class="section-divider"></div>
        </div>
        <div class="biography-content">
          <div class="biography-text">
            <div class="biography-intro">
              <p>
                {{ $t('homepage.biography_intro') }}
              </p>
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
                alt="Patrick Laumond"
                class="portrait-artwork"
              />
              <div class="portrait-overlay">
                <h4>{{ $t('homepage.hero_title') }}</h4>
                <p>{{ $t('homepage.portrait_caption') }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="section-link">
          <NuxtLink to="/biography" class="artistic-link">{{ $t('homepage.read_biography') }}</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Métahisme Section - Concept artistique -->
    <section id="metahisme" class="section metahisme-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">{{ $t('homepage.metahisme_title') }}</h2>
          <div class="section-divider"></div>
        </div>
        <div class="metahisme-content">
          <div class="metahisme-text">
            <div class="metahisme-definition">
              <p>
                {{ $t('homepage.metahisme_definition') }}
              </p>
            </div>
            <div class="metahisme-analysis">
              <p>
                {{ $t('homepage.metahisme_analysis') }}
              </p>
            </div>
          </div>
          <div class="metahisme-visual">
            <div class="artwork-showcase">
              <img
                src="https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/02.jpg"
                alt="Concordance Universelle"
                class="metahisme-artwork"
              />
              <div class="artwork-overlay">
                <h4>{{ $t('homepage.artwork_concordance_title') }}</h4>
                <p>{{ $t('homepage.metahisme_artwork_caption') }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="section-link">
          <NuxtLink to="/metahism" class="artistic-link">{{ $t('homepage.discover_metahisme') }}</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Oeuvres Section - Présentation artistique -->
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
            <div class="artwork-frame">
              <img :src="artwork.imageUrl" :alt="$t(artwork.titleKey)" />
            </div>
            <div class="artwork-info">
              <h3 class="artwork-title">{{ $t(artwork.titleKey) }}</h3>
              <div class="artwork-category">{{ $t(artwork.categoryKey) }}</div>
            </div>
          </div>
        </div>
        <div class="section-link">
          <NuxtLink to="/artworks" class="artistic-link">{{ $t('homepage.browse_artworks') }}</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Analyses Section - Texte et réflexion -->
    <section id="analyses" class="section analyses-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">{{ $t('homepage.analyses_title') }}</h2>
          <div class="section-divider"></div>
        </div>
        <div class="analyses-content">
          <div class="analysis-text">
            <div class="analysis-quote">
              <p>
                "{{ $t('homepage.analysis_quote') }}"
              </p>
              <span class="quote-author">— {{ $t('homepage.analysis_author') }}</span>
            </div>
            <div class="analysis-excerpt">
              <p>
                {{ $t('homepage.analysis_excerpt') }}
              </p>
            </div>
          </div>
          <div class="analysis-visual">
            <div class="text-block">
              <h3>{{ $t('homepage.artwork_le_portant_title') }}</h3>
              <p>{{ $t('homepage.artwork_le_portant_description') }}</p>
            </div>
            <div class="text-block">
              <h3>{{ $t('homepage.artwork_concordance_title') }}</h3>
              <p>{{ $t('homepage.artwork_concordance_description') }}</p>
            </div>
          </div>
        </div>
        <div class="section-link">
          <NuxtLink to="/analyses" class="artistic-link">{{ $t('homepage.read_analyses') }}</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const videoIframe = ref<HTMLIFrameElement | null>(null);

  // Interface pour les méthodes fullscreen cross-browser
  interface FullscreenElement extends HTMLIFrameElement {
    webkitRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
  }

  // Fonction pour ouvrir la vidéo en plein écran
  const openFullscreen = (): void => {
    if (videoIframe.value) {
      const element = videoIframe.value as FullscreenElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    }
  };

  // Données des œuvres en vedette
  const featuredArtworks = ref([
    {
      id: 1,
      titleKey: 'homepage.artwork_le_portant_title',
      categoryKey: 'homepage.category_deployment',
      imageUrl: 'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/10.jpg',
    },
    {
      id: 2,
      titleKey: 'homepage.artwork_concordance_title',
      categoryKey: 'homepage.category_deployment',
      imageUrl: 'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/02.jpg',
    },
    {
      id: 3,
      titleKey: 'homepage.artwork_comme_deux_aimants_title',
      categoryKey: 'homepage.category_deployment',
      imageUrl: 'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/06.jpg',
    },
  ]);
</script>

<style lang="scss" scoped>
  .homepage {
    min-height: 100vh;
    background: var(--color-background);
    color: var(--color-text);
    padding-top: var(--header-height);
  }

  // Sections générales
  .section {
    padding: 6rem 2rem;
    min-height: 100vh;
    display: flex;
    align-items: center;

    .section-container {
      max-width: var(--max-width-content);
      margin: 0 auto;
      width: 100%;
    }

    .section-header {
      text-align: center;
      margin-bottom: 5rem;

      .section-title {
        font-size: 2.5rem;
        font-weight: 300;
        margin-bottom: 1rem;
        color: #757b7d;
        letter-spacing: 0.15em;
        text-transform: uppercase;
      }

      .section-divider {
        width: 80px;
        height: 1px;
        background: #cc0000;
        margin: 0 auto;
      }
    }

    .section-link {
      text-align: center;
      margin-top: 4rem;
    }
  }

  // Hero Section - Métahisme : géométrie pure et contemplation
  .hero-section {
    background: var(--color-background);
    color: var(--color-text);
    display: flex;
    align-items: center;
    padding: 8rem 2rem 6rem;
    position: relative;

    .hero-content {
      max-width: var(--max-width-content);
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6rem;
      align-items: center;

      .hero-text {
        .hero-title {
          font-size: 3.5rem;
          font-weight: 200;
          margin-bottom: 2rem;
          color: #757b7d;
          letter-spacing: 0.05em;
          line-height: 1.1;
          text-transform: uppercase;
        }

        .hero-subtitle {
          margin-bottom: 3rem;
          border-left: 2px solid #cc0000;
          padding-left: 1.5rem;

          .subtitle-line {
            display: block;
            font-size: 1.1rem;
            color: var(--color-text-light);
            margin-bottom: 0.5rem;
            font-weight: 300;
            letter-spacing: 0.05em;
          }
        }

        .hero-description {
          p {
            font-size: 1rem;
            line-height: 1.8;
            color: var(--color-text-light);
            margin-bottom: 1rem;
            font-weight: 300;
          }
        }
      }

      .hero-visual {
        position: relative;
        height: 400px;

        .video-container {
          position: relative;
          width: 100%;
          height: 100%;
          cursor: pointer;
          border: 1px solid #757b7d;
          transition: border-color 0.3s ease;

          &:hover {
            border-color: #cc0000;
          }

          .video {
            width: 100%;
            height: 100%;
            border: none;
            overflow: hidden;
          }

          .video-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: rgba(117, 123, 125, 0.85);
            color: white;
            padding: 1rem;
            opacity: 0;
            transition: opacity 0.3s ease;

            .play-icon {
              font-size: 3rem;
              margin-bottom: 1rem;
              color: #cc0000;
            }

            .video-hint {
              font-size: 0.95rem;
              text-align: center;
              color: white;
              letter-spacing: 0.05em;
              text-transform: uppercase;
            }
          }

          &:hover {
            .video-overlay {
              opacity: 1;
            }
          }
        }
      }
    }
  }

  // Biography Section
  .biography-section {
    background: var(--color-background-alt);

    .biography-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;

      .biography-text {
        .biography-intro {
          margin-bottom: 3rem;

          p {
            font-size: 1.1rem;
            line-height: 1.8;
            color: var(--color-text-light);
          }
        }

        .biography-timeline {
          border-left: 2px solid #757b7d;
          padding-left: 2rem;
          position: relative;

          .timeline-item {
            display: flex;
            align-items: center;
            margin-bottom: 2rem;
            position: relative;

            &::before {
              content: '';
              position: absolute;
              left: -2.063rem;
              top: 0.4rem;
              width: 10px;
              height: 10px;
              background: #cc0000;
            }

            .year {
              font-size: 1.2rem;
              font-weight: 600;
              color: #757b7d;
              margin-right: 2rem;
              min-width: 60px;
            }

            .event {
              font-size: 0.9rem;
              color: var(--color-text-light);
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
          }
        }
      }

      .biography-visual {
        .portrait-showcase {
          position: relative;
          overflow: hidden;
          background: white;
          border: 1px solid #757b7d;
          transition: border-color 0.3s ease;

          &:hover {
            border-color: #cc0000;
          }

          .portrait-artwork {
            width: 100%;
            height: 400px;
            object-fit: cover;
            transition: transform 0.5s ease;
          }

          .portrait-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(117, 123, 125, 0.95));
            color: white;
            padding: 2rem;
            transform: translateY(100%);
            transition: transform 0.3s ease;

            h4 {
              font-size: 1.3rem;
              font-weight: 500;
              margin-bottom: 0.5rem;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }

            p {
              font-size: 0.9rem;
              opacity: 0.9;
              letter-spacing: 0.05em;
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
    background: white;

    .metahisme-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;

      .metahisme-text {
        .metahisme-definition {
          margin-bottom: 3rem;
          border-left: 2px solid #cc0000;
          padding-left: 2rem;

          p {
            font-size: 1.1rem;
            line-height: 1.8;
            color: var(--color-text-light);
          }
        }

        .metahisme-analysis {
          p {
            font-size: 1rem;
            line-height: 1.6;
            color: var(--color-text-light);
          }
        }
      }

      .metahisme-visual {
        .artwork-showcase {
          position: relative;
          overflow: hidden;
          background: white;
          border: 1px solid #757b7d;
          transition: border-color 0.3s ease;

          &:hover {
            border-color: #cc0000;
          }

          .metahisme-artwork {
            width: 100%;
            height: 400px;
            object-fit: cover;
            transition: transform 0.5s ease;
          }

          .artwork-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(117, 123, 125, 0.95));
            color: white;
            padding: 2rem;
            transform: translateY(100%);
            transition: transform 0.3s ease;

            h4 {
              font-size: 1.3rem;
              font-weight: 500;
              margin-bottom: 0.5rem;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }

            p {
              font-size: 0.9rem;
              opacity: 0.9;
              letter-spacing: 0.05em;
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

      .artwork-item {
        position: relative;

        .artwork-frame {
          background: white;
          padding: 0;
          border: 1px solid #757b7d;
          margin-bottom: 1.5rem;
          overflow: hidden;
          transition: border-color 0.3s ease;

          &:hover {
            border-color: #cc0000;
          }

          img {
            width: 100%;
            height: 300px;
            object-fit: cover;
            transition: transform 0.5s ease;

            &:hover {
              transform: scale(1.05);
            }
          }
        }

        .artwork-info {
          .artwork-title {
            font-size: 1.1rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
            color: #757b7d;
          }

          .artwork-category {
            font-size: 0.85rem;
            color: var(--color-text-light);
            text-transform: uppercase;
            letter-spacing: 0.15em;
          }
        }
      }
    }
  }

  // Analyses Section
  .analyses-section {
    background: white;

    .analyses-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;

      .analysis-text {
        .analysis-quote {
          margin-bottom: 3rem;
          border-left: 2px solid #cc0000;
          padding-left: 2rem;

          p {
            font-size: 1.3rem;
            line-height: 1.6;
            color: #757b7d;
            font-style: italic;
            margin-bottom: 1rem;
            font-weight: 300;
          }

          .quote-author {
            font-size: 0.9rem;
            color: var(--color-text-light);
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
        }

        .analysis-excerpt {
          p {
            font-size: 1rem;
            line-height: 1.8;
            color: var(--color-text-light);
          }
        }
      }

      .analysis-visual {
        .text-block {
          background: var(--color-background-alt);
          padding: 2rem;
          margin-bottom: 2rem;
          border-left: 2px solid #757b7d;
          transition: border-color 0.3s ease;

          &:hover {
            border-left-color: #cc0000;
          }

          h3 {
            font-size: 1.2rem;
            font-weight: 500;
            margin-bottom: 1rem;
            color: #757b7d;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          p {
            font-size: 0.9rem;
            line-height: 1.6;
            color: var(--color-text-light);
          }
        }
      }
    }
  }

  // Liens artistiques - Style navbar
  .artistic-link {
    display: inline-block;
    text-decoration: none;
    color: #757b7d;
    font-size: 0.95rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 1rem 2.5rem;
    border: 1px solid #757b7d;
    transition: all 0.3s ease;
    background: transparent;

    &:hover {
      background: transparent;
      color: #cc0000;
      border-color: #cc0000;
    }
  }

  // Animations
  @keyframes slideInLeft {
    from {
      transform: translateX(-50px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes fadeInUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
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
        text-align: center;
        gap: 2rem;

        .hero-text {
          .hero-title {
            font-size: 2.2rem;
            line-height: 1.2;
            margin-bottom: 1.5rem;
          }

          .hero-subtitle {
            border-left: none;
            border-top: 2px solid #cc0000;
            padding-left: 0;
            padding-top: 1rem;
            margin-bottom: 2rem;

            .subtitle-line {
              font-size: 1rem;
              margin-bottom: 0.3rem;
            }
          }

          .hero-description p {
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 0.8rem;
          }
        }
      }

      .hero-visual {
        height: 250px;

        .video {
          height: 100%;
        }
      }
    }

    .section {
      padding: 3rem 1rem;
      min-height: auto;

      .section-header {
        margin-bottom: 2rem;

        .section-title {
          font-size: 1.8rem;
          margin-bottom: 0.8rem;
        }

        .section-divider {
          width: 60px;
        }
      }

      .section-link {
        margin-top: 2rem;
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
            margin-bottom: 1rem;

            img {
              height: 250px;
              width: 100%;
              object-fit: cover;
            }
          }
        }
      }
    }

    .analyses-content,
    .metahisme-content,
    .biography-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .biography-timeline {
      border-left: 2px solid #757b7d;
      padding-left: 1.5rem;

      .timeline-item {
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 1.5rem;

        &::before {
          left: -2rem;
        }

        .year {
          margin-bottom: 0.5rem;
          margin-right: 0;
        }
      }
    }

    .artistic-link {
      padding: 0.9rem 2rem;
      font-size: 0.85rem;
    }
  }

  @media (max-width: 480px) {
    .hero-section {
      padding: 2rem 0.8rem 1.5rem;

      .hero-content .hero-text .hero-title {
        font-size: 1.8rem;
      }

      .hero-visual {
        height: 200px;
      }
    }

    .section {
      padding: 2rem 0.8rem;

      .section-header .section-title {
        font-size: 1.6rem;
      }
    }

    .artistic-link {
      padding: 0.8rem 1.5rem;
      font-size: 0.8rem;
    }
  }
</style>
