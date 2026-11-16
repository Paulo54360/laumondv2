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

  import { useI18n } from '#i18n';
  import CarouselSection from '~/components/carousel/CarouselSection.vue';

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

  // URLs des images servies via le proxy média sécurisé
  const imageUrlsArchetypes = ref([
    '/api/media/Archetypes/jusqu-au-boutisme.webp',
    '/api/media/Archetypes/outreconscience.webp',
    '/api/media/Archetypes/ubiquite-quantique.webp',
    '/api/media/Archetypes/la-convergence-du-dialogue.webp',
  ]);

  const imageUrlsDeployments = ref([
    '/api/media/Deployments/cairn-blanc-galerie-du-theatre-de-la.webp',
    '/api/media/Deployments/concordance-universelle-2022.webp',
    '/api/media/Deployments/le-mobile-d-ouverture-des-univers-pa.webp',
    '/api/media/Deployments/mutation-de-la-pensee-globale-et-la-.webp',
  ]);

  const imageUrlsDrawings = ref([
    '/api/media/Drawings/etude-preparatoire-de-la-genese-de-p.webp',
    '/api/media/Drawings/etude-preparatoire-de-la-genese-de-p-230.webp',
    '/api/media/Drawings/etude-preparatoire-de-la-genese-de-p-231.webp',
    '/api/media/Drawings/etude-preparatoire-de-la-genese-de-p-232.webp',
  ]);

  const imageUrlsTranscriptions = ref([
    '/api/media/Transcriptions/alea-du-mi-clos.webp',
    '/api/media/Transcriptions/au-dela-de-l-impact.webp',
    '/api/media/Transcriptions/avant-maintenant-apres-a-m-a.webp',
    '/api/media/Transcriptions/balance-des-blancs.webp',
    '/api/media/Transcriptions/chrysalide.webp',
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
