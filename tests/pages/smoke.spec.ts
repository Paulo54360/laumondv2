/**
 * Smoke tests : les pages critiques se montent sans erreur et affichent un contenu attendu.
 * Pas de snapshots lourds, assertions ciblées.
 */
import { flushPromises, mount } from '@vue/test-utils';
import { h, ref, Suspense } from 'vue';

import Navbar from '../../components/layout/Navbar.vue';
import Biography from '../../pages/biography.vue';
import Galerie from '../../pages/galerie.vue';
import Index from '../../pages/index.vue';
import Search from '../../pages/search.vue';

vi.stubGlobal('definePageMeta', vi.fn());

vi.mock('vue-i18n', () => ({
  useI18n: (): { t: (key: string) => string; locale: { value: string } } => ({
    t: (key: string): string => key,
    locale: { value: 'fr' },
  }),
}));

vi.mock('vue-router', () => ({
  useRoute: (): { path: string; query: Record<string, string> } => ({
    path: '/fr',
    query: {},
  }),
  useRouter: (): { push: ReturnType<typeof vi.fn> } => ({
    push: vi.fn(),
  }),
}));

vi.mock('../../composables/useNavbar', () => ({
  useNavbar: (): {
    isScrolled: ReturnType<typeof ref<boolean>>;
    isMobileMenuOpen: ReturnType<typeof ref<boolean>>;
    searchQuery: ReturnType<typeof ref<string>>;
    isCompactSearch: ReturnType<typeof ref<boolean>>;
    isSearchPanelOpen: ReturnType<typeof ref<boolean>>;
    countdown: ReturnType<typeof ref<string>>;
    currentLocale: ReturnType<typeof ref<string>>;
    searchPlaceholder: ReturnType<typeof ref<string>>;
    closeMobileMenu: ReturnType<typeof vi.fn>;
    closeSearchPanel: ReturnType<typeof vi.fn>;
    openSearchPanel: ReturnType<typeof vi.fn>;
    toggleMobileMenu: ReturnType<typeof vi.fn>;
    changeLanguage: ReturnType<typeof vi.fn>;
    performSearch: ReturnType<typeof vi.fn>;
    isCurrentRoute: ReturnType<typeof vi.fn>;
    localePath: (path: string) => string;
  } => ({
    isScrolled: ref(false),
    isMobileMenuOpen: ref(false),
    searchQuery: ref(''),
    isCompactSearch: ref(false),
    isSearchPanelOpen: ref(false),
    countdown: ref(''),
    currentLocale: ref('fr'),
    searchPlaceholder: ref('Rechercher'),
    closeMobileMenu: vi.fn(),
    closeSearchPanel: vi.fn(),
    openSearchPanel: vi.fn(),
    toggleMobileMenu: vi.fn(),
    changeLanguage: vi.fn(),
    performSearch: vi.fn(),
    isCurrentRoute: vi.fn(() => false),
    localePath: (path: string): string => `/fr${path === '#' ? '#' : path}`,
  }),
}));

const mockSearchArtworks = vi.fn().mockResolvedValue([]);
vi.mock('../../composables/useSearch', () => ({
  useSearch: (): { searchArtworks: ReturnType<typeof vi.fn> } => ({
    searchArtworks: mockSearchArtworks,
  }),
}));

const mockGetArtworks = vi.fn().mockResolvedValue([]);
vi.mock('../../composables/useS3', () => ({
  useS3: (): { getArtworks: ReturnType<typeof vi.fn> } => ({
    getArtworks: mockGetArtworks,
  }),
}));

const mockFetchTexts = vi.fn().mockResolvedValue([]);
const mockGetContent = vi.fn().mockReturnValue(null);
vi.stubGlobal(
  'useSiteTexts',
  (): {
    fetchTexts: ReturnType<typeof vi.fn>;
    getContent: ReturnType<typeof vi.fn>;
  } => ({
    fetchTexts: mockFetchTexts,
    getContent: mockGetContent,
  })
);

vi.stubGlobal('useAsyncData', (_key: string, fn: () => Promise<unknown>) =>
  Promise.resolve({ data: fn(), pending: ref(false) })
);

describe('Pages smoke', (): void => {
  describe('index (homepage)', (): void => {
    it('se monte et affiche la zone homepage', async (): Promise<void> => {
      const wrapper = mount(
        {
          render() {
            return h(Suspense, null, {
              default: () => h(Index),
              fallback: () => h('div', 'loading'),
            });
          },
        },
        {
          global: {
            components: { Index, Suspense },
            stubs: {
              HomeHero: true,
              HomeBiographySection: true,
              HomeMetahismSection: true,
              HomeArtworksSection: true,
              HomeAnalysesSection: true,
            },
          },
        }
      );
      await flushPromises();
      expect(wrapper.find('.homepage').exists()).toBe(true);
    });
  });

  describe('galerie', (): void => {
    it('se monte et affiche les onglets de catégories', (): void => {
      const wrapper = mount(Galerie, {
        global: {
          mocks: { $t: (key: string): string => key },
          stubs: {
            GalleryArtworkGrid: true,
            GalleryArtworkModal: true,
          },
        },
      });
      expect(wrapper.find('.gallery-page').exists()).toBe(true);
      expect(wrapper.find('.category-tabs').exists()).toBe(true);
    });
  });

  describe('search', (): void => {
    it('se monte et affiche la zone search', (): void => {
      const wrapper = mount(Search);
      expect(wrapper.find('.search-page').exists()).toBe(true);
    });
  });

  describe('biography', (): void => {
    it('se monte et affiche le contenu et le menu nav', async (): Promise<void> => {
      const wrapper = mount(
        {
          render() {
            return h(Suspense, null, {
              default: () => h(Biography),
              fallback: () => h('div', 'loading'),
            });
          },
        },
        {
          global: {
            components: { Biography, Suspense },
            mocks: { $t: (key: string): string => key },
          },
        }
      );
      await flushPromises();
      expect(wrapper.find('.biography-page').exists()).toBe(true);
      expect(wrapper.find('.nav-menu').exists()).toBe(true);
    });
  });

  describe('navbar', (): void => {
    it('le bouton (*) pointe vers la page du grand mikado', (): void => {
      const NuxtLinkStub = {
        props: ['to'],
        template: '<a :href="to"><slot /></a>',
      };

      const wrapper = mount(Navbar, {
        global: {
          stubs: {
            NuxtLink: NuxtLinkStub,
          },
          mocks: {
            $t: (key: string): string => key,
          },
        },
      });

      const symbolLink = wrapper.find('.nav-link--symbol');
      expect(symbolLink.exists()).toBe(true);
      expect(symbolLink.attributes('href')).toContain('le-grand-mikado-de-la-pensee-humaine');
    });
  });
});
