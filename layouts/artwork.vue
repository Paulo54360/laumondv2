<template>
  <div class="layout-artwork">
    <TheHeader variant="transparent" />
    
    <div class="layout-artwork__container">
      <aside class="layout-artwork__sidebar">
        <nav class="artwork-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="artwork-tabs__button"
            :class="{ 'artwork-tabs__button--active': currentTab === tab.id }"
            @click="currentTab = tab.id"
          >
            {{ t(tab.label) }}
          </button>
        </nav>
      </aside>

      <main class="layout-artwork__content">
        <div class="artwork-view">
          <div class="artwork-view__image">
            <slot name="image" />
          </div>
          
          <div class="artwork-view__content">
            <div v-show="currentTab === 'info'" class="artwork-view__tab">
              <slot name="info" />
            </div>
            <div v-show="currentTab === 'description'" class="artwork-view__tab">
              <slot name="description" />
            </div>
            <div v-show="currentTab === 'details'" class="artwork-view__tab">
              <slot name="details" />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import TheHeader from '~/components/layout/TheHeader.vue';

interface ITab {
  id: 'info' | 'description' | 'details'
  label: string
}

const { t } = useI18n()
const currentTab = ref<ITab['id']>('info')

const tabs: ITab[] = [
  { id: 'info', label: 'artwork.tabs.info' },
  { id: 'description', label: 'artwork.tabs.description' },
  { id: 'details', label: 'artwork.tabs.details' }
]
</script>

<style lang="scss" scoped>
.layout-artwork {
  min-height: 100vh;
  padding-top: var(--header-height);

  &__container {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: var(--spacing-lg);
    max-width: var(--max-width-content);
    margin: 0 auto;
    padding: var(--spacing-lg);

    @include md {
      grid-template-columns: 300px 1fr;
    }
  }

  &__sidebar {
    position: sticky;
    top: calc(var(--header-height) + var(--spacing-lg));
    height: fit-content;
  }

  &__content {
    min-height: calc(100vh - var(--header-height) - 2 * var(--spacing-lg));
  }
}

.artwork-tabs {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-background);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);

  &__button {
    width: 100%;
    padding: var(--spacing-md);
    text-align: left;
    background: none;
    border: none;
    border-radius: var(--border-radius);
    color: var(--color-text);
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover {
      background: var(--color-background-alt);
    }

    &--active {
      background: var(--color-primary) !important;
      color: white;
    }
  }
}

.artwork-view {
  display: grid;
  gap: var(--spacing-xl);

  &__image {
    aspect-ratio: 16/9;
    background: var(--color-background-alt);
    border-radius: var(--border-radius);
    overflow: hidden;
  }

  &__content {
    padding: var(--spacing-lg);
    background: var(--color-background);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-md);
  }

  &__tab {
    animation: fadeIn var(--transition-medium);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 