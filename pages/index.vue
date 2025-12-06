<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="homepage">
    <HomeHero
      :video-url="heroContent.videoUrl"
      :video-title="heroContent.videoTitle"
      :artwork-title="heroContent.artworkTitle"
      :hero-title-top="heroContent.titleTop"
      :hero-title-bottom="heroContent.titleBottom"
    />

    <HomeBiographySection
      :section-title="biographyContent.sectionTitle"
      :portrait-url="biographyPortraitUrl"
      :portrait-alt="biographyContent.portraitName"
      :portrait-caption="biographyContent.portraitCaption"
      :biography-text="biographyContent.text"
      :cta-label="biographyContent.ctaLabel"
      :cta-href="biographyContent.ctaHref"
      :show-more-alt="biographyContent.showMoreAlt"
      :show-less-alt="biographyContent.showLessAlt"
    />

    <HomeMetahismSection
      :section-title="metahismeContent.sectionTitle"
      :artwork-title="metahismeContent.artworkTitle"
      :artwork-caption="metahismeContent.artworkCaption"
      :artwork-image-url="mobileOuvertureImageUrl"
      :definition-title="metahismeContent.definitionTitle"
      :definition-text="metahismeContent.definitionText"
      :cta-label="metahismeContent.ctaLabel"
      :cta-href="metahismeContent.ctaHref"
      :show-more-alt="metahismeContent.showMoreAlt"
      :show-less-alt="metahismeContent.showLessAlt"
    />

    <HomeArtworksSection
      :section-title="t('homepage.artworks_title')"
      :artworks="featuredArtworks"
      :cta-label="t('homepage.browse_artworks')"
      :cta-href="ctaArtworksLink"
    />

    <HomeAnalysesSection
      :section-title="t('homepage.analyses_title')"
      :analyses="analyses"
      :cta-label="t('homepage.read_analyses')"
      :cta-href="ctaAnalysesLink"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute } from 'vue-router';

  import HomeAnalysesSection from '~/components/home/HomeAnalysesSection.vue';
  import HomeArtworksSection from '~/components/home/HomeArtworksSection.vue';
  import HomeBiographySection from '~/components/home/HomeBiographySection.vue';
  import HomeHero from '~/components/home/HomeHero.vue';
  import HomeMetahismSection from '~/components/home/HomeMetahismSection.vue';

  const route = useRoute();
  const { locale, t } = useI18n();

  const biographyPortraitUrl =
    // eslint-disable-next-line max-len
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/authors/Work+of+Identity+from+ID+Laumond.jpg';
  const mobileOuvertureImageUrl =
    'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/06.jpg';

  const localePath = (path: string): string => {
    const localeFromPath = route.path?.match(/^\/(fr|en)/)?.[1] || locale.value || 'fr';
    return `/${localeFromPath}${path}`;
  };

  const heroContent = computed(() => ({
    titleTop: t('homepage.hero_title_top'),
    titleBottom: t('homepage.hero_title_bottom'),
    videoTitle: t('homepage.video_hint'),
    videoUrl: 'https://tm3.co/Y2xddo',
    artworkTitle: "Le mobile d'ouverture des univers parallèles, 2022 — Œuvre interactive 360°",
  }));

  const biographyContent = computed(() => ({
    sectionTitle: t('homepage.biography_title'),
    portraitName: t('homepage.portrait_name'),
    portraitCaption: t('homepage.portrait_caption'),
    text: t('homepage.biography_text'),
    ctaLabel: t('homepage.read_biography'),
    ctaHref: localePath('/biography'),
    showMoreAlt: t('analyses.show_more'),
    showLessAlt: t('analyses.show_less'),
  }));

  const metahismeTextFull = computed(() => t('homepage.metahisme_text'));

  const metahismeTitle = computed(() => {
    const fullText = metahismeTextFull.value;
    const firstLineEnd = fullText.indexOf('\n\n');
    return firstLineEnd !== -1 ? fullText.substring(0, firstLineEnd) : '';
  });

  const metahismeText = computed(() => {
    const fullText = metahismeTextFull.value;
    const firstLineEnd = fullText.indexOf('\n\n');
    return firstLineEnd !== -1 ? fullText.substring(firstLineEnd + 2) : fullText;
  });

  const metahismeContent = computed(() => ({
    sectionTitle: t('homepage.metahisme_title'),
    artworkTitle: t('homepage.mobile_ouverture_title'),
    artworkCaption: t('homepage.metahisme_artwork_caption'),
    definitionTitle: metahismeTitle.value,
    definitionText: metahismeText.value,
    ctaLabel: t('homepage.discover_metahisme'),
    ctaHref: localePath('/metahism'),
    showMoreAlt: t('analyses.show_more'),
    showLessAlt: t('analyses.show_less'),
  }));

  const featuredArtworks = computed(() => {
    const artworksLink = localePath('/artworks');
    return [
      {
        id: 1,
        title: t('homepage.artwork_portant'),
        author: t('homepage.artwork_portant_author'),
        imageUrl: 'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/10.jpg',
        link: artworksLink,
      },
      {
        id: 2,
        title: t('homepage.artwork_concordance'),
        author: t('homepage.artwork_concordance_author'),
        imageUrl: 'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/03.jpg',
        link: artworksLink,
      },
      {
        id: 3,
        title: t('homepage.artwork_mobile_ouverture'),
        author: t('homepage.artwork_mobile_author'),
        imageUrl: 'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/06.jpg',
        link: artworksLink,
      },
    ];
  });

  const analyses = computed(() => {
    const analysesBase = localePath('/analyses');
    const buildLink = (tab: string): string => `${analysesBase}?tab=${tab}`;
    return [
      {
        title: t('homepage.analysis_portant_title'),
        excerpt: t('homepage.analysis_portant_excerpt'),
        imageUrl: 'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/10.jpg',
        link: buildLink('portant'),
      },
      {
        title: t('homepage.analysis_concordance_title'),
        excerpt: t('homepage.analysis_concordance_excerpt'),
        imageUrl: 'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/02.jpg',
        link: buildLink('concordance'),
      },
    ];
  });

  const ctaAnalysesLink = computed(() => localePath('/analyses'));
  const ctaArtworksLink = computed(() => localePath('/artworks'));
</script>

<style lang="scss" src="~/assets/css/pages/home.scss"></style>
