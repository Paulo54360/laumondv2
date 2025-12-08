<template>
  <GalleryComponent
    :title="$t('gallery.categories.deploiement')"
    :api-url="`${bucketUrl}/Deployments`"
    :subfolders="[...['00', '01', '02', '03', '04', '05']].reverse()"
    :file-ranges="[...[1, 7], [1, 4], [1, 3], [1, 6], [1, 2], [1, 4]].reverse()"
  />
</template>

<script setup>
  import { useRuntimeConfig } from '#app';

  import GalleryComponent from '~/components/gallery/GalleryWrapper.vue';

  const config = useRuntimeConfig();
  const bucketUrl = config.public.apiUrl; // Récupération de l'URL de base depuis nuxt.config.ts
</script>
