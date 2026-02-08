// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2025-12-11',
  devtools: { enabled: true },
  nitro: {
    // Aligne Nitro avec les Web APIs et comportements de cette date (évite l'avertissement)
    compatibilityDate: '2025-12-11',
  },

  // Configuration des variables d'environnement
  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
    s3Bucket: process.env.S3_BUCKET || 'plaumondpicture',
    // Google Analytics 4 (Dashboard Admin)
    ga4PropertyId: process.env.GA4_PROPERTY_ID,
    googleCredentialsJson: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
    googleCredentialsBase64: process.env.GOOGLE_CREDENTIALS_BASE64,
    public: {
      apiUrl:
        process.env.NUXT_PUBLIC_API_URL || 'https://plaumondpicture.s3.eu-west-3.amazonaws.com',
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
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
        // Laisse Nuxt i18n générer automatiquement les routes localisées
        // à partir de la structure de `pages/` (y compris l'admin).
        customRoutes: 'page',
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
    'nuxt-gtag',
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
    transpile: ['@supabase/supabase-js', '@supabase/postgrest-js', 'tslib'],
  },
});
