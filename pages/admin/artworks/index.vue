<template>
  <div class="admin-artworks">
    <AdminHeader
      title="Gestion des œuvres"
      subtitle="Consultez et modifiez les œuvres existantes."
      @logout="onLogout"
    />

    <div
      v-if="createdSuccess"
      class="admin-artworks__toast admin-artworks__toast--success"
      role="status"
    >
      Œuvre créée avec succès.
      <button type="button" class="admin-artworks__toast-close" @click="createdSuccess = false">
        ×
      </button>
    </div>
    <div
      v-if="updatedSuccess"
      class="admin-artworks__toast admin-artworks__toast--success"
      role="status"
    >
      Œuvre mise à jour avec succès.
      <button type="button" class="admin-artworks__toast-close" @click="updatedSuccess = false">
        ×
      </button>
    </div>
    <div
      v-if="trashedSuccess"
      class="admin-artworks__toast admin-artworks__toast--success"
      role="status"
    >
      Œuvre déplacée dans la corbeille.
      <button type="button" class="admin-artworks__toast-close" @click="trashedSuccess = false">
        ×
      </button>
    </div>
    <div
      v-if="restoredSuccess"
      class="admin-artworks__toast admin-artworks__toast--success"
      role="status"
    >
      Œuvre restaurée.
      <button type="button" class="admin-artworks__toast-close" @click="restoredSuccess = false">
        ×
      </button>
    </div>

    <section class="admin-artworks__filters">
      <div class="admin-artworks__filter">
        <label class="admin-artworks__label" for="search">Recherche</label>
        <input
          id="search"
          v-model="searchTerm"
          type="search"
          placeholder="Titre de l'œuvre…"
          class="admin-artworks__input"
        />
      </div>

      <div class="admin-artworks__filter">
        <label class="admin-artworks__label" for="category">Catégorie</label>
        <select
          id="category"
          v-model="selectedCategory"
          class="admin-artworks__select"
          :disabled="categoriesLoading"
        >
          <option value="">Toutes les catégories</option>
          <option v-for="cat in categoryOptions" :key="cat.id" :value="String(cat.id)">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div class="admin-artworks__filter admin-artworks__filter--align-end">
        <NuxtLink
          :to="localePath('/admin/artworks/trash')"
          class="btn-artistic admin-artworks__corbeille"
        >
          Voir la corbeille
        </NuxtLink>
      </div>
    </section>

    <section class="admin-artworks__list">
      <div v-if="errorMessage" class="admin-artworks__status admin-artworks__status--error">
        {{ errorMessage }}
      </div>
      <div v-else-if="categoriesError" class="admin-artworks__status admin-artworks__status--error">
        {{ categoriesError }}
      </div>
      <div v-else-if="loading" class="admin-artworks__status">Chargement des œuvres…</div>
      <div v-else-if="items.length === 0" class="admin-artworks__status">
        Aucune œuvre trouvée avec ces critères.
      </div>
      <div v-else>
        <!-- Tableau desktop -->
        <div class="admin-artworks__table">
          <div class="admin-artworks__row admin-artworks__row--head">
            <div class="admin-artworks__col admin-artworks__col--thumb">Miniature</div>
            <div class="admin-artworks__col admin-artworks__col--title">Titre</div>
            <div class="admin-artworks__col admin-artworks__col--cat">Catégorie</div>
            <div class="admin-artworks__col admin-artworks__col--date">Créée le</div>
            <div class="admin-artworks__col admin-artworks__col--actions">Actions</div>
          </div>
          <div
            v-for="item in items"
            :key="item.id"
            class="admin-artworks__row admin-artworks__row--data"
          >
            <div class="admin-artworks__col admin-artworks__col--thumb">
              <img
                v-if="item.thumbnailUrl"
                :src="proxiedUrl(item.thumbnailUrl)"
                alt=""
                width="64"
                height="64"
                loading="lazy"
                class="admin-artworks__thumb"
              />
              <span v-else class="admin-artworks__thumb-placeholder">—</span>
            </div>
            <div class="admin-artworks__col admin-artworks__col--title">{{ item.title }}</div>
            <div class="admin-artworks__col admin-artworks__col--cat">
              {{ item.categoryName || '—' }}
            </div>
            <div class="admin-artworks__col admin-artworks__col--date">
              {{ formatDate(item.createdAt) }}
            </div>
            <div class="admin-artworks__col admin-artworks__col--actions">
              <NuxtLink
                :to="localePath(`/admin/artworks/${item.id}/edit`)"
                class="btn-artistic admin-artworks__action admin-artworks__action--link"
              >
                Modifier
              </NuxtLink>
              <BaseButton
                variant="outline"
                size="sm"
                :disabled="deleteLoading === item.id"
                :is-loading="deleteLoading === item.id"
                title="Déplacer dans la corbeille"
                @click="confirmTrash(item)"
              >
                Supprimer
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Cartes mobile / tablette -->
        <div class="admin-artworks__cards">
          <article
            v-for="item in items"
            :key="item.id"
            class="admin-artworks__card"
          >
            <div class="admin-artworks__card-thumb">
              <img
                v-if="item.thumbnailUrl"
                :src="proxiedUrl(item.thumbnailUrl)"
                alt=""
                width="64"
                height="64"
                loading="lazy"
                class="admin-artworks__thumb"
              />
              <span v-else class="admin-artworks__thumb-placeholder">—</span>
            </div>
            <div class="admin-artworks__card-body">
              <h3 class="admin-artworks__card-title">{{ item.title }}</h3>
              <p class="admin-artworks__card-meta">
                {{ item.categoryName || '—' }} · {{ formatDate(item.createdAt) }}
              </p>
              <div class="admin-artworks__card-actions">
                <NuxtLink
                  :to="localePath(`/admin/artworks/${item.id}/edit`)"
                  class="btn-artistic admin-artworks__action admin-artworks__action--link"
                >
                  Modifier
                </NuxtLink>
                <BaseButton
                  variant="outline"
                  size="sm"
                  :disabled="deleteLoading === item.id"
                  :is-loading="deleteLoading === item.id"
                  title="Déplacer dans la corbeille"
                  @click="confirmTrash(item)"
                >
                  Supprimer
                </BaseButton>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <footer v-if="total > 0" class="admin-artworks__pagination">
      <span>{{ rangeLabel }}</span>
      <div class="admin-artworks__pagination-controls">
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
  // prettier-ignore
  import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
  } from 'vue';

  import { useAdminArtworksList } from '~/composables/useAdminArtworksList';
  import { useAdminAuth } from '~/composables/useAdminAuth';
  import { useImageProxy } from '~/composables/useImageProxy';
  import { mapCategoriesToCanonical, type RawCategoryRow } from '~/utils/adminCategories';

  defineOptions({ name: 'AdminArtworksList' });

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
  const createdSuccess = ref(route.query.created === '1');
  const updatedSuccess = ref(route.query.updated === '1');
  const trashedSuccess = ref(route.query.trashed === '1');
  const restoredSuccess = ref(route.query.restored === '1');
  const deleteLoading = ref<string | null>(null);
  const categoriesError = ref<string | null>(null);
  const categoriesLoading = ref(false);

  const searchTerm = ref('');
  const selectedCategory = ref('');
  const errorMessage = computed(() => error.value);

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
      if (!token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      const response = await $fetch<{ categories: RawCategoryRow[] }>('/api/admin/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });

      categoryOptions.value = mapCategoriesToCanonical(response.categories ?? []);
    } catch (err: unknown) {
      console.error('Erreur chargement catégories (liste admin)', err);
      const fetchErr = err as { statusMessage?: string; message?: string };
      categoriesError.value =
        fetchErr.statusMessage ||
        fetchErr.message ||
        "Impossible de charger les catégories pour l'instant.";
    } finally {
      categoriesLoading.value = false;
    }
  }

  let searchDebounce: ReturnType<typeof setTimeout> | null = null;

  watch(searchTerm, (value) => {
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }
    searchDebounce = setTimeout(() => {
      fetchList({
        page: 1,
        search: value || undefined,
        category: selectedCategory.value || undefined,
      });
    }, 350);
  });

  watch(selectedCategory, (value, oldValue) => {
    if (value === oldValue) return;
    fetchList({
      page: 1,
      search: searchTerm.value || undefined,
      category: value || undefined,
    });
  });

  function changePage(targetPage: number): void {
    fetchList({
      page: targetPage,
      search: searchTerm.value || undefined,
      category: selectedCategory.value || undefined,
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

  async function confirmTrash(item: { id: string; title: string }): Promise<void> {
    const ok = window.confirm(
      `Déplacer « ${item.title} » dans la corbeille ? Vous pourrez la restaurer plus tard.`
    );
    if (!ok) return;
    deleteLoading.value = item.id;
    try {
      const session = await getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Session expirée.');
      await $fetch(`/api/admin/artworks/${item.id}`, {
        method: 'PATCH',
        body: { action: 'trash' },
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchList({
        page: page.value,
        search: searchTerm.value || undefined,
        category: selectedCategory.value || undefined,
      });
      trashedSuccess.value = true;
    } catch (err) {
      console.error('Erreur suppression', err);
      const e = err as { data?: { statusMessage?: string }; statusMessage?: string };
      errorMessage.value =
        e.data?.statusMessage ?? e.statusMessage ?? 'Erreur lors de la suppression.';
    } finally {
      deleteLoading.value = null;
    }
  }

  onMounted(async () => {
    if (
      route.query.created === '1' ||
      route.query.updated === '1' ||
      route.query.trashed === '1' ||
      route.query.restored === '1'
    ) {
      await router.replace({ path: '/admin/artworks', query: {} });
    }
    await Promise.all([loadCategories(), fetchList({ page: 1 })]);
  });

  onBeforeUnmount(() => {
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }
  });
</script>

<style scoped lang="scss">
  .admin-artworks {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1.5rem 3rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .admin-artworks__toast {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.95rem;
  }

  .admin-artworks__toast--success {
    background: rgba(34, 139, 34, 0.15);
    color: #2d5a2d;
    border: 1px solid rgba(34, 139, 34, 0.4);
  }

  .admin-artworks__toast-close {
    padding: 0 0.4rem;
    font-size: 1.2rem;
    line-height: 1;
    border: none;
    background: none;
    color: inherit;
    cursor: pointer;
    opacity: 0.7;
  }

  .admin-artworks__toast-close:hover {
    opacity: 1;
  }

  .admin-artworks__filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }

  .admin-artworks__filter {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .admin-artworks__filter--align-end {
    justify-content: flex-end;
  }

  .admin-artworks__label {
    font-size: 0.85rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--color-text-light);
  }

  .admin-artworks__input,
  .admin-artworks__select {
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: 6px;
    padding: 0.65rem 0.75rem;
    font-size: 1rem;
    background: #fff;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--color-primary, #cc0000);
    }
  }

  .admin-artworks__corbeille {
    display: inline-flex;
  }

  .admin-artworks__list {
    background: #fff;
    border: 1px solid var(--color-border, #e8e8e8);
    border-radius: 12px;
    overflow: hidden;
  }

  /* Tableau desktop */
  .admin-artworks__table {
    display: grid;
    grid-template-columns: 88px minmax(120px, 1fr) 130px 110px minmax(180px, auto);
    column-gap: 0;
    row-gap: 0;
  }

  .admin-artworks__row {
    display: contents;
  }

  .admin-artworks__row > .admin-artworks__col {
    display: flex;
    align-items: center;
    padding: 0.85rem 0;
  }

  .admin-artworks__row > .admin-artworks__col:first-child {
    padding-left: 1rem;
  }

  .admin-artworks__row > .admin-artworks__col:last-child {
    padding-right: 1rem;
  }

  .admin-artworks__row--head > .admin-artworks__col {
    background: #fafafa;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-light);
    border-bottom: 1px solid var(--color-border, #e8e8e8);
    padding: 0.85rem 0;

    &.admin-artworks__col--thumb {
      justify-content: center;
    }

    &.admin-artworks__col--title,
    &.admin-artworks__col--cat,
    &.admin-artworks__col--date {
      justify-content: flex-start;
    }

    &.admin-artworks__col--actions {
      justify-content: flex-end;
    }
  }

  .admin-artworks__row--data > .admin-artworks__col {
    border-bottom: 1px solid var(--color-border, #f0f0f0);
  }

  .admin-artworks__row--data:last-child > .admin-artworks__col {
    border-bottom: none;
  }

  .admin-artworks__col--thumb {
    justify-content: center;
  }

  .admin-artworks__thumb {
    display: block;
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid var(--color-border, #e0e0e0);
    background: #fff;
  }

  .admin-artworks__thumb-placeholder {
    color: var(--color-text-light);
    font-size: 0.85rem;
    font-style: italic;
  }

  .admin-artworks__col--title {
    font-weight: 600;
  }

  .admin-artworks__col--actions {
    gap: 0.5rem;
    justify-content: flex-end;
  }

  .admin-artworks__action--link {
    text-decoration: none;
  }

  /* Cartes mobile / tablette */
  .admin-artworks__cards {
    display: none;
  }

  .admin-artworks__card {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    padding: 1rem;
    border-bottom: 1px solid var(--color-border, #f0f0f0);
  }

  .admin-artworks__card:last-child {
    border-bottom: none;
  }

  .admin-artworks__card-thumb {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .admin-artworks__card-body {
    flex: 1;
    min-width: 0;
  }

  .admin-artworks__card-title {
    margin: 0 0 0.25rem;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.3;
    word-break: break-word;
  }

  .admin-artworks__card-meta {
    margin: 0 0 0.75rem;
    font-size: 0.85rem;
    color: var(--color-text-light);
  }

  .admin-artworks__card-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .admin-artworks__status {
    padding: 1.5rem;
    text-align: center;
    color: var(--color-text-light);
  }

  .admin-artworks__status--error {
    color: var(--color-primary, #cc0000);
  }

  .admin-artworks__pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fafafa;
    padding: 0.8rem 1rem;
    border: 1px solid var(--color-border, #e8e8e8);
    border-radius: 999px;
    font-size: 0.95rem;
  }

  .admin-artworks__pagination-controls {
    display: flex;
    gap: 0.5rem;
  }

  @media (max-width: 1024px) {
    .admin-artworks__table {
      display: none;
    }

    .admin-artworks__cards {
      display: block;
    }
  }

  @media (max-width: 768px) {
    .admin-artworks {
      padding: 1.5rem 1rem 2rem;
    }

    .admin-artworks__card {
      padding: 0.85rem 1rem;
      gap: 0.75rem;
    }

    .admin-artworks__thumb {
      width: 48px;
      height: 48px;
    }

    .admin-artworks__card-meta {
      margin-bottom: 0.5rem;
    }

    .admin-artworks__pagination {
      flex-direction: column;
      gap: 0.75rem;
      align-items: flex-start;
    }
  }
</style>
