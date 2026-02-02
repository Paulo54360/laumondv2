<template>
  <section id="analyses" class="section analyses-section">
    <div class="section-container">
      <BaseSectionTitle :animated="true">
        <NuxtLink :to="ctaHref" class="heading-link">{{ sectionTitle }}</NuxtLink>
      </BaseSectionTitle>

      <div class="analyses-content">
        <div
          v-for="(analysis, index) in analyses"
          :key="`${analysis.title}-${index}`"
          class="analysis-item"
          :class="{ 'analysis-reverse': index % 2 === 1 }"
        >
          <div class="analysis-image">
            <img :src="analysis.imageUrl" :alt="analysis.title" />
          </div>
          <div class="analysis-text-content">
            <h3 class="analysis-title">
              <NuxtLink :to="analysis.link" class="heading-link">{{ analysis.title }}</NuxtLink>
            </h3>
            <div class="analysis-excerpt">
              <p>{{ analysis.excerpt }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="section-link">
        <NuxtLink :to="ctaHref" class="artistic-link">{{ ctaLabel }}</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  interface IHomeAnalysis {
    title: string;
    excerpt: string;
    imageUrl: string;
    link: string;
  }

  defineProps<{
    sectionTitle: string;
    analyses: IHomeAnalysis[];
    ctaLabel: string;
    ctaHref: string;
  }>();
</script>
