<template>
  <GalleryComponent
      title="Drawings"
      :api-url="`${bucketUrl}/Drawings+`"
      :subfolders="['05','04', '03', '02', '01']"
      :fileRanges="[[1, 8], [1, 9], [1, 9], [1, 9], [1, 9]]"
  />
</template>

<script setup>
import GalleryComponent from '~/components/gallery.vue';
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const bucketUrl = config.public.apiUrl.trim(); // Récupération de l'URL de base depuis nuxt.config.ts
console.log(`${bucketUrl}/Drawings+/`);
</script>