<template>
  <Transition name="admin-fab-fade">
    <NuxtLink
      v-if="isAuthenticated"
      :to="localePath('/admin/artworks')"
      class="admin-fab"
      :title="t('admin.goToDashboard')"
      aria-label="Dashboard Admin"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
      <span class="admin-fab__label">Admin</span>
    </NuxtLink>
  </Transition>
</template>

<script setup lang="ts">
  const { t } = useI18n();
  const localePath = useLocalePath();
  const { isAuthenticated, getSession } = useAdminAuth();

  // Vérifier la session au montage (côté client uniquement)
  onMounted(async () => {
    await getSession();
  });
</script>

<style scoped lang="scss">
  .admin-fab {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 999;

    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1rem;

    background-color: var(--color-primary);
    color: var(--color-white);
    border-radius: 2rem;
    box-shadow: 0 4px 12px rgba(204, 0, 0, 0.3);

    font-size: 0.85rem;
    font-weight: 500;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    transition:
      background-color 0.2s ease,
      transform 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      background-color: var(--color-primary-dark);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(204, 0, 0, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .admin-fab__label {
    @media (max-width: 640px) {
      // Cacher le label sur mobile, garder juste l'icône
      display: none;
    }
  }

  // Transition d'entrée/sortie
  .admin-fab-fade-enter-active,
  .admin-fab-fade-leave-active {
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .admin-fab-fade-enter-from,
  .admin-fab-fade-leave-to {
    opacity: 0;
    transform: translateY(1rem) scale(0.9);
  }
</style>
