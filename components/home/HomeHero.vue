<template>
  <section class="hero-section">
    <div class="hero-wrapper">
      <div class="hero-visual">
        <div class="viewer-360">
          <iframe class="video" :src="videoUrl" allowfullscreen :title="videoTitle"></iframe>
          <div class="viewer-overlay-top"></div>
        </div>
        <div class="viewer-caption">
          <h3 class="artwork-title">{{ artworkTitle }}</h3>
        </div>
      </div>
      <div class="hero-text">
        <h1 class="hero-name">{{ heroTitleTop }}<br />{{ heroTitleBottom }}</h1>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  defineProps<{
    videoUrl: string;
    videoTitle: string;
    artworkTitle: string;
    heroTitleTop: string;
    heroTitleBottom: string;
  }>();
</script>
