import type { Ref } from 'vue';

export type SiteText = {
  id: number;
  slug: string;
  category: string | null;
  contentFr: string | null;
  contentEn: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
};

export type UseAdminSiteTextsReturn = {
  items: Ref<SiteText[]>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  fetchTexts: () => Promise<void>;
  saveText: (slug: string, contentFr: string | null, contentEn: string | null) => Promise<void>;
  restoreText: (slug: string) => Promise<{ contentFr: string | null; contentEn: string | null }>;
};

export function useAdminSiteTexts(): UseAdminSiteTextsReturn {
  const items = ref<SiteText[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const { getSession } = useAdminAuth();

  async function fetchTexts(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const session = await getSession();
      const token = session?.access_token;
      if (!token) {
        error.value = 'Session expirée. Veuillez vous reconnecter.';
        return;
      }
      const data = await $fetch<SiteText[] | SiteText | null>('/api/admin/site-texts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      items.value = Array.isArray(data) ? data : data ? [data] : [];
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur lors du chargement des textes';
      error.value = msg;
      items.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function saveText(
    slug: string,
    contentFr: string | null,
    contentEn: string | null
  ): Promise<void> {
    const session = await getSession();
    const token = session?.access_token;
    if (!token) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    await $fetch(`/api/admin/site-texts/${encodeURIComponent(slug)}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: { contentFr, contentEn },
    });
  }

  async function restoreText(
    slug: string
  ): Promise<{ contentFr: string | null; contentEn: string | null }> {
    const session = await getSession();
    const token = session?.access_token;
    if (!token) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    const res = await $fetch<{ contentFr: string | null; contentEn: string | null }>(
      `/api/admin/site-texts/${encodeURIComponent(slug)}/restore`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res;
  }

  return { items, loading, error, fetchTexts, saveText, restoreText };
}
