<template>
  <header class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="navbar-container">
      <!-- Logo / Titre -->
      <div class="navbar-brand">
        <NuxtLink :to="localePath('/')" class="brand-link">
          <h1 class="brand-title">Patrick Laumond</h1>
          <span class="brand-subtitle">{{ $t('navbar.MétaHisme') }}</span>
        </NuxtLink>
      </div>

      <!-- Navigation principale -->
      <nav class="navbar-nav" :class="{ 'navbar-nav-open': isMobileMenuOpen }">
        <ul class="nav-list">
          <li class="nav-item">
            <NuxtLink
              :to="localePath('/')"
              class="nav-link"
              :class="{ active: isCurrentRoute('/') }"
              @click="closeMobileMenu"
            >
              {{ $t('navbar.home') }}
            </NuxtLink>
          </li>
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
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import { useNuxtApp } from '#app';
  import { useLocalePath, useSwitchLocalePath } from '#imports';

  const route = useRoute();
  const router = useRouter();
  const { $i18n } = useNuxtApp();
  const localePath = useLocalePath();
  const switchLocalePath = useSwitchLocalePath();

  const isScrolled = ref(false);
  const isMobileMenuOpen = ref(false);

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

  // Vérifier si une route est active
  const isCurrentRoute = (path: string) => {
    const cleanPath = route.path.replace(/^\/(fr|en)/, '') || '/';
    return cleanPath === path || (path === '/' && cleanPath === '');
  };

  // Gestion du scroll
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 50;
  };

  // Gestion du menu mobile
  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
    if (process.client) {
      document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : '';
    }
  };

  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
    if (process.client) {
      document.body.style.overflow = '';
    }
  };

  // Fermer le menu mobile lors du clic extérieur
  const handleClickOutside = (event: Event) => {
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
      document.addEventListener('click', handleClickOutside);
    }
  });

  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
    }
  });

  // Watcher pour fermer le menu lors du changement de route
  watch(
    () => route.path,
    () => {
      closeMobileMenu();
    }
  );
</script>

<style lang="scss" scoped>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(117, 123, 125, 0.1);
    transition: all 0.3s ease;

    &.navbar-scrolled {
      background: rgba(255, 255, 255, 0.98);
      border-bottom-color: rgba(117, 123, 125, 0.2);
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }

    .navbar-container {
      max-width: var(--max-width-content);
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--header-height, 80px);
    }

    .navbar-brand {
      .brand-link {
        text-decoration: none;
        color: inherit;
        display: block;
      }

      .brand-title {
        font-size: 1.5rem;
        font-weight: 300;
        margin: 0;
        color: #757b7d;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        line-height: 1.2;
      }

      .brand-subtitle {
        font-size: 0.75rem;
        color: var(--color-text-light, #999);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        display: block;
        margin-top: 2px;
      }
    }

    .navbar-nav {
      display: flex;
      align-items: center;
      gap: 3rem;

      .nav-list {
        display: flex;
        align-items: center;
        gap: 2.5rem;
        margin: 0;
        padding: 0;
        list-style: none;

        .nav-item {
          .nav-link {
            text-decoration: none;
            color: #757b7d;
            font-size: 0.9rem;
            font-weight: 500;
            letter-spacing: 0.1em;
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
              background: #cc0000;
              transition: width 0.3s ease;
            }

            &:hover,
            &.active {
              color: #cc0000;

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
        padding-left: 1rem;
        border-left: 1px solid rgba(117, 123, 125, 0.2);

        .language-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.4rem 0.8rem;
          border: 1px solid rgba(117, 123, 125, 0.3);
          background: transparent;
          color: #757b7d;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 2px;

          .flag-icon {
            width: 16px;
            height: 12px;
            object-fit: cover;
          }

          &:hover,
          &.active {
            background: #cc0000;
            border-color: #cc0000;
            color: white;
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

      .hamburger-line {
        width: 100%;
        height: 2px;
        background: #757b7d;
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

    // Responsive
    @media (max-width: 1024px) {
      .navbar-container {
        padding: 0 1.5rem;
      }

      .navbar-nav {
        gap: 2rem;

        .nav-list {
          gap: 1.5rem;
        }
      }
    }

    @media (max-width: 768px) {
      .navbar-container {
        padding: 0 1rem;
        height: 70px;
      }

      .navbar-brand {
        .brand-title {
          font-size: 1.3rem;
        }

        .brand-subtitle {
          font-size: 0.7rem;
        }
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
        border-bottom: 1px solid rgba(117, 123, 125, 0.1);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

        &.navbar-nav-open {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
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
              border-bottom: 1px solid rgba(117, 123, 125, 0.1);

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
          border-top: 1px solid rgba(117, 123, 125, 0.2);
          padding-top: 1rem;

          .language-btn {
            padding: 0.6rem 1rem;
            font-size: 0.8rem;
          }
        }
      }
    }

    @media (max-width: 480px) {
      .navbar-container {
        padding: 0 0.8rem;
        height: 60px;
      }

      .navbar-brand {
        .brand-title {
          font-size: 1.1rem;
        }

        .brand-subtitle {
          font-size: 0.65rem;
        }
      }

      .mobile-menu-btn {
        width: 25px;
        height: 25px;
      }

      .navbar-nav {
        top: 60px;
        padding: 1.5rem;
      }
    }
  }
</style>
