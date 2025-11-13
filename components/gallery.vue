<template>
  <div class="gallery-container">
    <h1>{{ title || $t('gallery.default_title') }}</h1>

    <div class="pagination-controls">
      <label for="itemsPerPage">{{ $t('gallery.items_per_page') }}</label>
      <select id="itemsPerPage" v-model="itemsPerPage" @change="currentPage = 0">
        <option v-for="option in [5, 10, 15, 20, 25]" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <span>{{
        $t('gallery.range', { start: startIndex + 1, end: endIndex, total: totalItems })
      }}</span>
      <button :disabled="currentPage === 0" @click="prevPage">
        &#8592; {{ $t('common.previous') }}
      </button>
      <button :disabled="endIndex >= totalItems" @click="nextPage">
        {{ $t('common.next') }} &#8594;
      </button>
    </div>

    <div class="image-gallery">
      <div
        v-for="(url, index) in paginatedImages"
        :key="url"
        class="image-item"
        @click="openModal(index)"
      >
        <img :src="url" :alt="titles[url]" />
        <h2>{{ titles[url] }}</h2>
      </div>
    </div>

    <div v-if="currentImageIndex !== null" class="modal" @click="closeModal">
      <img
        :src="imageUrls[currentImageIndex]"
        :alt="titles[imageUrls[currentImageIndex]]"
        class="modal-image"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';

  const props = defineProps({
    title: String,
    apiUrl: String,
    subfolders: Array,
    fileRanges: Array,
  });

  const imageUrls = ref([]);
  const titles = ref({});
  const currentImageIndex = ref(null);
  const itemsPerPage = ref(10);
  const currentPage = ref(0);

  const startIndex = computed(() => currentPage.value * itemsPerPage.value);
  const endIndex = computed(() =>
    Math.min(startIndex.value + itemsPerPage.value, imageUrls.value.length)
  );
  const totalItems = computed(() => imageUrls.value.length);

  const paginatedImages = computed(() => imageUrls.value.slice(startIndex.value, endIndex.value));

  const loadImages = async () => {
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
  };

  const prevPage = () => {
    if (currentPage.value > 0) currentPage.value--;
  };

  const nextPage = () => {
    if (endIndex.value < totalItems.value) currentPage.value++;
  };

  const openModal = (index) => {
    currentImageIndex.value = index + startIndex.value;
  };

  const closeModal = () => {
    currentImageIndex.value = null;
  };

  onMounted(loadImages);
</script>

<style scoped>
  .gallery-container {
    padding: 20px;
    text-align: center;
  }

  .pagination-controls {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }

  .pagination-controls select,
  .pagination-controls button {
    padding: 8px 15px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
    cursor: pointer;
    background-color: #f8f8f8;
  }

  .pagination-controls button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .image-gallery {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    align-items: center; /* Centre les images verticalement */
  }

  .image-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
  }

  .image-item img {
    width: 100%;
    height: 300px; /* Hauteur uniforme pour toutes les images */
    object-fit: contain; /* Assure que l'image est entièrement visible sans rognage */
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.117);
    transition: transform 0.3s ease-in-out;
    background-color: #f5f5f5; /* Ajoute un fond pour éviter l'effet de vide autour des images plus petites */
  }

  .image-item img:hover {
    transform: scale(1.05);
  }

  .image-item h2 {
    margin-top: 10px;
    font-size: 16px;
    color: #333;
    font-weight: bold;
    text-align: center;
  }
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-image {
    max-width: 90%;
    max-height: 90%;
    border-radius: 5px;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .image-gallery {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      padding: 1rem;
    }

    .image-item img {
      height: 250px;
    }

    .image-item h2 {
      font-size: 14px;
      margin-top: 8px;
    }
  }

  @media (max-width: 480px) {
    .image-gallery {
      grid-template-columns: 1fr;
      gap: 1rem;
      padding: 0.8rem;
    }

    .image-item img {
      height: 280px;
    }

    .image-item h2 {
      font-size: 13px;
      margin-top: 6px;
    }

    .modal-image {
      max-width: 95%;
      max-height: 85%;
    }
  }
</style>
