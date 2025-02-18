<template>
  <div class="carousels-container">
    <CarouselSection title="Archetypes" :images="imageUrlsArchetypes" link="/archetypes" />
    <CarouselSection title="Deployments" :images="imageUrlsDeployments" link="/deployments" />
    <CarouselSection title="Drawings" :images="imageUrlsDrawings" link="/drawings" />
    <CarouselSection title="Transcriptions" :images="imageUrlsTranscriptions" link="/transcriptions" />
  </div>
</template>

<script setup>
import CarouselSection from './carousselSection.vue';
import { ref } from 'vue';
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const bucketUrl = config.public.apiUrl;

const imageUrlsArchetypes = ref([]);
const imageUrlsDeployments = ref([]);
const imageUrlsDrawings = ref([]);
const imageUrlsTranscriptions = ref([]);
const image = ref('');

// Chargement des images
for (let i = 1; i <= 6; i++) {
  const num = i.toString().padStart(2, '0');
  imageUrlsArchetypes.value.push(`${bucketUrl}/Archetypes/09/${num}.jpg`);
  imageUrlsArchetypes.value.push(`${bucketUrl}/Archetypes/03/${num}.jpg`);
  imageUrlsDeployments.value.push(`${bucketUrl}/Deployments/03/${num}.jpg`);
  imageUrlsDrawings.value.push(`${bucketUrl}/Drawings+/01/${num}.jpg`);
  imageUrlsTranscriptions.value.push(`${bucketUrl}/Transcriptions/02/${num}.jpg`);
}

// Assigner une image par défaut
image.value = imageUrlsArchetypes.value.length > 0 ? imageUrlsArchetypes.value[0] : '';
</script>

<style scoped>
.carousels-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
</style>
