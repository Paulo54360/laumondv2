<template>
  <div class="carousels-container">
    <CarouselSection
      :title="$t('gallery.categories.archetype')"
      :images="imageUrlsArchetypes"
      :link="archetypesLink"
    />
    <CarouselSection
      :title="$t('gallery.categories.deploiement')"
      :images="imageUrlsDeployments"
      :link="deploymentsLink"
    />
    <CarouselSection
      :title="$t('gallery.categories.drawing')"
      :images="imageUrlsDrawings"
      :link="drawingsLink"
    />
    <CarouselSection
      :title="$t('gallery.categories.transcriptions')"
      :images="imageUrlsTranscriptions"
      :link="transcriptionsLink"
    />
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';

  import CarouselSection from './carousselSection.vue';

  import { useRuntimeConfig } from '#app';
  import { useI18n } from '#i18n';

  const config = useRuntimeConfig();
  const route = useRoute();
  const { locale } = useI18n();
  const bucketUrl = config.public.apiUrl;

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

  const imageUrlsArchetypes = ref([]);
  const imageUrlsDeployments = ref([]);
  const imageUrlsDrawings = ref([]);
  const imageUrlsTranscriptions = ref([]);
  const image = ref('');

  // Chargement des images
  for (let i = 1; i <= 6; i++) {
    const num = i.toString().padStart(2, '0');
    imageUrlsArchetypes.value.push(`${bucketUrl}/Archetypes/09/${num}.jpg`);
    imageUrlsArchetypes.value.push(`${bucketUrl}/Archetypes/03/${num}.jpg`);
    imageUrlsDeployments.value.push(`${bucketUrl}/Deployments/03/${num}.jpg`);
    imageUrlsDrawings.value.push(`${bucketUrl}/Drawings+/01/${num}.jpg`);
    imageUrlsTranscriptions.value.push(`${bucketUrl}/Transcriptions/02/${num}.jpg`);
  }

  // Assigner une image par défaut
  image.value = imageUrlsArchetypes.value.length > 0 ? imageUrlsArchetypes.value[0] : '';
</script>

<style scoped>
  .carousels-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }
</style>
