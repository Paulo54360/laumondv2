<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="metahism-page">
    <div class="page-title-header">
      <h1 class="page-title">{{ $t('MétaHisme.Titre') }}</h1>
      <div class="page-title-divider"></div>
    </div>
    <div class="text-content">
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

<script setup>
  // Component setup - no additional logic needed
</script>

<style lang="scss" src="~/assets/css/pages/metahism.scss"></style>
