<template>
  <div v-if="loading" class="gallery-loading">
    {{ $t('gallery.loading') }}
  </div>
  <GalleryContent v-else :title="title" />
</template>

<script setup lang="ts">
  import { ref, provide, computed, onMounted } from 'vue';

  import GalleryContent from './GalleryContent.vue';

  interface IProps {
    title: string;
    apiUrl: string;
    subfolders: string[];
    fileRanges: Array<[number, number]>;
  }

  const props = defineProps<IProps>();

  const imageUrls = ref<string[]>([]);
  const titles = ref<Record<string, string>>({});
  const currentImageIndex = ref<number | null>(null);
  const itemsPerPage = ref(10);
  const currentPage = ref(0);
  const loading = ref(true);

  const totalPages = computed(() => Math.ceil(imageUrls.value.length / itemsPerPage.value));

  const loadImages = async (): Promise<void> => {
    for (const [i, subfolder] of props.subfolders.entries()) {
      for (let j = props.fileRanges[i][0]; j <= props.fileRanges[i][1]; j++) {
        const num = j.toString().padStart(2, '0');
        const imageUrl = `${props.apiUrl}/${subfolder}/${num}.jpg`;
        const textUrl = `${props.apiUrl}/${subfolder}/${num}.txt`;
        try {
          const text = await (await fetch(textUrl)).text();
          imageUrls.value.push(imageUrl);
          titles.value[imageUrl] = text;
        } catch (error) {
          console.error(`Erreur lors du chargement : ${textUrl}`, error);
        }
      }
    }
    loading.value = false;
  };

  const openModal = (index: number): void => {
    currentImageIndex.value = index;
    // TODO: Implémenter modal si nécessaire
  };

  provide('imageUrls', imageUrls);
  provide('titles', titles);
  provide('openModal', openModal);
  provide('itemsPerPage', itemsPerPage);
  provide('currentPage', currentPage);
  provide('totalPages', totalPages);
  provide('currentImageIndex', currentImageIndex);

  onMounted(loadImages);
</script>

<style lang="scss" scoped>
  .gallery-loading {
    text-align: center;
    padding: var(--spacing-xl);
    color: var(--color-text);
  }
</style>

