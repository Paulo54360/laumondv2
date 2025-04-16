<template>
  <button
    class="base-button"
    :class="[
      `base-button--${props.variant}`,
      `base-button--${props.size}`,
      { 'base-button--loading': props.isLoading }
    ]"
    :disabled="props.isLoading || props.disabled"
    v-bind="$attrs"
  >
    <span v-if="props.isLoading" class="base-button__loader" />
    <slot />
  </button>
</template>

<script setup lang="ts">
interface IProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  variant: 'primary',
  size: 'md',
  isLoading: false,
  disabled: false
})
</script>

<style lang="scss" scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  // Variants
  &--primary {
    background: var(--color-primary);
    color: white;

    &:hover:not(:disabled) {
      background: var(--color-primary-dark);
    }
  }

  &--secondary {
    background: transparent;
    border: 1px solid var(--color-border);
    color: var(--color-text);

    &:hover:not(:disabled) {
      background: var(--color-background-alt);
    }
  }

  // Sizes
  &--sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  &--md {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }

  &--lg {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }

  // Loading state
  &--loading {
    position: relative;
    color: transparent;
  }

  &__loader {
    position: absolute;
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-radius: 50%;
    border-right-color: transparent;
    animation: spin 0.6s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 