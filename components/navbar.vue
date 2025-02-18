<template>
  <nav :class="{ hidden: isHidden }">
    <ul>
      <div class="logo">
      <li><NuxtLink to="/">Home</NuxtLink></li>
      </div>
      <div class="links">
        <li><NuxtLink to="/biography">Biography</NuxtLink></li>
        <li><NuxtLink to="/metahism">Metahism</NuxtLink></li>
        <li><NuxtLink to="/artworks">Artworks</NuxtLink></li>
        <li><NuxtLink to="/analyses">Analyses</NuxtLink></li>
      </div>
    </ul>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isHidden = ref(false);
let lastScrollY = 0;

const handleScroll = () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY) {
    // Scrolling down
    isHidden.value = true;
  } else {
    // Scrolling up
    isHidden.value = false;
  }

  lastScrollY = currentScrollY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
</script>

<style scoped>
nav {
  background-color: #525252; /* Couleur de fond de la navbar */
  transition: all 0.3s ease;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 20px; /* Ajoutez du padding pour l'espacement */
}

.links {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.hidden {
  transform: translateY(-100%); /* Cache la navbar en la déplaçant vers le haut */
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
}

li {
  margin-right: 20px;
}

a {
  color: #cfcfcf; /* Couleur des liens */
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: #cc0000; /* Couleur des liens au survol */
}
</style>