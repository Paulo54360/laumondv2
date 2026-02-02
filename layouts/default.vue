<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="app-layout">
    <Navbar />
    <main class="main-content">
      <slot />
    </main>
    <TheFooter />
    <ButtonUpPage />
  </div>
</template>

<script setup lang="ts">
  import ButtonUpPage from '~/components/base/ButtonUpPage.vue';
  import Navbar from '~/components/layout/Navbar.vue';
  import TheFooter from '~/components/layout/TheFooter.vue';
  // Architecture cible : structure commune (header/nav, main, footer, sélecteur de langue dans Navbar).
</script>

<style lang="scss">
  .app-layout {
    min-height: 100vh;

    .main-content {
      padding-top: 0;
    }
  }
</style>
