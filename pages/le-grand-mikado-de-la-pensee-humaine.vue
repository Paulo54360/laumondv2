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
  const presseDir = '../assets/images/common/presse';

  const presseMikado1 = new URL(
    `${presseDir}/AFFICHE-PATRICK LAUMOND-METHAMIKADO-byYMG122-2027.jpg`,
    import.meta.url
  ).href;
  const presseMikado2 = new URL(
    `${presseDir}/AFFICHE-PATRICK LAUMOND-METHAMIKADO-byYMG122-20272.jpg`,
    import.meta.url
  ).href;
  const presseMikado3 = new URL(
    `${presseDir}/AFFICHE-PATRICK LAUMOND-METHAMIKADO-byYMG122-20273.jpg`,
    import.meta.url
  ).href;
  const presseMikado4 = new URL(
    `${presseDir}/AFFICHE-PATRICK LAUMOND-METHAMIKADO-byYMG122-20274.jpg`,
    import.meta.url
  ).href;
  const presseVerre1 = new URL(
    `${presseDir}/AFFICHE-PATRICK LAUMOND-METHAVERRE-byYMG122-2027.jpg`,
    import.meta.url
  ).href;
  const presseVerre2 = new URL(
    `${presseDir}/AFFICHE-PATRICK LAUMOND-METHAVERRE-byYMG122-20272.jpg`,
    import.meta.url
  ).href;

  const pageTitle = computed(() => t('grandMikado.pageTitle'));

  const images = computed(() => [
    {
      src: presseMikado1,
      alt: pageTitle.value,
    },
    {
      src: presseMikado2,
      alt: pageTitle.value,
    },
    {
      src: presseMikado3,
      alt: pageTitle.value,
    },
    {
      src: presseMikado4,
      alt: pageTitle.value,
    },
    {
      src: presseVerre1,
      alt: pageTitle.value,
    },
    {
      src: presseVerre2,
      alt: pageTitle.value,
    },
  ]);

  useHead({
    title: pageTitle,
  });
</script>

<style
  lang="scss"
  src="~/assets/css/pages/le-grand-mikado-de-la-pensee-humaine.scss"
></style>
