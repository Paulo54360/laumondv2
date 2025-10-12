<template>
  <div v-if="show" class="artwork-modal" @click="close">
    <div class="modal-content" @click.stop>
      <button class="close-button" @click="close">&times;</button>

      <div class="image-viewer">
        <img :src="currentImage" :alt="artwork.title" />
        
        <button 
          v-if="currentIndex > 0" 
          class="nav-button prev" 
          @click="previousImage"
        >
          &lt;
        </button>
        <button 
          v-if="currentIndex < artwork.images.length - 1" 
          class="nav-button next" 
          @click="nextImage"
        >
          &gt;
        </button>
      </div>

      <div class="artwork-details">
        <h2>{{ artwork.title }}</h2>
        <p class="description">{{ artwork.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean;
  artwork: {
    title: string;
    description: string;
    images: string[];
  };
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'close'): void;
}>();

const currentIndex = ref(0);
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
watch(() => props.artwork, () => {
  currentIndex.value = 0;
});
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
  z-index: 1;
  padding: var(--spacing-xs);
  line-height: 1;
  
  &:hover {
    color: var(--color-primary);
  }
}

.image-viewer {
  position: relative;
  flex: 1;
  min-height: 0;
  background: var(--color-background-alt);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  padding: var(--spacing-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  border-radius: 50%;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
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
    max-height: 95vh;
  }
  
  .close-button {
    font-size: 1.5rem;
    top: 0.5rem;
    right: 0.5rem;
  }
  
  .nav-button {
    font-size: 1.2rem;
    padding: 0.8rem;
    
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
    max-height: 98vh;
  }
  
  .close-button {
    font-size: 1.3rem;
    top: 0.3rem;
    right: 0.3rem;
  }
  
  .nav-button {
    font-size: 1rem;
    padding: 0.6rem;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    
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