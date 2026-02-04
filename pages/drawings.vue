<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <GalleryComponent :title="$t('gallery.categories.drawing')" category-key="drawing" />
</template>

<script setup>
  import GalleryComponent from '~/components/gallery.vue';

  definePageMeta({ layout: 'default' });
</script>
