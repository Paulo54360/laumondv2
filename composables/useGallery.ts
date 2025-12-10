import { computed, ref, type Ref } from 'vue';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useGallery(
  imageUrls: Ref<string[]>,
  // titles: Ref<Record<string, string>>, // Removed as argument, we will manage it internally or expect it to be passed? 
  // Actually, to keep it simple and self-contained for the new feature, let's manage it here or allow injection.
  // But wait, the previous signature had `titles` as the 2nd arg. 
  // Let's keep the signature compatible but utilize the Ref passed in, OR create a new one if we want useGallery to own fetching.
  // The User Plan says "Add state titles". Let's assume we manage it here if not provided, or better, change signature to allow optional or remove it if not used by caller yet.
  // Looking at the codebase, `useGallery` seems to be used inside `GalleryContent`? 
  // No, `GalleryContent` currently does NOT use `useGallery`. `useGallery` seems to be an old or unused composable based on my grep earlier!
  // Wait, I saw `useGallery.ts` file content but `GalleryContent.vue` didn't import it in my previous `view_file` of `GalleryContent.vue` (Step 136).
  // `GalleryContent.vue` relies on `inject`.
  // `components/gallery/OeuvreGallery.vue` (Step 54) doesn't use it either.
  // Let's check `components/gallery.vue` (Step 92) -> It uses `provide`.
  // So `useGallery` might be a utility intended for this but not fully wired?
  // User Plan said: "Update logic... Update GalleryContent.vue".
  
  // Actually, `GalleryContent.vue` in Step 136 DOES NOT use `useGallery`. 
  // So I should implement the logic directly in `GalleryContent.vue` OR `useGallery.ts` and use it.
  // Since `GalleryContent.vue` is the one consuming the images, I'll update `GalleryContent.vue` to fetch titles.
  // But the plan says "Update useGallery.ts". I should probably update `useGallery` to be a useful composable and then USE it in `GalleryContent`.
  // However, `GalleryContent.vue` was fully rewritten in Step 136 WITHOUT `useGallery`.
  
  // Correct approach per Plan: Update `useGallery.ts` (maybe for other components) AND `GalleryContent.vue`.
  // I will update `useGallery.ts` to include the fetching logic so it CAN be used, but primarily I will put the logic in `GalleryContent.vue` if that's where the logic currently lives (it's manually doing pagination there now).
  
  // Re-reading Plan: "MODIFY useGallery.ts ... MODIFY GalleryContent.vue".
  // Okay, I will implement the logic in `useGallery.ts` and then I'll make `GalleryContent.vue` use it? 
  // Or just duplicate/put logic in `GalleryContent` since it's standalone now.
  // Given `GalleryContent` has local state for pagination now (post-redesign), adding fetching logic there makes sense.
  // But `useGallery` might be useful for the Modal or other views.
  
  // Let's stick to the plan: Update `useGallery.ts` anyway.
  itemsPerPage: Ref<number>,
  currentPage: Ref<number>,
  currentImageIndex: Ref<number | null>
) {
  const titles = ref<Record<string, string>>({});

  // Helper to safely get title
  const getTitle = (imageUrl: string | undefined): string => {
    if (!titles.value || !imageUrl) return '';
    const title = titles.value[imageUrl];
    return title ? String(title).trim() : '';
  };

  // Fetch titles for a list of images
  const fetchTitlesForImages = async (images: string[]) => {
    // console.log('Fetching titles for', images.length, 'images');
    await Promise.all(images.map(async (url) => {
        if (titles.value[url] || !url) return; // Already fetched
        
        try {
            // Replace extension with .txt
            const txtUrl = url.replace(/\.(jpg|jpeg|png|webp)$/i, '.txt');
            const response = await fetch(txtUrl);
            if (response.ok) {
                const text = await response.text();
                if (text && text.trim()) {
                    titles.value[url] = text.trim();
                } else {
                     titles.value[url] = ''; // Empty file
                }
            } else {
                // Determine fallback if 404
                // titles.value[url] = 'Untitled';
                titles.value[url] = ''; // Mark as visited
            }
        } catch (e) {
            console.error('Error fetching title for', url, e);
            titles.value[url] = '';
        }
    }));
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

  // UI Helpers
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
    titles,
    fetchTitlesForImages,
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
