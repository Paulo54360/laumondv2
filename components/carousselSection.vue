<template>
  <div class="carousels-container">
    <div class="carousel-wrapper">
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
        <NuxtLink :to="link">
          <h2>{{ title }}</h2>
          <div ref="carousel" class="carousel" @scroll="handleScroll">
            <div v-for="(image, index) in dynamicImages" :key="index" class="carousel-item">
              <img :src="image" class="carousel-image" :alt="`Image ${index + 1}`" />
            </div>
          </div>
        </NuxtLink>
      </template>
      <template v-else>
        <h2>{{ title }}</h2>
        <div ref="carousel" class="carousel" @scroll="handleScroll">
          <div v-for="(image, index) in dynamicImages" :key="index" class="carousel-item">
            <img :src="image" class="carousel-image" :alt="`Image ${index + 1}`" />
          </div>
        </div>
      </template>
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
  }

  .carousel-wrapper {
    position: relative;
    width: 100%;
  }

  .carousel-wrapper a {
    text-decoration: none;
  }

  .carousel-wrapper h2 {
    text-align: center;
    color: #525252;
    font-size: 1.8em;
    font-weight: bold;
  }

  .carousel {
    display: flex;
    overflow-x: scroll;
    scroll-behavior: smooth;
    gap: 20px;
    width: 100vw;
    white-space: nowrap;
    position: relative;
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
</style>
