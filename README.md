# Laumond Art - Site Web

Site web de l'artiste Patrick Laumond, développé avec Nuxt 3.

## 🚀 Technologies

- **Frontend :** Nuxt 3, Vue 3, TypeScript
- **Base de données :** Supabase (PostgreSQL)
- **Stockage :** AWS S3
- **Hébergement :** OVH

## 📁 Structure du projet

```
laumond-nuxt/
├── assets/           # Styles et assets
├── components/       # Composants Vue
├── composables/      # Composables Nuxt
├── db/              # Configuration base de données
├── i18n/            # Internationalisation
├── layouts/         # Layouts Nuxt
├── pages/           # Pages de l'application
├── plugins/         # Plugins Nuxt
├── public/          # Fichiers statiques
├── server/          # API routes
└── scripts/         # Scripts utilitaires
```

## 🔧 Installation

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour production
npm run build
```

## 🌐 Déploiement

Le site est déployé sur OVH avec les variables d'environnement suivantes :
- `SUPABASE_URL`
- `SUPABASE_KEY`

## 📊 Base de données

La base de données Supabase est maintenue active 24h/24 via un service de ping automatique (cron-job.org).

## 🎨 Fonctionnalités

- Galerie d'œuvres d'art
- Recherche en temps réel
- Analyses critiques
- Support multilingue (FR/EN)
- Interface responsive
