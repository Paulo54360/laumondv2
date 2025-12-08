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
  import TheFooter from '~/components/layout/TheFooter.vue';
  import Navbar from '~/components/navbar.vue';
  // Layout par défaut avec Navbar + Footer + Bouton remonter en haut
</script>

<style lang="scss">
  .app-layout {
    min-height: 100vh;

    .main-content {
      padding-top: 0;
    }
  }
</style>
