<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="grand-mikado-page">
    <header class="page-overlay-header">
      <p class="page-eyebrow">{{ workTitle }}</p>
      <h1 class="page-title">{{ pageTitle }}</h1>
    </header>

    <section class="page-gallery" aria-label="Revue de presse en plein écran">
      <figure v-for="image in images" :key="image.src" class="gallery-figure">
        <img :src="image.src" :alt="image.alt" class="gallery-image" />
        <figcaption class="gallery-caption">{{ image.caption }}</figcaption>
      </figure>
    </section>

    <div class="back-link-row">
      <NuxtLink :to="analysesLink" class="back-link">
        {{ backToAnalyses }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';

  definePageMeta({ layout: 'default' });

  const runtimeConfig = useRuntimeConfig();
  const localePath = useLocalePath();
  const { t } = useI18n();

  const S3_BASE_URL = runtimeConfig.public.apiUrl;

  const pageTitle = computed(() => t('grandMikado.pageTitle'));
  const workTitle = computed(() => t('grandMikado.workTitle'));
  const backToAnalyses = computed(() => t('grandMikado.backToAnalyses'));

  const images = computed(() => [
    {
      src: `${S3_BASE_URL}/Archetypes/02/09.jpg`,
      alt: pageTitle.value,
      caption: workTitle.value,
    },
    {
      src: `${S3_BASE_URL}/Archetypes/02/10.jpg`,
      alt: pageTitle.value,
      caption: workTitle.value,
    },
  ]);

  const analysesLink = computed(() =>
    localePath({ path: '/analyses', query: { tab: 'advienne' } })
  );

  useHead({
    title: pageTitle,
  });
</script>

<style lang="scss" src="~/assets/css/pages/le-grand-mikado-de-la-pensee-humaine.scss"></style>
