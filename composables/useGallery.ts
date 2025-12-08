import { computed, type Ref } from 'vue';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useGallery(
  imageUrls: Ref<string[]>,
  titles: Ref<Record<string, string>>,
  itemsPerPage: Ref<number>,
  currentPage: Ref<number>,
  currentImageIndex: Ref<number | null>
) {
  // Helper to safely get title
  const getTitle = (imageUrl: string | undefined): string => {
    if (!titles || !titles.value || !imageUrl) return '';
    const title = titles.value[imageUrl];
    return title ? String(title).trim() : '';
  };

  // Pagination Computeds
  const startIndex = computed(() => {
    const page = Number(currentPage.value) || 0;
    const perPage = Number(itemsPerPage.value) || 10;
    const result = page * perPage;
    return isNaN(result) ? 0 : result;
  });

  const endIndex = computed(() => {
    const length = Array.isArray(imageUrls.value) ? imageUrls.value.length : 0;
    const perPage = Number(itemsPerPage.value) || 10;
    const start = startIndex.value;
    const result = Math.min(start + perPage, length);
    return isNaN(result) ? 0 : result;
  });

  const totalItems = computed(() => {
    return Array.isArray(imageUrls.value) ? imageUrls.value.length : 0;
  });

  const displayedImages = computed(() => {
    if (!Array.isArray(imageUrls.value) || imageUrls.value.length === 0) return [];
    const start = startIndex.value;
    const end = endIndex.value;
    if (isNaN(start) || isNaN(end) || start < 0 || end < start) return [];
    const images = imageUrls.value.slice(start, end);
    return images.filter((img): img is string => Boolean(img));
  });

  // Modal Computeds
  const showModal = computed(() => {
    if (currentImageIndex.value === null || currentImageIndex.value < 0) return false;
    if (!imageUrls.value[currentImageIndex.value]) return false;
    return true;
  });

  const modalImageUrl = computed(() => {
    if (!showModal.value) return '';
    return imageUrls.value[currentImageIndex.value!];
  });

  // UI Helpers (safe numbers for display)
  const itemsPerPageValue = computed(() => Number(itemsPerPage.value) || 10);
  const currentPageValue = computed(() => Number(currentPage.value) || 0);

  const paginationStart = computed(() => {
    const start = Number(startIndex.value) + 1;
    return isNaN(start) || start < 1 ? 0 : Math.floor(start);
  });

  const paginationEnd = computed(() => {
    const end = Number(endIndex.value);
    return isNaN(end) || end < 0 ? 0 : Math.floor(end);
  });

  const paginationTotal = computed(() => {
    const total = Number(totalItems.value);
    return isNaN(total) || total < 0 ? 0 : Math.floor(total);
  });

  // Actions
  const previousPage = (): void => {
    if (currentPage.value > 0) {
      currentPage.value--;
    }
  };

  const nextPage = (): void => {
    if (endIndex.value < totalItems.value) {
      currentPage.value++;
    }
  };

  const closeModal = (): void => {
    currentImageIndex.value = null;
  };

  return {
    getTitle,
    startIndex,
    endIndex,
    totalItems,
    displayedImages,
    showModal,
    modalImageUrl,
    itemsPerPageValue,
    currentPageValue,
    paginationStart,
    paginationEnd,
    paginationTotal,
    previousPage,
    nextPage,
    closeModal,
  };
}
