import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { computed, ref, mergeProps, defineComponent, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { useRoute } from 'vue-router';
import { _ as __nuxt_component_0 } from './nuxt-link-DGIkgc4d.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { a as useI18n } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "carousselSection",
  __ssrInlineRender: true,
  props: {
    title: {},
    images: {},
    link: {}
  },
  setup(__props) {
    const props = __props;
    ref(null);
    const dynamicImages = ref([...props.images, ...props.images]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "carousels-container" }, _attrs))} data-v-f51f8009><div class="carousel-header-wrapper" data-v-f51f8009><div class="carousel-header" data-v-f51f8009>`);
      if (__props.link && !__props.link.startsWith("http") && !__props.link.endsWith(".jpg") && !__props.link.endsWith(".png") && !__props.link.endsWith(".jpeg") && !__props.link.endsWith(".webp")) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: __props.link,
          class: "carousel-title-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h2 class="carousel-title" data-v-f51f8009${_scopeId}>${ssrInterpolate(__props.title)}</h2>`);
            } else {
              return [
                createVNode("h2", { class: "carousel-title" }, toDisplayString(__props.title), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<h2 class="carousel-title" data-v-f51f8009>${ssrInterpolate(__props.title)}</h2>`);
      }
      _push(`<div class="carousel-divider" data-v-f51f8009></div></div></div><div class="carousel-full-width" data-v-f51f8009><div class="carousel" data-v-f51f8009><!--[-->`);
      ssrRenderList(dynamicImages.value, (image, index) => {
        _push(`<div class="carousel-item" data-v-f51f8009><img${ssrRenderAttr("src", image)} class="carousel-image"${ssrRenderAttr("alt", `Image ${index + 1}`)} data-v-f51f8009></div>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/carousselSection.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const CarouselSection = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-f51f8009"]]);
const _sfc_main$1 = {
  __name: "oeuvreGallery",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { locale } = useI18n();
    const currentLocale = computed(() => {
      var _a, _b;
      const localeFromPath = (_b = (_a = route.path) == null ? void 0 : _a.match(/^\/(fr|en)/)) == null ? void 0 : _b[1];
      return localeFromPath || locale.value || "fr";
    });
    const archetypesLink = computed(() => `/${currentLocale.value}/archetypes`);
    const deploymentsLink = computed(() => `/${currentLocale.value}/deployments`);
    const drawingsLink = computed(() => `/${currentLocale.value}/drawings`);
    const transcriptionsLink = computed(() => `/${currentLocale.value}/transcriptions`);
    const imageUrlsArchetypes = ref([
      "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/04/07.jpg",
      "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/03/01.jpg",
      "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/09/05.jpg",
      "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/03/02.jpg"
    ]);
    const imageUrlsDeployments = ref([
      "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/05/01.jpg",
      "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/01/03.jpg",
      "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/02/01.jpg",
      "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/03.jpg"
    ]);
    const imageUrlsDrawings = ref([
      "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings+/01/01.jpg",
      "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings+/01/02.jpg",
      "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings+/01/03.jpg",
      "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings+/01/04.jpg"
    ]);
    const imageUrlsTranscriptions = ref([
      "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/02/01.jpg",
      "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/02/02.jpg",
      "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/02/03.jpg",
      "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/02/04.jpg",
      "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/02/05.jpg"
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "carousels-container" }, _attrs))} data-v-4d223cb1>`);
      _push(ssrRenderComponent(CarouselSection, {
        title: _ctx.$t("gallery.categories.deploiement"),
        images: imageUrlsDeployments.value,
        link: deploymentsLink.value
      }, null, _parent));
      _push(ssrRenderComponent(CarouselSection, {
        title: _ctx.$t("gallery.categories.archetype"),
        images: imageUrlsArchetypes.value,
        link: archetypesLink.value
      }, null, _parent));
      _push(ssrRenderComponent(CarouselSection, {
        title: _ctx.$t("gallery.categories.transcriptions"),
        images: imageUrlsTranscriptions.value,
        link: transcriptionsLink.value
      }, null, _parent));
      _push(ssrRenderComponent(CarouselSection, {
        title: _ctx.$t("gallery.categories.drawing"),
        images: imageUrlsDrawings.value,
        link: drawingsLink.value
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/oeuvreGallery.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const OeuvreGallery = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-4d223cb1"]]);
const _sfc_main = {
  __name: "artworks",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(OeuvreGallery, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/artworks.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=artworks-DQD-m1y8.mjs.map
