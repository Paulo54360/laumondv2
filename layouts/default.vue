<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="app-layout">
    <Navbar />
    <main class="main-content">
      <slot />
    </main>
    <TheFooter />
    <ButtonUpPage />
    <!-- Bouton flottant admin : visible uniquement si connecté et hors pages admin -->
    <ClientOnly>
      <AdminFloatingButton v-if="!isAdminPage" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
  import ButtonUpPage from '~/components/base/ButtonUpPage.vue';
  import Navbar from '~/components/layout/Navbar.vue';
  import TheFooter from '~/components/layout/TheFooter.vue';
  import AdminFloatingButton from '~/components/admin/AdminFloatingButton.vue';

  const route = useRoute();
  const isAdminPage = computed(() => route.path.startsWith('/admin'));
  // Architecture cible : structure commune (header/nav, main, footer, sélecteur de langue dans Navbar).
</script>

<style lang="scss">
  .app-layout {
    min-height: 100vh;

    .main-content {
      padding-top: 2rem;
    }
  }
</style>
