import { defineComponent, ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _imports_0, a as _imports_1 } from './Fleche Vers Le Haut-CSX7pV5_.mjs';
import { b as useRuntimeConfig, a as useI18n } from './server.mjs';
import { useRoute } from 'vue-router';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "analyses",
  __ssrInlineRender: true,
  setup(__props) {
    const runtimeConfig = useRuntimeConfig();
    const S3_BASE_URL = runtimeConfig.public.apiUrl;
    const route = useRoute();
    const { t } = useI18n();
    const tabs = [
      {
        id: "portant",
        title: "Laumond \xE0 l'espace Commines",
        images: [`${S3_BASE_URL}/Deployments/00/10.jpg`, `${S3_BASE_URL}/Deployments/00/11.jpg`],
        translations: {
          fr: "",
          en: ""
        },
        author: "Edith Herlemont-Lassiat",
        analysisTitle: "Le portant (524C)",
        location: "Espace Commines, Paris",
        copyright: "\xA9 Philibert Tapissier",
        paragraphs: [
          { text: t("LAEC.Texte1LAEC"), type: "normal" },
          { text: t("LAEC.Texte2LAEC"), type: "normal" },
          { text: t("LAEC.Texte3LAEC"), type: "normal" },
          { text: t("LAEC.Texte4LAEC"), type: "normal" },
          { text: t("LAEC.Texte5LAEC"), type: "normal" },
          { text: t("LAEC.Texte6LAEC"), type: "normal" },
          { text: t("LAEC.Texte10LAEC"), type: "normal" },
          { text: t("LAEC.Texte12LAEC"), type: "normal" },
          { text: t("LAEC.Texte13LAEC"), type: "normal" },
          { text: t("LAEC.Texte14LAEC"), type: "normal" },
          { text: t("LAEC.Texte15LAEC"), type: "normal" },
          { text: t("LAEC.Texte16LAEC"), type: "normal" },
          { text: t("LAEC.Texte17LAEC"), type: "normal" },
          { text: t("LAEC.Texte18LAEC"), type: "normal" },
          { text: t("LAEC.Texte19LAEC"), type: "normal" }
        ],
        authorSignature: {
          name: t("LAEC.AuteurLAEC"),
          title: "",
          date: ""
        },
        footnotes: []
      },
      {
        id: "concordance",
        title: "M\xE9taHisme, une tentative d'\xE9largissement des possibles",
        images: [
          `${S3_BASE_URL}/Deployments/00/02.jpg`,
          `${S3_BASE_URL}/Deployments/00/03.jpg`,
          `${S3_BASE_URL}/Deployments/00/04.jpg`
        ],
        translations: {
          fr: "",
          en: ""
        },
        author: "Marion Zilio",
        analysisTitle: "Concordance universelle",
        location: "Biennale de Venise 2022 \u2014 Centre Culturel Europ\xE9en d\u2019Italie, Palazzo Bembo.",
        copyright: "\xA9 Matteo Losurdo",
        paragraphs: [{ text: t("CU.TexteCU"), type: "normal" }],
        authorSignature: {
          name: t("CU.AuteurCU"),
          title: "",
          date: ""
        },
        footnotes: []
      },
      {
        id: "aimants",
        title: "Comme deux aimants",
        images: [`${S3_BASE_URL}/Deployments/00/06.jpg`],
        translations: {
          fr: "",
          en: ""
        },
        author: "Marion Zilio",
        analysisTitle: "Le Mobile d'ouverture des univers parall\xE8les",
        location: "Espace Labasse \u2014 Saint-Viance, 2023",
        copyright: "\xA9 Philibert Tapissier",
        paragraphs: [
          { text: t("CDA.Texte1CDA"), type: "normal" },
          { text: t("CDA.Texte2CDA"), type: "normal" },
          { text: t("CDA.Texte3CDA"), type: "normal" }
        ],
        authorSignature: {
          name: t("CDA.AuteurCDA"),
          title: "",
          date: ""
        },
        footnotes: []
      },
      {
        id: "advienne",
        title: "Afin qu'un jouradvienne",
        images: [`${S3_BASE_URL}/Archetypes/02/09.jpg`, `${S3_BASE_URL}/Archetypes/02/10.jpg`],
        translations: {
          fr: "",
          en: ""
        },
        author: "Isabelle de Maison Rouge",
        analysisTitle: "Le grand Mikado de la pens\xE9e humaine",
        copyright: "\xA9 Philibert Tapissier",
        paragraphs: [
          { text: t("AQJA.Texte1AQJA"), type: "normal" },
          { text: t("AQJA.Texte2AQJA"), type: "normal" },
          { text: t("AQJA.Texte3AQJA"), type: "normal" },
          { text: t("AQJA.Texte4AQJA"), type: "normal" },
          { text: t("AQJA.Texte5AQJA"), type: "normal" },
          { text: t("AQJA.Texte6AQJA"), type: "normal" },
          { text: t("AQJA.Texte7AQJA"), type: "normal" },
          { text: t("AQJA.Texte8AQJA"), type: "citation" },
          { text: t("AQJA.Texte9AQJA"), type: "citation" },
          { text: t("AQJA.Texte10AQJA"), type: "normal" },
          { text: t("AQJA.Texte11AQJA"), type: "normal" },
          { text: t("AQJA.Texte12AQJA"), type: "normal" },
          { text: t("AQJA.Texte13AQJA"), type: "normal" },
          { text: t("AQJA.Texte14AQJA"), type: "normal" },
          { text: t("AQJA.Texte15AQJA"), type: "normal" },
          { text: t("AQJA.Texte16AQJA"), type: "normal" },
          { text: t("AQJA.Texte17AQJA"), type: "normal" },
          { text: t("AQJA.Texte18AQJA"), type: "emphasis" },
          { text: t("AQJA.Texte19AQJA"), type: "poeticLine" },
          { text: t("AQJA.Texte20AQJA"), type: "poeticLine" },
          { text: t("AQJA.Texte21AQJA"), type: "poeticLine" },
          { text: t("AQJA.Texte22AQJA"), type: "poeticLine" },
          { text: t("AQJA.Texte23AQJA"), type: "poeticLine" },
          { text: t("AQJA.Texte24AQJA"), type: "poeticLine" },
          { text: t("AQJA.Texte25AQJA"), type: "poeticLine" },
          { text: t("AQJA.Texte26AQJA"), type: "poeticLine" },
          { text: t("AQJA.Texte27AQJA"), type: "normal" },
          { text: t("AQJA.Texte28AQJA"), type: "citation" },
          { text: t("AQJA.Texte29AQJA"), type: "citation" },
          { text: t("AQJA.Texte30AQJA"), type: "citation" },
          { text: t("AQJA.Texte31AQJA"), type: "normal" }
        ],
        authorSignature: {
          name: t("AQJA.Texte32AQJA"),
          title: t("AQJA.Texte33AQJA"),
          date: t("AQJA.Texte34AQJA")
        },
        footnotes: [
          { number: "\xB9", text: t("AQJA.Legende1AQJA") },
          { number: "\xB2", text: t("AQJA.Legende2AQJA") }
        ]
      }
    ];
    const activeTab = ref(tabs[0].id);
    const showModal = ref(false);
    const currentImageIndex = ref(0);
    const showFullText = ref(false);
    const authorAvatars = {
      "Marion Zilio": `${S3_BASE_URL}/authors/marion-zilio.jpg`,
      "Isabelle de Maison Rouge": `${S3_BASE_URL}/authors/isabelle-de-maison-rouge.png`,
      "Edith Herlemont-Lassiat": `${S3_BASE_URL}/authors/default-avatar.jpg`,
      default: `${S3_BASE_URL}/authors/default-avatar.jpg`
    };
    const currentTab = computed(
      () => tabs.find((tab) => tab.id === activeTab.value)
    );
    watch(
      () => route.query.tab,
      (tab) => {
        if (typeof tab === "string" && tabs.some((entry) => entry.id === tab)) {
          activeTab.value = tab;
        }
      },
      { immediate: true }
    );
    const getAuthor = (tab) => {
      return tab.author || t("analyses.unknown_author");
    };
    const getAuthorAvatar = (tab) => {
      if (!tab || !tab.author) return authorAvatars.default;
      if (tab.author === "Edith Herlemont-Lassiat") {
        return authorAvatars.default;
      }
      return authorAvatars[tab.author] || authorAvatars.default;
    };
    const getAuthorTitle = (tab) => {
      if (!tab || !tab.author) return t("analyses.author_title");
      if (tab.author === "Edith Herlemont-Lassiat") {
        return `${t("analyses.author_title")} - Exporevue`;
      }
      if (tab.author === "Marion Zilio") {
        return `${t("analyses.author_title")} - AICA France`;
      }
      return t("analyses.author_title");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "analyses-page" }, _attrs))} data-v-6b40ab6d><div class="tabs" data-v-6b40ab6d><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass({ active: activeTab.value === tab.id })}" data-v-6b40ab6d>${ssrInterpolate(tab.title)}</button>`);
      });
      _push(`<!--]--></div>`);
      if (currentTab.value) {
        _push(`<div data-v-6b40ab6d><div class="${ssrRenderClass([{
          "images-side-by-side": currentTab.value.id === "advienne" && currentTab.value.images && currentTab.value.images.length > 1
        }, "main-image-container"])}" data-v-6b40ab6d>`);
        if (currentTab.value.id === "advienne" && currentTab.value.images && currentTab.value.images.length > 1) {
          _push(`<!--[-->`);
          ssrRenderList(currentTab.value.images, (image, index) => {
            _push(`<img class="main-image side-image"${ssrRenderAttr("src", image)}${ssrRenderAttr("alt", currentTab.value.title)} data-v-6b40ab6d>`);
          });
          _push(`<!--]-->`);
        } else if (currentTab.value.images && currentTab.value.images.length > 0) {
          _push(`<img class="main-image"${ssrRenderAttr("src", currentTab.value.images[0])}${ssrRenderAttr("alt", currentTab.value.title)} data-v-6b40ab6d>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="article-title-row" data-v-6b40ab6d><div class="article-title-header" data-v-6b40ab6d><h2 class="article-title" data-v-6b40ab6d>${ssrInterpolate(currentTab.value.analysisTitle)}</h2></div>`);
        if (currentTab.value.location) {
          _push(`<div class="article-location" data-v-6b40ab6d>${ssrInterpolate(currentTab.value.location)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="article-copyright" data-v-6b40ab6d>${ssrInterpolate(currentTab.value.copyright)}</div></div><div class="author-section" data-v-6b40ab6d><div class="author-info" data-v-6b40ab6d><div class="author-avatar" data-v-6b40ab6d><img${ssrRenderAttr("src", getAuthorAvatar(currentTab.value))}${ssrRenderAttr("alt", getAuthor(currentTab.value))} data-v-6b40ab6d></div><div class="author-details" data-v-6b40ab6d><span class="author-name" data-v-6b40ab6d>${ssrInterpolate(getAuthor(currentTab.value))}</span><span class="author-title" data-v-6b40ab6d>${ssrInterpolate(getAuthorTitle(currentTab.value))}</span></div></div></div><div class="translations" data-v-6b40ab6d><div class="translation fr" data-v-6b40ab6d><div class="text-content-wrapper" data-v-6b40ab6d><div class="${ssrRenderClass([{ collapsed: !showFullText.value }, "text-content"])}" data-v-6b40ab6d><div class="analysis-body" data-v-6b40ab6d><h3 class="section-title-in-text" data-v-6b40ab6d>${ssrInterpolate(currentTab.value.title)}</h3><!--[-->`);
        ssrRenderList(currentTab.value.paragraphs, (paragraph, index) => {
          _push(`<p class="${ssrRenderClass(paragraph.type === "poeticLine" ? "poetic-line" : "paragraph-item")}" data-v-6b40ab6d>`);
          if (paragraph.type === "quote") {
            _push(`<span class="quote-text" data-v-6b40ab6d>${ssrInterpolate(paragraph.text)}</span>`);
          } else if (paragraph.type === "citation") {
            _push(`<em class="citation" data-v-6b40ab6d>${ssrInterpolate(paragraph.text)}</em>`);
          } else if (paragraph.type === "emphasis") {
            _push(`<em class="emphasis-text" data-v-6b40ab6d>${ssrInterpolate(paragraph.text)}</em>`);
          } else {
            _push(`<!--[-->${ssrInterpolate(paragraph.text)}<!--]-->`);
          }
          _push(`</p>`);
        });
        _push(`<!--]--></div><div class="author-signature" data-v-6b40ab6d><p class="author-name-signature" data-v-6b40ab6d>${ssrInterpolate(currentTab.value.authorSignature.name)}</p>`);
        if (currentTab.value.authorSignature.title) {
          _push(`<p class="author-title-signature" data-v-6b40ab6d>${ssrInterpolate(currentTab.value.authorSignature.title)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (currentTab.value.authorSignature.date) {
          _push(`<p class="author-date" data-v-6b40ab6d>${ssrInterpolate(currentTab.value.authorSignature.date)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (currentTab.value.footnotes && currentTab.value.footnotes.length > 0) {
          _push(`<div class="footnotes" data-v-6b40ab6d><hr class="footnotes-separator" data-v-6b40ab6d><!--[-->`);
          ssrRenderList(currentTab.value.footnotes, (footnote, index) => {
            _push(`<p class="footnote" data-v-6b40ab6d><sup data-v-6b40ab6d>${ssrInterpolate(footnote.number)}</sup> ${ssrInterpolate(footnote.text)}</p>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="show-more-arrow" role="button" tabindex="0" data-v-6b40ab6d>`);
        if (!showFullText.value) {
          _push(`<img${ssrRenderAttr("src", _imports_0)}${ssrRenderAttr("alt", unref(t)("analyses.show_more"))} class="arrow-img" data-v-6b40ab6d>`);
        } else {
          _push(`<img${ssrRenderAttr("src", _imports_1)}${ssrRenderAttr("alt", unref(t)("analyses.show_less"))} class="arrow-img up" data-v-6b40ab6d>`);
        }
        _push(`</div>`);
        if (!showFullText.value) {
          _push(`<div class="text-fade" data-v-6b40ab6d></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
        if (showModal.value) {
          _push(`<div class="modal" data-v-6b40ab6d><div class="modal-content" data-v-6b40ab6d><img${ssrRenderAttr("src", currentTab.value.images[currentImageIndex.value])}${ssrRenderAttr("alt", currentTab.value.title)} data-v-6b40ab6d><button class="close-button" data-v-6b40ab6d>\xD7</button>`);
          if (currentImageIndex.value > 0) {
            _push(`<button class="nav-button prev" data-v-6b40ab6d> &lt; </button>`);
          } else {
            _push(`<!---->`);
          }
          if (currentImageIndex.value < currentTab.value.images.length - 1) {
            _push(`<button class="nav-button next" data-v-6b40ab6d> &gt; </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/analyses.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const analyses = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6b40ab6d"]]);

export { analyses as default };
//# sourceMappingURL=analyses-BTX4DorX.mjs.map
