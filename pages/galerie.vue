<template>
  <div class="gallery-page">
    <div class="category-tabs">
      <button
        v-for="category in categories"
        :key="category.id"
        :class="{ active: currentCategory === category.id }"
        @click="currentCategory = category.id"
      >
        {{ t(`gallery.categories.${category.id}`) }}
      </button>
    </div>

    <ArtworkGrid :category="currentCategory" @select="selectArtwork" />

    <ArtworkModal
      v-if="selectedArtwork"
      :show="!!selectedArtwork"
      :artwork="selectedArtwork"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: 'default',
  });

  const { t } = useI18n();

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
    selectedArtwork.value = artwork;
  };

  const closeModal = (): void => {
    selectedArtwork.value = null;
  };
</script>

<style lang="scss" scoped>
  .gallery-page {
    padding-top: var(--header-height);
  }

  .category-tabs {
    position: sticky;
    top: var(--header-height);
    background: var(--color-background);
    padding: var(--spacing-md);
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    border-bottom: 1px solid var(--color-border);
    z-index: 1;

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
      padding-top: calc(var(--header-height) + 20px);
    }

    .category-tabs {
      padding: 1rem;
      gap: 0.5rem;
      flex-wrap: wrap;

      button {
        font-size: 1rem;
        padding: 0.5rem 1rem;
        white-space: nowrap;
      }
    }
  }

  @media (max-width: 480px) {
    .category-tabs {
      padding: 0.8rem;
      gap: 0.3rem;

      button {
        font-size: 0.9rem;
        padding: 0.4rem 0.8rem;
      }
    }
  }
</style>
