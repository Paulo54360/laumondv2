<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="grand-mikado-page">
    <header class="page-header">
      <p class="page-eyebrow">{{ workTitle }}</p>
      <h1 class="page-title">{{ pageTitle }}</h1>
      <div class="page-title-divider"></div>
      <p class="page-summary">{{ summary }}</p>
      <div class="page-meta">
        <span>{{ authorName }}</span>
        <span>{{ authorRole }}</span>
        <span>{{ publicationDate }}</span>
      </div>
    </header>

    <section class="page-gallery" aria-label="Illustrations de l'analyse">
      <figure v-for="image in images" :key="image.src" class="gallery-figure">
        <img :src="image.src" :alt="image.alt" class="gallery-image" />
        <figcaption class="gallery-caption">{{ image.caption }}</figcaption>
      </figure>
    </section>

    <section class="page-content">
      <p v-for="(paragraph, index) in paragraphs" :key="index" :class="paragraph.class">
        <template v-if="paragraph.type === 'citation'">
          <em>{{ paragraph.text }}</em>
        </template>
        <template v-else-if="paragraph.type === 'poetic'">
          <span>{{ paragraph.text }}</span>
        </template>
        <template v-else>
          {{ paragraph.text }}
        </template>
      </p>

      <div class="signature-block">
        <p class="signature-name">{{ authorName }}</p>
        <p class="signature-title">{{ authorRole }}</p>
        <p class="signature-date">{{ publicationDate }}</p>
      </div>

      <div class="footnotes">
        <p v-for="footnote in footnotes" :key="footnote.number" class="footnote">
          <sup>{{ footnote.number }}</sup> {{ footnote.text }}
        </p>
      </div>

      <div class="back-link-row">
        <NuxtLink :to="analysesLink" class="back-link">
          {{ backToAnalyses }}
        </NuxtLink>
      </div>
    </section>
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
  const summary = computed(() => t('grandMikado.summary'));
  const backToAnalyses = computed(() => t('grandMikado.backToAnalyses'));

  const authorName = computed(() => t('AQJA.Texte32AQJA'));
  const authorRole = computed(() => t('AQJA.Texte33AQJA'));
  const publicationDate = computed(() => t('AQJA.Texte34AQJA'));

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

  const paragraphs = computed(() => [
    { text: t('AQJA.Texte13AQJA'), type: 'normal' },
    { text: t('AQJA.Texte14AQJA'), type: 'normal' },
    { text: t('AQJA.Texte15AQJA'), type: 'normal' },
    { text: t('AQJA.Texte16AQJA'), type: 'normal' },
    { text: t('AQJA.Texte17AQJA'), type: 'normal' },
    { text: t('AQJA.Texte18AQJA'), type: 'normal' },
    { text: t('AQJA.Texte19AQJA'), type: 'poetic' },
    { text: t('AQJA.Texte20AQJA'), type: 'poetic' },
    { text: t('AQJA.Texte21AQJA'), type: 'poetic' },
    { text: t('AQJA.Texte22AQJA'), type: 'poetic' },
    { text: t('AQJA.Texte23AQJA'), type: 'poetic' },
    { text: t('AQJA.Texte24AQJA'), type: 'poetic' },
    { text: t('AQJA.Texte25AQJA'), type: 'poetic' },
    { text: t('AQJA.Texte26AQJA'), type: 'poetic' },
    { text: t('AQJA.Texte27AQJA'), type: 'normal' },
    { text: t('AQJA.Texte28AQJA'), type: 'citation' },
    { text: t('AQJA.Texte29AQJA'), type: 'citation' },
    { text: t('AQJA.Texte30AQJA'), type: 'citation' },
    { text: t('AQJA.Texte31AQJA'), type: 'normal' },
  ]);

  const footnotes = computed(() => [
    { number: '¹', text: t('AQJA.Legende1AQJA') },
    { number: '²', text: t('AQJA.Legende2AQJA') },
  ]);

  const analysesLink = computed(() =>
    localePath({ path: '/analyses', query: { tab: 'advienne' } })
  );

  useHead({
    title: pageTitle,
  });
</script>

<style lang="scss" src="~/assets/css/pages/le-grand-mikado-de-la-pensee-humaine.scss"></style>