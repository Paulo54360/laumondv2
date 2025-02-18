<template>
  <GalleryComponent
      title="Deployments"
      :api-url="`${bucketUrl}/Deployments`"
      :subfolders="[...['00', '01', '02', '03', '04', '05']].reverse()"
      :fileRanges="[...[1,7],[1, 4], [1, 3], [1, 6], [1, 2], [1, 4],].reverse()"
  />
</template>

<script setup>
import GalleryComponent from '~/components/gallery.vue';
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const bucketUrl = config.public.apiUrl; // Récupération de l'URL de base depuis nuxt.config.ts
</script>