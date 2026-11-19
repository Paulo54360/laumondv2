<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="grand-mikado-page">
    <section class="page-gallery" aria-label="Affiche en plein écran">
      <figure class="gallery-figure">
        <picture class="gallery-picture">
          <img
            :src="posterSrc"
            :alt="pageTitle"
            class="gallery-image gallery-image--mobile-rotated"
          />
        </picture>
      </figure>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { useImageProxy } from '~/composables/useImageProxy';

  definePageMeta({ layout: 'default' });

  const { t } = useI18n();
  const proxify = useImageProxy();

  // Affiche "affiche mikado" du dossier S3 "autres"
  const posterSrc = proxify('autres/affiche-mikado.webp');

  const pageTitle = computed(() => t('grandMikado.pageTitle'));

  useHead({
    title: pageTitle,
  });
</script>

<style lang="scss" src="~/assets/css/pages/le-grand-mikado-de-la-pensee-humaine.scss"></style>
