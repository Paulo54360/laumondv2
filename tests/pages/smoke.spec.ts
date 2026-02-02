/**
 * Smoke tests : les pages critiques se montent sans erreur et affichent un contenu attendu.
 * Pas de snapshots lourds, assertions ciblées.
 */
import { mount, shallowMount } from '@vue/test-utils';

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

describe('Pages smoke', (): void => {
  describe('index (homepage)', (): void => {
    it('se monte et affiche la zone homepage', (): void => {
      const wrapper = shallowMount(Index, {
        global: {
          stubs: {
            HomeHero: true,
            HomeBiographySection: true,
            HomeMetahismSection: true,
            HomeArtworksSection: true,
            HomeAnalysesSection: true,
          },
        },
      });
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
    it('se monte et affiche le contenu et le menu nav', (): void => {
      const wrapper = mount(Biography, {
        global: {
          mocks: { $t: (key: string): string => key },
        },
      });
      expect(wrapper.find('.biography-page').exists()).toBe(true);
      expect(wrapper.find('.nav-menu').exists()).toBe(true);
    });
  });
});
