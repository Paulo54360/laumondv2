<template>
  <div class="carousels-container">
    <CarouselSection
      :title="$t('gallery.categories.deploiement')"
      :images="imageUrlsDeployments"
      :link="deploymentsLink"
    />
    <CarouselSection
      :title="$t('gallery.categories.archetype')"
      :images="imageUrlsArchetypes"
      :link="archetypesLink"
    />
    <CarouselSection
      :title="$t('gallery.categories.transcriptions')"
      :images="imageUrlsTranscriptions"
      :link="transcriptionsLink"
    />
    <CarouselSection
      :title="$t('gallery.categories.drawing')"
      :images="imageUrlsDrawings"
      :link="drawingsLink"
    />
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';

  import CarouselSection from './carousel/CarouselSection.vue';

  import { useI18n } from '#i18n';

  const route = useRoute();
  const { locale } = useI18n();

  // Obtenir la locale actuelle depuis la route (priorité) ou i18n
  // La computed property se met à jour automatiquement quand route.path change
  const currentLocale = computed(() => {
    // Extraire la locale de l'URL (ex: /fr/artworks -> fr)
    const localeFromPath = route.path?.match(/^\/(fr|en)/)?.[1];
    // Utiliser la locale de l'URL si disponible, sinon celle de i18n, sinon 'fr' par défaut
    return localeFromPath || locale.value || 'fr';
  });

  // Générer les liens de manière réactive avec la locale actuelle
  // Ces computed properties dépendent de currentLocale qui dépend de route.path
  // donc elles se mettront à jour automatiquement quand la route change
  const archetypesLink = computed(() => `/${currentLocale.value}/archetypes`);
  const deploymentsLink = computed(() => `/${currentLocale.value}/deployments`);
  const drawingsLink = computed(() => `/${currentLocale.value}/drawings`);
  const transcriptionsLink = computed(() => `/${currentLocale.value}/transcriptions`);

  // URLs des images - Modifiez directement ces tableaux avec vos liens
  const imageUrlsArchetypes = ref([
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/04/07.jpg',
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/03/01.jpg',
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/09/05.jpg',
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/03/02.jpg',
  ]);

  const imageUrlsDeployments = ref([
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/05/01.jpg',
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/01/03.jpg',
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/02/01.jpg',
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/03.jpg',
  ]);

  const imageUrlsDrawings = ref([
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings+/01/01.jpg',
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings+/01/02.jpg',
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings+/01/03.jpg',
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings+/01/04.jpg',
  ]);

  const imageUrlsTranscriptions = ref([
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/02/01.jpg',
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/02/02.jpg',
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/02/03.jpg',
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/02/04.jpg',
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/02/05.jpg',
  ]);
</script>

<style scoped>
  .carousels-container {
    display: flex;
    flex-direction: column;
    gap: 0;
    font-family: var(
      --font-family-base,
      'Inter',
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      sans-serif
    );
    width: calc(100% - 1cm);
    max-width: calc(100% - 1cm);
    margin: 0 0.5cm;
    overflow-x: hidden;
    box-sizing: border-box;
  }
</style>
