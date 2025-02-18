<template>
  <div class="homepage">
    <h1>Bienvenue sur Laumond</h1>
    <div class="shortcut-container">
      <NuxtLink to="/analyses" class="shortcut">Analyses</NuxtLink>
      <NuxtLink to="/biography" class="shortcut">Biographie</NuxtLink>
      <NuxtLink to="/metahism" class="shortcut">Métahisme</NuxtLink>
      <NuxtLink to="/artworks" class="shortcut">Œuvres</NuxtLink>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Accueil - Laumond",
  meta: [{ name: "description", content: "Explorez toutes les sections de Laumond depuis cette page centrale." }]
});
</script>

<style scoped>
.homepage {
  text-align: center;
  padding: 40px;
}
.shortcut-container {
  display: flex;
  gap: 20px;
  justify-content: center;
}
.shortcut {
  padding: 15px 25px;
  background-color: #000;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  transition: 0.3s;
}
.shortcut:hover {
  background-color: #444;
}
</style>
