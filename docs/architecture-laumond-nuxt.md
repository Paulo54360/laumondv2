# Architecture cible — laumond-nuxt

Document de référence pour le refactor. Objectif : structure simple, compréhensible, scalable, sans sur-développement.

---

## 1. Vision du site

- **Type** : site vitrine pour l’artiste Patrick Laumond, mise en avant de son mouvement artistique.
- **Priorité** : expérience de navigation fluide, faire rester les visiteurs le plus longtemps possible, donner envie de parcourir tout le site et le “monde” de Patrick Laumond.
- **Fonctionnalités principales** : galerie d’œuvres, barre de recherche (œuvres par nom), pages de contenu (biographie, analyses, etc.).
- **Données** : images dans un bucket S3, métadonnées (noms d’œuvres, etc.) dans une base de données. Usage principalement **lecture seule**.

---

## 2. Structure des dossiers cible

```
laumond-nuxt/
├── app.vue
├── nuxt.config.ts
├── pages/                    # Une page = une route, composition uniquement
├── layouts/                  # default.vue (header, nav, footer, langue)
├── components/
│   ├── base/                 # Composants réutilisables "bêtes" (boutons, sections, modales)
│   └── feature/              # Par feature métier
│       ├── gallery/          # Grille galerie, vignettes, etc.
│       ├── search/           # Barre de recherche, résultats
│       └── …                 # biography, etc. si pertinent
├── composables/              # Logique métier + accès données côté client
├── server/
│   └── api/                  # Endpoints Nuxt → base de données / S3
├── assets/
│   └── css/                  # Tokens, main.scss, styles par page
├── public/                   # Statiques (favicon, images flags, etc.)
├── i18n/                     # Langues FR/EN
├── types/                    # Types TypeScript partagés
└── docs/                     # Documentation projet + refactor
```

---

## 3. Rôles de chaque couche

### 3.1 `pages/`

- **Rôle** : définir les routes et **composer** les sections (layouts + composants).
- **Règle** : pas de logique métier lourde dans les pages. Les pages appellent des composables et passent des props aux composants.
- **Exemple** : `pages/galerie.vue` utilise `useGallery()` et `useSearch()`, et affiche `<GalleryGrid />`, `<SearchBar />`, etc.

### 3.2 `layouts/`

- **Rôle** : structure commune (header, navigation, footer, sélecteur de langue).
- **Règle** : un `default.vue` suffit tant qu’il n’y a pas de pages au rendu très différent.

### 3.3 `components/base/`

- **Rôle** : composants UI réutilisables, sans accès direct aux données.
- **Règle** : ils reçoivent tout par **props** (et éventuellement émettent des événements). Pas d’appel API ni de `useX()` métier à l’intérieur.
- **Exemples** : `BaseButton`, `BaseSection`, `BaseModal`, `BaseHeading`.

### 3.4 `components/feature/<feature>/`

- **Rôle** : composants liés à une partie métier du site (galerie, recherche, biographie, etc.).
- **Règle** : ils affichent et réagissent aux événements. La **donnée** vient des composables (via la page ou un parent). Éviter les appels API directs dans les composants.
- **Exemples** : `GalleryGrid`, `GalleryItem`, `SearchBar`, `SearchResults`.

### 3.5 `composables/`

- **Rôle** : **logique métier et accès aux données côté client**. C’est la couche qui appelle `$fetch('/api/...')` ou `useFetch`.
- **Règle** : un composable par “domaine” ou usage (galerie, recherche, navbar, debounce, etc.). Les pages et éventuellement les composants feature les utilisent.
- **Exemples** : `useGallery()`, `useArtworks()`, `useSearch()`, `useNavbar()`, `useDebounce()`.

### 3.6 `server/api/`

- **Rôle** : endpoints Nuxt qui parlent à la base de données (et indirectement à S3 si besoin). Toute la logique “comment on récupère les données” reste ici.
- **Règle** : un fichier par ressource ou action (ex. `artworks.get.ts`, `search.get.ts`). Retourner du JSON propre, typé.
- **Exemple** : `server/api/artworks.get.ts` interroge la base (Supabase, etc.), renvoie la liste des œuvres (avec URLs S3 si besoin).

### 3.7 `assets/css/`

- **Rôle** : tokens (couleurs, typo, espacements), styles globaux, styles par page.
- **Règle** : respecter l’existant (tokens → variables CSS `var(--color-...)`). Pas de changement visuel pendant le refactor, seulement clarification et nettoyage.

### 3.8 `docs/`

- **Rôle** : objectifs du refactor, epics/stories, architecture (ce document), et plus tard README / how-to.
- **Règle** : garder les docs à jour quand l’architecture ou les conventions évoluent.

---

## 4. Flux de données (exemple : galerie + recherche)

1. **Page** (`pages/galerie.vue`)
   - Utilise `useGallery()` et `useSearch()`.
   - Compose `<GalleryGrid :items="artworks" />`, `<SearchBar @search="handleSearch" />`, etc.

2. **Composables** (`useGallery`, `useSearch`)
   - Appellent `$fetch('/api/artworks')`, `$fetch('/api/search?q=...')`.
   - Gèrent état (chargement, erreur, liste filtrée).

3. **API** (`server/api/artworks.get.ts`, `server/api/search.get.ts`)
   - Interrogent la base (métadonnées œuvres, noms pour la recherche).
   - Retournent des données prêtes pour le front (avec URLs S3 pour les images si besoin).

Résultat : **les composants affichent**, **les composables orchestrent**, **les endpoints parlent aux données**. Aucune logique base/S3 dans les composants.

---

## 5. Conventions à respecter

- **Pas de sur-dev** : ne pas ajouter de couches (stores globaux, services abstraits) tant que le besoin n’est pas là.
- **Typage** : utiliser les types dans `types/` pour les réponses API et les props importantes.
- **i18n** : textes via `useI18n()` / clés de traduction, pas de chaînes en dur dans l’UI.
- **Styles** : utiliser `var(--color-...)` et les tokens existants ; pas de couleurs magiques dans les composants.
- **Nommage** :
  - composables : `useXxx`
  - composants base : `BaseXxx`
  - composants feature : nom métier (`GalleryGrid`, `SearchBar`, etc.)
  - endpoints : `ressource.action.ts` (ex. `artworks.get.ts`).

---

## 6. Références

- Objectifs et périmètre du refactor : `docs/refactor-laumond-nuxt.md`
- Plan de travail (epics/stories) : `docs/refactor-epics-stories.md`
- Styles (tokens, où mettre quoi, comment modifier) : `docs/styles-howto.md`
- CI/CD & déploiement (pipeline, Docker, VPS) : `docs/cicd-deployment.md`
- How to ajouter une page/section : `docs/howto-add-page.md`
- Conventions & bonnes pratiques : `docs/conventions.md`
- Règles projet (stack, style, CI/CD) : `.cursorrules` à la racine

---

_Document créé dans le cadre du refactor laumond-nuxt. À mettre à jour si l’architecture évolue._
