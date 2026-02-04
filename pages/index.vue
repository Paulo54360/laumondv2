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
      :footnote="metahismeContent.footnote"
    />

    <HomeArtworksSection
      :section-title="getContent('homepage_artworks_title', locale) ?? t('homepage.artworks_title')"
      :artworks="featuredArtworks"
      :cta-label="getContent('homepage_browse_artworks', locale) ?? t('homepage.browse_artworks')"
      :cta-href="ctaArtworksLink"
    />

    <HomeAnalysesSection
      :section-title="getContent('homepage_analyses_title', locale) ?? t('homepage.analyses_title')"
      :analyses="analyses"
      :cta-label="getContent('homepage_read_analyses', locale) ?? t('homepage.read_analyses')"
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

  definePageMeta({ layout: 'default' });

  const route = useRoute();
  const { locale, t } = useI18n();
  const { fetchTexts, getContent } = useSiteTexts();

  await useAsyncData('site-texts', () => fetchTexts());

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
    titleTop: getContent('homepage_hero_title_top', locale.value) ?? t('homepage.hero_title_top'),
    titleBottom:
      getContent('homepage_hero_title_bottom', locale.value) ?? t('homepage.hero_title_bottom'),
    videoTitle: t('homepage.video_hint'),
    videoUrl: 'https://tm3.co/Y2xddo',
    artworkTitle: "Le mobile d'ouverture des univers parallèles, 2022 — Œuvre interactive 360°",
  }));

  const biographyContent = computed(() => ({
    sectionTitle:
      getContent('homepage_biography_title', locale.value) ?? t('homepage.biography_title'),
    portraitName: t('homepage.portrait_name'),
    portraitCaption:
      getContent('homepage_portrait_caption', locale.value) ?? t('homepage.portrait_caption'),
    text: getContent('homepage_biography', locale.value) ?? t('homepage.biography_text'),
    ctaLabel: getContent('homepage_read_biography', locale.value) ?? t('homepage.read_biography'),
    ctaHref: localePath('/biography'),
    showMoreAlt: t('analyses.show_more'),
    showLessAlt: t('analyses.show_less'),
  }));

  const metahismeTextFull = computed(() => {
    const fromDb = getContent('homepage_metahism', locale.value);
    return fromDb ?? t('homepage.metahisme_text');
  });

  const metahismeTitle = computed(() => {
    const fullText = metahismeTextFull.value;
    const firstLineEnd = fullText.indexOf('\n\n');
    return firstLineEnd !== -1 ? fullText.substring(0, firstLineEnd) : fullText;
  });

  const metahismeText = computed(() => {
    const fullText = metahismeTextFull.value;
    const firstLineEnd = fullText.indexOf('\n\n');
    return firstLineEnd !== -1 ? fullText.substring(firstLineEnd + 2) : '';
  });

  const metahismeContent = computed(() => ({
    sectionTitle:
      getContent('homepage_metahism_title', locale.value) ?? t('homepage.metahisme_title'),
    artworkTitle:
      getContent('homepage_mobile_ouverture_title', locale.value) ??
      t('homepage.mobile_ouverture_title'),
    artworkCaption:
      getContent('homepage_metahisme_artwork_caption', locale.value) ??
      t('homepage.metahisme_artwork_caption'),
    definitionTitle: metahismeTitle.value,
    definitionText: metahismeText.value,
    ctaLabel:
      getContent('homepage_discover_metahisme', locale.value) ?? t('homepage.discover_metahisme'),
    ctaHref: localePath('/metahism'),
    showMoreAlt: t('analyses.show_more'),
    showLessAlt: t('analyses.show_less'),
    footnote: t('MétaHisme.Footnote'),
  }));

  const featuredArtworks = computed(() => {
    const artworksLink = localePath('/artworks');
    return [
      {
        id: 1,
        title:
          getContent('homepage_artwork_portant', locale.value) ?? t('homepage.artwork_portant'),
        author:
          getContent('homepage_artwork_portant_author', locale.value) ??
          t('homepage.artwork_portant_author'),
        imageUrl: 'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/10.jpg',
        link: artworksLink,
      },
      {
        id: 2,
        title:
          getContent('homepage_artwork_concordance', locale.value) ??
          t('homepage.artwork_concordance'),
        author:
          getContent('homepage_artwork_concordance_author', locale.value) ??
          t('homepage.artwork_concordance_author'),
        imageUrl: 'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/03.jpg',
        link: artworksLink,
      },
      {
        id: 3,
        title:
          getContent('homepage_artwork_mobile', locale.value) ??
          t('homepage.artwork_mobile_ouverture'),
        author:
          getContent('homepage_artwork_mobile_author', locale.value) ??
          t('homepage.artwork_mobile_author'),
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
        title:
          getContent('homepage_analysis_portant_title', locale.value) ??
          t('homepage.analysis_portant_title'),
        excerpt:
          getContent('homepage_analysis_portant_excerpt', locale.value) ??
          t('homepage.analysis_portant_excerpt'),
        imageUrl: 'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/10.jpg',
        link: buildLink('portant'),
      },
      {
        title:
          getContent('homepage_analysis_concordance_title', locale.value) ??
          t('homepage.analysis_concordance_title'),
        excerpt:
          getContent('homepage_analysis_concordance_excerpt', locale.value) ??
          t('homepage.analysis_concordance_excerpt'),
        imageUrl: 'https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/02.jpg',
        link: buildLink('concordance'),
      },
    ];
  });

  const ctaAnalysesLink = computed(() => localePath('/analyses'));
  const ctaArtworksLink = computed(() => localePath('/artworks'));
</script>

<style lang="scss" src="~/assets/css/pages/home.scss"></style>
