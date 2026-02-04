<!-- Page Corbeille — Story S1.4 -->
<template>
  <div class="admin-trash">
    <AdminHeader
      title="Corbeille"
      subtitle="Œuvres supprimées. Restaurez ou supprimez définitivement."
      @logout="onLogout"
    />

    <div
      v-if="restoredSuccess"
      class="admin-trash__toast admin-trash__toast--success"
      role="status"
    >
      Œuvre restaurée.
      <button type="button" class="admin-trash__toast-close" @click="restoredSuccess = false">
        ×
      </button>
    </div>

    <section class="admin-trash__nav">
      <NuxtLink :to="localePath('/admin/artworks')" class="btn-artistic admin-trash__back">
        ← Retour à la liste
      </NuxtLink>
    </section>

    <section class="admin-trash__filters">
      <div class="admin-trash__filter">
        <label class="admin-trash__label" for="search">Recherche</label>
        <input
          id="search"
          v-model="searchTerm"
          type="search"
          placeholder="Titre de l'œuvre…"
          class="admin-trash__input"
        />
      </div>
      <div class="admin-trash__filter">
        <label class="admin-trash__label" for="category">Catégorie</label>
        <select
          id="category"
          v-model="selectedCategory"
          class="admin-trash__select"
          :disabled="categoriesLoading"
        >
          <option value="">Toutes les catégories</option>
          <option v-for="cat in categoryOptions" :key="cat.id" :value="String(cat.id)">
            {{ cat.name }}
          </option>
        </select>
      </div>
    </section>

    <section class="admin-trash__list">
      <div v-if="errorMessage" class="admin-trash__status admin-trash__status--error">
        {{ errorMessage }}
      </div>
      <div v-else-if="categoriesError" class="admin-trash__status admin-trash__status--error">
        {{ categoriesError }}
      </div>
      <div v-else-if="loading" class="admin-trash__status">Chargement…</div>
      <div v-else-if="items.length === 0" class="admin-trash__status">La corbeille est vide.</div>
      <div v-else class="admin-trash__grid">
        <div class="admin-trash__row admin-trash__row--head">
          <div class="admin-trash__col admin-trash__col--thumb">Miniature</div>
          <div class="admin-trash__col admin-trash__col--title">Titre</div>
          <div class="admin-trash__col admin-trash__col--cat">Catégorie</div>
          <div class="admin-trash__col admin-trash__col--date">Supprimée le</div>
          <div class="admin-trash__col admin-trash__col--actions">Actions</div>
        </div>
        <div v-for="item in items" :key="item.id" class="admin-trash__row admin-trash__row--data">
          <div class="admin-trash__col admin-trash__col--thumb">
            <img
              v-if="item.thumbnailUrl"
              :src="proxiedUrl(item.thumbnailUrl)"
              alt=""
              width="64"
              height="64"
              loading="lazy"
              class="admin-trash__thumb"
            />
            <span v-else class="admin-trash__thumb-placeholder">—</span>
          </div>
          <div class="admin-trash__col admin-trash__col--title">{{ item.title }}</div>
          <div class="admin-trash__col admin-trash__col--cat">
            {{ item.categoryName || '—' }}
          </div>
          <div class="admin-trash__col admin-trash__col--date">
            {{ formatDate(item.deletedAt || item.updatedAt) }}
          </div>
          <div class="admin-trash__col admin-trash__col--actions">
            <BaseButton
              variant="outline"
              size="sm"
              :disabled="actionLoading === item.id"
              :is-loading="actionLoading === item.id"
              @click="restore(item)"
            >
              Restaurer
            </BaseButton>
            <BaseButton
              variant="outline"
              size="sm"
              :disabled="actionLoading === item.id"
              @click="confirmPurge(item)"
            >
              Supprimer définitivement
            </BaseButton>
          </div>
        </div>
      </div>
    </section>

    <footer v-if="total > 0" class="admin-trash__pagination">
      <span>{{ rangeLabel }}</span>
      <div class="admin-trash__pagination-controls">
        <BaseButton variant="outline" size="sm" :disabled="page <= 1" @click="changePage(page - 1)">
          ← Précédent
        </BaseButton>
        <BaseButton
          variant="outline"
          size="sm"
          :disabled="page >= totalPages"
          @click="changePage(page + 1)"
        >
          Suivant →
        </BaseButton>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

  import { useAdminArtworksList } from '~/composables/useAdminArtworksList';
  import { useAdminAuth } from '~/composables/useAdminAuth';
  import { useImageProxy } from '~/composables/useImageProxy';
  import { mapCategoriesToCanonical, type RawCategoryRow } from '~/utils/adminCategories';

  defineOptions({ name: 'AdminTrash' });

  definePageMeta({
    layout: 'default',
    middleware: 'admin-auth',
  });

  const router = useRouter();
  const route = useRoute();
  const localePath = useLocalePath();
  const { logout, getSession } = useAdminAuth();
  const proxiedUrl = useImageProxy();

  const { items, loading, error, page, pageSize, total, totalPages, fetchList } =
    useAdminArtworksList();

  type CategoryOption = { id: number; name: string };
  const categoryOptions = ref<CategoryOption[]>([]);
  const restoredSuccess = ref(route.query.restored === '1');
  const categoriesError = ref<string | null>(null);
  const categoriesLoading = ref(false);
  const searchTerm = ref('');
  const selectedCategory = ref('');
  const actionLoading = ref<string | null>(null);
  const actionError = ref('');

  const errorMessage = computed(() => actionError.value || error.value);

  const rangeLabel = computed(() => {
    if (!total.value) return '0 résultat';
    const start = (page.value - 1) * pageSize.value + 1;
    const end = Math.min(total.value, start + pageSize.value - 1);
    return `${start} – ${end} sur ${total.value}`;
  });

  async function loadCategories(): Promise<void> {
    categoriesLoading.value = true;
    categoriesError.value = null;
    try {
      const session = await getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Session expirée.');
      const response = await $fetch<{ categories: RawCategoryRow[] }>('/api/admin/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      categoryOptions.value = mapCategoriesToCanonical(response.categories ?? []);
    } catch (err: unknown) {
      console.error('Erreur chargement catégories', err);
      const fetchErr = err as { statusMessage?: string; message?: string };
      categoriesError.value =
        fetchErr.statusMessage || fetchErr.message || 'Impossible de charger les catégories.';
    } finally {
      categoriesLoading.value = false;
    }
  }

  let searchDebounce: ReturnType<typeof setTimeout> | null = null;

  watch(searchTerm, (value) => {
    if (searchDebounce) clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      fetchList({
        page: 1,
        search: value || undefined,
        category: selectedCategory.value || undefined,
        trash: true,
      });
    }, 350);
  });

  watch(selectedCategory, (value, oldValue) => {
    if (value === oldValue) return;
    fetchList({
      page: 1,
      search: searchTerm.value || undefined,
      category: value || undefined,
      trash: true,
    });
  });

  function changePage(targetPage: number): void {
    fetchList({
      page: targetPage,
      search: searchTerm.value || undefined,
      category: selectedCategory.value || undefined,
      trash: true,
    });
  }

  function formatDate(value: string | null): string {
    if (!value) return '—';
    try {
      const date = new Date(value);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return value;
    }
  }

  async function onLogout(): Promise<void> {
    await logout();
    await router.replace(localePath('/admin/login'));
  }

  async function restore(item: { id: string }): Promise<void> {
    actionLoading.value = item.id;
    actionError.value = '';
    try {
      const session = await getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Session expirée.');
      await $fetch(`/api/admin/artworks/${item.id}`, {
        method: 'PATCH',
        body: { action: 'restore' },
        headers: { Authorization: `Bearer ${token}` },
      });
      await router.push({ path: '/admin/artworks', query: { restored: '1' } });
    } catch (err) {
      console.error('Erreur restauration', err);
      const e = err as { data?: { statusMessage?: string }; statusMessage?: string };
      actionError.value =
        e.data?.statusMessage ?? e.statusMessage ?? 'Erreur lors de la restauration.';
    } finally {
      actionLoading.value = null;
    }
  }

  async function confirmPurge(item: { id: string; title: string }): Promise<void> {
    const ok = window.confirm(
      `Supprimer définitivement « ${item.title} » ? Cette action est irréversible.`
    );
    if (!ok) return;
    actionLoading.value = item.id;
    actionError.value = '';
    try {
      const session = await getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Session expirée.');
      await $fetch(`/api/admin/artworks/${item.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchList({
        page: page.value,
        search: searchTerm.value || undefined,
        category: selectedCategory.value || undefined,
        trash: true,
      });
    } catch (err) {
      console.error('Erreur purge', err);
      const e = err as { data?: { statusMessage?: string }; statusMessage?: string };
      actionError.value =
        e.data?.statusMessage ?? e.statusMessage ?? 'Erreur lors de la suppression définitive.';
    } finally {
      actionLoading.value = null;
    }
  }

  onMounted(async () => {
    await Promise.all([loadCategories(), fetchList({ page: 1, trash: true })]);
  });

  onBeforeUnmount(() => {
    if (searchDebounce) clearTimeout(searchDebounce);
  });
</script>

<style scoped lang="scss">
  .admin-trash {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1.5rem 3rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .admin-trash__toast {
    padding: 1rem 1.5rem;
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .admin-trash__toast--success {
    background: rgba(0, 128, 0, 0.1);
    color: #2d6a2d;
  }

  .admin-trash__toast-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0 0.25rem;
  }

  .admin-trash__nav {
    margin-bottom: -1rem;
  }

  .admin-trash__back {
    display: inline-flex;
  }

  .admin-trash__filters {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .admin-trash__filter {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .admin-trash__label {
    font-size: 0.85rem;
    color: var(--color-text-light);
  }

  .admin-trash__input,
  .admin-trash__select {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
  }

  .admin-trash__grid {
    display: grid;
    grid-template-columns: 72px 1fr 120px 120px 260px;
    column-gap: 0;
    row-gap: 0;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    overflow: hidden;
  }

  .admin-trash__row {
    display: contents;
  }

  .admin-trash__row > .admin-trash__col {
    display: flex;
    align-items: center;
    padding: 0.75rem 0;
  }

  .admin-trash__row > .admin-trash__col:first-child {
    padding-left: 1rem;
  }

  .admin-trash__row > .admin-trash__col:last-child {
    padding-right: 1rem;
  }

  .admin-trash__row--head > .admin-trash__col {
    background: #f8f9fa;
    font-size: 0.8rem;
    letter-spacing: 0.05em;
    color: var(--color-text-light);
    border-bottom: 1px solid var(--color-border);
    padding: 0.75rem 0;

    &.admin-trash__col--thumb {
      justify-content: center;
    }

    &.admin-trash__col--title,
    &.admin-trash__col--cat,
    &.admin-trash__col--date {
      justify-content: flex-start;
    }

    &.admin-trash__col--actions {
      justify-content: flex-end;
    }
  }

  .admin-trash__row--data > .admin-trash__col {
    border-bottom: 1px solid var(--color-border);
  }

  .admin-trash__row--data:last-child > .admin-trash__col {
    border-bottom: none;
  }

  .admin-trash__col--thumb {
    justify-content: center;
  }

  .admin-trash__col--title {
    font-weight: 600;
  }

  .admin-trash__col--actions {
    gap: 0.5rem;
    justify-content: flex-end;
  }

  .admin-trash__thumb {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 6px;
  }

  .admin-trash__thumb-placeholder {
    color: var(--color-text-light);
    font-style: italic;
  }

  .admin-trash__status {
    padding: 1.5rem;
    text-align: center;
    color: var(--color-text-light);
  }

  .admin-trash__status--error {
    color: var(--color-primary);
  }

  .admin-trash__pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 0;
  }

  .admin-trash__pagination-controls {
    display: flex;
    gap: 0.5rem;
  }

  @media (max-width: 768px) {
    .admin-trash__grid {
      grid-template-columns: 72px 1fr auto;
    }

    .admin-trash__col--cat,
    .admin-trash__col--date {
      display: none;
    }
  }
</style>
