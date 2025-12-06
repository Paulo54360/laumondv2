import { defineComponent, ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { a as useI18n } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "search",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { t } = useI18n();
    const searchQuery = ref(route.query.q || "");
    const artworks = ref([]);
    const isLoading = ref(false);
    const error = ref(null);
    const selectedArtwork = ref(null);
    const currentImageIndex = ref(0);
    function getImageUrls(artwork) {
      if (Array.isArray(artwork.imageUrls)) {
        return artwork.imageUrls;
      }
      try {
        return typeof artwork.imageUrls === "string" ? JSON.parse(artwork.imageUrls) : [];
      } catch (e) {
        console.error("Erreur lors du parsing des URLs:", e);
        return [];
      }
    }
    function getFirstImageUrl(artwork) {
      const urls = getImageUrls(artwork);
      return urls[0] || void 0;
    }
    const getCurrentImageUrl = computed(() => {
      if (!selectedArtwork.value) return void 0;
      const urls = getImageUrls(selectedArtwork.value);
      return urls[currentImageIndex.value] || void 0;
    });
    async function fetchResults() {
      var _a;
      if (!searchQuery.value) {
        artworks.value = [];
        return;
      }
      isLoading.value = true;
      error.value = null;
      try {
        const response = await $fetch("/api/search", {
          params: {
            q: searchQuery.value
          }
        });
        artworks.value = response.artworks;
        console.log("R\xE9sultats de recherche:", artworks.value);
      } catch (e) {
        error.value = ((_a = e.data) == null ? void 0 : _a.message) || t("common.error");
        console.error("Erreur de recherche:", e);
        artworks.value = [];
      } finally {
        isLoading.value = false;
      }
    }
    watch(
      () => route.query.q,
      (newQuery) => {
        searchQuery.value = newQuery || "";
        fetchResults();
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "search-page" }, _attrs))} data-v-2b039b9f><h1 class="search-title" data-v-2b039b9f>${ssrInterpolate(unref(t)("search.title"))}</h1><div class="search-results" data-v-2b039b9f>`);
      if (isLoading.value) {
        _push(`<div class="loading" data-v-2b039b9f><div class="loading-spinner" data-v-2b039b9f></div><p data-v-2b039b9f>${ssrInterpolate(unref(t)("search.loading"))}</p></div>`);
      } else if (error.value) {
        _push(`<div class="error" data-v-2b039b9f><p data-v-2b039b9f>${ssrInterpolate(error.value)}</p><button class="retry-button" data-v-2b039b9f>${ssrInterpolate(unref(t)("common.retry"))}</button></div>`);
      } else if (artworks.value.length === 0) {
        _push(`<div class="no-results" data-v-2b039b9f>`);
        if (searchQuery.value) {
          _push(`<p data-v-2b039b9f>${ssrInterpolate(unref(t)("search.empty_with_query", { query: searchQuery.value }))}</p>`);
        } else {
          _push(`<p data-v-2b039b9f>${ssrInterpolate(unref(t)("search.empty_without_query"))}</p>`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="artworks-grid" data-v-2b039b9f><!--[-->`);
        ssrRenderList(artworks.value, (artwork) => {
          _push(`<div class="artwork-card" data-v-2b039b9f><div class="artwork-image" data-v-2b039b9f>`);
          if (getFirstImageUrl(artwork)) {
            _push(`<img${ssrRenderAttr("src", getFirstImageUrl(artwork))}${ssrRenderAttr("alt", artwork.title)} loading="lazy" data-v-2b039b9f>`);
          } else {
            _push(`<div class="placeholder-image" data-v-2b039b9f>${ssrInterpolate(unref(t)("search.image_placeholder"))}</div>`);
          }
          _push(`</div><div class="artwork-info" data-v-2b039b9f><h2 data-v-2b039b9f>${ssrInterpolate(artwork.title)}</h2><p class="category" data-v-2b039b9f>${ssrInterpolate(unref(t)("search.category_label", { category: artwork.category.name }))}</p></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
      if (selectedArtwork.value) {
        _push(`<div class="modal" data-v-2b039b9f><div class="modal-content" data-v-2b039b9f><button class="close-button" data-v-2b039b9f>\xD7</button><div class="modal-gallery" data-v-2b039b9f><img${ssrRenderAttr("src", getCurrentImageUrl.value)}${ssrRenderAttr("alt", selectedArtwork.value.title)} class="modal-image" data-v-2b039b9f>`);
        if (currentImageIndex.value > 0) {
          _push(`<button class="nav-button prev" data-v-2b039b9f> &lt; </button>`);
        } else {
          _push(`<!---->`);
        }
        if (currentImageIndex.value < getImageUrls(selectedArtwork.value).length - 1) {
          _push(`<button class="nav-button next" data-v-2b039b9f> &gt; </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="modal-info" data-v-2b039b9f><h2 data-v-2b039b9f>${ssrInterpolate(selectedArtwork.value.title)}</h2><p class="category" data-v-2b039b9f>${ssrInterpolate(unref(t)("search.category_label", { category: selectedArtwork.value.category.name }))}</p>`);
        if (selectedArtwork.value.description) {
          _push(`<p class="description" data-v-2b039b9f>${ssrInterpolate(selectedArtwork.value.description)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/search.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const search = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2b039b9f"]]);

export { search as default };
//# sourceMappingURL=search-DM4ohWZ-.mjs.map
