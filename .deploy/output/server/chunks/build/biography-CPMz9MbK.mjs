import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "biography",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "biography-page" }, _attrs))}><div class="text-content">${ssrInterpolate(_ctx.$t("biography.intro_text"))} <br><br><h3 id="Exp\xE9rimentation">${ssrInterpolate(_ctx.$t("biography.experimentation_title"))}</h3><div class="section-title-divider"></div> ${ssrInterpolate(_ctx.$t("biography.experimentation_text"))} <br><br><h3 id="Language">${ssrInterpolate(_ctx.$t("biography.language_title"))}</h3><div class="section-title-divider"></div> ${ssrInterpolate(_ctx.$t("biography.language_text"))} <br><br><h3 id="M\xE9ta">${ssrInterpolate(_ctx.$t("biography.meta_title"))}</h3><div class="section-title-divider"></div> ${ssrInterpolate(_ctx.$t("biography.meta_text"))} <br><br><h3 id="Th\xE9orisation_et_le_m\xE9tahisme">${ssrInterpolate(_ctx.$t("biography.theorisation_title"))}</h3><div class="section-title-divider"></div> ${ssrInterpolate(_ctx.$t("biography.theorisation_text"))} <br><br><h3 id="Un paradigme_de_l&#39;universalit\xE9">${ssrInterpolate(_ctx.$t("biography.paradigme_title"))}</h3><div class="section-title-divider"></div> ${ssrInterpolate(_ctx.$t("biography.paradigme_text"))} <br><br><h3 id="Vision_globale_et_pens\xE9e_complexe">${ssrInterpolate(_ctx.$t("biography.vision_title"))}</h3><div class="section-title-divider"></div> ${ssrInterpolate(_ctx.$t("biography.vision_text"))} <br><br><h3 id="Cr\xE9ation_d&#39;un_langage,_un_pari">${ssrInterpolate(_ctx.$t("biography.creation_title"))}</h3><div class="section-title-divider"></div> ${ssrInterpolate(_ctx.$t("biography.creation_text"))} <br><br><h3 id="Une_\u0153uvre_n\xE9e_du_cerveau_droit">${ssrInterpolate(_ctx.$t("biography.cerveau_title"))}</h3><div class="section-title-divider"></div> ${ssrInterpolate(_ctx.$t("biography.cerveau_text"))} <br><br><h3 id="Une_\u0153uvre_holographique">${ssrInterpolate(_ctx.$t("biography.holographique_title"))}</h3><div class="section-title-divider"></div> ${ssrInterpolate(_ctx.$t("biography.holographique_text"))}</div><div class="nav-menu"><a href="#Exp\xE9rimentation">${ssrInterpolate(_ctx.$t("biography.nav_experimentation"))}</a><a href="#Language">${ssrInterpolate(_ctx.$t("biography.nav_language"))}</a><a href="#M\xE9ta">${ssrInterpolate(_ctx.$t("biography.nav_meta"))}</a><a href="#Th\xE9orisation_et_le_m\xE9tahisme">${ssrInterpolate(_ctx.$t("biography.nav_theorisation"))}</a><a href="#Un paradigme_de_l&#39;universalit\xE9">${ssrInterpolate(_ctx.$t("biography.nav_paradigme"))}</a><a href="#Vision_globale_et_pens\xE9e_complexe">${ssrInterpolate(_ctx.$t("biography.nav_vision"))}</a><a href="#Cr\xE9ation_d&#39;un_langage,_un_pari">${ssrInterpolate(_ctx.$t("biography.nav_creation"))}</a><a href="#Une_\u0153uvre_n\xE9e_du_cerveau_droit">${ssrInterpolate(_ctx.$t("biography.nav_cerveau"))}</a><a href="#Une_\u0153uvre_holographique">${ssrInterpolate(_ctx.$t("biography.nav_holographique"))}</a></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/biography.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=biography-CPMz9MbK.mjs.map
