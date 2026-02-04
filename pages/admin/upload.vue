<!-- Page upload admin — Story S1.2: formulaire création œuvre FR/EN + multi-images -->
<template>
  <div class="admin-upload">
    <AdminHeader
      title="Ajouter une œuvre"
      subtitle="Publiez une œuvre : titre, description et une ou plusieurs images."
      @logout="onLogout"
    />
    <form class="admin-upload__form" @submit.prevent="onSubmit">
      <div class="admin-upload__field">
        <label for="title"
          >{{ t('admin.upload.title') }} <span class="admin-upload__required">*</span></label
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

      <div class="admin-upload__field">
        <label for="description">{{ t('admin.upload.description') }}</label>
        <textarea
          id="description"
          v-model="description"
          rows="3"
          :disabled="loading"
          :placeholder="t('admin.upload.placeholder_description')"
        />
      </div>

      <div class="admin-upload__field">
        <label for="category"
          >{{ t('admin.upload.category') }} <span class="admin-upload__required">*</span></label
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

      <div class="admin-upload__field">
        <label
          >{{ t('admin.upload.images') }} <span class="admin-upload__required">*</span> ({{
            t('admin.upload.images_format')
          }})</label
        >
        <div
          class="admin-upload__dropzone"
          :class="{
            'admin-upload__dropzone--dragover': isDragging,
            'admin-upload__dropzone--error': filesError,
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
            class="admin-upload__file-input"
            @change="onFileChange"
          />
          <p v-if="files.length === 0" class="admin-upload__dropzone-hint">
            {{ t('admin.upload.images_hint') }}
          </p>
          <p v-else class="admin-upload__dropzone-count">
            {{ t('admin.upload.images_count', { n: files.length }) }}
          </p>
          <ul v-if="files.length > 0" class="admin-upload__file-list">
            <li v-for="(f, i) in files" :key="i" class="admin-upload__file-item">
              {{ f.name }} ({{ formatFileSize(f.size) }})
              <button
                type="button"
                class="admin-upload__file-remove"
                :disabled="loading"
                aria-label="Retirer"
                @click="removeFile(i)"
              >
                ×
              </button>
            </li>
          </ul>
        </div>
        <p v-if="filesError" class="admin-upload__error">{{ filesError }}</p>
      </div>

      <p v-if="errorMessage" class="admin-upload__error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="admin-upload__success">{{ successMessage }}</p>

      <BaseButton
        type="submit"
        variant="outline"
        :is-loading="loading"
        :disabled="loading || files.length === 0"
        class="admin-upload__submit"
      >
        {{ loading ? t('admin.upload.submit_loading') : t('admin.upload.submit') }}
      </BaseButton>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n';

  import { mapCategoriesToCanonical, type RawCategoryRow } from '~/utils/adminCategories';

  const { t } = useI18n();
  const localePath = useLocalePath();

  defineOptions({ name: 'AdminUpload' });

  definePageMeta({
    layout: 'default',
    middleware: 'admin-auth',
  });

  useHead({
    meta: [{ name: 'robots', content: 'noindex' }],
  });

  type Category = {
    id: number;
    name: string;
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

  const { logout, getSession } = useAdminAuth();
  const router = useRouter();

  const title = ref('');
  const description = ref('');
  const selectedCategoryId = ref<number | ''>('');
  const files = ref<File[]>([]);
  const fileInputRef = ref<HTMLInputElement | null>(null);
  const isDragging = ref(false);
  const loading = ref(false);
  const errorMessage = ref('');
  const successMessage = ref('');
  const filesError = ref('');

  const categories = ref<Category[]>([]);
  const categoriesLoading = ref(false);

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

  function addFiles(newFiles: FileList | File[]): void {
    const list = Array.from(newFiles);
    for (const file of list) {
      const err = validateFile(file);
      if (err) {
        filesError.value = err;
        return;
      }
    }
    filesError.value = '';
    files.value = [...files.value, ...list];
  }

  function removeFile(index: number): void {
    files.value = files.value.filter((_f: File, i: number) => i !== index);
    filesError.value = '';
  }

  function onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    const selected = target?.files;
    if (selected && selected.length > 0) {
      addFiles(selected);
    }
    if (target) target.value = '';
  }

  function onDrop(event: DragEvent): void {
    isDragging.value = false;
    const dt = event.dataTransfer;
    if (!dt?.files || dt.files.length === 0) return;
    addFiles(dt.files);
  }

  onMounted(async (): Promise<void> => {
    categoriesLoading.value = true;
    try {
      const session = await getSession();
      const token = session?.access_token;
      if (!token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      const response = await $fetch<{ categories: RawCategoryRow[] }>('/api/admin/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      categories.value = mapCategoriesToCanonical(response.categories ?? []);
    } catch (err: unknown) {
      console.error('Erreur chargement catégories', err);
      const fetchErr = err as {
        data?: { statusMessage?: string; message?: string };
        statusMessage?: string;
        message?: string;
      };
      const detail =
        fetchErr.data?.statusMessage ||
        fetchErr.data?.message ||
        fetchErr.statusMessage ||
        fetchErr.message;
      errorMessage.value = detail
        ? `Impossible de charger les catégories : ${detail}`
        : "Impossible de charger les catégories pour l'instant. Réessayez plus tard.";
    } finally {
      categoriesLoading.value = false;
    }
  });

  async function onLogout(): Promise<void> {
    await logout();
    await router.replace(localePath('/admin/login'));
  }

  async function onSubmit(): Promise<void> {
    errorMessage.value = '';
    successMessage.value = '';
    filesError.value = '';

    if (files.value.length === 0) {
      filesError.value = 'Veuillez sélectionner au moins une image.';
      return;
    }

    if (!selectedCategoryId.value) {
      errorMessage.value = 'Veuillez choisir une catégorie.';
      return;
    }

    loading.value = true;
    try {
      const session = await getSession();
      const token = session?.access_token;
      if (!token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      const formData = new FormData();
      formData.append('title', title.value);
      formData.append('description', description.value);
      formData.append('categoryId', String(selectedCategoryId.value));
      for (const file of files.value) {
        formData.append('files', file);
      }

      await $fetch('/api/admin/artworks', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      successMessage.value = 'Œuvre publiée avec succès.';
      title.value = '';
      description.value = '';
      selectedCategoryId.value = '';
      files.value = [];

      await router.push({ path: localePath('/admin/artworks'), query: { created: '1' } });
    } catch (err: unknown) {
      console.error('Erreur upload', err);
      const fetchErr = err as { data?: { statusMessage?: string }; statusMessage?: string };
      const msg =
        fetchErr.data?.statusMessage ??
        fetchErr.statusMessage ??
        (err instanceof Error ? err.message : "Une erreur s'est produite lors de l'envoi.");
      errorMessage.value = msg;
    } finally {
      loading.value = false;
    }
  }
</script>

<style scoped lang="scss">
  .admin-upload {
    max-width: var(--max-width-content);
    margin: 0 auto;
    padding: var(--spacing-lg) 1cm;
  }

  .admin-upload__form {
    margin-top: var(--spacing-lg);
    max-width: 640px;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .admin-upload__fields-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
  }

  @media (max-width: 640px) {
    .admin-upload__fields-row {
      grid-template-columns: 1fr;
    }
  }

  .admin-upload__field label {
    display: block;
    margin-bottom: var(--spacing-xs);
    font-size: 0.9rem;
    color: var(--color-text);
  }

  .admin-upload__required {
    color: var(--color-primary);
  }

  .admin-upload__field input,
  .admin-upload__field select,
  .admin-upload__field textarea {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
  }

  .admin-upload__field textarea {
    resize: vertical;
    min-height: 4rem;
  }

  .admin-upload__dropzone {
    position: relative;
    padding: var(--spacing-lg);
    border: 2px dashed var(--color-border);
    border-radius: var(--border-radius);
    background: #fafafa;
    transition:
      border-color 0.2s,
      background 0.2s;
  }

  .admin-upload__dropzone--dragover {
    border-color: var(--color-primary);
    background: rgba(204, 0, 0, 0.05);
  }

  .admin-upload__dropzone--error {
    border-color: var(--color-primary);
  }

  .admin-upload__file-input {
    position: absolute;
    inset: 0;
    width: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .admin-upload__dropzone-hint,
  .admin-upload__dropzone-count {
    margin: 0;
    font-size: 0.95rem;
    color: var(--color-text-light);
    pointer-events: none;
  }

  .admin-upload__file-list {
    margin: var(--spacing-sm) 0 0;
    padding: 0;
    list-style: none;
    font-size: 0.9rem;
  }

  .admin-upload__file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-xs) 0;
    border-bottom: 1px solid var(--color-border);
  }

  .admin-upload__file-remove {
    padding: 0 0.4rem;
    font-size: 1.2rem;
    line-height: 1;
    border: none;
    background: none;
    color: var(--color-text-light);
    cursor: pointer;
  }

  .admin-upload__file-remove:hover:not(:disabled) {
    color: var(--color-primary);
  }

  .admin-upload__error {
    color: var(--color-primary);
    font-size: 0.9rem;
  }

  .admin-upload__success {
    color: var(--color-text-light);
    font-size: 0.9rem;
  }

  .admin-upload__submit {
    align-self: flex-start;
    display: inline-flex;
  }
</style>
