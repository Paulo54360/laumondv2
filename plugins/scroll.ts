import type { RouteLocationNormalized } from 'vue-router'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use({
    install(app) {
      app.config.globalProperties.$router.options.scrollBehavior = (
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
        savedPosition: { left: number; top: number } | null
      ) => {
        if (to.hash) {
          return { el: to.hash, behavior: 'smooth' }
        }
        return { top: 0, behavior: 'smooth' }
      }
    }
  })
}) 