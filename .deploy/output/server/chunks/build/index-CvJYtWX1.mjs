import { defineComponent, computed, mergeProps, unref, ref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { _ as __nuxt_component_0 } from './nuxt-link-DGIkgc4d.mjs';
import { _ as _imports_0, a as _imports_1 } from './Fleche Vers Le Haut-CSX7pV5_.mjs';
import { a as useI18n } from './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "HomeAnalysesSection",
  __ssrInlineRender: true,
  props: {
    sectionTitle: {},
    analyses: {},
    ctaLabel: {},
    ctaHref: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "analyses",
        class: "section analyses-section"
      }, _attrs))}><div class="section-container"><div class="section-header"><h2 class="section-title">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: __props.ctaHref,
        class: "heading-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.sectionTitle)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.sectionTitle), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</h2><div class="section-divider"></div></div><div class="analyses-content"><!--[-->`);
      ssrRenderList(__props.analyses, (analysis, index) => {
        _push(`<div class="${ssrRenderClass([{ "analysis-reverse": index % 2 === 1 }, "analysis-item"])}"><div class="analysis-image"><img${ssrRenderAttr("src", analysis.imageUrl)}${ssrRenderAttr("alt", analysis.title)}></div><div class="analysis-text-content"><h3 class="analysis-title">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: analysis.link,
          class: "heading-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(analysis.title)}`);
            } else {
              return [
                createTextVNode(toDisplayString(analysis.title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</h3><div class="analysis-excerpt"><p>${ssrInterpolate(analysis.excerpt)}</p></div></div></div>`);
      });
      _push(`<!--]--></div><div class="section-link">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: __props.ctaHref,
        class: "artistic-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.ctaLabel)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.ctaLabel), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/HomeAnalysesSection.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "HomeArtworksSection",
  __ssrInlineRender: true,
  props: {
    sectionTitle: {},
    artworks: {},
    ctaLabel: {},
    ctaHref: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "oeuvres",
        class: "section oeuvres-section"
      }, _attrs))}><div class="section-container"><div class="section-header"><h2 class="section-title">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: __props.ctaHref,
        class: "heading-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.sectionTitle)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.sectionTitle), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</h2><div class="section-divider"></div></div><div class="artworks-showcase"><!--[-->`);
      ssrRenderList(__props.artworks, (artwork, index) => {
        _push(`<div class="${ssrRenderClass([`artwork-${index + 1}`, "artwork-item"])}">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: artwork.link,
          class: "artwork-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="artwork-frame"${_scopeId}><img${ssrRenderAttr("src", artwork.imageUrl)}${ssrRenderAttr("alt", artwork.title)}${_scopeId}></div><div class="artwork-info"${_scopeId}><h3 class="artwork-title"${_scopeId}>${ssrInterpolate(artwork.title)}</h3><div class="artwork-author"${_scopeId}>${ssrInterpolate(artwork.author)}</div></div>`);
            } else {
              return [
                createVNode("div", { class: "artwork-frame" }, [
                  createVNode("img", {
                    src: artwork.imageUrl,
                    alt: artwork.title
                  }, null, 8, ["src", "alt"])
                ]),
                createVNode("div", { class: "artwork-info" }, [
                  createVNode("h3", { class: "artwork-title" }, toDisplayString(artwork.title), 1),
                  createVNode("div", { class: "artwork-author" }, toDisplayString(artwork.author), 1)
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div><div class="section-link">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: __props.ctaHref,
        class: "artistic-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.ctaLabel)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.ctaLabel), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/HomeArtworksSection.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "HomeBiographySection",
  __ssrInlineRender: true,
  props: {
    sectionTitle: {},
    portraitUrl: {},
    portraitAlt: {},
    portraitCaption: {},
    biographyText: {},
    ctaLabel: {},
    ctaHref: {},
    showMoreAlt: {},
    showLessAlt: {}
  },
  setup(__props) {
    const showFullBiography = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "biography",
        class: "section biography-section"
      }, _attrs))}><div class="section-container"><div class="section-header"><h2 class="section-title">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: __props.ctaHref,
        class: "heading-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.sectionTitle)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.sectionTitle), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</h2><div class="section-divider"></div></div><div class="biography-content"><div class="biography-visual"><div class="portrait-showcase"><img${ssrRenderAttr("src", __props.portraitUrl)}${ssrRenderAttr("alt", __props.portraitAlt)} class="portrait-artwork"><div class="portrait-overlay"><h4>${ssrInterpolate(__props.portraitAlt)}</h4><p>${ssrInterpolate(__props.portraitCaption)}</p></div></div></div><div class="biography-text"><div class="biography-intro"><div class="${ssrRenderClass([{ collapsed: !showFullBiography.value }, "text-content"])}"><p>${ssrInterpolate(__props.biographyText)}</p></div><button class="show-more-button" type="button">`);
      if (!showFullBiography.value) {
        _push(`<img${ssrRenderAttr("src", unref(_imports_0))}${ssrRenderAttr("alt", __props.showMoreAlt)} class="arrow-img">`);
      } else {
        _push(`<img${ssrRenderAttr("src", unref(_imports_1))}${ssrRenderAttr("alt", __props.showLessAlt)} class="arrow-img">`);
      }
      _push(`</button></div></div></div>`);
      if (showFullBiography.value) {
        _push(`<div class="section-link">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: __props.ctaHref,
          class: "artistic-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(__props.ctaLabel)}`);
            } else {
              return [
                createTextVNode(toDisplayString(__props.ctaLabel), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/HomeBiographySection.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "HomeHero",
  __ssrInlineRender: true,
  props: {
    videoUrl: {},
    videoTitle: {},
    artworkTitle: {},
    heroTitleTop: {},
    heroTitleBottom: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "hero-section" }, _attrs))}><div class="hero-wrapper"><div class="hero-visual"><div class="viewer-360"><iframe class="video"${ssrRenderAttr("src", __props.videoUrl)} allowfullscreen${ssrRenderAttr("title", __props.videoTitle)}></iframe><div class="viewer-overlay-top"></div></div><div class="viewer-caption"><h3 class="artwork-title">${ssrInterpolate(__props.artworkTitle)}</h3></div></div><div class="hero-text"><h1 class="hero-name">${ssrInterpolate(__props.heroTitleTop)}<br>${ssrInterpolate(__props.heroTitleBottom)}</h1></div></div></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/HomeHero.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "HomeMetahismSection",
  __ssrInlineRender: true,
  props: {
    sectionTitle: {},
    artworkTitle: {},
    artworkCaption: {},
    artworkImageUrl: {},
    definitionTitle: {},
    definitionText: {},
    ctaLabel: {},
    ctaHref: {},
    showMoreAlt: {},
    showLessAlt: {}
  },
  setup(__props) {
    const showFullMetahisme = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "metahisme",
        class: "section metahisme-section"
      }, _attrs))}><div class="section-container"><div class="section-header"><h2 class="section-title">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: __props.ctaHref,
        class: "heading-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.sectionTitle)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.sectionTitle), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</h2><div class="section-divider"></div></div><div class="metahisme-content"><div class="metahisme-visual"><div class="artwork-showcase"><img${ssrRenderAttr("src", __props.artworkImageUrl)}${ssrRenderAttr("alt", __props.artworkTitle)} class="metahisme-artwork"><div class="artwork-overlay"><h4>${ssrInterpolate(__props.artworkTitle)}</h4><p>${ssrInterpolate(__props.artworkCaption)}</p></div></div></div><div class="metahisme-text"><div class="metahisme-definition"><h3 class="metahisme-declaration-title">${ssrInterpolate(__props.definitionTitle)}</h3><div class="${ssrRenderClass([{ collapsed: !showFullMetahisme.value }, "text-content"])}"><p>${ssrInterpolate(__props.definitionText)}</p></div><button class="show-more-button" type="button">`);
      if (!showFullMetahisme.value) {
        _push(`<img${ssrRenderAttr("src", unref(_imports_0))}${ssrRenderAttr("alt", __props.showMoreAlt)} class="arrow-img">`);
      } else {
        _push(`<img${ssrRenderAttr("src", unref(_imports_1))}${ssrRenderAttr("alt", __props.showLessAlt)} class="arrow-img">`);
      }
      _push(`</button></div></div></div>`);
      if (showFullMetahisme.value) {
        _push(`<div class="section-link">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: __props.ctaHref,
          class: "artistic-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(__props.ctaLabel)}`);
            } else {
              return [
                createTextVNode(toDisplayString(__props.ctaLabel), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/HomeMetahismSection.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const biographyPortraitUrl = (
  // eslint-disable-next-line max-len
  "https://plaumondpicture.s3.eu-west-3.amazonaws.com/authors/Work+of+Identity+from+ID+Laumond.jpg"
);
const mobileOuvertureImageUrl = "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/06.jpg";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { locale, t } = useI18n();
    const localePath = (path) => {
      var _a, _b;
      const localeFromPath = ((_b = (_a = route.path) == null ? void 0 : _a.match(/^\/(fr|en)/)) == null ? void 0 : _b[1]) || locale.value || "fr";
      return `/${localeFromPath}${path}`;
    };
    const heroContent = computed(() => ({
      titleTop: t("homepage.hero_title_top"),
      titleBottom: t("homepage.hero_title_bottom"),
      videoTitle: t("homepage.video_hint"),
      videoUrl: "https://tm3.co/Y2xddo",
      artworkTitle: "Le mobile d'ouverture des univers parall\xE8les, 2022 \u2014 \u0152uvre interactive 360\xB0"
    }));
    const biographyContent = computed(() => ({
      sectionTitle: t("homepage.biography_title"),
      portraitName: t("homepage.portrait_name"),
      portraitCaption: t("homepage.portrait_caption"),
      text: t("homepage.biography_text"),
      ctaLabel: t("homepage.read_biography"),
      ctaHref: localePath("/biography"),
      showMoreAlt: t("analyses.show_more"),
      showLessAlt: t("analyses.show_less")
    }));
    const metahismeTextFull = computed(() => t("homepage.metahisme_text"));
    const metahismeTitle = computed(() => {
      const fullText = metahismeTextFull.value;
      const firstLineEnd = fullText.indexOf("\n\n");
      return firstLineEnd !== -1 ? fullText.substring(0, firstLineEnd) : "";
    });
    const metahismeText = computed(() => {
      const fullText = metahismeTextFull.value;
      const firstLineEnd = fullText.indexOf("\n\n");
      return firstLineEnd !== -1 ? fullText.substring(firstLineEnd + 2) : fullText;
    });
    const metahismeContent = computed(() => ({
      sectionTitle: t("homepage.metahisme_title"),
      artworkTitle: t("homepage.mobile_ouverture_title"),
      artworkCaption: t("homepage.metahisme_artwork_caption"),
      definitionTitle: metahismeTitle.value,
      definitionText: metahismeText.value,
      ctaLabel: t("homepage.discover_metahisme"),
      ctaHref: localePath("/metahism"),
      showMoreAlt: t("analyses.show_more"),
      showLessAlt: t("analyses.show_less")
    }));
    const featuredArtworks = computed(() => {
      const artworksLink = localePath("/artworks");
      return [
        {
          id: 1,
          title: t("homepage.artwork_portant"),
          author: t("homepage.artwork_portant_author"),
          imageUrl: "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/10.jpg",
          link: artworksLink
        },
        {
          id: 2,
          title: t("homepage.artwork_concordance"),
          author: t("homepage.artwork_concordance_author"),
          imageUrl: "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/03.jpg",
          link: artworksLink
        },
        {
          id: 3,
          title: t("homepage.artwork_mobile_ouverture"),
          author: t("homepage.artwork_mobile_author"),
          imageUrl: "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/06.jpg",
          link: artworksLink
        }
      ];
    });
    const analyses = computed(() => {
      const analysesBase = localePath("/analyses");
      const buildLink = (tab) => `${analysesBase}?tab=${tab}`;
      return [
        {
          title: t("homepage.analysis_portant_title"),
          excerpt: t("homepage.analysis_portant_excerpt"),
          imageUrl: "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/10.jpg",
          link: buildLink("portant")
        },
        {
          title: t("homepage.analysis_concordance_title"),
          excerpt: t("homepage.analysis_concordance_excerpt"),
          imageUrl: "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/02.jpg",
          link: buildLink("concordance")
        }
      ];
    });
    const ctaAnalysesLink = computed(() => localePath("/analyses"));
    const ctaArtworksLink = computed(() => localePath("/artworks"));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "homepage" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        "video-url": heroContent.value.videoUrl,
        "video-title": heroContent.value.videoTitle,
        "artwork-title": heroContent.value.artworkTitle,
        "hero-title-top": heroContent.value.titleTop,
        "hero-title-bottom": heroContent.value.titleBottom
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$3, {
        "section-title": biographyContent.value.sectionTitle,
        "portrait-url": biographyPortraitUrl,
        "portrait-alt": biographyContent.value.portraitName,
        "portrait-caption": biographyContent.value.portraitCaption,
        "biography-text": biographyContent.value.text,
        "cta-label": biographyContent.value.ctaLabel,
        "cta-href": biographyContent.value.ctaHref,
        "show-more-alt": biographyContent.value.showMoreAlt,
        "show-less-alt": biographyContent.value.showLessAlt
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        "section-title": metahismeContent.value.sectionTitle,
        "artwork-title": metahismeContent.value.artworkTitle,
        "artwork-caption": metahismeContent.value.artworkCaption,
        "artwork-image-url": mobileOuvertureImageUrl,
        "definition-title": metahismeContent.value.definitionTitle,
        "definition-text": metahismeContent.value.definitionText,
        "cta-label": metahismeContent.value.ctaLabel,
        "cta-href": metahismeContent.value.ctaHref,
        "show-more-alt": metahismeContent.value.showMoreAlt,
        "show-less-alt": metahismeContent.value.showLessAlt
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$4, {
        "section-title": unref(t)("homepage.artworks_title"),
        artworks: featuredArtworks.value,
        "cta-label": unref(t)("homepage.browse_artworks"),
        "cta-href": ctaArtworksLink.value
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$5, {
        "section-title": unref(t)("homepage.analyses_title"),
        analyses: analyses.value,
        "cta-label": unref(t)("homepage.read_analyses"),
        "cta-href": ctaAnalysesLink.value
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CvJYtWX1.mjs.map
