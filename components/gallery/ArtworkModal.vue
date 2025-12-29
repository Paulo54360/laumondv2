<template>
  <div v-if="show" class="artwork-modal" @click="close">
    <div class="modal-content" @click.stop>
      <button class="close-button" @click="close">&times;</button>

      <div class="image-viewer">
        <img :src="currentImage" :alt="artwork.title" />

        <button v-if="currentIndex > 0" class="nav-button prev" @click="previousImage">&lt;</button>
        <button
          v-if="currentIndex < artwork.images.length - 1"
          class="nav-button next"
          @click="nextImage"
        >
          &gt;
        </button>
      </div>

      <div class="artwork-details" v-if="showDetails && (artwork.description || artwork.title)">
        <h2 v-if="artwork.title">{{ artwork.title }}</h2>
        <p class="description" v-if="artwork.description">{{ artwork.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';

  interface IProps {
    show: boolean;
    initialIndex?: number;
    showDetails?: boolean;
    artwork: {
      title: string;
      description: string;
      images: string[];
    };
  }

  const props = withDefaults(defineProps<IProps>(), {
    initialIndex: 0,
    showDetails: true,
  });
  const emit = defineEmits<{
    (e: 'close'): void;
  }>();

  const currentIndex = ref(props.initialIndex);
  const currentImage = computed(() => props.artwork.images[currentIndex.value]);

  const close = (): void => {
    currentIndex.value = 0;
    emit('close');
  };

  const previousImage = (): void => {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
  };

  const nextImage = (): void => {
    if (currentIndex.value < props.artwork.images.length - 1) {
      currentIndex.value++;
    }
  };

  // Réinitialiser l'index quand une nouvelle œuvre est sélectionnée
  watch(
    () => props.artwork,
    () => {
      currentIndex.value = props.initialIndex;
    }
  );
</script>

<style lang="scss" scoped>
  .artwork-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: var(--z-index-modal);
  }

  .modal-content {
    position: relative;
    width: 90%;
    max-width: 1200px;
    height: 90vh; /* Fixed height to force containment */
    max-height: 90vh;
    background: var(--color-background);
    border-radius: var(--border-radius);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .close-button {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    background: none;
    border: none;
    color: var(--color-text);
    font-size: 2rem;
    cursor: pointer;
    z-index: 2; /* Increased z-index */
    padding: var(--spacing-xs);
    line-height: 1;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8); /* visibility on dark bg */

    &:hover {
      color: var(--color-primary);
    }
  }

  .image-viewer {
    position: relative;
    flex: 1;
    min-height: 0; /* Crucial for flex child scrolling/containment */
    background: var(--color-background-alt);
    display: flex; /* Centering image */
    justify-content: center;
    align-items: center;
    overflow: hidden;

    img {
      max-width: 100%;
      max-height: 100%;
      width: auto; /* Allow width to shrink */
      height: auto; /* Allow height to shrink */
      object-fit: contain;
      display: block;
    }
  }

  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 2.2rem;
    height: 2.2rem;
    background: var(--color-background);
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
    font-size: 1.1rem;
    line-height: 1;
    padding: 0 0 2px 0; /* Slight adjustment for visual center of text characters */
    cursor: pointer;
    transition: all var(--transition-fast);
    border-radius: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: var(--color-primary);
      color: var(--color-white);
      transform: translateY(-50%); /* Maintaining vertical center */
    }

    &.prev {
      left: var(--spacing-md);
    }

    &.next {
      right: var(--spacing-md);
    }
  }

  .artwork-details {
    padding: var(--spacing-lg);
    background: var(--color-background); /* Ensure opaque background */
    flex-shrink: 0; /* Don't shrink to fit image */

    h2 {
      margin: 0 0 var(--spacing-md);
      color: var(--color-text);
    }

    .description {
      margin: 0;
      color: var(--color-text-light);
      line-height: 1.6;
    }
  }

  @media (max-width: 768px) {
    .modal-content {
      width: 95%;
      height: 95vh;
      max-height: 95vh;
    }

    .close-button {
      font-size: 1.5rem;
      top: 0.5rem;
      right: 0.5rem;
    }

    .nav-button {
      font-size: 0.9rem;
      width: 1.8rem;
      height: 1.8rem;
      padding: 0 0 1px 0;

      &.prev {
        left: 0.5rem;
      }

      &.next {
        right: 0.5rem;
      }
    }

    .artwork-details {
      padding: 1rem;

      h2 {
        font-size: 1.3rem;
        margin-bottom: 0.8rem;
      }

      .description {
        font-size: 0.9rem;
      }
    }
  }

  @media (max-width: 480px) {
    .modal-content {
      width: 98%;
      height: 98vh;
      max-height: 98vh;
    }

    .close-button {
      font-size: 1.3rem;
      top: 0.3rem;
      right: 0.3rem;
    }

    .nav-button {
      font-size: 0.8rem;
      width: 1.5rem;
      height: 1.5rem;
      border-width: 1px; /* Thinner border for small screens */

      &.prev {
        left: 0.3rem;
      }

      &.next {
        right: 0.3rem;
      }
    }

    .artwork-details {
      padding: 0.8rem;

      h2 {
        font-size: 1.1rem;
        margin-bottom: 0.6rem;
      }

      .description {
        font-size: 0.8rem;
      }
    }
  }
</style>
