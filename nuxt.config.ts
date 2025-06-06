// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';



export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: false,

  app: {
    head: {
      title: 'Patrick Laumond - Art',
      meta: [
        {
          name: 'description',
          content: `Découvrez l'univers artistique unique de Patrick Laumond`,
        },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.0/css/all.min.css'
        }
      ]
    },
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.S3_BASE_URL,
    },
  },

  i18n: {
    locales: [
      { code: 'fr', iso: 'fr-FR', file: 'fr.json' },
      { code: 'en', iso: 'en-US', file: 'en.json' },
    ],
    defaultLocale: 'fr',
    langDir: 'locales/',
    lazy: true,
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  devtools: { enabled: true },
  css: ['~/assets/styles/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/_variables.scss" as *;'
        }
      }
    }
  },
  modules: ['@nuxt/image', '@nuxtjs/i18n'],
});
