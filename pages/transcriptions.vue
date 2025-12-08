<template>
  <GalleryComponent
    :title="$t('gallery.categories.transcriptions')"
    :api-url="`${bucketUrl}/Transcriptions`"
    :subfolders="[
      ...[
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
      ].reverse(),
    ]"
    :file-ranges="[
      ...[1, 9],
      [1, 9],
      [1, 9],
      [1, 9],
      [1, 9],
      [1, 8],
      [1, 9],
      [1, 9],
      [1, 9],
      [1, 9],
      [1, 9],
      [1, 9],
      [1, 9],
      [1, 8],
      [1, 9],
      [1, 4].reverse(),
    ]"
  />
</template>

<script setup>
  import { useRuntimeConfig } from '#app';

  import GalleryComponent from '~/components/gallery/GalleryWrapper.vue';

  const config = useRuntimeConfig();
  const bucketUrl = config.public.apiUrl; // Récupération de l'URL de base depuis nuxt.config.ts
</script>
