// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  devtools: { enabled: true },
  nitro: {
    // Aligne Nitro avec les Web APIs et comportements de cette date (évite l'avertissement)
    compatibilityDate: '2025-10-21',
  },

  // Configuration des variables d'environnement accessibles côté client
  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    public: {
      apiUrl:
        process.env.NUXT_PUBLIC_API_URL || 'https://plaumondpicture.s3.eu-west-3.amazonaws.com',
    },
  },

  // Configuration des modules
  modules: [
    [
      '@nuxtjs/i18n',
      {
        locales: [
          { code: 'fr', name: 'Français', file: 'fr.json' },
          { code: 'en', name: 'English', file: 'en.json' },
        ],
        lazy: true,
        // Chemin des fichiers de langue (dans le dossier i18n du module)
        langDir: 'locales/',
        defaultLocale: 'fr',
        strategy: 'prefix',
        bundle: { optimizeTranslationDirective: false },
        // Options passées au moteur vue-i18n (via fichier dédié)
        vueI18n: '~/i18n/i18n.config.ts',
        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: 'i18n_redirected',
          redirectOn: 'root',
          alwaysRedirect: true,
          fallbackLocale: 'fr',
        },
      },
    ],
  ],

  // Configuration CSS
  css: ['~/assets/css/main.scss'],

  // Configuration Vite
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // On évite d'injecter @import pour ne pas entrer en conflit avec @use
          // Les variables seront importées explicitement dans chaque SCSS au besoin
          additionalData: '',
        },
      },
    },
  },

  // Résolution des problèmes de build avec Supabase
  build: {
    transpile: ['@supabase/supabase-js', '@supabase/postgrest-js'],
  },

  // Éviter que Nitro n'essaie de bundler ces dépendances (elles seront chargées depuis node_modules)
  nitro: {
    externals: {
      external: ['@supabase/supabase-js', '@supabase/postgrest-js'],
    },
  },
});
