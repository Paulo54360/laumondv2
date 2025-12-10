<template>
  <GalleryContent :title="title" />
</template>

<script setup lang="ts">
  import { computed, provide, toRef } from 'vue';

  import GalleryContent from '~/components/gallery/GalleryContent.vue';

  const props = defineProps<{
    title: string;
    apiUrl: string;
    subfolders: string[];
    fileRanges: number[][];
  }>();

  const imageUrls = computed(() => {
    const urls: string[] = [];
    const { apiUrl, subfolders, fileRanges } = props;

    // Ensure apiUrl does not end with a slash
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    subfolders.forEach((subfolder, index) => {
      const range = fileRanges[index];
      if (!range || range.length < 2) return;

      const [start, end] = range;
      for (let i = start; i <= end; i++) {
        // Pads with 0 to ensure 2 digits (e.g. 1 -> 01)
        const fileNum = i.toString().padStart(2, '0');
        urls.push(`${baseUrl}/${subfolder}/${fileNum}.jpg`);
      }
    });

    return urls;
  });

  provide('imageUrls', imageUrls);
</script>
