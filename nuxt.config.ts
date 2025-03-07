// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: false,
  
  app: {
    head: {
      title: 'Patrick Laumond - Art',
      meta: [
        { name: 'description', content: `Découvrez l'univers artistique unique de Patrick Laumond` },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiUrl: 'https://plaumondpicture.s3.eu-west-3.amazonaws.com',
    },
  },

  i18n: {
    locales: [
      { code: 'fr', iso: 'fr-FR', file: 'fr.json' },
      { code: 'en', iso: 'en-US', file: 'en.json' }
    ],
    defaultLocale: 'fr',
    langDir: 'locales/',
    lazy: true,
  },

  devtools: { enabled: true },
  css:  ['./app.vue'],
  modules: [
    '@nuxt/image',
    '@nuxtjs/i18n'
  ]
})