<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="metahism-page">
    <div class="page-title-header">
      <h1 class="page-title">{{ pageTitle }}</h1>
      <div class="page-title-divider"></div>
    </div>
    <div v-if="useSiteContent" class="text-content">
      <p v-for="(para, i) in paragraphs" :key="i">{{ para }}</p>
      <div class="article-link-container">
        <a
          href="https://www.champslibres.media/rencontre-avec-patrick-laumond"
          target="_blank"
          rel="noopener noreferrer"
          class="article-link"
        >
          {{ $t('MétaHisme.ArticleLinkText') }}
        </a>
      </div>
    </div>
    <div v-else class="text-content">
      <p>{{ $t('MétaHisme.Texte') }}</p>
      <p>{{ $t('MétaHisme.Texte2') }}</p>
      <p>{{ $t('MétaHisme.Texte3') }}</p>
      <p>
        {{ $t('MétaHisme.Texte4,1') }}<br />
        {{ $t('MétaHisme.Texte4,2') }}<br />
        {{ $t('MétaHisme.Texte4,3') }}
      </p>
      <p>{{ $t('MétaHisme.Texte5') }}</p>
      <p>
        {{ $t('MétaHisme.Texte6,1') }}<br />
        {{ $t('MétaHisme.Texte6,2') }}
      </p>
      <p>{{ $t('MétaHisme.Texte7') }}</p>
      <p>
        {{ $t('MétaHisme.Texte8,1') }}<br />
        {{ $t('MétaHisme.Texte8,2') }}<br />
        {{ $t('MétaHisme.Texte8,3') }}
      </p>
      <p>{{ $t('MétaHisme.Texte9') }}</p>
      <p>
        {{ $t('MétaHisme.Texte10,1') }}<br />
        {{ $t('MétaHisme.Texte10,2') }}<br />
        {{ $t('MétaHisme.Texte10,3') }}
      </p>
      <p>{{ $t('MétaHisme.Texte11') }}</p>
      <p>
        {{ $t('MétaHisme.Texte12,1') }}<br />
        {{ $t('MétaHisme.Texte12,2') }}<br />
        {{ $t('MétaHisme.Texte12,3') }}<br />
        {{ $t('MétaHisme.Texte12,4') }}<br />
        {{ $t('MétaHisme.Texte12,5') }}<br />
        {{ $t('MétaHisme.Texte12,6') }}
      </p>
      <p id="Patrick">{{ $t('MétaHisme.Texte16') }}<br /></p>

      <div>
        <p id="citation">
          {{ $t('MétaHisme.Texte13') }}<br />
          <a>{{ $t('MétaHisme.Texte14') }}</a>
        </p>
      </div>

      <div class="metahisme-footnote">
        <p>{{ $t('MétaHisme.Footnote') }}</p>
      </div>

      <div class="article-link-container">
        <a
          href="https://www.champslibres.media/rencontre-avec-patrick-laumond"
          target="_blank"
          rel="noopener noreferrer"
          class="article-link"
        >
          {{ $t('MétaHisme.ArticleLinkText') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';

  definePageMeta({ layout: 'default' });

  const { locale, t } = useI18n();
  const { fetchTexts, getContent } = useSiteTexts();

  await useAsyncData('site-texts', () => fetchTexts());

  const metahismRaw = computed(() => getContent('metahism', locale.value) ?? '');

  const useSiteContent = computed(() => metahismRaw.value.length > 0);

  const paragraphs = computed(() =>
    metahismRaw.value
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
  );

  const pageTitle = computed(() => t('MétaHisme.Titre'));
</script>

<style lang="scss" src="~/assets/css/pages/metahism.scss"></style>
