<template>
  <section id="oeuvres" class="section oeuvres-section">
    <div class="section-container">
      <div class="section-header">
        <h2 class="section-title">
          <NuxtLink :to="ctaHref" class="heading-link">{{ sectionTitle }}</NuxtLink>
        </h2>
        <div class="section-divider"></div>
      </div>

      <div class="artworks-showcase">
        <div
          v-for="(artwork, index) in artworks"
          :key="artwork.id ?? index"
          class="artwork-item"
          :class="`artwork-${index + 1}`"
        >
          <NuxtLink :to="artwork.link" class="artwork-link">
            <div class="artwork-frame">
              <img :src="artwork.imageUrl" :alt="artwork.title" />
            </div>
            <div class="artwork-info">
              <h3 class="artwork-title">{{ artwork.title }}</h3>
              <div class="artwork-author">{{ artwork.author }}</div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <div class="section-link">
        <NuxtLink :to="ctaHref" class="artistic-link">{{ ctaLabel }}</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  interface IHomeArtwork {
    id?: number;
    title: string;
    author: string;
    imageUrl: string;
    link: string;
  }

  defineProps<{
    sectionTitle: string;
    artworks: IHomeArtwork[];
    ctaLabel: string;
    ctaHref: string;
  }>();
</script>
