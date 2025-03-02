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
import { ref, onMounted, onUnmounted } from 'vue';

const isSidebarOpen = ref(false);
const isHidden = ref(false);
const isOpaque = ref(false);

const navbarHeight = 70; // Hauteur estimée de la navbar pour décider quand elle disparaît
let lastScrollY = 0;

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const handleScroll = () => {
  const currentScrollY = window.scrollY;

  // Gestion de l'opacité
  isOpaque.value = currentScrollY > 0; // Devient opaque si on défile vers le bas

  // Logique de disparition naturelle
  if (currentScrollY > navbarHeight && currentScrollY > lastScrollY) {
    // Disparaître "naturellement" quand on défile assez bas
    isHidden.value = true;
  } else if (currentScrollY < lastScrollY) {
    // Réapparaître immédiatement lorsqu'on défile vers le haut
    isHidden.value = false;
  }

  lastScrollY = currentScrollY; // Mise à jour de la position précédente
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
nav {
  background-color: rgba(51, 51, 51, 0); /* Couleur de fond initiale */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 20px;
  transition: transform 0.5s ease, background-color 0.3s ease; /* Transition adoucie */
}

.hidden {
  transform: translateY(-100%); /* Déplacer l'élément en dehors de la vue */
}

/* Opaque quand on défile */
.opaque {
  background-color: #acacac;
}


.logo a {
  color: #000000; /* Même couleur que les autres liens */
  text-decoration: none; /* Supprime la décoration (par exemple, soulignement) */
  transition: color 0.3s ease; /* Ajoute une transition fluide pour le changement de couleur */
}

.logo a:hover {
  color: #cc0000; /* Applique la même couleur de survol */
}

.menu-icon {
  display: none; /* Masquer l'icône de menu par défaut */
  font-size: 1.5em;
  cursor: pointer;
}

.nav-links {
  list-style-type: none;
  padding: 0;
  display: flex;
  /* Décalage du groupe vers la gauche */
  margin: 0 0 0 -20px;
}

.nav-links li {
  margin-right: 30px; /* Augmente l'espace entre les liens */
}

.nav-links a {
  color: #000000; /* Couleur des liens */
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #cc0000; /* Couleur des liens au survol */
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px; /* Ajout de padding au conteneur */
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