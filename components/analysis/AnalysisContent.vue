<template>
  <div class="analysis-content">
    <div class="image-gallery">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="image-container"
        @click="openModal(index)"
      >
        <img :src="image" :alt="t('gallery.image_alt', { index: index + 1 })" />
      </div>
    </div>

    <div v-if="showModal" class="modal" @click="closeModal">
      <div class="modal-content">
        <img
          :src="images[currentImageIndex]"
          :alt="t('gallery.image_alt', { index: currentImageIndex + 1 })"
        />
        <button class="close-button" @click="closeModal">&times;</button>
        <button
          v-if="currentImageIndex > 0"
          class="nav-button prev"
          @click.stop="currentImageIndex--"
        >
          &lt;
        </button>
        <button
          v-if="currentImageIndex < images.length - 1"
          class="nav-button next"
          @click.stop="currentImageIndex++"
        >
          &gt;
        </button>
      </div>
    </div>

    <div class="content-section">
      <h2>{{ title }}</h2>
      <div class="translations">
        <div v-for="(translation, lang) in translations" :key="lang" class="translation">
          <h3>{{ t(`analyses.languages.${lang}`) }}</h3>
          <div v-html="translation"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  interface IProps {
    images: string[];
    title: string;
    translations: Record<string, string>;
  }

  defineProps<IProps>();

  const showModal = ref(false);
  const currentImageIndex = ref(0);

  const openModal = (index: number): void => {
    currentImageIndex.value = index;
    showModal.value = true;
  };

  const closeModal = (): void => {
    showModal.value = false;
  };
</script>

<style lang="scss" scoped>
  .analysis-content {
    padding: 2rem;
  }

  .image-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .image-container {
    aspect-ratio: 1;
    cursor: pointer;
    overflow: hidden;
    border-radius: 8px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    position: relative;
    max-width: 90%;
    max-height: 90vh;

    img {
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
    }
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
    background: rgba(255, 255, 255, 0.3);
    border: none;
    color: white;
    padding: 1rem;
    cursor: pointer;
    font-size: 1.5rem;
    border-radius: 50%;

    &.prev {
      left: -60px;
    }

    &.next {
      right: -60px;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }

  .content-section {
    h2 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
    }
  }

  .translations {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;

    .translation {
      h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        text-transform: uppercase;
      }
    }
  }
</style>
