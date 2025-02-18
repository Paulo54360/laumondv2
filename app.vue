<template>
  <div>
    <!-- Barre de navigation -->
    <Navbar />

    <!-- Contenu dynamique de chaque page -->
    <main>
      <NuxtPage />
    </main>

    <!-- Pied de page -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '~/components/navbar.vue';
import Footer from '~/components/footer.vue';
import { useHead } from 'nuxt/app'

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'
    }
  ]
})
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
