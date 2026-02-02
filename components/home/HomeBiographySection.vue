<template>
  <section id="biography" class="section biography-section">
    <div class="section-container">
      <BaseSectionTitle :animated="true">
        <NuxtLink :to="ctaHref" class="heading-link">{{ sectionTitle }}</NuxtLink>
      </BaseSectionTitle>

      <div class="biography-content">
        <div class="biography-visual">
          <div class="portrait-showcase">
            <img :src="portraitUrl" :alt="portraitAlt" class="portrait-artwork" />
            <div class="portrait-overlay">
              <h4>{{ portraitAlt }}</h4>
              <p>{{ portraitCaption }}</p>
            </div>
          </div>
        </div>

        <div class="biography-text">
          <div class="biography-intro">
            <div class="text-content" :class="{ collapsed: !showFullBiography }">
              <p>{{ biographyText }}</p>
            </div>

            <button class="show-more-button" type="button" @click="toggleBiography">
              <img
                v-if="!showFullBiography"
                :src="downArrowIcon"
                :alt="showMoreAlt"
                class="arrow-img"
              />
              <img v-else :src="upArrowIcon" :alt="showLessAlt" class="arrow-img" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="showFullBiography" class="section-link">
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
    portraitUrl: string;
    portraitAlt: string;
    portraitCaption: string;
    biographyText: string;
    ctaLabel: string;
    ctaHref: string;
    showMoreAlt: string;
    showLessAlt: string;
  }>();

  const showFullBiography = ref(false);
  const toggleBiography = (): void => {
    showFullBiography.value = !showFullBiography.value;
  };
</script>
