<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="gallery-page">
    <div class="category-tabs">
      <button
        v-for="category in categories"
        :key="category.id"
        :class="{ active: currentCategory === category.id }"
        @click="currentCategory = category.id"
      >
        {{ $t(`gallery.categories.${category.id}`) }}
      </button>
    </div>

    <GalleryArtworkGrid :category="currentCategory" @select="selectArtwork" />

    <GalleryArtworkModal
      v-if="selectedArtwork"
      :show="!!selectedArtwork"
      :artwork="selectedArtwork"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
  import GalleryArtworkGrid from '~/components/gallery/ArtworkGrid.vue';
  import GalleryArtworkModal from '~/components/gallery/ArtworkModal.vue';

  definePageMeta({
    layout: 'default',
  });

  const categories = [
    { id: 'transcriptions', label: 'Transcriptions' },
    { id: 'archetype', label: 'Archétypes' },
    { id: 'deploiement', label: 'Déploiements' },
    { id: 'drawing', label: 'Dessins+' },
  ];

  const currentCategory = ref(categories[0].id);
  const selectedArtwork = ref<{ title: string; description: string; images: string[] } | null>(
    null
  );

  const selectArtwork = (artwork: {
    title: string;
    description: string;
    images: string[];
  }): void => {
    console.log('GaleriePage: selectArtwork received', artwork);
    selectedArtwork.value = artwork;
    console.log('GaleriePage: selectedArtwork updated', selectedArtwork.value);
  };

  const closeModal = (): void => {
    selectedArtwork.value = null;
  };
</script>

<style lang="scss" scoped>
  .gallery-page {
    padding-top: 0;
    min-height: 100vh;
  }

  .category-tabs {
    position: sticky;
    top: 0;
    background: var(--color-background);
    padding: 1rem 2rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
    border-bottom: 1px solid var(--color-border);
    z-index: 100;
    flex-wrap: wrap;

    button {
      background: none;
      border: none;
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: 1.1rem;
      color: var(--color-text);
      cursor: pointer;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--color-primary);
        transform: scaleX(0);
        transition: transform var(--transition-fast);
      }

      &.active {
        color: var(--color-primary);

        &::after {
          transform: scaleX(1);
        }
      }

      &:hover {
        color: var(--color-primary);
      }
    }
  }

  @media (max-width: 768px) {
    .gallery-page {
      padding-top: 0;
    }

    .category-tabs {
      top: 0;
      padding: 0.8rem 1rem;
      gap: 0.5rem;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      -ms-overflow-style: none;

      &::-webkit-scrollbar {
        display: none;
      }

      button {
        font-size: 0.9rem;
        padding: 0.5rem 0.8rem;
        white-space: nowrap;
        flex-shrink: 0;
      }
    }
  }

  @media (max-width: 480px) {
    .category-tabs {
      padding: 0.6rem 0.8rem;
      gap: 0.4rem;
      justify-content: flex-start;

      button {
        font-size: 0.85rem;
        padding: 0.4rem 0.7rem;
      }
    }
  }
</style>
