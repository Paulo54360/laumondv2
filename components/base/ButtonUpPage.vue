<template>
  <button
    v-if="isVisible"
    class="button-up-page"
    :aria-label="t('common.scroll_to_top')"
    @click="scrollToTop"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M18 15l-6-6-6 6" />
    </svg>
  </button>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const isVisible = ref(false);

  const checkScrollPosition = (): void => {
    isVisible.value = window.scrollY > 300;
  };

  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  onMounted(() => {
    window.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition();
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', checkScrollPosition);
  });
</script>

<style lang="scss" scoped>
  .button-up-page {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 2rem;
    height: 2rem;
    background: var(--color-white);
    border: 2px solid var(--color-primary);
    border-radius: 0;
    color: var(--color-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    box-shadow: var(--shadow-md);
    transition: all var(--transition-medium);
    opacity: 0;
    transform: translateY(1rem);
    animation: fadeInUp 0.3s ease forwards;

    &:hover {
      background: var(--color-primary);
      color: var(--color-white);
      box-shadow: var(--shadow-lg);
      transform: translateY(-0.25rem);
    }

    &:active {
      transform: translateY(0);
    }

    svg {
      display: block;
      width: 14px;
      height: 14px;
    }
  }

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .button-up-page {
      bottom: 1.5rem;
      right: 1.5rem;
      width: 1.75rem;
      height: 1.75rem;

      svg {
        width: 12px;
        height: 12px;
      }
    }
  }
</style>
