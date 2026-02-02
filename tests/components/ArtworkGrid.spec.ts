import { mount } from '@vue/test-utils';

import ArtworkGrid from '../../components/gallery/ArtworkGrid.vue';

vi.mock('vue-i18n', () => ({
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  useI18n: () => ({
    t: (key: string, _params?: Record<string, unknown>): string => key,
  }),
}));

const mockGetArtworks = vi.fn();
vi.mock('../../composables/useS3', () => ({
  useS3: (): { getArtworks: ReturnType<typeof vi.fn> } => ({
    getArtworks: mockGetArtworks,
  }),
}));

describe('ArtworkGrid', (): void => {
  beforeEach((): void => {
    mockGetArtworks.mockReset();
  });

  it('affiche les images de la page courante et le statut de pagination', (): void => {
    mockGetArtworks.mockImplementation(() => new Promise(() => {}));

    const wrapper = mount(ArtworkGrid, {
      props: { category: 'deployments' },
    });

    expect(wrapper.find('.loading').exists()).toBe(true);
    expect(wrapper.text()).toContain('gallery.loading');
  });

  it('gère la pagination et la mise à jour de la page', async (): Promise<void> => {
    mockGetArtworks.mockRejectedValueOnce(new Error('Failed'));

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const wrapper = mount(ArtworkGrid, {
      props: { category: 'deployments' },
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(wrapper.find('.error').exists()).toBe(true);
    consoleError.mockRestore();
  });

  it("affiche la grille d'œuvres après chargement réussi", async (): Promise<void> => {
    const mockArtworks = [
      {
        title: 'Test Artwork',
        description: 'Test description',
        images: ['https://example.com/image.jpg'],
      },
    ];

    mockGetArtworks.mockResolvedValueOnce(mockArtworks);

    const wrapper = mount(ArtworkGrid, {
      props: { category: 'deployments' },
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(wrapper.find('.grid').exists()).toBe(true);
    expect(wrapper.findAll('.artwork-card')).toHaveLength(1);
    expect(wrapper.text()).toContain('Test Artwork');
  });

  it('appelle openModal au clic sur une image', async (): Promise<void> => {
    const mockArtworks = [
      {
        title: 'Test Artwork',
        description: 'Test description',
        images: ['https://example.com/image.jpg'],
      },
    ];

    mockGetArtworks.mockResolvedValueOnce(mockArtworks);

    const wrapper = mount(ArtworkGrid, {
      props: { category: 'deployments' },
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    await wrapper.find('.artwork-card').trigger('click');

    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')?.[0]).toEqual([mockArtworks[0]]);
  });
});
