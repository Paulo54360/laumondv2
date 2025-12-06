import { defineComponent, ref, resolveComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "galerie",
  __ssrInlineRender: true,
  setup(__props) {
    const categories = [
      { id: "transcriptions", label: "Transcriptions" },
      { id: "archetype", label: "Arch\xE9types" },
      { id: "deploiement", label: "D\xE9ploiements" },
      { id: "drawing", label: "Dessins+" }
    ];
    const currentCategory = ref(categories[0].id);
    const selectedArtwork = ref(
      null
    );
    const selectArtwork = (artwork) => {
      selectedArtwork.value = artwork;
    };
    const closeModal = () => {
      selectedArtwork.value = null;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ArtworkGrid = resolveComponent("ArtworkGrid");
      const _component_ArtworkModal = resolveComponent("ArtworkModal");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "gallery-page" }, _attrs))} data-v-a451f0da><div class="category-tabs" data-v-a451f0da><!--[-->`);
      ssrRenderList(categories, (category) => {
        _push(`<button class="${ssrRenderClass({ active: unref(currentCategory) === category.id })}" data-v-a451f0da>${ssrInterpolate(_ctx.$t(`gallery.categories.${category.id}`))}</button>`);
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(_component_ArtworkGrid, {
        category: unref(currentCategory),
        onSelect: selectArtwork
      }, null, _parent));
      if (unref(selectedArtwork)) {
        _push(ssrRenderComponent(_component_ArtworkModal, {
          show: !!unref(selectedArtwork),
          artwork: unref(selectedArtwork),
          onClose: closeModal
        }, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/galerie.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const galerie = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a451f0da"]]);

export { galerie as default };
//# sourceMappingURL=galerie-jYsYmzsg.mjs.map
