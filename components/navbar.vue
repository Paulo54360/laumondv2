<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="navbar-container">
      <!-- Logo / Titre -->
      <div class="navbar-brand">
        <NuxtLink :to="localePath('/')" class="brand-link">
          <div class="brand-title">
            <span class="brand-name-top">Patrick</span>
            <span class="brand-name-bottom">Laumond</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Barre de recherche desktop -->
      <div v-if="!isCompactSearch" class="navbar-search navbar-search--desktop">
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          :placeholder="searchPlaceholder"
          @keyup.enter="performSearch"
        />
        <button
          class="search-button"
          :aria-label="$t('header.search_placeholder')"
          @click="performSearch"
        >
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
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
      <button
        v-else
        class="navbar-search-trigger"
        :aria-label="$t('header.search_placeholder')"
        @click="openSearchPanel"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      <!-- Navigation principale -->
      <nav class="navbar-nav" :class="{ 'navbar-nav-open': isMobileMenuOpen }">
        <div v-if="isMobileMenuOpen" class="navbar-search navbar-search--mobile">
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            :placeholder="$t('header.search_placeholder')"
            @keyup.enter="performSearch"
          />
          <button
            class="search-button"
            :aria-label="$t('header.search_placeholder')"
            @click="performSearch"
          >
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
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
        <ul class="nav-list">
          <li class="nav-item">
            <NuxtLink
              :to="localePath('/metahism')"
              class="nav-link"
              :class="{ active: isCurrentRoute('/metahism') }"
              @click="closeMobileMenu"
            >
              {{ $t('navbar.MétaHisme') }}
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink
              :to="localePath('/artworks')"
              class="nav-link"
              :class="{ active: isCurrentRoute('/artworks') }"
              @click="closeMobileMenu"
            >
              {{ $t('navbar.Oeuvres') }}
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink
              :to="localePath('/biography')"
              class="nav-link"
              :class="{ active: isCurrentRoute('/biography') }"
              @click="closeMobileMenu"
            >
              {{ $t('navbar.Biographie') }}
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink
              :to="localePath('/analyses')"
              class="nav-link"
              :class="{ active: isCurrentRoute('/analyses') }"
              @click="closeMobileMenu"
            >
              {{ $t('navbar.Analyses') }}
            </NuxtLink>
          </li>
        </ul>

        <!-- Sélecteur de langue -->
        <div class="language-selector">
          <button
            class="language-btn"
            :class="{ active: currentLocale === 'fr' }"
            @click="changeLanguage('fr')"
          >
            <img src="/images/flags/fr.svg" :alt="$t('analyses.languages.fr')" class="flag-icon" />
            <span class="language-text">FR</span>
          </button>
          <button
            class="language-btn"
            :class="{ active: currentLocale === 'en' }"
            @click="changeLanguage('en')"
          >
            <img src="/images/flags/uk.svg" :alt="$t('analyses.languages.en')" class="flag-icon" />
            <span class="language-text">EN</span>
          </button>
        </div>
      </nav>

      <!-- Menu mobile -->
      <button
        class="mobile-menu-btn"
        :class="{ active: isMobileMenuOpen }"
        :aria-label="isMobileMenuOpen ? $t('header.menu_close') : $t('header.menu_open')"
        @click="toggleMobileMenu"
      >
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>
  </header>
  <Teleport to="body">
    <div v-if="isSearchPanelOpen" class="search-panel-overlay" @click.self="closeSearchPanel">
      <div class="search-panel">
        <input
          v-model="searchQuery"
          type="text"
          class="search-panel-input"
          :placeholder="$t('header.search_placeholder')"
          autofocus
          @keyup.enter="performSearch"
        />
        <button class="search-panel-btn" @click="performSearch">
          {{ $t('common.search') ?? 'OK' }}
        </button>
        <button class="search-panel-close" aria-label="Close search" @click="closeSearchPanel">
          ✕
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  // @ts-expect-error - Provided by Nuxt auto-imports at build time
  import { useLocalePath, useNuxtApp, useSwitchLocalePath } from '#imports';

  const route = useRoute();
  const router = useRouter();
  const { $i18n } = useNuxtApp();
  const localePath = useLocalePath();
  const switchLocalePath = useSwitchLocalePath();

  const isScrolled = ref(false);
  const isMobileMenuOpen = ref(false);
  const searchQuery = ref('');
  const isCompactSearch = ref(false);
  const isSearchPanelOpen = ref(false);

  // Récupérer la locale actuelle
  const currentLocale = computed(() => {
    return $i18n.locale.value || 'fr';
  });

  // Fonction pour changer de langue
  const changeLanguage = async (newLocale: string): Promise<void> => {
    try {
      // Changer la locale
      await $i18n.setLocale(newLocale);

      // Naviguer vers l’URL localisée équivalente
      const target = switchLocalePath(newLocale);
      await router.push(target);

      closeMobileMenu();
    } catch (error) {
      console.error('Erreur lors du changement de langue:', error);
      // Fallback: recharger la page avec la nouvelle langue
      window.location.href = `/${newLocale}${route.path.replace(/^\/(fr|en)/, '')}`;
    }
  };

  const performSearch = (): void => {
    const value = searchQuery.value.trim();
    if (!value) return;

    const searchUrl = localePath({ path: '/search', query: { q: value } });
    router.push(searchUrl);
    searchQuery.value = '';
  };

  const openSearchPanel = (): void => {
    isSearchPanelOpen.value = true;
  };

  const closeSearchPanel = (): void => {
    isSearchPanelOpen.value = false;
  };

  // Vérifier si une route est active
  const isCurrentRoute = (path: string): boolean => {
    const cleanPath = route.path.replace(/^\/(fr|en)/, '') || '/';
    return cleanPath === path || (path === '/' && cleanPath === '');
  };

  // Gestion du scroll
  const handleScroll = (): void => {
    isScrolled.value = window.scrollY > 50;
  };

  // Gestion du menu mobile
  const toggleMobileMenu = (): void => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
    if (process.client) {
      document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : '';
    }
  };

  const closeMobileMenu = (): void => {
    isMobileMenuOpen.value = false;
    if (process.client) {
      document.body.style.overflow = '';
    }
  };

  const searchPlaceholder = computed(() =>
    isCompactSearch.value
      ? $i18n.t('header.search_placeholder_short')
      : $i18n.t('header.search_placeholder')
  );

  const updateSearchMode = (): void => {
    if (!process.client) return;
    // Passer en mode compact sous tablette (768px)
    const compact = window.innerWidth < 768;
    if (compact !== isCompactSearch.value) {
      isCompactSearch.value = compact;
      if (!compact) {
        closeSearchPanel();
      }
    }
  };

  const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && isSearchPanelOpen.value) {
      closeSearchPanel();
    }
  };

  // Fermer le menu mobile lors du clic extérieur
  const handleClickOutside = (event: Event): void => {
    if (process.client) {
      const target = event.target as HTMLElement;
      const navbar = target.closest('.navbar');
      if (!navbar && isMobileMenuOpen.value) {
        closeMobileMenu();
      }
    }
  };

  // Lifecycle hooks
  onMounted(() => {
    if (process.client) {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', updateSearchMode);
      window.addEventListener('keydown', handleKeydown);
      document.addEventListener('click', handleClickOutside);
      updateSearchMode();
    }
  });

  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateSearchMode);
      window.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
    }
  });

  // Watcher pour fermer le menu lors du changement de route
  watch(
    () => route.path,
    () => {
      closeMobileMenu();
      closeSearchPanel();
    }
  );
</script>

<style lang="scss" scoped>
  .navbar {
    position: relative;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(var(--color-muted-rgb), 0.1);
    transition: all 0.3s ease;

    &.navbar-scrolled {
      background: rgba(255, 255, 255, 0.98);
      border-bottom-color: rgba(var(--color-muted-rgb), 0.2);
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }

    .navbar-container {
      max-width: var(--max-width-content);
      margin: 0 auto;
      padding: 1rem 1cm;
      display: flex;
      align-items: center;
      gap: clamp(1rem, 2vw, 1.5rem);
      min-height: var(--header-height, 80px);
      font-family: var(--font-family-base);
    }

    .navbar-search {
      width: auto;
      max-width: none;
      display: flex;
      align-items: stretch;
      border: 1px solid rgba(var(--color-muted-rgb), 0.3);
      border-radius: 0;
      overflow: hidden;
      background: var(--color-white);
      transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;

      &:focus-within {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 1px rgba(var(--color-primary-rgb), 0.15);
      }

      .search-input {
        flex: 1 1 auto;
        border: none;
        padding: 0 0.75rem;
        font-size: 0.9rem;
        color: #404447;
        height: 38px;

        &:focus {
          outline: none;
        }
      }

      .search-button {
        width: 44px;
        border: none;
        border-left: 1px solid rgba(var(--color-muted-rgb), 0.3);
        background: transparent;
        color: var(--color-muted);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
          color 0.2s ease,
          background-color 0.2s ease;

        &:hover {
          color: var(--color-primary);
          background-color: rgba(var(--color-primary-rgb), 0.05);
        }
      }
    }

    .navbar-search--desktop {
      flex: 1 1 auto;
      min-width: 200px;
      max-width: 400px;
      margin: 0 auto;
    }

    .navbar-search-trigger {
      width: 48px;
      height: 48px;
      border: 1px solid rgba(var(--color-muted-rgb), 0.3);
      background: transparent;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-muted);
      cursor: pointer;
      transition:
        color 0.2s ease,
        border-color 0.2s ease,
        background-color 0.2s ease;

      &:hover {
        color: var(--color-primary);
        border-color: var(--color-primary);
        background-color: rgba(var(--color-primary-rgb), 0.05);
      }
    }

    .navbar-search--mobile {
      display: none;
      width: 100%;
      margin-bottom: 1.5rem;
    }

    .navbar-brand {
      flex-shrink: 0;
      white-space: nowrap;

      .brand-link {
        text-decoration: none;
        color: inherit;
        display: block;
      }

      .brand-title {
        font-size: clamp(1.1rem, 2vw, 1.4rem);
        font-weight: 400;
        margin: 0;
        color: var(--color-muted);
        text-transform: uppercase;
        line-height: 1.05;

        .brand-name-top,
        .brand-name-bottom {
          display: block;
        }

        .brand-name-top {
          letter-spacing: 0.25em;
        }

        .brand-name-bottom {
          letter-spacing: 0.2em;
        }
      }
    }

    .navbar-nav {
      flex: 0 0 auto;
      min-width: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: clamp(0.8rem, 1.8vw, 2.2rem);
      flex-shrink: 0;

      .nav-list {
        display: flex;
        align-items: center;
        gap: clamp(0.6rem, 1.5vw, 1.8rem);
        margin: 0;
        padding: 0;
        list-style: none;
        flex-wrap: nowrap;
        min-width: 0;
        white-space: nowrap;

        .nav-item {
          .nav-link {
            text-decoration: none;
            color: var(--color-muted);
            font-size: clamp(0.7rem, 1.4vw, 0.9rem);
            font-weight: 500;
            letter-spacing: clamp(0.02em, 0.18vw, 0.08em);
            text-transform: uppercase;
            padding: 0.5rem 0;
            position: relative;
            transition: all 0.3s ease;

            &::after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 0;
              width: 0;
              height: 2px;
              background: var(--color-primary);
              transition: width 0.3s ease;
            }

            &:hover,
            &.active {
              color: var(--color-primary);

              &::after {
                width: 100%;
              }
            }
          }
        }
      }

      .language-selector {
        display: flex;
        gap: 0.5rem;
        padding-left: clamp(0.5rem, 1vw, 1rem);
        border-left: 1px solid rgba(var(--color-muted-rgb), 0.2);
        flex-shrink: 0;

        .language-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.6rem;
          border: 1px solid rgba(var(--color-muted-rgb), 0.3);
          background: transparent;
          color: var(--color-muted);
          font-size: clamp(0.6rem, 1vw, 0.72rem);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 2px;
          flex-shrink: 0;

          .flag-icon {
            width: 16px;
            height: 12px;
            object-fit: cover;
          }

          &:hover,
          &.active {
            background: var(--color-primary);
            border-color: var(--color-primary);
            color: var(--color-white);
          }
        }
      }
    }

    .mobile-menu-btn {
      display: none;
      flex-direction: column;
      justify-content: space-around;
      width: 30px;
      height: 30px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      margin-left: auto;

      .hamburger-line {
        width: 100%;
        height: 2px;
        background: var(--color-muted);
        transition: all 0.3s ease;
        transform-origin: 1px;
      }

      &.active {
        .hamburger-line {
          &:nth-child(1) {
            transform: rotate(45deg);
          }

          &:nth-child(2) {
            opacity: 0;
          }

          &:nth-child(3) {
            transform: rotate(-45deg);
          }
        }
      }
    }

    // Responsive - 3 formats uniquement
    // 1. ORDINATEUR (> 1024px) : par défaut, pas de media query

    // 2. TABLETTE (768px - 1024px)
    @media (max-width: 1024px) {
      .navbar-container {
        padding: 1rem 1.5rem;
        gap: 1rem;
      }

      .navbar-brand {
        .brand-title {
          font-size: 1.2rem;
        }
      }

      .navbar-search--desktop {
        min-width: 180px;
        max-width: 280px;
      }

      .navbar-nav {
        gap: 1.2rem;

        .nav-list {
          gap: 0.8rem;

          .nav-link {
            font-size: 0.85rem;
            letter-spacing: 0.05em;
          }
        }

        .language-selector {
          padding-left: 0.75rem;
          gap: 0.4rem;

          .language-btn {
            padding: 0.3rem 0.5rem;
            font-size: 0.7rem;
          }
        }
      }
    }

    // 3. SMARTPHONE (< 768px)
    @media (max-width: 768px) {
      .navbar-container {
        padding: 0.75rem 1rem;
        min-height: 70px;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .navbar-brand {
        .brand-title {
          font-size: 1.25rem;
        }
      }

      .navbar-search--desktop,
      .navbar-search-trigger {
        display: none;
      }

      .mobile-menu-btn {
        display: flex;
      }

      .navbar-nav {
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(10px);
        flex-direction: column;
        padding: 2rem;
        gap: 2rem;
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        border-bottom: 1px solid rgba(var(--color-muted-rgb), 0.1);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

        &.navbar-nav-open {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        .navbar-search--mobile {
          display: flex;
        }

        .nav-list {
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;

          .nav-item {
            width: 100%;
            text-align: center;

            .nav-link {
              display: block;
              padding: 1rem;
              font-size: 1rem;
              border-bottom: 1px solid rgba(var(--color-muted-rgb), 0.1);

              &::after {
                display: none;
              }
            }
          }
        }

        .language-selector {
          justify-content: center;
          padding-left: 0;
          border-left: none;
          border-top: 1px solid rgba(var(--color-muted-rgb), 0.2);
          padding-top: 1rem;

          .language-btn {
            padding: 0.6rem 1rem;
            font-size: 0.8rem;
          }
        }
      }
    }
  }

  .search-panel-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1500;
    padding: 1rem;
  }

  .search-panel {
    width: min(480px, 90vw);
    background: var(--color-white);
    border-radius: 4px;
    padding: 1rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    display: flex;
    gap: 0.5rem;
    align-items: center;
    position: relative;
  }

  .search-panel-input {
    flex: 1;
    border: 1px solid rgba(var(--color-muted-rgb), 0.4);
    padding: 0.65rem 0.9rem;
    font-size: 1rem;
  }

  .search-panel-btn {
    border: none;
    background: var(--color-primary);
    color: var(--color-white);
    padding: 0.6rem 1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    cursor: pointer;
    border-radius: 4px;
  }

  .search-panel-close {
    position: absolute;
    top: 0.3rem;
    right: 0.5rem;
    border: none;
    background: transparent;
    font-size: 1.2rem;
    cursor: pointer;
    color: var(--color-muted);
  }
</style>
