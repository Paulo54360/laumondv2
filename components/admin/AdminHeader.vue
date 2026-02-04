<template>
  <header class="admin-header">
    <div class="admin-header__titles">
      <h1 class="admin-header__title">{{ title }}</h1>
      <p v-if="subtitle" class="admin-header__subtitle">
        {{ subtitle }}
      </p>
    </div>

    <nav class="admin-header__nav">
      <NuxtLink class="btn-artistic admin-header__link" :to="localePath('/admin/artworks')">
        Liste des œuvres
      </NuxtLink>
      <NuxtLink class="btn-artistic admin-header__link" :to="localePath('/admin/upload')">
        Ajouter une œuvre
      </NuxtLink>
      <NuxtLink class="btn-artistic admin-header__link" :to="localePath('/admin/texts')">
        Textes
      </NuxtLink>
      <BaseButton variant="outline" class="admin-header__logout" @click="$emit('logout')">
        Déconnexion
      </BaseButton>
    </nav>
  </header>
</template>

<script setup lang="ts">
  const localePath = useLocalePath();

  defineProps<{
    title: string;
    subtitle?: string;
  }>();

  defineEmits<{
    (e: 'logout'): void;
  }>();
</script>

<style scoped lang="scss">
  .admin-header {
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .admin-header__titles {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .admin-header__title {
    margin: 0;
    font-size: 1.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .admin-header__subtitle {
    margin: 0;
    color: var(--color-text-light);
    max-width: 640px;
  }

  .admin-header__nav {
    display: inline-flex;
    gap: 0.75rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .admin-header__link.router-link-active {
    background-color: var(--color-primary);
    color: #fff;
    border-color: var(--color-primary);
  }

  .admin-header__logout {
    display: inline-flex;
  }
</style>
