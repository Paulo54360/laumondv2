<template>
  <GalleryComponent
    :title="$t('gallery.categories.archetype')"
    :api-url="`${bucketUrl}/Archetypes`"
    :subfolders="['09', '08', '07', '06', '05', '04', '03', '02']"
    :file-ranges="[
      [1, 10],
      [1, 4],
      [1, 8],
      [1, 8],
      [1, 7],
      [1, 7],
      [1, 9],
      [1, 10],
    ]"
  />
</template>

<script setup>
  import { useRuntimeConfig } from '#app';
  import GalleryComponent from '~/components/gallery.vue';

  const config = useRuntimeConfig();
  // On force l'URL à être absolue et sans préfixe de langue
  let bucketUrl = config.public.apiUrl || '';
  if (
    typeof bucketUrl === 'string' &&
    (bucketUrl.startsWith('/fr/') || bucketUrl.startsWith('/en/'))
  ) {
    bucketUrl = bucketUrl.replace(/^\/(fr|en)\//, '/');
  }
  // Si bucketUrl est vide, afficher un avertissement en console
  if (!bucketUrl) {
    console.warn(
      'Attention : public.apiUrl est vide ou non défini. Vérifiez votre .env ou nuxt.config.ts'
    );
  }
</script>
