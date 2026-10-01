<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="grand-mikado-page">
    <section class="page-gallery" aria-label="Revue de presse en plein écran">
      <figure v-for="image in images" :key="image.src" class="gallery-figure">
        <img :src="image.src" :alt="image.alt" class="gallery-image" />
      </figure>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';

  definePageMeta({ layout: 'default' });

  const { t } = useI18n();
  const presseImages = import.meta.glob('../assets/images/common/presse/*.jpg', {
    eager: true,
    import: 'default',
  }) as Record<string, string>;

  const pageTitle = computed(() => t('grandMikado.pageTitle'));

  const images = computed(() =>
    Object.entries(presseImages)
      .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
      .map(([, src]) => ({
        src,
        alt: pageTitle.value,
      }))
  );

  useHead({
    title: pageTitle,
  });
</script>

<style
  lang="scss"
  src="~/assets/css/pages/le-grand-mikado-de-la-pensee-humaine.scss"
></style>
