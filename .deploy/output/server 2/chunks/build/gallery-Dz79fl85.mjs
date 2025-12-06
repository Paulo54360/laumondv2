import { defineComponent, ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "gallery",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      default: ""
    },
    apiUrl: {
      type: String,
      default: ""
    },
    subfolders: {
      type: Array,
      default: () => []
    },
    fileRanges: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const imageUrls = ref([]);
    const titles = ref({});
    const currentImageIndex = ref(null);
    const itemsPerPage = ref(10);
    const currentPage = ref(0);
    const startIndex = computed(() => currentPage.value * itemsPerPage.value);
    const endIndex = computed(
      () => Math.min(startIndex.value + itemsPerPage.value, imageUrls.value.length)
    );
    const totalItems = computed(() => imageUrls.value.length);
    const paginatedImages = computed(() => imageUrls.value.slice(startIndex.value, endIndex.value));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "gallery-container" }, _attrs))} data-v-d799a1f2><h1 data-v-d799a1f2>${ssrInterpolate(__props.title || _ctx.$t("gallery.default_title"))}</h1><div class="pagination-controls" data-v-d799a1f2><label for="itemsPerPage" data-v-d799a1f2>${ssrInterpolate(_ctx.$t("gallery.items_per_page"))}</label><select id="itemsPerPage" data-v-d799a1f2><!--[-->`);
      ssrRenderList([5, 10, 15, 20, 25], (option) => {
        _push(`<option${ssrRenderAttr("value", option)} data-v-d799a1f2${ssrIncludeBooleanAttr(Array.isArray(itemsPerPage.value) ? ssrLooseContain(itemsPerPage.value, option) : ssrLooseEqual(itemsPerPage.value, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select><span data-v-d799a1f2>${ssrInterpolate(_ctx.$t("gallery.range", { start: startIndex.value + 1, end: endIndex.value, total: totalItems.value }))}</span><button${ssrIncludeBooleanAttr(currentPage.value === 0) ? " disabled" : ""} data-v-d799a1f2> \u2190 ${ssrInterpolate(_ctx.$t("common.previous"))}</button><button${ssrIncludeBooleanAttr(endIndex.value >= totalItems.value) ? " disabled" : ""} data-v-d799a1f2>${ssrInterpolate(_ctx.$t("common.next"))} \u2192 </button></div><div class="image-gallery" data-v-d799a1f2><!--[-->`);
      ssrRenderList(paginatedImages.value, (url, index) => {
        _push(`<div class="image-item" data-v-d799a1f2><img${ssrRenderAttr("src", url)}${ssrRenderAttr("alt", titles.value[url])} data-v-d799a1f2><h2 data-v-d799a1f2>${ssrInterpolate(titles.value[url])}</h2></div>`);
      });
      _push(`<!--]--></div>`);
      if (currentImageIndex.value !== null) {
        _push(`<div class="modal" data-v-d799a1f2><img${ssrRenderAttr("src", imageUrls.value[currentImageIndex.value])}${ssrRenderAttr("alt", titles.value[imageUrls.value[currentImageIndex.value]])} class="modal-image" data-v-d799a1f2></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/gallery.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const GalleryComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d799a1f2"]]);

export { GalleryComponent as G };
//# sourceMappingURL=gallery-Dz79fl85.mjs.map
