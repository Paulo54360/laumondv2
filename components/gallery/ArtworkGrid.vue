<template>
  <div class="artwork-grid">
    <div v-if="loading" class="loading">
      {{ t('gallery.loading') }}
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="grid">
      <div
        v-for="artwork in artworks"
        :key="artwork.images[0] || localizedTitle(artwork)"
        class="artwork-card"
        @click="openArtwork(artwork)"
      >
        <div class="artwork-image">
          <img :src="proxiedUrl(artwork.images[0])" :alt="localizedTitle(artwork)" />
        </div>
        <div class="artwork-info">
          <h3>{{ localizedTitle(artwork) }}</h3>
          <p class="description">{{ truncateDescription(localizedDescription(artwork)) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { useS3 } from '../../composables/useS3';
  import {
    getLocalizedTitle,
    getLocalizedDescription,
    type ILocalizedArtwork,
  } from '../../utils/artworkLocale';

  interface IProps {
    category: string;
  }

  type ArtworkItem = ILocalizedArtwork & { images: string[] };

  const props = defineProps<IProps>();
  const { getArtworks } = useS3();
  const { t, locale } = useI18n();
  const proxiedUrl = useImageProxy();

  const artworks = ref<ArtworkItem[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);

  const emit = defineEmits<{
    (e: 'select', artwork: ArtworkItem): void;
  }>();

  const localizedTitle = (artwork: ILocalizedArtwork): string =>
    getLocalizedTitle(artwork, locale.value);

  const localizedDescription = (artwork: ILocalizedArtwork): string =>
    getLocalizedDescription(artwork, locale.value);

  const truncateDescription = (description: string): string => {
    return description.length > 100 ? `${description.slice(0, 100)}...` : description;
  };

  const openArtwork = (artwork: ArtworkItem): void => {
    emit('select', artwork);
  };

  const fetchArtworks = async (category: string): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      artworks.value = await getArtworks(category);
    } catch (e) {
      error.value = t('gallery.error');
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchArtworks(props.category);
  });

  watch(
    () => props.category,
    (newCategory) => {
      fetchArtworks(newCategory);
    }
  );
</script>

<style lang="scss" scoped>
  .artwork-grid {
    padding: var(--spacing-md);

    .loading,
    .error {
      text-align: center;
      padding: var(--spacing-xl);
      color: var(--color-text);
    }

    .error {
      color: var(--color-primary);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-lg);
    }

    .artwork-card {
      background: var(--color-background);
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      cursor: pointer;
      transition:
        transform var(--transition-fast),
        box-shadow var(--transition-fast);

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
      }

      .artwork-image {
        aspect-ratio: 16/9;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-fast);
        }

        &:hover img {
          transform: scale(1.05);
        }
      }

      .artwork-info {
        padding: var(--spacing-md);

        h3 {
          margin: 0 0 var(--spacing-sm);
          font-size: 1.2rem;
          color: var(--color-text);
        }

        .description {
          margin: 0;
          font-size: 0.9rem;
          color: var(--color-text-light);
          line-height: 1.4;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .artwork-grid {
      padding: 1rem;

      .grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
      }

      .artwork-card .artwork-info {
        padding: 1rem;

        h3 {
          font-size: 1.1rem;
        }

        .description {
          font-size: 0.8rem;
        }
      }
    }
  }

  @media (max-width: 480px) {
    .artwork-grid {
      padding: 0.5rem;

      .grid {
        grid-template-columns: 1fr;
        gap: 0.8rem;
      }

      .artwork-card .artwork-info {
        padding: 0.8rem;

        h3 {
          font-size: 1rem;
        }

        .description {
          font-size: 0.75rem;
        }
      }
    }
  }
</style>
