<template>
  <div class="carousels-container">
    <div class="carousel-header-wrapper">
      <div class="carousel-header">
        <template
          v-if="
            link &&
            !link.startsWith('http') &&
            !link.endsWith('.jpg') &&
            !link.endsWith('.png') &&
            !link.endsWith('.jpeg') &&
            !link.endsWith('.webp')
          "
        >
          <NuxtLink :to="link" class="carousel-title-link">
            <h2 class="carousel-title">{{ title }}</h2>
          </NuxtLink>
        </template>
        <template v-else>
          <h2 class="carousel-title">{{ title }}</h2>
        </template>
        <div class="carousel-divider"></div>
      </div>
    </div>
    <div class="carousel-full-width">
      <div ref="carousel" class="carousel" @scroll="handleScroll">
        <div v-for="(image, index) in dynamicImages" :key="index" class="carousel-item">
          <img :src="image" class="carousel-image" :alt="`Image ${index + 1}`" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';

  // Définition des props
  const props = defineProps<{
    title: string;
    images: string[];
    link?: string;
  }>();

  const carousel = ref<HTMLElement | null>(null);
  const dynamicImages = ref<string[]>([...props.images, ...props.images]); // Initialiser avec des images dupliquées

  // Fonction pour ajouter dynamiquement des images à la fin
  const addMoreImages = (): void => {
    dynamicImages.value.push(...props.images);
  };

  // Fonction pour gérer le défilement infini fluide
  const handleScroll = (): void => {
    if (!carousel.value) return;

    const scrollLeft = carousel.value.scrollLeft;
    const totalWidth = carousel.value.scrollWidth;
    const visibleWidth = carousel.value.clientWidth;

    // Ajouter des images à la fin lorsque la fin est proche
    if (scrollLeft + visibleWidth >= totalWidth - 200) {
      addMoreImages();
    }
  };

  // Initialiser le carrousel après le montage pour éviter les retours brusques
  onMounted(() => {
    if (carousel.value) {
      carousel.value.scrollLeft = 0;
    }
  });
</script>

<style scoped>
  .carousels-container {
    display: flex;
    flex-direction: column;
    font-family:
      var(--font-family-base, 'Inter'),
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      sans-serif;
    width: 100%;
  }

  .carousel-header-wrapper {
    max-width: var(--max-width-content, 1200px);
    margin: 0 auto;
    padding: 0 clamp(1.5rem, 4vw, 2rem) 1cm;
    width: 100%;
  }

  .carousels-container > .carousel-header-wrapper:first-child {
    padding-top: 1rem;
  }

  .carousel-header {
    text-align: left;
    margin-bottom: 0;
  }

  .carousel-full-width {
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    margin-bottom: 0.25rem;
  }

  .carousel-title-link {
    text-decoration: none;
  }

  .carousel-title {
    font-size: clamp(1.1rem, 2vw, 1.4rem);
    font-weight: 400;
    margin-bottom: 0.3rem;
    color: var(--color-muted);
    letter-spacing: 0.22em;
    text-transform: uppercase;
    display: block;
    line-height: 1.2;
    text-align: left;
  }

  .carousel-divider {
    width: 110px;
    height: 3px;
    background: var(--color-primary-dark);
    margin: 0;
  }

  .carousel {
    display: flex;
    overflow-x: scroll;
    scroll-behavior: smooth;
    gap: 20px;
    width: 100%;
    padding: 0 clamp(1.5rem, 4vw, 2rem);
    white-space: nowrap;
    position: relative;
    box-sizing: border-box;
  }

  .carousel::-webkit-scrollbar {
    display: none; /* Masquer la barre de défilement */
  }

  .carousel-item {
    flex: 0 0 auto;
    width: 300px;
  }

  .carousel-image {
    width: 100%;
    height: 250px;
    object-fit: cover;
    transition: transform 0.3s ease-in-out;
  }

  .carousel-image:hover {
    transform: scale(1.05);
  }

  @media (max-width: 1024px) {
    .carousel-item {
      width: 400px;
    }
  }

  @media (max-width: 1400px) {
    .carousel-title {
      font-size: 1.25rem;
    }
  }

  @media (max-width: 1120px) {
    .carousel-title {
      font-size: 1.05rem;
    }
  }

  @media (max-width: 1024px) {
    .carousel-title {
      font-size: 1.05rem;
    }
  }

  @media (max-width: 980px) {
    .carousel-title {
      font-size: 0.95rem;
    }
  }

  @media (max-width: 768px) {
    .carousel-title {
      font-size: 1.3rem;
      margin-bottom: 0.6rem;
      letter-spacing: 0.12em;
    }

    .carousel-divider {
      width: 40px;
      height: 2px;
    }

    .carousel-header {
      margin-bottom: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .carousel-title {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      letter-spacing: 0.1em;
    }

    .carousel-divider {
      width: 35px;
      height: 2px;
    }
  }
</style>
