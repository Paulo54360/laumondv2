<template>
  <div>
    <!-- Barre de navigation -->
    <TheHeader />

    <!-- Contenu dynamique de chaque page -->
    <main>
      <NuxtPage />
    </main>

    <!-- Pied de page -->
    <Footer />
  </div>
</template>

<script setup>
  import { useHead } from 'nuxt/app';

  import Footer from '~/components/footer.vue';
  import TheHeader from '~/components/layout/TheHeader.vue';

  useHead({
    link: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
      },
    ],
  });
</script>

<style scoped>
  main {
    padding: 80px 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  * {
    font-family: 'Roboto', sans-serif;
  }
</style>
