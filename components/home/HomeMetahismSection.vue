<template>
  <section id="metahisme" class="section metahisme-section">
    <div class="section-container">
      <div class="section-header">
        <h2 class="section-title">
          <NuxtLink :to="ctaHref" class="heading-link">{{ sectionTitle }}</NuxtLink>
        </h2>
        <div class="section-divider"></div>
      </div>

      <div class="metahisme-content">
        <div class="metahisme-visual">
          <div class="artwork-showcase">
            <img :src="artworkImageUrl" :alt="artworkTitle" class="metahisme-artwork" />
            <div class="artwork-overlay">
              <h4>{{ artworkTitle }}</h4>
              <p>{{ artworkCaption }}</p>
            </div>
          </div>
        </div>

        <div class="metahisme-text">
          <div class="metahisme-definition">
            <h3 class="metahisme-declaration-title">{{ definitionTitle }}</h3>

            <div class="text-content" :class="{ collapsed: !showFullMetahisme }">
              <p>{{ definitionText }}</p>
            </div>

            <button class="show-more-button" type="button" @click="toggleMetahisme">
              <img
                v-if="!showFullMetahisme"
                :src="downArrowIcon"
                :alt="showMoreAlt"
                class="arrow-img"
              />
              <img v-else :src="upArrowIcon" :alt="showLessAlt" class="arrow-img" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="showFullMetahisme" class="section-link">
        <NuxtLink :to="ctaHref" class="artistic-link">{{ ctaLabel }}</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  import downArrowIcon from '~/assets/images/common/Down Arrow Icon.png';
  import upArrowIcon from '~/assets/images/common/Fleche Vers Le Haut.png';

  defineProps<{
    sectionTitle: string;
    artworkTitle: string;
    artworkCaption: string;
    artworkImageUrl: string;
    definitionTitle: string;
    definitionText: string;
    ctaLabel: string;
    ctaHref: string;
    showMoreAlt: string;
    showLessAlt: string;
  }>();

  const showFullMetahisme = ref(false);
  const toggleMetahisme = (): void => {
    showFullMetahisme.value = !showFullMetahisme.value;
  };
</script>
