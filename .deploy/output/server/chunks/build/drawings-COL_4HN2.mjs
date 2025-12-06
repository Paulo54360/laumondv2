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
  __name: "drawings",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const bucketUrl = config.public.apiUrl.trim();
    console.log(`${bucketUrl}/Drawings+/`);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(GalleryComponent, mergeProps({
        title: _ctx.$t("gallery.categories.drawing"),
        "api-url": `${unref(bucketUrl)}/Drawings+`,
        subfolders: ["05", "04", "03", "02", "01"],
        "file-ranges": [
          [1, 8],
          [1, 9],
          [1, 9],
          [1, 9],
          [1, 9]
        ]
      }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/drawings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=drawings-COL_4HN2.mjs.map
