import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = {
  __name: "metahism",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "metahism-page" }, _attrs))}><div class="page-title-header"><h1 class="page-title">${ssrInterpolate(_ctx.$t("M\xE9taHisme.Titre"))}</h1><div class="page-title-divider"></div></div><div class="text-content"><p>${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte"))}</p><p>${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte2"))}</p><p>${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte3"))}</p><p>${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte4,1"))}<br> ${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte4,2"))}<br> ${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte4,3"))}</p><p>${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte5"))}</p><p>${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte6,1"))}<br> ${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte6,2"))}</p><p>${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte7"))}</p><p>${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte8,1"))}<br> ${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte8,2"))}<br> ${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte8,3"))}</p><p>${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte9"))}</p><p>${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte10,1"))}<br> ${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte10,2"))}<br> ${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte10,3"))}</p><p>${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte11"))}</p><p>${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte12,1"))}<br> ${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte12,2"))}<br> ${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte12,3"))}<br> ${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte12,4"))}<br> ${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte12,5"))}<br> ${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte12,6"))}</p><p id="Patrick">${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte16"))}<br></p><div><p id="citation">${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte13"))}<br><a>${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte14"))}</a></p></div><p id="ps">${ssrInterpolate(_ctx.$t("M\xE9taHisme.Texte15"))}</p></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/metahism.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=metahism-lsDgUwP5.mjs.map
