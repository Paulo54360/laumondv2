import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useAdminSiteTexts } from '~/composables/useAdminSiteTexts';

const getSessionMock = vi.fn(() => Promise.resolve({ access_token: 'token' }));

describe('useAdminSiteTexts', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getSessionMock.mockReset();
    getSessionMock.mockResolvedValue({ access_token: 'token' });
    fetchMock = vi.fn();
    vi.stubGlobal('$fetch', fetchMock);
    vi.stubGlobal('useAdminAuth', () => ({
      getSession: getSessionMock,
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('charge les textes et remplit items', async () => {
    const data = [
      {
        id: 1,
        slug: 'biography',
        contentFr: 'Contenu FR',
        contentEn: 'Content EN',
        updatedAt: '2025-01-01T12:00:00Z',
        updatedBy: null,
      },
    ];
    fetchMock.mockResolvedValue(data);

    const { items, loading, error, fetchTexts } = useAdminSiteTexts();

    await fetchTexts();

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/admin/site-texts',
      expect.objectContaining({
        headers: { Authorization: 'Bearer token' },
      })
    );
    expect(items.value).toHaveLength(1);
    expect(items.value[0]?.slug).toBe('biography');
    expect(items.value[0]?.contentFr).toBe('Contenu FR');
    expect(loading.value).toBe(false);
    expect(error.value).toBeNull();
  });

  it('retourne une erreur quand la session est absente', async () => {
    getSessionMock.mockResolvedValue(null);

    const { error, fetchTexts } = useAdminSiteTexts();
    await fetchTexts();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(error.value).toContain('Session expirée');
  });

  it('saveText appelle PUT avec les bons paramètres', async () => {
    fetchMock.mockResolvedValue(undefined);

    const { saveText } = useAdminSiteTexts();
    await saveText('biography', 'Nouveau FR', 'New EN');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/admin/site-texts/biography',
      expect.objectContaining({
        method: 'PUT',
        body: { contentFr: 'Nouveau FR', contentEn: 'New EN' },
      })
    );
  });

  it('restoreText appelle POST restore et retourne le contenu', async () => {
    const restored = { contentFr: 'Ancien FR', contentEn: 'Old EN' };
    fetchMock.mockResolvedValue(restored);

    const { restoreText } = useAdminSiteTexts();
    const result = await restoreText('metahism');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/admin/site-texts/metahism/restore',
      expect.objectContaining({ method: 'POST' })
    );
    expect(result).toEqual(restored);
  });
});
