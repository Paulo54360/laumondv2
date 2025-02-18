<template>
  <GalleryComponent
      title="Transcriptions"
      :api-url="`${bucketUrl}/Transcriptions`"
      :subfolders="[...['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15','16','17'].reverse()]"
      :fileRanges="[...[1, 9], [1, 9], [1, 9], [1, 9], [1, 9], [1,8],[1,9],[1,9],[1,9],[1,9],[1,9],[1,9],[1,9],[1,8],[1,9],[1,4].reverse()]"
  />
</template>

<script setup>
import GalleryComponent from '~/components/gallery.vue';
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const bucketUrl = config.public.apiUrl; // Récupération de l'URL de base depuis nuxt.config.ts
</script>