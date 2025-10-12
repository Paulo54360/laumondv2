<template>
  <div class="layout-default">
    <TheHeader />
    <main class="layout-default__content">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
  import TheFooter from '~/components/layout/TheFooter.vue';
  import TheHeader from '~/components/layout/TheHeader.vue';
</script>

<style lang="scss" scoped>
  .layout-default {
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    &__content {
      flex: 1;
      width: 100%;
      max-width: var(--max-width-content);
      margin: 0 auto;
      padding: var(--spacing-lg);
    }
  }
</style>
