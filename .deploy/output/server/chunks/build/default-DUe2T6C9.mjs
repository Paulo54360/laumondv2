import { defineComponent, mergeProps, ref, unref, useSSRContext, computed, watch, withCtx, createVNode, createTextVNode, toDisplayString } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderTeleport } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-DGIkgc4d.mjs';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { useRoute, useRouter } from 'vue-router';
import { a as useI18n, d as useNuxtApp, g as useLocalePath, i as useSwitchLocalePath } from './server.mjs';
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

const _sfc_main$3 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "footer" }, _attrs))} data-v-fb4b71a7><div class="container" data-v-fb4b71a7><div class="footer-line" data-v-fb4b71a7></div><p class="footer-text" data-v-fb4b71a7>${ssrInterpolate(_ctx.$t("footer.legal"))} <br data-v-fb4b71a7> ${ssrInterpolate(_ctx.$t("footer.credits"))}</p><a href="https://www.facebook.com/metahisme/?locale=fr_FR" target="_blank" rel="noopener noreferrer" class="social-link" data-v-fb4b71a7><i class="fab fa-facebook-f" data-v-fb4b71a7></i></a><a href=" https://www.instagram.com/metahisme/" target="_blank" rel="noopener noreferrer" class="social-link" data-v-fb4b71a7><i class="fab fa-instagram" data-v-fb4b71a7></i></a><a href="https://laumond.tumblr.com/" target="_blank" rel="noopener noreferrer" class="social-link" data-v-fb4b71a7><i class="fab fa-tumblr" data-v-fb4b71a7></i></a></div></footer>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/TheFooter.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const TheFooter = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-fb4b71a7"]]);
const _imports_0 = publicAssetsURL("/images/flags/fr.svg");
const _imports_1 = publicAssetsURL("/images/flags/uk.svg");
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "navbar",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const { $i18n } = useNuxtApp();
    const localePath = useLocalePath();
    useSwitchLocalePath();
    const isScrolled = ref(false);
    const isMobileMenuOpen = ref(false);
    const searchQuery = ref("");
    const isCompactSearch = ref(false);
    const isSearchPanelOpen = ref(false);
    const currentLocale = computed(() => {
      return $i18n.locale.value || "fr";
    });
    const closeSearchPanel = () => {
      isSearchPanelOpen.value = false;
    };
    const isCurrentRoute = (path) => {
      const cleanPath = route.path.replace(/^\/(fr|en)/, "") || "/";
      return cleanPath === path || path === "/" && cleanPath === "";
    };
    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false;
    };
    const searchPlaceholder = computed(
      () => isCompactSearch.value ? $i18n.t("header.search_placeholder_short") : $i18n.t("header.search_placeholder")
    );
    watch(
      () => route.path,
      () => {
        closeMobileMenu();
        closeSearchPanel();
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<!--[--><header class="${ssrRenderClass([{ "navbar-scrolled": isScrolled.value }, "navbar"])}" data-v-918ba305><div class="navbar-container" data-v-918ba305><div class="navbar-brand" data-v-918ba305>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/"),
        class: "brand-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="brand-title" data-v-918ba305${_scopeId}><span class="brand-name-top" data-v-918ba305${_scopeId}>Patrick</span><span class="brand-name-bottom" data-v-918ba305${_scopeId}>Laumond</span></div>`);
          } else {
            return [
              createVNode("div", { class: "brand-title" }, [
                createVNode("span", { class: "brand-name-top" }, "Patrick"),
                createVNode("span", { class: "brand-name-bottom" }, "Laumond")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (!isCompactSearch.value) {
        _push(`<div class="navbar-search navbar-search--desktop" data-v-918ba305><input${ssrRenderAttr("value", searchQuery.value)} type="text" class="search-input"${ssrRenderAttr("placeholder", searchPlaceholder.value)} data-v-918ba305><button class="search-button"${ssrRenderAttr("aria-label", _ctx.$t("header.search_placeholder"))} data-v-918ba305><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-918ba305><circle cx="11" cy="11" r="8" data-v-918ba305></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-v-918ba305></line></svg></button></div>`);
      } else {
        _push(`<button class="navbar-search-trigger"${ssrRenderAttr("aria-label", _ctx.$t("header.search_placeholder"))} data-v-918ba305><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-918ba305><circle cx="11" cy="11" r="8" data-v-918ba305></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-v-918ba305></line></svg></button>`);
      }
      _push(`<nav class="${ssrRenderClass([{ "navbar-nav-open": isMobileMenuOpen.value }, "navbar-nav"])}" data-v-918ba305>`);
      if (isMobileMenuOpen.value) {
        _push(`<div class="navbar-search navbar-search--mobile" data-v-918ba305><input${ssrRenderAttr("value", searchQuery.value)} type="text" class="search-input"${ssrRenderAttr("placeholder", _ctx.$t("header.search_placeholder"))} data-v-918ba305><button class="search-button"${ssrRenderAttr("aria-label", _ctx.$t("header.search_placeholder"))} data-v-918ba305><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-918ba305><circle cx="11" cy="11" r="8" data-v-918ba305></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-v-918ba305></line></svg></button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<ul class="nav-list" data-v-918ba305><li class="nav-item" data-v-918ba305>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/metahism"),
        class: ["nav-link", { active: isCurrentRoute("/metahism") }],
        onClick: closeMobileMenu
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.$t("navbar.M\xE9taHisme"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.$t("navbar.M\xE9taHisme")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="nav-item" data-v-918ba305>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/artworks"),
        class: ["nav-link", { active: isCurrentRoute("/artworks") }],
        onClick: closeMobileMenu
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.$t("navbar.Oeuvres"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.$t("navbar.Oeuvres")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="nav-item" data-v-918ba305>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/biography"),
        class: ["nav-link", { active: isCurrentRoute("/biography") }],
        onClick: closeMobileMenu
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.$t("navbar.Biographie"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.$t("navbar.Biographie")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="nav-item" data-v-918ba305>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/analyses"),
        class: ["nav-link", { active: isCurrentRoute("/analyses") }],
        onClick: closeMobileMenu
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.$t("navbar.Analyses"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.$t("navbar.Analyses")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul><div class="language-selector" data-v-918ba305><button class="${ssrRenderClass([{ active: currentLocale.value === "fr" }, "language-btn"])}" data-v-918ba305><img${ssrRenderAttr("src", _imports_0)}${ssrRenderAttr("alt", _ctx.$t("analyses.languages.fr"))} class="flag-icon" data-v-918ba305><span class="language-text" data-v-918ba305>FR</span></button><button class="${ssrRenderClass([{ active: currentLocale.value === "en" }, "language-btn"])}" data-v-918ba305><img${ssrRenderAttr("src", _imports_1)}${ssrRenderAttr("alt", _ctx.$t("analyses.languages.en"))} class="flag-icon" data-v-918ba305><span class="language-text" data-v-918ba305>EN</span></button></div></nav><button class="${ssrRenderClass([{ active: isMobileMenuOpen.value }, "mobile-menu-btn"])}"${ssrRenderAttr("aria-label", isMobileMenuOpen.value ? _ctx.$t("header.menu_close") : _ctx.$t("header.menu_open"))} data-v-918ba305><span class="hamburger-line" data-v-918ba305></span><span class="hamburger-line" data-v-918ba305></span><span class="hamburger-line" data-v-918ba305></span></button></div></header>`);
      ssrRenderTeleport(_push, (_push2) => {
        var _a;
        if (isSearchPanelOpen.value) {
          _push2(`<div class="search-panel-overlay" data-v-918ba305><div class="search-panel" data-v-918ba305><input${ssrRenderAttr("value", searchQuery.value)} type="text" class="search-panel-input"${ssrRenderAttr("placeholder", _ctx.$t("header.search_placeholder"))} autofocus data-v-918ba305><button class="search-panel-btn" data-v-918ba305>${ssrInterpolate((_a = _ctx.$t("common.search")) != null ? _a : "OK")}</button><button class="search-panel-close" aria-label="Close search" data-v-918ba305> \u2715 </button></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/navbar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const Navbar = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-918ba305"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "buttonUpPage",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const isVisible = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      if (isVisible.value) {
        _push(`<button${ssrRenderAttrs(mergeProps({
          class: "button-up-page",
          "aria-label": unref(t)("common.scroll_to_top")
        }, _attrs))} data-v-f3f1f643><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-f3f1f643><path d="M18 15l-6-6-6 6" data-v-f3f1f643></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/buttonUpPage.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ButtonUpPage = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-f3f1f643"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-layout" }, _attrs))}>`);
      _push(ssrRenderComponent(Navbar, null, null, _parent));
      _push(`<main class="main-content">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(TheFooter, null, null, _parent));
      _push(ssrRenderComponent(ButtonUpPage, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-DUe2T6C9.mjs.map
