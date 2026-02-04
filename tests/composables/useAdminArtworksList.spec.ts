import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useAdminArtworksList } from '~/composables/useAdminArtworksList';

const getSessionMock = vi.fn(() => Promise.resolve({ access_token: 'token' }));

vi.mock('~/composables/useAdminAuth', () => {
  return {
    useAdminAuth(): { getSession: typeof getSessionMock } {
      return {
        getSession: getSessionMock,
      };
    },
  };
});

describe('useAdminArtworksList', () => {
  beforeEach(() => {
    getSessionMock.mockReset();
    getSessionMock.mockResolvedValue({ access_token: 'token' });
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('charge les œuvres et met à jour la pagination', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      items: [
        {
          id: '1',
          title: 'Œuvre test',
          categoryId: 1,
          categoryName: 'Archetypes',
          createdAt: '2025-01-01T12:00:00Z',
          updatedAt: '2025-01-02T12:00:00Z',
          thumbnailUrl: 'https://example.com/foo.jpg',
        },
      ],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 1,
        totalPages: 1,
      },
    });
    vi.stubGlobal('$fetch', fetchMock);

    const { items, total, page, fetchList } = useAdminArtworksList();

    await fetchList();

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/admin/artworks',
      expect.objectContaining({
        query: expect.objectContaining({ page: 1 }),
      })
    );
    expect(items.value).toHaveLength(1);
    expect(total.value).toBe(1);
    expect(items.value[0]?.thumbnailUrl).toBe('https://example.com/foo.jpg');
    expect(page.value).toBe(1);
  });

  it('retourne une erreur quand la session est absente', async () => {
    getSessionMock.mockResolvedValue(null);
    vi.stubGlobal('$fetch', vi.fn());

    const { error, fetchList } = useAdminArtworksList();
    await fetchList();

    expect(error.value).toContain('Session expirée');
  });
});
