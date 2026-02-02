<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <GalleryComponent
    :title="$t('gallery.categories.drawing')"
    :api-url="`${bucketUrl}/Drawings+`"
    :subfolders="['05', '04', '03', '02', '01']"
    :file-ranges="[
      [1, 8],
      [1, 9],
      [1, 9],
      [1, 9],
      [1, 9],
    ]"
  />
</template>

<script setup>
  import GalleryComponent from '~/components/gallery.vue';

  const config = useRuntimeConfig();
  const bucketUrl = config.public.apiUrl.trim();
</script>
