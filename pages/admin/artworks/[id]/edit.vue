<!-- Page édition œuvre — Story S1.3 -->
<template>
  <div class="admin-edit">
    <AdminHeader
      :title="t('admin.edit.title')"
      :subtitle="t('admin.edit.subtitle')"
      @logout="onLogout"
    />
    <div v-if="loadingData" class="admin-edit__status">{{ t('admin.edit.loading') }}</div>
    <div v-else-if="loadError" class="admin-edit__status admin-edit__status--error">
      {{ loadError }}
    </div>
    <form v-else class="admin-edit__form" @submit.prevent="onSubmit">
      <div class="admin-edit__field">
        <label for="title"
          >{{ t('admin.upload.title') }} <span class="admin-edit__required">*</span></label
        >
        <input
          id="title"
          v-model="title"
          type="text"
          required
          :disabled="loading"
          autocomplete="off"
          :placeholder="t('admin.upload.placeholder_title')"
        />
      </div>

      <div class="admin-edit__field">
        <label for="description">{{ t('admin.upload.description') }}</label>
        <textarea
          id="description"
          v-model="description"
          rows="3"
          :disabled="loading"
          :placeholder="t('admin.upload.placeholder_description')"
        />
      </div>

      <div class="admin-edit__field">
        <label for="category"
          >{{ t('admin.upload.category') }} <span class="admin-edit__required">*</span></label
        >
        <select
          id="category"
          v-model="selectedCategoryId"
          required
          :disabled="loading || categoriesLoading"
        >
          <option value="" disabled>
            {{
              categoriesLoading
                ? t('admin.upload.category_loading')
                : t('admin.upload.category_choose')
            }}
          </option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div class="admin-edit__field">
        <label>{{ t('admin.edit.images_current') }}</label>
        <div v-if="displayedImages.length === 0" class="admin-edit__empty">
          {{ t('admin.edit.no_images') }}
        </div>
        <ul v-else class="admin-edit__image-list">
          <li v-for="img in displayedImages" :key="img.url" class="admin-edit__image-item">
            <img
              :src="proxiedUrl(img.url)"
              alt=""
              class="admin-edit__thumb"
              width="80"
              height="80"
            />
            <button
              type="button"
              class="admin-edit__remove-img"
              :disabled="loading || displayedImages.length <= 1"
              :title="t('admin.edit.remove_image')"
              aria-label="Retirer"
              @click="removeImage(img.url)"
            >
              ×
            </button>
          </li>
        </ul>
      </div>

      <div class="admin-edit__field">
        <label>{{ t('admin.edit.images_add') }} ({{ t('admin.upload.images_format') }})</label>
        <div
          class="admin-edit__dropzone"
          :class="{
            'admin-edit__dropzone--dragover': isDragging,
            'admin-edit__dropzone--error': filesError,
          }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="onDrop"
        >
          <input
            ref="fileInputRef"
            type="file"
            accept="image/jpeg,image/png"
            multiple
            :disabled="loading"
            class="admin-edit__file-input"
            @change="onFileChange"
          />
          <p v-if="newFiles.length === 0" class="admin-edit__dropzone-hint">
            {{ t('admin.upload.images_hint') }}
          </p>
          <p v-else class="admin-edit__dropzone-count">
            {{ t('admin.upload.images_count', { n: newFiles.length }) }}
          </p>
          <ul v-if="newFiles.length > 0" class="admin-edit__file-list">
            <li v-for="(f, i) in newFiles" :key="i" class="admin-edit__file-item">
              {{ f.name }} ({{ formatFileSize(f.size) }})
              <button
                type="button"
                class="admin-edit__file-remove"
                :disabled="loading"
                aria-label="Retirer"
                @click="removeNewFile(i)"
              >
                ×
              </button>
            </li>
          </ul>
        </div>
        <p v-if="filesError" class="admin-edit__error">{{ filesError }}</p>
      </div>

      <p v-if="errorMessage" class="admin-edit__error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="admin-edit__success">{{ successMessage }}</p>

      <div class="admin-edit__actions">
        <NuxtLink :to="localePath('/admin/artworks')" class="btn-artistic admin-edit__back">
          ← {{ t('admin.edit.back') }}
        </NuxtLink>
        <BaseButton
          variant="outline"
          type="submit"
          :disabled="loading || !canSave"
          :is-loading="loading"
          class="admin-edit__submit"
        >
          {{ loading ? t('admin.upload.submit_loading') : t('admin.edit.save') }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n';

  import { useImageProxy } from '~/composables/useImageProxy';
  import { mapCategoriesToCanonical, type RawCategoryRow } from '~/utils/adminCategories';

  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const localePath = useLocalePath();
  const proxiedUrl = useImageProxy();

  defineOptions({ name: 'AdminArtworkEdit' });

  definePageMeta({
    layout: 'default',
    middleware: 'admin-auth',
  });

  useHead({
    meta: [{ name: 'robots', content: 'noindex' }],
  });

  type Category = { id: number; name: string };
  type ImageItem = { id: string; url: string; filename: string | null; position: number };

  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

  const { logout, getSession } = useAdminAuth();

  const artworkId = computed(() => {
    const id = route.params.id;
    return typeof id === 'string' ? Number(id) : NaN;
  });

  const title = ref('');
  const description = ref('');
  const selectedCategoryId = ref<number | ''>('');
  const currentImages = ref<ImageItem[]>([]);
  const deletedImageUrls = ref<string[]>([]);
  const newFiles = ref<File[]>([]);
  const fileInputRef = ref<HTMLInputElement | null>(null);
  const isDragging = ref(false);
  const loading = ref(false);
  const loadingData = ref(true);
  const loadError = ref('');
  const errorMessage = ref('');
  const successMessage = ref('');
  const filesError = ref('');

  const categories = ref<Category[]>([]);
  const categoriesLoading = ref(false);

  const displayedImages = computed(() =>
    currentImages.value.filter((img) => !deletedImageUrls.value.includes(img.url))
  );

  const canSave = computed(() => {
    const hasImages = displayedImages.value.length + newFiles.value.length > 0;
    return hasImages && title.value.trim();
  });

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  }

  function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Format non accepté : ${file.name}. Utilisez JPEG ou PNG.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name} dépasse 10 Mo.`;
    }
    return null;
  }

  function addNewFiles(files: FileList | File[]): void {
    const list = Array.from(files);
    for (const file of list) {
      const err = validateFile(file);
      if (err) {
        filesError.value = err;
        return;
      }
    }
    filesError.value = '';
    newFiles.value = [...newFiles.value, ...list];
  }

  function removeNewFile(index: number): void {
    newFiles.value = newFiles.value.filter((_, i) => i !== index);
    filesError.value = '';
  }

  function removeImage(url: string): void {
    if (displayedImages.value.length <= 1) return;
    deletedImageUrls.value = [...deletedImageUrls.value, url];
  }

  function onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target?.files?.length) addNewFiles(target.files);
    if (target) target.value = '';
  }

  function onDrop(event: DragEvent): void {
    isDragging.value = false;
    const dt = event.dataTransfer;
    if (dt?.files?.length) addNewFiles(dt.files);
  }

  async function loadArtwork(): Promise<void> {
    loadingData.value = true;
    loadError.value = '';
    try {
      const session = await getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Session expirée.');

      const [artworkRes, catRes] = await Promise.all([
        $fetch<{
          id: number;
          title: string;
          description: string;
          categoryId: number | null;
          images: ImageItem[];
        }>(`/api/admin/artworks/${artworkId.value}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        $fetch<{ categories: RawCategoryRow[] }>('/api/admin/categories', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      title.value = artworkRes.title;
      description.value = artworkRes.description;
      selectedCategoryId.value = artworkRes.categoryId ?? '';
      currentImages.value = artworkRes.images ?? [];
      categories.value = mapCategoriesToCanonical(catRes.categories ?? []);
    } catch (err: unknown) {
      console.error('Erreur chargement œuvre', err);
      const e = err as { data?: { statusMessage?: string }; statusMessage?: string };
      loadError.value = e.data?.statusMessage ?? e.statusMessage ?? 'Erreur chargement œuvre';
    } finally {
      loadingData.value = false;
    }
  }

  async function onLogout(): Promise<void> {
    await logout();
    await router.replace(localePath('/admin/login'));
  }

  async function onSubmit(): Promise<void> {
    if (!canSave.value) return;
    errorMessage.value = '';
    successMessage.value = '';

    const keptCount = displayedImages.value.length;
    if (keptCount + newFiles.value.length === 0) {
      errorMessage.value = "L'œuvre doit conserver au moins une image.";
      return;
    }

    loading.value = true;
    try {
      const session = await getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Session expirée.');

      const formData = new FormData();
      formData.append('title', title.value.trim());
      formData.append('description', description.value);
      formData.append('categoryId', String(selectedCategoryId.value));
      formData.append('deletedImageUrls', JSON.stringify(deletedImageUrls.value));
      for (const f of newFiles.value) {
        formData.append('files', f);
      }

      await $fetch(`/api/admin/artworks/${artworkId.value}`, {
        method: 'PUT',
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      await router.push({ path: localePath('/admin/artworks'), query: { updated: '1' } });
    } catch (err: unknown) {
      console.error('Erreur mise à jour', err);
      const e = err as { data?: { statusMessage?: string }; statusMessage?: string };
      errorMessage.value =
        e.data?.statusMessage ?? e.statusMessage ?? 'Erreur lors de la mise à jour.';
    } finally {
      loading.value = false;
    }
  }

  onMounted(loadArtwork);
</script>

<style scoped lang="scss">
  .admin-edit {
    max-width: var(--max-width-content);
    margin: 0 auto;
    padding: var(--spacing-lg) 1cm;
  }

  .admin-edit__status {
    padding: var(--spacing-md);
    color: var(--color-text-light);
  }

  .admin-edit__status--error {
    color: var(--color-primary);
  }

  .admin-edit__form {
    margin-top: var(--spacing-lg);
    max-width: 640px;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .admin-edit__field label {
    display: block;
    margin-bottom: var(--spacing-xs);
    font-size: 0.9rem;
    color: var(--color-text);
  }

  .admin-edit__required {
    color: var(--color-primary);
  }

  .admin-edit__field input,
  .admin-edit__field select,
  .admin-edit__field textarea {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
  }

  .admin-edit__field textarea {
    resize: vertical;
    min-height: 4rem;
  }

  .admin-edit__image-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .admin-edit__image-item {
    position: relative;
  }

  .admin-edit__thumb {
    display: block;
    object-fit: cover;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
  }

  .admin-edit__remove-img {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 24px;
    height: 24px;
    padding: 0;
    font-size: 1.2rem;
    line-height: 1;
    border: none;
    background: var(--color-primary);
    color: white;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0.9;
  }

  .admin-edit__remove-img:hover:not(:disabled) {
    opacity: 1;
  }

  .admin-edit__remove-img:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .admin-edit__empty {
    color: var(--color-text-light);
    font-size: 0.9rem;
  }

  .admin-edit__dropzone {
    position: relative;
    padding: var(--spacing-lg);
    border: 2px dashed var(--color-border);
    border-radius: var(--border-radius);
    background: #fafafa;
  }

  .admin-edit__dropzone--dragover {
    border-color: var(--color-primary);
    background: rgba(204, 0, 0, 0.05);
  }

  .admin-edit__dropzone--error {
    border-color: var(--color-primary);
  }

  .admin-edit__file-input {
    position: absolute;
    inset: 0;
    width: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .admin-edit__dropzone-hint,
  .admin-edit__dropzone-count {
    margin: 0;
    font-size: 0.95rem;
    color: var(--color-text-light);
  }

  .admin-edit__file-list {
    margin: var(--spacing-sm) 0 0;
    padding: 0;
    list-style: none;
    font-size: 0.9rem;
  }

  .admin-edit__file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-xs) 0;
    border-bottom: 1px solid var(--color-border);
  }

  .admin-edit__file-remove {
    padding: 0 0.4rem;
    font-size: 1.2rem;
    border: none;
    background: none;
    color: var(--color-text-light);
    cursor: pointer;
  }

  .admin-edit__file-remove:hover:not(:disabled) {
    color: var(--color-primary);
  }

  .admin-edit__error {
    color: var(--color-primary);
    font-size: 0.9rem;
  }

  .admin-edit__success {
    color: var(--color-text-light);
    font-size: 0.9rem;
  }

  .admin-edit__actions {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
  }

  .admin-edit__back {
    display: inline-flex;
  }

  .admin-edit__submit {
    display: inline-flex;
  }
</style>
