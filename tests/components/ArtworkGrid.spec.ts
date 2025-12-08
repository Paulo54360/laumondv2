import { mount } from '@vue/test-utils';
import { ref } from 'vue';

import ArtworkGrid from '../../components/gallery/ArtworkGrid.vue';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../../composables/useS3', () => ({
  default: () => ({
    getArtworks: vi.fn(),
  }),
}));

describe('ArtworkGrid', () => {
  it('affiche un état de chargement initial', () => {
    const wrapper = mount(ArtworkGrid, {
      props: { category: 'deployments' },
    });

    expect(wrapper.find('.loading').exists()).toBe(true);
    expect(wrapper.text()).toContain('gallery.loading');
  });

  it('affiche une erreur si le chargement échoue', async () => {
    const { useS3 } = await import('../../composables/useS3');
    const mockGetArtworks = vi.fn().mockRejectedValue(new Error('Failed'));
    vi.mocked(useS3().getArtworks).mockImplementation(mockGetArtworks);

    const wrapper = mount(ArtworkGrid, {
      props: { category: 'deployments' },
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(wrapper.find('.error').exists()).toBe(true);
  });

  it("affiche la grille d'œuvres après chargement réussi", async () => {
    const mockArtworks = [
      {
        title: 'Test Artwork',
        description: 'Test description',
        images: ['https://example.com/image.jpg'],
      },
    ];

    const { useS3 } = await import('../../composables/useS3');
    const mockGetArtworks = vi.fn().mockResolvedValue(mockArtworks);
    vi.mocked(useS3().getArtworks).mockImplementation(mockGetArtworks);

    const wrapper = mount(ArtworkGrid, {
      props: { category: 'deployments' },
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(wrapper.find('.grid').exists()).toBe(true);
    expect(wrapper.findAll('.artwork-card')).toHaveLength(1);
    expect(wrapper.text()).toContain('Test Artwork');
  });

  it('émet un événement select au clic sur une œuvre', async () => {
    const mockArtworks = [
      {
        title: 'Test Artwork',
        description: 'Test description',
        images: ['https://example.com/image.jpg'],
      },
    ];

    const { useS3 } = await import('../../composables/useS3');
    const mockGetArtworks = vi.fn().mockResolvedValue(mockArtworks);
    vi.mocked(useS3().getArtworks).mockImplementation(mockGetArtworks);

    const wrapper = mount(ArtworkGrid, {
      props: { category: 'deployments' },
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    await wrapper.find('.artwork-card').trigger('click');

    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')?.[0]).toEqual([mockArtworks[0]]);
  });
});
