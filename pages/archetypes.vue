<template>
  <GalleryComponent
    title="Archetypes"
    :api-url="`${bucketUrl}/Archetypes`"
    :subfolders="['09', '08', '07', '06', '05', '04', '03', '02']"
    :file-ranges="[
      [1, 10],
      [1, 4],
      [1, 8],
      [1, 8],
      [1, 7],
      [1, 7],
      [1, 9],
      [1, 10],
    ]"
  />
</template>

<script setup>
  import { useRuntimeConfig } from '#app';
  import GalleryComponent from '~/components/gallery.vue';

  const config = useRuntimeConfig();
  const bucketUrl = config.public.apiUrl; // Récupération de l'URL de base depuis nuxt.config.ts
</script>
