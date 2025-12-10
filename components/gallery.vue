<template>
  <div>
    <GalleryContent :title="title" />

    <div v-if="showModal" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="closeModal">&times;</button>
        <img :src="imageUrls[currentImageIndex]" :alt="`Image ${currentImageIndex + 1}`" />
        
        <button
          v-if="currentImageIndex > 0"
          class="nav-button prev"
          @click.stop="prevImage"
        >
          &lt;
        </button>
        <button
          v-if="currentImageIndex < imageUrls.length - 1"
          class="nav-button next"
          @click.stop="nextImage"
        >
          &gt;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, provide, ref } from 'vue';

  import GalleryContent from '~/components/gallery/GalleryContent.vue';

  const props = defineProps<{
    title: string;
    apiUrl: string;
    subfolders: string[];
    fileRanges: number[][];
  }>();

  // State
  const currentPage = ref(1);
  const itemsPerPage = 12;
  const showModal = ref(false);
  const currentImageIndex = ref(0);

  const imageUrls = computed(() => {
    const urls: string[] = [];
    const { apiUrl, subfolders, fileRanges } = props;

    // Ensure apiUrl does not end with a slash
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    subfolders.forEach((subfolder, index) => {
      const range = fileRanges[index];
      if (!range || range.length < 2) return;

      const [start, end] = range;
      for (let i = start; i <= end; i++) {
        // Pads with 0 to ensure 2 digits (e.g. 1 -> 01)
        const fileNum = i.toString().padStart(2, '0');
        urls.push(`${baseUrl}/${subfolder}/${fileNum}.jpg`);
      }
    });

    return urls;
  });

  const totalPages = computed(() => Math.ceil(imageUrls.value.length / itemsPerPage));

  // Modal actions
  const openModal = (index: number) => {
    currentImageIndex.value = index;
    showModal.value = true;
  };

  const closeModal = () => {
    showModal.value = false;
  };

  const nextImage = () => {
    if (currentImageIndex.value < imageUrls.value.length - 1) {
      currentImageIndex.value++;
    }
  };

  const prevImage = () => {
    if (currentImageIndex.value > 0) {
      currentImageIndex.value--;
    }
  };

  // Provide state to children
  provide('imageUrls', imageUrls);
  provide('itemsPerPage', itemsPerPage);
  provide('currentPage', currentPage);
  provide('totalPages', totalPages);
  provide('openModal', openModal);
</script>

<style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    position: relative;
    max-width: 90%;
    max-height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content img {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
  }

  .close-button {
    position: absolute;
    top: -40px;
    right: 0;
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
  }

  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s;
  }

  .nav-button:hover {
    background: rgba(255, 255, 255, 0.4);
  }

  .nav-button.prev {
    left: -70px; /* Position outside the image */
  }

  .nav-button.next {
    right: -70px; /* Position outside the image */
  }
  
  @media (max-width: 768px) {
    .nav-button.prev {
        left: 10px;
    }
    .nav-button.next {
        right: 10px;
    }
  }
</style>
