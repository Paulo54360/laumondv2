<!-- Titre de section + barre rouge (design system). Réutilisable (home, autres pages). -->
<template>
  <div class="section-header" :class="{ 'section-header--static': !animated }">
    <component :is="tag" class="section-title">
      <slot />
    </component>
    <div class="section-divider" />
  </div>
</template>

<script setup lang="ts">
  interface IProps {
    /** Balise du titre (h1, h2, h3). */
    tag?: 'h1' | 'h2' | 'h3';
    /** Barre rouge qui s’étend au survol (homepage). Désactiver pour les autres pages. */
    animated?: boolean;
  }

  withDefaults(defineProps<IProps>(), {
    tag: 'h2',
    animated: true,
  });
</script>

<style lang="scss" scoped>
  /* Désactive l’animation de la barre quand animated=false (ex. pages internes). */
  .section-header--static:hover :deep(.section-divider) {
    transform: scaleX(0.3);
  }
</style>
