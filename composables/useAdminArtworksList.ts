import { computed, reactive, readonly, ref, type ComputedRef } from 'vue';

import { useAdminAuth } from '~/composables/useAdminAuth';

export type AdminArtworkListItem = {
  id: string;
  title: string;
  categoryId: number | null;
  categoryName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  thumbnailUrl: string | null;
};

type AdminArtworksListResponse = {
  items: AdminArtworkListItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type AdminArtworksListQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string | null;
  trash?: boolean;
};

type FiltersState = Required<Omit<AdminArtworksListQuery, 'page' | 'pageSize'>>;

type UseAdminArtworksListReturn = {
  items: ComputedRef<AdminArtworkListItem[]>;
  loading: ComputedRef<boolean>;
  error: ComputedRef<string | null>;
  page: ComputedRef<number>;
  pageSize: ComputedRef<number>;
  total: ComputedRef<number>;
  totalPages: ComputedRef<number>;
  filters: Readonly<FiltersState>;
  fetchList: (query?: AdminArtworksListQuery) => Promise<void>;
};

export function useAdminArtworksList(): UseAdminArtworksListReturn {
  const { getSession } = useAdminAuth();

  const items = ref<AdminArtworkListItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const page = ref(1);
  const pageSize = ref(20);
  const total = ref(0);
  const totalPages = ref(1);

  const filters = reactive<FiltersState>({
    search: '',
    category: null,
    trash: false,
  });

  async function fetchList(query: AdminArtworksListQuery = {}): Promise<void> {
    loading.value = true;
    error.value = null;

    if (typeof query.page === 'number') {
      page.value = Math.max(1, query.page);
    }
    if (typeof query.pageSize === 'number') {
      pageSize.value = Math.min(100, Math.max(1, query.pageSize));
    }

    if (query.search !== undefined) {
      filters.search = query.search?.trim() ?? '';
    }
    if (query.category !== undefined) {
      filters.category = query.category && query.category.length > 0 ? query.category : null;
    }
    if (query.trash !== undefined) {
      filters.trash = query.trash;
    }

    try {
      const session = await getSession();
      const token = session?.access_token;
      if (!token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      const response = await $fetch<AdminArtworksListResponse>('/api/admin/artworks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        query: {
          page: page.value,
          pageSize: pageSize.value,
          search: filters.search || undefined,
          category: filters.category || undefined,
          trash: filters.trash ? 'true' : undefined,
        },
      });

      items.value = response.items;
      page.value = response.pagination.page;
      pageSize.value = response.pagination.pageSize;
      total.value = response.pagination.total;
      totalPages.value = Math.max(1, response.pagination.totalPages);
    } catch (err: unknown) {
      console.error('Erreur fetch liste œuvres', err);
      const fetchErr = err as { statusMessage?: string; message?: string };
      error.value =
        fetchErr.statusMessage ||
        fetchErr.message ||
        "Impossible de charger les œuvres pour l'instant. Réessayez plus tard.";
    } finally {
      loading.value = false;
    }
  }

  return {
    items: computed(() => items.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    page: computed(() => page.value),
    pageSize: computed(() => pageSize.value),
    total: computed(() => total.value),
    totalPages: computed(() => totalPages.value),
    filters: readonly(filters) as Readonly<FiltersState>,
    fetchList,
  };
}
