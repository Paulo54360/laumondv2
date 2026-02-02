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
├── assets/           # Styles SCSS (Architecture modulaire)
├── components/       # Composants Vue (Organisés par fonctionnalité: layout, gallery, etc.)
├── composables/      # Logique métier (useSearch, useS3, useNavbar)
├── i18n/            # Internationalisation (locales fr/en)
├── layouts/         # Layouts Nuxt
├── pages/           # Pages de l'application
├── plugins/         # Plugins Nuxt
├── public/          # Fichiers statiques
├── server/          # API routes (Nitro)
├── scripts/         # Scripts utilitaires et de maintenance
└── tests/           # Tests unitaires (Vitest)
```

## 🛠️ Qualité du Code

Le projet suit des standards stricts de qualité de code :

- **Linting :** ESLint + Prettier (Configuration stricte Nuxt)
- **Typage :** TypeScript strict (Types de retour explicites, pas de `any`)
- **Architecture :** Séparation vue/logique via les Composables
- **Tests :** Vitest pour les composants critiques

Commandes de maintenance :

```bash
# Vérifier la qualité du code
npm run lint

# Corriger automatiquement les problèmes de style
npm run lint:fix

# Lancer les tests
npm test
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
