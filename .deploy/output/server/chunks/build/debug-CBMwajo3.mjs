import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
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
import 'vue-router';

const _sfc_main = {
  __name: "debug",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const connectionResults = ref(null);
    const testImages = ref([
      "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/01/01.jpg",
      "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/01.jpg",
      "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/03/01.jpg",
      "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings+/01/01.jpg"
    ]);
    const searchQuery = ref("etude");
    const searchResults = ref([]);
    const searchError = ref(null);
    const isSearching = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "debug-page" }, _attrs))} data-v-8b4651f7><h1 data-v-8b4651f7>${ssrInterpolate(unref(t)("debug.title"))}</h1><div data-v-8b4651f7><h2 data-v-8b4651f7>${ssrInterpolate(unref(t)("debug.section_connection"))}</h2><button class="test-button" data-v-8b4651f7>${ssrInterpolate(unref(t)("debug.action_test_connection"))}</button>`);
      if (connectionResults.value) {
        _push(`<pre data-v-8b4651f7>${ssrInterpolate(JSON.stringify(connectionResults.value, null, 2))}</pre>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-8b4651f7><h2 data-v-8b4651f7>${ssrInterpolate(unref(t)("debug.section_images"))}</h2><div class="image-test-container" data-v-8b4651f7><!--[-->`);
      ssrRenderList(testImages.value, (url, index) => {
        _push(`<div class="image-test" data-v-8b4651f7><h3 data-v-8b4651f7>${ssrInterpolate(unref(t)("gallery.image_alt", { index: index + 1 }))}</h3><div class="image-box" data-v-8b4651f7><img${ssrRenderAttr("src", url)}${ssrRenderAttr("alt", `Test ${index + 1}`)} data-v-8b4651f7></div><code data-v-8b4651f7>${ssrInterpolate(url)}</code></div>`);
      });
      _push(`<!--]--></div></div><div data-v-8b4651f7><h2 data-v-8b4651f7>${ssrInterpolate(unref(t)("debug.section_search"))}</h2><input${ssrRenderAttr("value", searchQuery.value)} type="text"${ssrRenderAttr("placeholder", unref(t)("debug.search_placeholder"))} class="search-input" data-v-8b4651f7><button class="test-button" data-v-8b4651f7>${ssrInterpolate(unref(t)("debug.action_search"))}</button>`);
      if (isSearching.value) {
        _push(`<div class="loading" data-v-8b4651f7>${ssrInterpolate(unref(t)("debug.loading"))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (searchError.value) {
        _push(`<div class="error" data-v-8b4651f7><h3 data-v-8b4651f7>${ssrInterpolate(unref(t)("debug.error"))}</h3><pre data-v-8b4651f7>${ssrInterpolate(JSON.stringify(searchError.value, null, 2))}</pre></div>`);
      } else {
        _push(`<!---->`);
      }
      if (searchResults.value && searchResults.value.length) {
        _push(`<div data-v-8b4651f7><h3 data-v-8b4651f7>${ssrInterpolate(unref(t)("debug.results", { count: searchResults.value.length }))}</h3><div class="results-grid" data-v-8b4651f7><!--[-->`);
        ssrRenderList(searchResults.value, (result) => {
          _push(`<div class="result-card" data-v-8b4651f7><h4 data-v-8b4651f7>${ssrInterpolate(result.title)}</h4>`);
          if (result.imageUrls && result.imageUrls.length) {
            _push(`<div data-v-8b4651f7><img${ssrRenderAttr("src", result.imageUrls[0])} alt="" data-v-8b4651f7></div>`);
          } else {
            _push(`<div class="no-image" data-v-8b4651f7>${ssrInterpolate(unref(t)("debug.no_image"))}</div>`);
          }
          _push(`<pre data-v-8b4651f7>${ssrInterpolate(JSON.stringify(result, null, 2))}</pre></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/debug.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const debug = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8b4651f7"]]);

export { debug as default };
//# sourceMappingURL=debug-CBMwajo3.mjs.map
