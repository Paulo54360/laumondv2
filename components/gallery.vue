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
  import { computed, provide, ref } from 'vue';

  import GalleryArtworkModal from '~/components/gallery/ArtworkModal.vue';
  import GalleryContent from '~/components/gallery/GalleryContent.vue';

  const props = defineProps<{
    title: string;
    apiUrl: string;
    subfolders: string[];
    fileRanges: number[][];
  }>();

  const imageUrls = computed(() => {
    const urls: string[] = [];
    const { apiUrl, subfolders, fileRanges } = props;

    // Ensure apiUrl does not end with a slash
    const baseUrl = apiUrl?.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    if (Array.isArray(subfolders) && Array.isArray(fileRanges)) {
      subfolders.forEach((subfolder, index) => {
        const range = fileRanges[index];
        if (!range || !Array.isArray(range) || range.length < 2) return;

        const [start, end] = range;
        for (let i = start; i <= end; i++) {
          // Pads with 0 to ensure 2 digits (e.g. 1 -> 01)
          const fileNum = i.toString().padStart(2, '0');
          urls.push(`${baseUrl}/${subfolder}/${fileNum}.jpg`);
        }
      });
    }

    return urls;
  });

  provide('imageUrls', imageUrls);

  // Modal logic
  const selectedArtwork = ref<{ title: string; description: string; images: string[] } | null>(
    null
  );
  const initialIndex = ref(0);

  const openModal = (index: number): void => {
    initialIndex.value = index;
    // For gallery pages (deployments, etc.), the modal should show all images
    // allowing the user to navigate through them.
    selectedArtwork.value = {
      title: props.title,
      description: '', // Description is optional/empty for these galleries
      images: imageUrls.value,
    };
  };

  const closeModal = (): void => {
    selectedArtwork.value = null;
  };

  provide('openModal', openModal);
</script>
