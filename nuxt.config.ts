// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Configuration des modules
  modules: [
    '@nuxtjs/i18n'
  ],
  
  // Configuration i18n
  i18n: {
    locales: [
      {
        code: 'fr',
        name: 'Français',
        file: 'fr.json'
      },
      {
        code: 'en', 
        name: 'English',
        file: 'en.json'
      }
    ],
    lazy: true,
    langDir: 'i18n/locales',
    defaultLocale: 'fr',
    strategy: 'prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: true,
      fallbackLocale: 'fr'
    }
  },

  // Configuration CSS
  css: ['~/assets/styles/main.scss'],
  
  // Configuration Vite
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "~/assets/styles/_variables.scss";'
        }
      }
    }
  }
})
