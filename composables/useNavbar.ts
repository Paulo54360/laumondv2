import type { Ref, ComputedRef } from 'vue';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// @ts-expect-error - Provided by Nuxt auto-imports at build time
import { useLocalePath, useNuxtApp, useSwitchLocalePath } from '#imports';

export interface IUseNavbarReturn {
  isScrolled: Ref<boolean>;
  isMobileMenuOpen: Ref<boolean>;
  searchQuery: Ref<string>;
  isCompactSearch: Ref<boolean>;
  isSearchPanelOpen: Ref<boolean>;
  currentLocale: ComputedRef<string>;
  searchPlaceholder: ComputedRef<string>;
  closeMobileMenu: () => void;
  closeSearchPanel: () => void;
  openSearchPanel: () => void;
  toggleMobileMenu: () => void;
  changeLanguage: (newLocale: string) => Promise<void>;
  performSearch: () => void;
  isCurrentRoute: (path: string) => boolean;
  localePath: (path: string | { path: string; query?: Record<string, string> }) => string;
}

export function useNavbar(): IUseNavbarReturn {
  const route = useRoute();
  const router = useRouter();
  const { $i18n } = useNuxtApp();
  const localePath = useLocalePath();
  const switchLocalePath = useSwitchLocalePath();

  // State
  const isScrolled = ref(false);
  const isMobileMenuOpen = ref(false);
  const searchQuery = ref('');
  const isCompactSearch = ref(false);
  const isSearchPanelOpen = ref(false);

  // Computeds
  const currentLocale = computed(() => {
    return $i18n.locale.value || 'fr';
  });

  const searchPlaceholder = computed(() =>
    isCompactSearch.value
      ? $i18n.t('header.search_placeholder_short')
      : $i18n.t('header.search_placeholder')
  );

  // Actions
  const closeMobileMenu = (): void => {
    isMobileMenuOpen.value = false;
    if (process.client) {
      document.body.style.overflow = '';
    }
  };

  const closeSearchPanel = (): void => {
    isSearchPanelOpen.value = false;
  };

  const openSearchPanel = (): void => {
    isSearchPanelOpen.value = true;
  };

  const toggleMobileMenu = (): void => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
    if (process.client) {
      document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : '';
    }
  };

  const changeLanguage = async (newLocale: string): Promise<void> => {
    try {
      await $i18n.setLocale(newLocale);
      const target = switchLocalePath(newLocale);
      await router.push(target);
      closeMobileMenu();
    } catch (error) {
      console.error('Error changing language:', error);
      window.location.href = `/${newLocale}${route.path.replace(/^\/(fr|en)/, '')}`;
    }
  };

  const performSearch = (): void => {
    const value = searchQuery.value.trim();
    if (!value) return;

    const searchUrl = localePath({ path: '/search', query: { q: value } });
    router.push(searchUrl);
    searchQuery.value = '';
    closeSearchPanel();
  };

  const isCurrentRoute = (path: string): boolean => {
    const cleanPath = route.path.replace(/^\/(fr|en)/, '') || '/';
    return cleanPath === path || (path === '/' && cleanPath === '');
  };

  // Event Handlers
  const handleScroll = (): void => {
    isScrolled.value = window.scrollY > 50;
  };

  const updateSearchMode = (): void => {
    if (!process.client) return;
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

  const handleClickOutside = (event: Event): void => {
    if (process.client) {
      const target = event.target as HTMLElement;
      const navbar = target.closest('.navbar');
      if (!navbar && isMobileMenuOpen.value) {
        closeMobileMenu();
      }
    }
  };

  // Lifecycle
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

  watch(
    () => route.path,
    () => {
      closeMobileMenu();
      closeSearchPanel();
    }
  );

  return {
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
    localePath, // Used in template
  };
}
