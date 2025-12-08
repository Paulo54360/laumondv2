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
  const {
    isScrolled,
    isMobileMenuOpen,
    searchQuery,
    isCompactSearch,
    isSearchPanelOpen,
    currentLocale,
    searchPlaceholder,
    closeMobileMenu,
    closeSearchPanel,
    openSearchPanel,
    toggleMobileMenu,
    changeLanguage,
    performSearch,
    isCurrentRoute,
    localePath,
  } = useNavbar();
</script>

<style lang="scss" scoped>
  @use '~/assets/css/components/navbar.scss';
</style>
