<template>
  <nav :class="{ hidden: isHidden, opaque: isOpaque }">
    <div class="navbar-container">
      <div class="logo">
        <NuxtLink :to="homePath">{{ t('navbar.home') }}</NuxtLink>
      </div>

      <!-- Barre de recherche -->
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('header.search_placeholder')"
          class="search-input"
          @keyup.enter="performSearch"
        />
        <button class="search-button" @click="performSearch">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>

      <ul :class="{ active: isSidebarOpen }" class="nav-links">
        <li>
          <NuxtLink :to="biographyPath">{{ t('navbar.Biographie') }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="metahismPath">{{ t('navbar.MétaHisme') }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="artworksPath">{{ t('navbar.Oeuvres') }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="analysesPath">{{ t('navbar.Analyses') }}</NuxtLink>
        </li>
      </ul>

      <!-- Éléments à droite -->
      <div class="right-items">
        <!-- Bouton de traduction -->
        <button class="lang-switch" @click="switchLanguage">
          <img
            :src="currentLocale === 'fr' ? '/images/flags/uk.svg' : '/images/flags/fr.svg'"
            :alt="currentLocale === 'fr' ? t('header.switch_to_en') : t('header.switch_to_fr')"
            class="flag-icon"
          />
        </button>

        <!-- Menu burger déplacé ici -->
        <div class="menu-icon" @click="toggleSidebar">
          &#9776;
          <!-- Icône de menu -->
        </div>
      </div>
    </div>

    <div class="sidebar" :class="{ open: isSidebarOpen }">
      <button class="close-btn" @click="toggleSidebar">&times;</button>
      <ul>
        <li>
          <NuxtLink :to="biographyPath" @click="toggleSidebar">
            {{ t('navbar.Biographie') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="metahismPath" @click="toggleSidebar">
            {{ t('navbar.MétaHisme') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="artworksPath" @click="toggleSidebar">
            {{ t('navbar.Oeuvres') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="analysesPath" @click="toggleSidebar">
            {{ t('navbar.Analyses') }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter, useRoute } from 'vue-router';

  const router = useRouter();
  const route = useRoute();

  const isSidebarOpen = ref(false);
  const isHidden = ref(false);
  const isOpaque = ref(false);
  const searchQuery = ref('');

  const { t, locale } = useI18n();

  // Obtenir la locale actuelle depuis la route (priorité) ou i18n
  const currentLocale = computed(() => {
    // Extraire la locale de l'URL (ex: /fr/artworks -> fr)
    const localeFromPath = route.path?.match(/^\/(fr|en)/)?.[1];
    // Utiliser la locale de l'URL si disponible, sinon celle de i18n, sinon 'fr' par défaut
    return localeFromPath || locale.value || 'fr';
  });

  // Générer les liens directement avec la locale actuelle (plus fiable)
  const homePath = computed(() => `/${currentLocale.value}/`);
  const biographyPath = computed(() => `/${currentLocale.value}/biography`);
  const metahismPath = computed(() => `/${currentLocale.value}/metahism`);
  const artworksPath = computed(() => `/${currentLocale.value}/artworks`);
  const analysesPath = computed(() => `/${currentLocale.value}/analyses`);
  const searchPath = computed(() => `/${currentLocale.value}/search`);

  // Fonction pour changer de langue
  const switchLanguage = (): void => {
    const newLocale = currentLocale.value === 'fr' ? 'en' : 'fr';
    // Construire le chemin avec la nouvelle locale
    const currentPath = route.path?.replace(/^\/(fr|en)/, '') || '/';
    const targetPath = `/${newLocale}${currentPath}`;
    router.push(targetPath);
  };

  const toggleSidebar = (): void => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };

  const performSearch = (): void => {
    if (searchQuery.value.trim()) {
      router.push({
        path: searchPath.value,
        query: { q: searchQuery.value.trim() },
      });
      searchQuery.value = '';
    }
  };

  const navbarHeight = 70;
  let lastScrollY = 0;

  const handleScroll = (): void => {
    const currentScrollY = window.scrollY;
    isOpaque.value = currentScrollY > 0;
    if (currentScrollY > navbarHeight && currentScrollY > lastScrollY) {
      isHidden.value = true;
    } else if (currentScrollY < lastScrollY) {
      isHidden.value = false;
    }
    lastScrollY = currentScrollY;
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
    transition:
      transform 0.5s ease,
      background-color 0.3s ease; /* Transition adoucie */
  }

  .hidden {
    transform: translateY(-100%); /* Déplacer l'élément en dehors de la vue */
  }

  /* Opaque quand on défile */
  .opaque {
    background-color: #acacac;
  }

  .logo a {
    color: var(--color-muted); /* Remplacé par la couleur demandée */
    text-decoration: none; /* Supprime la décoration (par exemple, soulignement) */
    transition: color 0.3s ease; /* Ajoute une transition fluide pour le changement de couleur */
    font-weight: bold;
    font-size: 1.3rem; /* Augmentation légère de la taille */
  }

  .logo a:hover {
    color: var(--color-primary); /* Applique la même couleur de survol */
  }

  /* Conteneur pour les éléments à droite */
  .right-items {
    display: flex;
    align-items: center;
  }

  .menu-icon {
    display: block; /* Toujours afficher l'icône de menu */
    font-size: 1.8em; /* Augmentation de la taille */
    cursor: pointer;
    padding: 5px 12px; /* Augmentation du padding */
    margin-left: 18px; /* Plus d'espace entre les éléments */
    border: none; /* Suppression du cadre */
    color: var(--color-muted);
    transition: color 0.3s ease;
  }

  .menu-icon:hover {
    color: var(--color-primary);
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
    color: var(--color-muted); /* Remplacé par la couleur demandée */
    text-decoration: none;
    transition: color 0.3s ease;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 1.05rem; /* Taille de police légèrement plus grande */
  }

  .nav-links a:hover {
    color: var(--color-primary); /* Couleur des liens au survol */
  }

  .navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px; /* Ajout de padding au conteneur */
  }

  /* Bouton de traduction */
  .lang-switch {
    background: none;
    border: none; /* Suppression de la bordure */
    cursor: pointer;
    padding: 8px; /* Padding augmenté */
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
  }

  .lang-switch:hover {
    opacity: 0.8;
  }

  .flag-icon {
    width: 30px; /* Augmentation de la taille */
    height: 30px; /* Augmentation de la taille */
    object-fit: contain;
  }

  /* Styles pour la sidebar */
  .sidebar {
    position: fixed;
    top: 0;
    right: -250px; /* Masquer la sidebar par défaut */
    width: 250px;
    height: 100%;
    background-color: var(--color-muted);
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

  .sidebar li a {
    color: var(--color-white);
    text-decoration: none;
    font-size: 1.2rem;
    text-transform: uppercase;
  }

  .close-btn {
    background: none;
    border: 1px solid var(--color-white);
    color: var(--color-white);
    font-size: 1.5em;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 0 10px;
  }

  /* Barre de recherche */
  .search-container {
    flex: 1; /* Prend l'espace restant entre le logo et les liens */
    margin: 0 20px; /* Espacement côté gauche et droit */
    display: flex;
    justify-content: center; /* Centrer la barre de recherche */
    position: relative; /* Pour positionner le bouton correctement */
    max-width: 400px; /* Limiter la largeur maximale */
  }

  .search-input {
    width: 100%;
    padding: 10px 45px 10px 16px; /* Augmentation légère du padding */
    font-size: 15px; /* Police plus grande */
    border: 1px solid var(--color-muted);
    border-radius: 0; /* Suppression des coins arrondis */
    background: var(--color-white);
    color: var(--color-muted);
    transition: all 0.3s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: none;
  }

  .search-button {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    background: none;
    border: none;
    border-left: 1px solid var(--color-muted); /* Ajout d'une bordure gauche */
    padding: 0 15px; /* Padding augmenté */
    color: var(--color-muted);
    cursor: pointer;
    transition:
      color 0.3s ease,
      background-color 0.3s ease;
  }

  .search-button:hover {
    color: var(--color-primary);
    background-color: #f0f0f0; /* Léger fond au survol */
  }

  /* Styles responsives */
  @media (max-width: 1024px) {
    .navbar-container {
      padding: 0 20px;
    }

    .search-container {
      max-width: 300px;
    }
  }

  @media (max-width: 768px) {
    nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 0;
    }

    .nav-links {
      display: none;
    }

    .navbar-container {
      flex-wrap: wrap;
      padding: 12px 15px;
      gap: 10px;
    }

    .logo a {
      font-size: 1.15rem;
    }

    .search-container {
      flex: 100%;
      max-width: none;
      margin: 8px 0 0;
      order: 3;
      padding: 0;
      width: 100%;
    }

    .search-input {
      padding: 10px 45px 10px 15px;
      font-size: 14px;
      width: 100%;
    }

    .search-button {
      right: 0;
      padding: 0 12px;
    }

    .right-items {
      gap: 8px;
    }

    .menu-icon {
      font-size: 1.6em;
      padding: 4px 10px;
      margin-left: 10px;
    }

    .lang-switch {
      padding: 6px;
    }

    .flag-icon {
      width: 28px;
      height: 28px;
    }
  }

  @media (max-width: 480px) {
    nav {
      padding: 0;
    }

    .navbar-container {
      padding: 10px 12px;
      gap: 8px;
    }

    .logo a {
      font-size: 1rem;
    }

    .search-container {
      margin: 6px 0 0;
      padding: 0;
    }

    .search-input {
      font-size: 14px;
      padding: 9px 38px 9px 12px;
      border-radius: 4px;
    }

    .search-button {
      padding: 0 10px;
      width: 38px;
      display: flex;
      justify-content: center;
      align-items: center;

      svg {
        width: 14px;
        height: 14px;
      }
    }

    .lang-switch {
      padding: 4px;
    }

    .flag-icon {
      width: 24px;
      height: 24px;
    }

    .menu-icon {
      padding: 4px 8px;
      font-size: 1.5em;
      margin-left: 8px;
    }

    .sidebar {
      width: 85vw;
      max-width: 300px;
    }
  }
</style>
