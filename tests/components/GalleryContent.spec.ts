import { mount } from '@vue/test-utils';
import { ref } from 'vue';

import GalleryContent from '../../components/gallery/GalleryContent.vue';

vi.mock('vue-i18n', () => ({
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  useI18n: () => ({
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
    t: (key: string, _params?: Record<string, any>) => {
      if (key === 'gallery.pagination.page_status') {
        return 'Page 1/2';
      }
      return key;
    },
  }),
}));

type MountOptions = {
  currentPage?: number;
  totalPages?: number;
  itemsPerPage?: number;
  imageCount?: number;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const mountGallery = (opts: MountOptions = {}) => {
  const imageCount = opts.imageCount ?? 5;
  const itemsPerPage = opts.itemsPerPage ?? 2;
  const images = Array.from({ length: imageCount }, (_, i) => `https://img/${i + 1}.jpg`);

  const imageUrls = ref(images);
  const currentPage = ref(opts.currentPage ?? 1);
  const totalPages = ref(opts.totalPages ?? Math.ceil(imageCount / itemsPerPage));
  const openModal = vi.fn();

  const wrapper = mount(GalleryContent, {
    props: { title: 'My Gallery' },
    global: {
      provide: {
        imageUrls,
        openModal,
        itemsPerPage,
        currentPage,
        totalPages,
      },
    },
  });

  return { wrapper, imageUrls, currentPage, totalPages, openModal, itemsPerPage };
};

describe('GalleryContent', (): void => {
  it('affiche les images de la page courante et le statut de pagination', (): void => {
    const { wrapper } = mountGallery({
      imageCount: 4,
      itemsPerPage: 2,
      currentPage: 1,
      totalPages: 2,
    });

    expect(wrapper.findAll('.image-container')).toHaveLength(2);
    expect(wrapper.text()).toContain('Page 1/2');
  });

  it('gère la pagination et les boutons correctement', async (): Promise<void> => {
    const { wrapper, currentPage } = mountGallery({
      imageCount: 4,
      itemsPerPage: 2,
      currentPage: 1,
      totalPages: 2,
    });

    const previous = wrapper.get('button:first-of-type');
    const next = wrapper.get('button:last-of-type');

    expect(previous.attributes('disabled')).toBeDefined();

    await next.trigger('click');
    expect(currentPage.value).toBe(2);
    expect(previous.attributes('disabled')).toBeUndefined();
    expect(next.attributes('disabled')).toBeDefined();

    await previous.trigger('click');
    expect(currentPage.value).toBe(1);
    expect(previous.attributes('disabled')).toBeDefined();
  });

  it('appelle openModal avec l’index global correct au clic', async (): Promise<void> => {
    const { wrapper, openModal } = mountGallery({
      imageCount: 3,
      itemsPerPage: 2,
      currentPage: 2,
      totalPages: 2,
    });

    await wrapper.find('.image-container').trigger('click');
    // Page 2, itemsPerPage 2 => startIndex = 2, donc premier item de la page a l’index global 2
    expect(openModal).toHaveBeenCalledWith(2);
  });
});
