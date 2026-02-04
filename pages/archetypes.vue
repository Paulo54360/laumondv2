<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <GalleryComponent :title="$t('gallery.categories.archetype')" category-key="archetype" />
</template>

<script setup>
  import GalleryComponent from '~/components/gallery.vue';

  definePageMeta({ layout: 'default' });
</script>
