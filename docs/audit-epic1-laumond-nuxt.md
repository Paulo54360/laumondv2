# EPIC 1 — Audit de l’existant (laumond-nuxt)

Rapport de cartographie produit pour le refactor. Référence : `docs/refactor-laumond-nuxt.md`, `docs/architecture-laumond-nuxt.md`.

---

## Story 1.1 — Structure actuelle du projet

### Racine

- `app.vue` — point d’entrée app
- `nuxt.config.ts` — config Nuxt (runtime, modules, build)
- `tsconfig.json`, `vitest.config.ts` — TypeScript / tests
- `.cursorrules` — règles projet
- `docker-compose.yml`, `nginx_sample.conf` — déploiement / reverse proxy

### Dossiers principaux

| Dossier | Contenu |
|--------|---------|
| **pages/** | 12 pages : `index`, `galerie`, `artworks`, `search`, `biography`, `analyses`, `archetypes`, `drawings`, `transcriptions`, `metahism`, `deployments`, `debug` |
| **layouts/** | `default.vue` uniquement |
| **components/** | Mélange de dossiers par feature et d’un composant racine `gallery.vue` |
| **composables/** | 6 fichiers : `useS3`, `useGallery`, `useNavbar`, `useOeuvres`, `useAnalysisData`, `useDebounce` |
| **server/api/** | 1 endpoint : `search/index.get.ts` |
| **server/middleware/** | `error.ts` |
| **db/** | `index.ts` (client Supabase + `searchArtworks`) — **non utilisé par l’app** (voir 1.4) |
| **assets/css/** | `main.scss`, `_tokens.scss`, `_mixins.scss`, `pages/` (biography, home, metahism), `components/navbar.scss` |
| **i18n/** | `i18n.config.ts`, `locales/fr.json`, `locales/en.json` |
| **public/** | `robots.txt`, `images/` (drapeaux) |
| **types/** | `nuxt-app.d.ts`, `nuxt-imports.d.ts` |
| **scripts/** | Nombreux scripts (backup, sync DB, deploy, tests de connexion) — hors runtime app |
| **tests/** | 2 specs (ex. `ArtworkGrid.spec.ts`) |
| **docs/** | `refactor-laumond-nuxt.md`, `refactor-epics-stories.md`, `architecture-laumond-nuxt.md` |
| **MD/** | Doc interne (context, dev rules, CI/CD, styles) |

### Composants (détail)

- **base/** : `BaseButton.vue`, `ButtonUpPage.vue`
- **layout/** : `Navbar.vue`, `SearchBar.vue`, `TheFooter.vue`
- **gallery/** : `ArtworkGrid.vue`, `ArtworkModal.vue`, `GalleryContent.vue`, `OeuvreGallery.vue`
- **gallery.vue** (racine components/) : wrapper qui utilise `GalleryContent` + `ArtworkModal` — utilisé par `transcriptions`, `drawings`, `deployments`, `archetypes`
- **home/** : `HomeHero.vue`, `HomeAnalysesSection.vue`, `HomeArtworksSection.vue`, `HomeBiographySection.vue`, `HomeMetahismSection.vue`
- **carousel/** : `CarouselSection.vue`, `ResponsiveCarousel.vue`
- **analysis/** : `AnalysisContent.vue`

### Incohérences par rapport à l’architecture cible

- Pas de `components/feature/` : les features sont en `gallery/`, `home/`, `layout/`, etc. (renommage / déplacement à prévoir si on veut `feature/<name>/`).
- Un composant à la racine de `components/` : `gallery.vue` — à déplacer ou renommer pour clarifier (ex. dans `feature/gallery/` ou garder comme alias documenté).
- `db/` contient de la logique métier + client Supabase alors que l’app ne l’utilise pas ; la recherche passe par `server/api/search`.

---

## Story 1.2 — Flux de données

### Côté client (pages / composants)

- **Recherche** : `pages/search.vue`, `pages/debug.vue`, `components/layout/SearchBar.vue` appellent `$fetch('/api/search', { params: { q } })`. Aucun composable dédié “recherche” ; la logique est dans les composants/pages.
- **Galerie / œuvres** :
  - `components/gallery/ArtworkGrid.vue` utilise **`useS3()`** : `getArtworks(category)` — construction d’URLs S3 à partir de listes statiques de dossiers (ex. `transcriptions: ['01','02',...]`). Pas d’appel à l’API Nuxt ni à Supabase depuis ce composant.
  - `components/gallery/GalleryContent.vue` et les pages qui utilisent `components/gallery.vue` (transcriptions, drawings, deployments, archetypes) s’appuient sur ce flux (provide/inject ou props).
  - `pages/galerie.vue` utilise directement `ArtworkGrid` + `ArtworkModal` avec une catégorie (ex. “transcriptions”).
- **Navbar** : `Navbar.vue` utilise `useNavbar()` (état menu, etc.).

### Côté serveur

- **`server/api/search/index.get.ts`** : seul endpoint utilisé par l’app. Crée un client Supabase avec `useRuntimeConfig()`, interroge les tables `artworks` et `categories`, formate les résultats (dont `image_urls`, URLs S3 de secours). Retourne `{ artworks }`.
- **`db/index.ts`** : exporte `supabase` et `searchArtworks(searchTerm)`. **Aucun import de `db/` dans l’app** (pages, composants, composables, server). Les scripts dans `scripts/` créent leur propre client Supabase. Donc `db/index.ts` est mort pour le runtime (voir 1.4).

### Résumé des flux

1. **Recherche** : Page / SearchBar → `$fetch('/api/search')` → `server/api/search/index.get.ts` → Supabase → JSON.
2. **Galerie (grille par catégorie)** : Page galerie / `gallery.vue` → `ArtworkGrid` → `useS3().getArtworks(category)` → URLs S3 construites en dur (pas de DB).
3. **Données Supabase** : utilisées uniquement via `/api/search` côté serveur. Aucun accès Supabase côté client (ni via `db/`, ni via autre module).

---

## Story 1.3 — Dépendances clés

### package.json (extrait)

- **Runtime** : `nuxt`, `vue`, `vue-router`, `@nuxtjs/i18n`, `@supabase/supabase-js`, `@nuxt/image`, `@nuxt/image-edge`, `nuxt-gtag`, `swiper`, `vue3-carousel`, `@fortawesome/fontawesome-free`, `node-fetch`, `dotenv`, `tslib`.
- **Dev** : `typescript`, `vitest`, `@vue/test-utils`, `eslint`, `sass-embedded`, `tsx`, `fs-extra`, etc.

### nuxt.config.ts (modules)

- `@nuxtjs/i18n` (config locales fr/en, lazy, strategy prefix)
- `nuxt-gtag`
- **Pas de `@nuxt/image`** dans `modules` alors qu’il est en dépendance — `NuxtImg` est utilisé dans `ResponsiveCarousel.vue`. Soit le module est chargé autrement, soit à ajouter explicitement.
- **Deux paquets image** : `@nuxt/image` et `@nuxt/image-edge` — à clarifier (un seul suffit en principe).

### Middleware

- `server/middleware/error.ts` uniquement (pas de middleware global côté Nuxt dans `middleware/` à la racine).

### Build

- `transpile: ['@supabase/supabase-js', '@supabase/postgrest-js', 'tslib']`
- `compatibilityDate` Nitro / Nuxt définie

---

## Story 1.4 — Code mort / deprecated / non utilisé

### Fichiers / dossiers

| Élément | Statut | Action suggérée |
|--------|--------|------------------|
| **db/index.ts** | Non importé par l’app (pages, composants, composables, server). Les scripts ont leur propre client Supabase. | Supprimer ou déprécier : déplacer la logique utile vers `server/api/` ou des scripts dédiés, puis supprimer `db/` pour l’app. |
| **composables/useGallery.ts** | Aucun `.vue` ni autre fichier app ne l’importe. Commentaires internes indiquent “unused / not wired”. | Supprimer ou réintégrer dans un flux (ex. GalleryContent) puis documenter. |
| **composables/useOeuvres.ts** | Aucune utilisation dans le projet (hors README/MD). | Supprimer ou documenter comme “réservé” si usage futur prévu. |
| **composables/useAnalysisData.ts** | Aucune utilisation dans les .vue / .ts de l’app. | Idem : supprimer ou réutiliser. |
| **composables/useDebounce.ts** | Aucune utilisation dans l’app. | Supprimer ou utiliser (ex. SearchBar). |

### Duplication / à clarifier

- **Recherche** : logique de formatage des œuvres (image_urls, fallback S3) dupliquée entre `server/api/search/index.get.ts` et `db/index.ts` (searchArtworks). Puisque `db/index.ts` n’est pas utilisé à l’exécution, la seule source de vérité est l’API. Supprimer `db/index.ts` évite la confusion.
- **useS3** : construit des URLs et liste des dossiers en dur par catégorie ; pas d’API pour “liste d’œuvres” depuis Supabase depuis la galerie. À terme, envisager un endpoint du type `GET /api/artworks?category=...` et un composable `useArtworks()` qui appelle l’API, pour aligner avec l’architecture cible.

### Scripts (hors runtime)

- `scripts/` : nombreux scripts (backup, sync, deploy, tests). À garder tels quels pour la maintenance, mais ne pas considérer comme partie de l’app Nuxt. Éviter d’importer `db/index.ts` depuis les scripts si on supprime `db/` ; chaque script peut garder son propre `createClient`.

---

## Synthèse EPIC 1

- **Structure** : globalement claire (pages, layouts, components, composables, server, assets, i18n). À aligner avec `docs/architecture-laumond-nuxt.md` (feature/, rôle de chaque couche).
- **Flux de données** : recherche 100 % via `/api/search` ; galerie via `useS3()` côté client (pas de DB). Supabase utilisé uniquement dans `server/api/search`.
- **Dépendances** : i18n, Supabase, nuxt-gtag en place ; @nuxt/image à vérifier (présent en deps, absent des modules dans nuxt.config) ; double module image (image + image-edge) à simplifier.
- **Code mort** : `db/index.ts` ; composables `useGallery`, `useOeuvres`, `useAnalysisData`, `useDebounce`. À supprimer ou réintégrer de façon documentée.

Prochaine étape recommandée : **EPIC 2** (déjà en partie fait via `architecture-laumond-nuxt.md`) puis **EPIC 3** (nettoyage : supprimer ou déplacer le code mort identifié ici).

---

## Mise à jour post-EPIC 3 (refactor appliqué)

- **Story 3.1** : Supprimés : `db/index.ts`, dossier `db/`, `composables/useGallery.ts`, `composables/useOeuvres.ts`, `composables/useAnalysisData.ts`, `composables/useDebounce.ts`.
- **Story 3.2** : Créés `composables/useSearch.ts` et `types/artwork.d.ts` ; SearchBar, pages/search.vue et pages/debug.vue utilisent `useSearch()`. Helper `formatArtwork()` extrait dans `server/api/search/index.get.ts`.
- **Story 3.3** : Non traitée (pas de composant « monstre » identifié en priorité).
- **Story 3.4** : Recherche alignée sur l’architecture cible (composable + type partagé). Réorganisation des dossiers composants reportée à l’EPIC 4.
