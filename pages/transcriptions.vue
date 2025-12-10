<template>
  <GalleryComponent
    :title="$t('gallery.categories.transcriptions')"
    :api-url="`${bucketUrl}/Transcriptions`"
    :subfolders="subfolders"
    :file-ranges="fileRanges"
  />
</template>

<script setup>
  import { useRuntimeConfig } from '#app';
  import GalleryComponent from '~/components/gallery.vue';

  const config = useRuntimeConfig();
  const bucketUrl = config.public.apiUrl;

  // Données vérifiées sur S3 (Dossier: Nombre d'images)
  const folderData = [
    { folder: '01', count: 9 },
    { folder: '02', count: 9 },
    { folder: '03', count: 9 },
    { folder: '04', count: 9 },
    { folder: '05', count: 9 },
    { folder: '06', count: 8 },
    { folder: '07', count: 9 },
    { folder: '08', count: 9 },
    { folder: '09', count: 9 },
    { folder: '10', count: 9 },
    { folder: '11', count: 9 },
    { folder: '12', count: 9 },
    { folder: '13', count: 9 },
    { folder: '14', count: 8 },
    { folder: '15', count: 8 },
    { folder: '16', count: 9 },
    { folder: '17', count: 4 },
  ];

  // Le design demande un ordre inversé (du plus récent au plus ancien)
  const reversedData = [...folderData].reverse();

  const subfolders = reversedData.map((d) => d.folder);
  const fileRanges = reversedData.map((d) => [1, d.count]);
</script>
