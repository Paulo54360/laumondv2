<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <GalleryContent :title="title" />
    <GalleryArtworkModal
      v-if="selectedArtwork"
      :show="!!selectedArtwork"
      :artwork="selectedArtwork"
      :initial-index="initialIndex"
      :show-details="false"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, provide, ref, watch } from 'vue';

  import GalleryArtworkModal from '~/components/gallery/ArtworkModal.vue';
  import GalleryContent from '~/components/gallery/GalleryContent.vue';
  import { useS3 } from '~/composables/useS3';

  const props = defineProps<{
    title: string;
    apiUrl?: string;
    subfolders?: string[];
    fileRanges?: number[][];
    categoryKey?: string;
  }>();

  const imageUrls = ref<string[]>([]);
  const { getArtworks } = useS3();

  const buildStaticUrls = (): string[] => {
    const urls: string[] = [];
    const { apiUrl, subfolders, fileRanges } = props;

    if (!apiUrl || !Array.isArray(subfolders) || !Array.isArray(fileRanges)) {
      return urls;
    }

    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    subfolders.forEach((subfolder, index) => {
      const range = fileRanges[index];
      if (!range || range.length < 2) return;

      const [start, end] = range;
      for (let i = start; i <= end; i++) {
        const fileNum = i.toString().padStart(2, '0');
        urls.push(`${baseUrl}/${subfolder}/${fileNum}.jpg`);
      }
    });

    return urls;
  };

  const loadImages = async (): Promise<void> => {
    if (props.categoryKey) {
      try {
        const artworks = await getArtworks(props.categoryKey);
        if (artworks.length > 0) {
          imageUrls.value = artworks.flatMap((artwork) => artwork.images);
          return;
        }
      } catch (error) {
        console.error('Erreur lors du chargement des œuvres dynamiques', error);
      }
    }

    imageUrls.value = buildStaticUrls();
  };

  onMounted(loadImages);
  watch(
    () => props.categoryKey,
    () => {
      loadImages();
    }
  );

  provide('imageUrls', imageUrls);

  // Modal logic
  const selectedArtwork = ref<{ title: string; description: string; images: string[] } | null>(
    null
  );
  const initialIndex = ref(0);

  const openModal = (index: number): void => {
    initialIndex.value = index;
    selectedArtwork.value = {
      title: props.title,
      description: '',
      images: imageUrls.value,
    };
  };

  const closeModal = (): void => {
    selectedArtwork.value = null;
  };

  provide('openModal', openModal);
</script>
