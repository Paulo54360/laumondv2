<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="biography-page">
    <div v-if="useSiteContent" class="text-content">
      <template v-for="(section, index) in parsedSections" :key="section.id || index">
        <template v-if="section.title">
          <h3 :id="section.id">{{ section.title }}</h3>
          <div class="section-title-divider"></div>
        </template>
        <p v-if="section.content" style="white-space: pre-wrap">{{ section.content }}</p>
        <br v-if="index < parsedSections.length - 1" />
      </template>
    </div>
    <div v-else class="text-content">
      {{ $t('biography.intro_text') }}
      <br />
      <br />
      <h3 id="Expérimentation">{{ $t('biography.experimentation_title') }}</h3>
      <div class="section-title-divider"></div>
      {{ $t('biography.experimentation_text') }}
      <br />
      <br />
      <h3 id="Language">{{ $t('biography.language_title') }}</h3>
      <div class="section-title-divider"></div>
      {{ $t('biography.language_text') }}
      <br />
      <br />
      <h3 id="Méta">{{ $t('biography.meta_title') }}</h3>
      <div class="section-title-divider"></div>
      {{ $t('biography.meta_text') }}
      <br />
      <br />
      <h3 id="Théorisation_et_le_métahisme">{{ $t('biography.theorisation_title') }}</h3>
      <div class="section-title-divider"></div>
      {{ $t('biography.theorisation_text') }}
      <br />
      <br />
      <h3 id="Un paradigme_de_l'universalité">{{ $t('biography.paradigme_title') }}</h3>
      <div class="section-title-divider"></div>
      {{ $t('biography.paradigme_text') }}
      <br />
      <br />
      <h3 id="Vision_globale_et_pensée_complexe">{{ $t('biography.vision_title') }}</h3>
      <div class="section-title-divider"></div>
      {{ $t('biography.vision_text') }}
      <br />
      <br />
      <h3 id="Création_d'un_langage,_un_pari">{{ $t('biography.creation_title') }}</h3>
      <div class="section-title-divider"></div>
      {{ $t('biography.creation_text') }}
      <br />
      <br />
      <h3 id="Une_œuvre_née_du_cerveau_droit">{{ $t('biography.cerveau_title') }}</h3>
      <div class="section-title-divider"></div>
      {{ $t('biography.cerveau_text') }}
      <br />
      <br />
      <h3 id="Une_œuvre_holographique">{{ $t('biography.holographique_title') }}</h3>
      <div class="section-title-divider"></div>
      {{ $t('biography.holographique_text') }}
    </div>
    <div class="nav-menu">
      <template v-if="useSiteContent">
        <a v-for="s in parsedSections.filter((x) => x.title)" :key="s.id" :href="`#${s.id}`">
          {{ s.title }}
        </a>
      </template>
      <template v-else>
        <a href="#Expérimentation">{{ $t('biography.nav_experimentation') }}</a>
        <a href="#Language">{{ $t('biography.nav_language') }}</a>
        <a href="#Méta">{{ $t('biography.nav_meta') }}</a>
        <a href="#Théorisation_et_le_métahisme">{{ $t('biography.nav_theorisation') }}</a>
        <a href="#Un paradigme_de_l'universalité">{{ $t('biography.nav_paradigme') }}</a>
        <a href="#Vision_globale_et_pensée_complexe">{{ $t('biography.nav_vision') }}</a>
        <a href="#Création_d'un_langage,_un_pari">{{ $t('biography.nav_creation') }}</a>
        <a href="#Une_œuvre_née_du_cerveau_droit">{{ $t('biography.nav_cerveau') }}</a>
        <a href="#Une_œuvre_holographique">{{ $t('biography.nav_holographique') }}</a>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { parseMarkdownSections } from '~/utils/siteTextMarkdown';

  definePageMeta({ layout: 'default' });

  const { locale } = useI18n();
  const { fetchTexts, getContent } = useSiteTexts();

  await useAsyncData('site-texts', () => fetchTexts());

  const biographyRaw = computed(() => getContent('biography', locale.value) ?? '');

  const useSiteContent = computed(() => biographyRaw.value.length > 0);

  const parsedSections = computed(() => parseMarkdownSections(biographyRaw.value));

  onMounted(() => {
    const links = document.querySelectorAll('.nav-menu a[href^="#"]');

    links.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();

        const targetId = link.getAttribute('href')?.substring(1);
        if (!targetId) return;

        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const headerOffset = 100;
          const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      });
    });
  });
</script>
<style lang="scss" src="~/assets/css/pages/biography.scss"></style>
