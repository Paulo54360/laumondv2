import { mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { b as useRuntimeConfig } from './server.mjs';
import { G as GalleryComponent } from './gallery-Dz79fl85.mjs';
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
import './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = {
  __name: "archetypes",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    let bucketUrl = config.public.apiUrl || "";
    if (typeof bucketUrl === "string" && (bucketUrl.startsWith("/fr/") || bucketUrl.startsWith("/en/"))) {
      bucketUrl = bucketUrl.replace(/^\/(fr|en)\//, "/");
    }
    if (!bucketUrl) {
      console.warn(
        "Attention : public.apiUrl est vide ou non d\xE9fini. V\xE9rifiez votre .env ou nuxt.config.ts"
      );
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(GalleryComponent, mergeProps({
        title: _ctx.$t("gallery.categories.archetype"),
        "api-url": `${unref(bucketUrl)}/Archetypes`,
        subfolders: ["09", "08", "07", "06", "05", "04", "03", "02"],
        "file-ranges": [
          [1, 10],
          [1, 4],
          [1, 8],
          [1, 8],
          [1, 7],
          [1, 7],
          [1, 9],
          [1, 10]
        ]
      }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/archetypes.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=archetypes-Dobkl7e4.mjs.map
