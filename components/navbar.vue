<template>
  <nav :class="{ hidden: isHidden, opaque: isOpaque }">
    <div class="navbar-container">
      <div class="logo">
        <NuxtLink to="/">Home</NuxtLink>
      </div>
      <div class="menu-icon" @click="toggleSidebar">
        &#9776; <!-- Icône de menu -->
      </div>
      <ul :class="{ 'active': isSidebarOpen }" class="nav-links">
        <li><NuxtLink to="/biography">Biography</NuxtLink></li>
        <li><NuxtLink to="/metahism">Metahism</NuxtLink></li>
        <li><NuxtLink to="/artworks">Artworks</NuxtLink></li>
        <li><NuxtLink to="/analyses">Analyses</NuxtLink></li>
      </ul>
    </div>
    <div class="sidebar" :class="{ 'open': isSidebarOpen }">
      <button class="close-btn" @click="toggleSidebar">&times;</button>
      <ul>
        <li><NuxtLink to="/biography">Biography</NuxtLink></li>
        <li><NuxtLink to="/metahism">Metahism</NuxtLink></li>
        <li><NuxtLink to="/artworks">Artworks</NuxtLink></li>
        <li><NuxtLink to="/analyses">Analyses</NuxtLink></li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isSidebarOpen = ref(false);
const isHidden = ref(false);
const isOpaque = ref(false);
let lastScrollY = 0;

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const handleScroll = () => {
  const currentScrollY = window.scrollY;

  // Gestion de l'opacité
  isOpaque.value = currentScrollY > 0; // Devenir opaque si on a défilé

  // Disparition de la navbar
  if (currentScrollY > lastScrollY && currentScrollY > 50) {
    isHidden.value = true; // Cache la navbar quand on fait défiler vers le bas
  } else if (currentScrollY < lastScrollY) {
    isHidden.value = false; // Réaffiche la navbar quand on fait défiler vers le haut
  }

  lastScrollY = currentScrollY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
</script>

<style scoped>
nav {
  background-color: rgba(51, 51, 51, 0); /* Couleur de fond initiale transparente */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 20px;
  transition: background-color 0.3s ease, transform 0.3s ease; /* Transition pour l'effet de disparition et d'opacité */
}

.hidden {
  transform: translateY(-100%); /* Cache la navbar en la déplaçant vers le haut */
}

.opaque {
  background-color: rgba(51, 51, 51, 1); /* Couleur de fond opaque */
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  color: #525252; /* Couleur du lien Home */
  font-size: 1.5em;
}

.menu-icon {
  display: none; /* Masquer l'icône de menu par défaut */
  font-size: 1.5em;
  cursor: pointer;
}

.nav-links {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
}

.nav-links li {
  margin-right: 20px;
}

.nav-links a {
  color: #525252; /* Couleur des liens */
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #cc0000; /* Couleur des liens au survol */
}

/* Styles pour la sidebar */
.sidebar {
  position: fixed;
  top: 0;
  right: -250px; /* Masquer la sidebar par défaut */
  width: 250px;
  height: 100%;
  background-color: #333;
  transition: right 0.3s ease;
  z-index: 1001;
}

.sidebar.open {
  right: 0; /* Afficher la sidebar */
}

.sidebar ul {
  list-style-type: none;
  padding: 20px;
}

.sidebar li {
  margin: 20px 0;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 2em;
  cursor: pointer;
}

/* Styles responsives */
@media (max-width: 768px) {
  .menu-icon {
    display: block; /* Afficher l'icône de menu sur mobile */
  }

  .nav-links {
    display: none; /* Masquer les liens de la navbar sur mobile */
  }
}
</style>