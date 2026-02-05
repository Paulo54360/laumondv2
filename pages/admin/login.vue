<!-- Page de connexion admin — URL cachée, non indexée -->
<template>
  <div class="admin-login">
    <div class="admin-login__card">
      <h1 class="admin-login__title">Connexion</h1>
      <form class="admin-login__form" @submit.prevent="onSubmit">
        <div class="admin-login__field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            :disabled="loading"
          />
        </div>
        <div class="admin-login__field">
          <label for="password">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            :disabled="loading"
          />
        </div>
        <p v-if="errorMessage" class="admin-login__error">{{ errorMessage }}</p>
        <p v-if="errorDetail" class="admin-login__error-detail">{{ errorDetail }}</p>
        <BaseButton
          type="submit"
          variant="outline"
          :is-loading="loading"
          class="admin-login__submit"
        >
          Se connecter
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'AdminLogin' });

  definePageMeta({
    layout: 'default',
    middleware: 'admin-auth',
  });

  useHead({
    meta: [{ name: 'robots', content: 'noindex' }],
  });

  const { login, getSession } = useAdminAuth();
  const router = useRouter();
  const localePath = useLocalePath();

  const email = ref('');
  const password = ref('');
  const loading = ref(false);
  const errorMessage = ref('');
  const errorDetail = ref('');

  onMounted(async (): Promise<void> => {
    const session = await getSession();
    if (session?.user) {
      await router.replace(localePath('/admin/upload'));
    }
  });

  async function onSubmit(): Promise<void> {
    errorMessage.value = '';
    errorDetail.value = '';
    loading.value = true;
    try {
      await login(email.value, password.value);
      await router.replace(localePath('/admin/upload'));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      errorDetail.value = msg;
      errorMessage.value =
        msg.toLowerCase().includes('invalid') || msg.includes('400')
          ? 'Identifiants incorrects'
          : 'Erreur de connexion. Réessayez.';
    } finally {
      loading.value = false;
    }
  }
</script>

<style scoped>
  .admin-login {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
    padding: var(--spacing-md);
  }

  .admin-login__card {
    width: 100%;
    max-width: 360px;
    padding: var(--spacing-lg);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
  }

  .admin-login__title {
    margin: 0 0 var(--spacing-lg);
    font-family: var(--font-family-heading);
    font-size: 1.5rem;
    font-weight: var(--font-weight-medium);
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--color-text);
  }

  .admin-login__field {
    margin-bottom: var(--spacing-md);
  }

  .admin-login__field label {
    display: block;
    margin-bottom: var(--spacing-xs);
    font-size: 0.9rem;
    color: var(--color-text);
  }

  .admin-login__field input {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
  }

  .admin-login__field input:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .admin-login__error {
    margin: var(--spacing-sm) 0 0;
    font-size: 0.9rem;
    color: var(--color-primary);
  }

  .admin-login__error-detail {
    margin: 0.25rem 0 0;
    font-size: 0.75rem;
    color: var(--color-text-light);
    word-break: break-word;
  }

  .admin-login__submit {
    margin-top: var(--spacing-md);
  }
</style>
