# Laumond — Site vitrine Patrick Laumond

Site vitrine de l’artiste **Patrick Laumond** (FR/EN) : galerie d’œuvres, recherche, biographie, analyses. Nuxt 3, Vue 3, TypeScript.

---

## Objectif

Mettre en avant le mouvement artistique de Patrick Laumond, avec une navigation fluide et un parcours invitant à découvrir l’ensemble du site. Données en lecture seule (images S3, métadonnées Supabase).

---

## Stack

| Couche | Techno |
|--------|--------|
| **Front** | Nuxt 3, Vue 3, TypeScript (strict) |
| **Données** | Supabase (PostgreSQL), AWS S3 (médias) |
| **i18n** | @nuxtjs/i18n (FR/EN) |
| **Déploiement** | Docker, GitHub Actions, OVH VPS |

---

## Structure du projet

```
laumond-nuxt/
├── pages/              # Une page = une route (composition uniquement)
├── layouts/            # default.vue (header, nav, footer)
├── components/
│   ├── base/           # Composants réutilisables (BaseButton, BaseSectionTitle, etc.)
│   ├── layout/         # Navbar, SearchBar, TheFooter
│   ├── gallery/        # Galerie, modale, grille
│   ├── home/           # Sections homepage
│   └── …
├── composables/        # Logique métier (useSearch, useS3, useNavbar)
├── server/api/         # Endpoints Nuxt (ex. /api/search)
├── assets/css/         # Tokens, main.scss, styles par page
├── i18n/               # Locales FR/EN
├── types/              # Types TypeScript partagés
└── docs/               # Architecture, styles, CI/CD, how-to
```

Détail : [docs/architecture-laumond-nuxt.md](docs/architecture-laumond-nuxt.md).

---

## Lancer le projet

```bash
# Dépendances
npm install

# Dev (http://localhost:3000)
npm run dev

# Build production
npm run build

# Preview du build
npm run preview
```

Variables d’environnement : copier `.env.example` en `.env` et renseigner `SUPABASE_URL`, `SUPABASE_KEY`, `NUXT_PUBLIC_API_URL` (et optionnellement `NUXT_PUBLIC_GTAG_ID`). Ne jamais committer `.env`.

---

## Qualité & tests

```bash
# Lint (avec corrections automatiques)
npm run lint:fix

# Tests (Vitest)
npm run test -- --run
```

Avant commit : `npm run lint:fix` et `npm run test -- --run`. Pas de `console.log` ni d’imports inutilisés (cf. [docs/conventions.md](docs/conventions.md)).

---

## Déploiement

Le déploiement est géré par **GitHub Actions** au push sur `main` : build Docker → push vers ghcr.io → SCP + SSH sur le VPS → `docker compose pull` / `up -d`.

- **Pipeline** : [.github/workflows/deploy.yml](.github/workflows/deploy.yml) (job `test` puis `build-and-deploy`)
- **Documentation** : [docs/cicd-deployment.md](docs/cicd-deployment.md) (secrets, checklist, commandes Docker)

---

## Documentation

| Doc | Contenu |
|-----|--------|
| [docs/architecture-laumond-nuxt.md](docs/architecture-laumond-nuxt.md) | Architecture cible, rôles des dossiers, flux de données |
| [docs/styles-howto.md](docs/styles-howto.md) | Styles : tokens, où mettre quoi, comment modifier |
| [docs/cicd-deployment.md](docs/cicd-deployment.md) | CI/CD, Docker, déploiement VPS, checklist |
| [docs/howto-add-page.md](docs/howto-add-page.md) | Comment ajouter une page ou une section |
| [docs/conventions.md](docs/conventions.md) | Conventions & bonnes pratiques |

Règles projet (stack, style, CI/CD) : [.cursorrules](.cursorrules) à la racine.
