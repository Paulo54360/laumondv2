<template>
  <Teleport to="body">
    <div v-if="show" class="egg-overlay" role="dialog" aria-modal="true" @click="emit('close')">
      <div class="egg-video" @click.stop>
        <iframe
          :src="src"
          :title="t('easter_egg.title')"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowfullscreen
        ></iframe>
      </div>
      <button
        type="button"
        class="egg-close"
        :aria-label="t('easter_egg.close')"
        @click.stop="emit('close')"
      >
        &times;
      </button>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, watch } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { EASTER_EGG } from '../../utils/easterEgg';

  const props = defineProps<{ show: boolean }>();
  const emit = defineEmits<{ (e: 'close'): void }>();

  const { t } = useI18n();

  // La vidéo n'est chargée qu'après le clic sur « Voir la vidéo »
  const EMBED_BASE = 'https://www.youtube-nocookie.com/embed';
  const src = computed(
    () => `${EMBED_BASE}/${EASTER_EGG.youtubeId}?autoplay=1&rel=0&modestbranding=1`
  );

  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') emit('close');
  };

  watch(
    () => props.show,
    (visible) => {
      if (visible) {
        window.addEventListener('keydown', onKey, true);
      } else {
        window.removeEventListener('keydown', onKey, true);
      }
    }
  );

  onBeforeUnmount(() => window.removeEventListener('keydown', onKey, true));
</script>

<style lang="scss" scoped>
  .egg-overlay {
    position: fixed;
    inset: 0;
    z-index: calc(var(--z-index-modal) + 10);
    background: rgba(0, 0, 0, 0.88);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-md);
    animation: egg-fade 0.8s ease;
  }

  .egg-video {
    position: relative;
    width: 100%;
    max-width: 960px;
    aspect-ratio: 16 / 9;
    background: #000;

    iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
  }

  .egg-close {
    position: absolute;
    top: 1rem;
    right: 1.25rem;
    background: none;
    border: none;
    font-size: 2rem;
    line-height: 1;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;

    &:hover {
      color: var(--color-white);
    }
  }

  @keyframes egg-fade {
    from {
      opacity: 0;
    }
  }
</style>
