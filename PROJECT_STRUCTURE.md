# Structure du Projet - Laumond V2

Documentation complète de la structure, conventions et pratiques de développement du site web de Patrick Laumond.

---

## 📋 Vue d'ensemble

**Type de projet :** Site web artistique  
**Framework :** Nuxt 3 (Vue 3, TypeScript)  
**Artiste :** Patrick Laumond - Inventeur du Métahisme  
**Version :** 2.0  

Le site doit être un prolongement de l'art de Patrick Laumond, respectant sa charte graphique et son style artistique.

---

## 🎨 Charte Graphique & Design System

### Couleurs Principales

**Rouge (Primary) :**
- `$color-primary: #cc0000` - Virgin Media Red (#c00)
- `$color-primary-dark: #a20101` - Version foncée pour hover/actif

**Gris (Muted) :**
- `$color-muted: #999999` - Wii Grey (#999) - Pour les éléments secondaires
- `$color-muted-light: #bfbfbf` - Version claire
- `$color-muted-dark: #525252` - Natural Color System (NCS S 6502-B) - Remplace le noir

**Couleurs du texte :**
- `$color-text: #2c3e50` - Texte principal
- `$color-text-light: #6c757d` - Texte secondaire
- `$color-black: #525252` - Noir remplacé par gris foncé
- `$color-ink: #333333` - Pour les textes très foncés

**Arrière-plans :**
- `$color-background: #ffffff` - Blanc pur
- `$color-background-alt: #f8f9fa` - Gris très clair pour sections alternées
- `$color-surface: #f5f5f5` - Surfaces légèrement grisées

### Typographie

**Police de base :** Inter (avec fallbacks système)
- `--font-family-base`: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- `--font-family-heading`: Identique à la base (peut être changée pour uniformisation future)

**Poids de police :**
- Regular: 400
- Medium: 500
- Bold: 600

**Titres de section :**
- Taille responsive : `clamp(2rem, 4vw, 3.2rem)`
- Font-weight: 300 (light)
- Couleur: `#5e6266`
- Letter-spacing: `0.22em`
- Text-transform: `uppercase`
- Display: `block` (texte à la ligne en dessous)

### Barres rouges sous les titres

Tous les titres de section ont une barre rouge sous eux :
- Hauteur: `3px`
- Couleur: `#a20101` (var(--color-primary-dark))
- Largeur par défaut: `scaleX(0.3)` (30% de la largeur du titre)
- Animation: S'étend à `scaleX(1)` au hover (sur la homepage uniquement)
- Ajustement: `calc(100% - 0.22em)` pour compenser le letter-spacing

**⚠️ IMPORTANT :** Sur certaines pages (biography, metahism), la barre reste fixe à 30% et ne s'anime pas.

### Espacements

**Marges & Padding :**
- Padding global des pages : `1cm` horizontalement (aligné avec navbar)
- `max-width-content: 1200px` - Largeur maximale du contenu
- Header height: `4rem`

**Breakpoints :**
- Mobile: `768px`
- Tablette: `1024px`
- Desktop: `1280px`

---

## 📁 Structure des Dossiers

```
laumond-nuxt/
├── assets/
│   ├── css/
│   │   ├── _tokens.scss          # Design tokens (couleurs, typo, espacements)
│   │   ├── main.scss             # Styles globaux + CSS custom properties
│   │   └── pages/
│   │       ├── home.scss         # Styles spécifiques homepage
│   │       ├── biography.scss    # Styles page biographie
│   │       └── metahism.scss     # Styles page métahisme
│   └── images/
│       └── common/               # Images communes (icônes flèches)
│
├── components/
│   ├── home/                     # Composants spécifiques homepage
│   │   ├── HomeHero.vue
│   │   ├── HomeBiographySection.vue
│   │   ├── HomeMetahismSection.vue
│   │   ├── HomeArtworksSection.vue
│   │   └── HomeAnalysesSection.vue
│   ├── layout/
│   │   └── TheFooter.vue
│   ├── navbar.vue                # Navigation principale
│   ├── carousselSection.vue      # Carrousel réutilisable (galeries)
│   ├── oeuvreGallery.vue         # Galerie d'œuvres
│   └── base/
│       └── BaseButton.vue        # Composants de base
│
├── composables/                  # Logic réutilisable
│   ├── useDebounce.ts
│   ├── useOeuvres.ts
│   └── useS3.ts
│
├── i18n/
│   ├── i18n.config.ts            # Configuration i18n
│   └── locales/
│       ├── fr.json               # Traductions françaises
│       └── en.json               # Traductions anglaises
│
├── layouts/
│   └── default.vue               # Layout principal (Navbar + Footer)
│
├── pages/
│   ├── index.vue                 # Homepage (modulaire avec composants)
│   ├── biography.vue             # Page biographie
│   ├── metahism.vue              # Page métahisme
│   ├── artworks.vue              # Galerie principale (utilise oeuvreGallery)
│   ├── analyses.vue              # Page analyses (tabs)
│   ├── deployments.vue           # Catégorie déploiements
│   ├── archetypes.vue            # Catégorie archétypes
│   ├── transcriptions.vue        # Catégorie transcriptions
│   ├── drawings.vue              # Catégorie dessins
│   └── search.vue                # Page de recherche
│
├── public/
│   ├── images/
│   │   └── flags/                # Drapeaux pour sélecteur de langue
│   └── robots.txt
│
├── server/
│   └── api/
│       └── search/
│           └── index.get.ts      # API de recherche (Supabase)
│
├── scripts/                      # Scripts utilitaires (DB, S3, etc.)
│
└── nuxt.config.ts                # Configuration Nuxt
```

---

## 🏗️ Architecture & Conventions

### Système de Styles

**1. Design Tokens (`assets/css/_tokens.scss`)**
- Contient TOUTES les variables SCSS du design system
- Utilise `@use` (pas `@import`) pour l'import
- Variables SCSS ($color-primary, etc.)

**2. Styles Globaux (`assets/css/main.scss`)**
- Importe `_tokens.scss` avec `@use './_tokens.scss' as *`
- Expose les tokens comme CSS Custom Properties (`:root { --color-primary: ... }`)
- Styles de base pour html, body, img, a, p, h1-h6, button, etc.
- **⚠️ Ne jamais dupliquer les variables CSS dans les layouts/autres fichiers**

**3. Styles de Page (`assets/css/pages/[nom].scss`)**
- Un fichier par page principale
- Référencé dans le `<style>` de la page : `<style lang="scss" src="~/assets/css/pages/home.scss"></style>`
- Utilise les CSS custom properties : `var(--color-primary)`, `var(--transition-medium)`, etc.

**Règle importante :** 
- ✅ Utiliser les CSS custom properties (`var(--color-primary)`) dans les composants/pages
- ✅ Utiliser les variables SCSS (`$color-primary`) uniquement dans `_tokens.scss` et `main.scss`
- ❌ Ne JAMAIS dupliquer les variables dans plusieurs fichiers

### Structure des Composants

**Composants Page-Specific :**
- Placés dans `components/[feature]/` (ex: `components/home/`)
- Nommage: PascalCase avec préfixe explicite (ex: `HomeHero.vue`)
- Style: Fichier SCSS séparé dans `assets/css/pages/` si nécessaire

**Composants Globaux :**
- Placés dans `components/` (ex: `navbar.vue`, `carousselSection.vue`)
- Utilisés dans plusieurs pages
- Peuvent avoir leur propre `<style scoped>` si styles spécifiques

**Composants Base :**
- Placés dans `components/base/`
- Composants réutilisables génériques (ex: `BaseButton.vue`)

### Structure des Pages

**Page Homepage (`pages/index.vue`) :**
- Structure modulaire avec composants `home/*`
- Pas de styles inline, tout dans `assets/css/pages/home.scss`
- Utilise `computed()` pour préparer les données des props
- Utilise `useI18n()` pour les traductions
- Structure :
  ```vue
  <template>
    <div class="homepage">
      <HomeHero :props="..." />
      <HomeBiographySection :props="..." />
      <!-- etc -->
    </div>
  </template>
  <script setup lang="ts">
    // Computed properties pour les données
    // Locale path helpers
  </script>
  <style lang="scss" src="~/assets/css/pages/home.scss"></style>
  ```

**Pages de Contenu :**
- Styles dans `assets/css/pages/[nom].scss`
- Padding horizontal : `1cm` (aligné avec navbar)
- Max-width : `var(--max-width-content)` (1200px)
- Structure :
  ```vue
  <template>
    <div class="[page-name]-page">
      <!-- Contenu -->
    </div>
  </template>
  <style lang="scss" src="~/assets/css/pages/[nom].scss"></style>
  ```

### Typographie des Titres

**Titres de Section (Homepage, Biography, etc.) :**
```scss
.section-title {
    font-family: var(--font-family-heading);
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 300;
    color: #5e6266;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    display: block; // Important : block pour que le texte passe à la ligne
    line-height: 1.2;
}
```

**Barre rouge :**
```scss
.section-title-divider {
    width: calc(100% - 0.22em); // Compense letter-spacing
    height: 3px;
    background: #a20101;
    transform: scaleX(0.3); // 30% par défaut
    // Sur homepage : s'étend à scaleX(1) au hover
    // Sur autres pages : reste à 0.3
}
```

**Structure HTML :**
```html
<div class="section-header">
  <h2 class="section-title">TITRE</h2>
  <div class="section-divider"></div>
</div>
```

### Internationalisation (i18n)

**Configuration :**
- Module `@nuxtjs/i18n` avec stratégie `prefix`
- Routes : `/fr/page` et `/en/page`
- Fichiers dans `i18n/locales/` (fr.json, en.json)

**Utilisation dans les composants :**
```typescript
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();
// t('homepage.biography_title')
```

**Helper pour les routes localisées :**
```typescript
const localePath = (path: string): string => {
  const localeFromPath = route.path?.match(/^\/(fr|en)/)?.[1] || locale.value || 'fr';
  return `/${localeFromPath}${path}`;
};
```

---

## 🔧 Pratiques de Développement

### Règles Importantes

**1. Modularité :**
- Une page = un fichier de styles séparé dans `assets/css/pages/`
- Composants complexes = décomposés en sous-composants
- Jamais de fichiers de 14000 lignes

**2. CSS :**
- ✅ Toujours utiliser les CSS custom properties (`var(--color-primary)`)
- ✅ Centraliser les styles dans `assets/css/pages/`
- ✅ Utiliser les design tokens du système
- ❌ Ne jamais dupliquer les variables CSS
- ❌ Ne jamais mettre de styles inline volumineux

**3. TypeScript :**
- Utiliser des interfaces avec préfixe `I` : `interface IAnalysis { ... }`
- Explicit return types pour les fonctions publiques
- Utiliser `defineProps<Type>()` pour les props Vue

**4. Naming Conventions :**
- Composants Vue : PascalCase (`HomeHero.vue`)
- Fichiers CSS : kebab-case (`home.scss`)
- Classes CSS : kebab-case (`.section-title`)
- Variables TS : camelCase (`biographyContent`)
- Interfaces : PascalCase avec préfixe `I` (`IAnalysis`)

**5. Linting :**
- ESLint + Prettier configurés
- Toujours lancer `npm run lint:fix` avant de commiter
- Respecter les règles TypeScript strictes

### Workflow de Refactorisation

**Quand refactoriser une page :**

1. **Créer/Extraire les styles CSS :**
   - Créer `assets/css/pages/[nom].scss`
   - Déplacer tous les styles du `<style scoped>` vers ce fichier
   - Utiliser les CSS custom properties

2. **Décomposer les composants :**
   - Identifier les sections réutilisables
   - Créer des composants dans `components/[feature]/`
   - Passer les données via props

3. **Nettoyer le code :**
   - Supprimer les console.log
   - Supprimer les variables inutilisées
   - Ajouter les types TypeScript
   - Vérifier le linting

4. **Validation :**
   - Le rendu visuel doit être **STRICTEMENT IDENTIQUE**
   - Tester le responsive
   - Vérifier les traductions i18n

**⚠️ IMPORTANT :** Toujours valider page par page, ne jamais faire plusieurs pages en même temps.

### Spacing & Layout

**Padding des pages :**
- Horizontal : `1cm` (aligné avec la navbar qui a aussi `padding: 1rem 1cm`)
- Vertical : `2rem` par défaut
- Responsive : `clamp(1.5rem, 4vw, 2rem)` sur tablette, `1rem` sur mobile

**Max-width :**
- Conteneurs de contenu : `var(--max-width-content)` (1200px)
- Navbar container : `var(--max-width-content)` avec `margin: 0 auto`

**Alignement :**
- Texte justifié : `text-align: justify` + `text-justify: inter-word` pour tous les paragraphes
- Line-height réduit : `1.7` pour les textes justifiés (au lieu de 1.9)

### Navigation & Liens

**Titres cliquables :**
- Tous les titres de section peuvent être des liens
- Utiliser `NuxtLink` avec classe `heading-link`
- Hover : La barre rouge s'allonge (pas de changement de couleur de texte)
- Barre s'arrête exactement à la fin du texte (compensation du letter-spacing)

**Navbar :**
- Logo "PATRICK LAUMOND" à gauche
- Barre de recherche au centre (desktop) ou icône (mobile)
- Menu navigation à droite
- Sélecteur de langue à droite
- Sticky avec ombre au scroll

---

## 🎯 Pages Spécifiques

### Homepage (`pages/index.vue`)

**Structure modulaire :**
- `HomeHero` - Section hero avec vidéo 360°
- `HomeBiographySection` - Section biographie avec portrait
- `HomeMetahismSection` - Section métahisme avec artwork
- `HomeArtworksSection` - Section œuvres en vedette
- `HomeAnalysesSection` - Section analyses

**Styles :** `assets/css/pages/home.scss`

**Caractéristiques :**
- Sections avec titre cliquable (barre rouge animée au hover)
- Texte justifié partout
- Line-height réduit (1.7)
- Liens vers les pages correspondantes

### Biography (`pages/biography.vue`)

**Structure :**
- Texte de biographie à gauche
- Menu de navigation sticky à droite (sections)
- Styles dans `assets/css/pages/biography.scss`

**Caractéristiques :**
- H3 avec même typographie que homepage
- Barre rouge à 30% (fixe, ne s'anime pas)
- Texte justifié
- Navigation interne avec scroll smooth
- Menu masqué sur mobile

**Alignement :**
- Page : `max-width: var(--max-width-content)`, `padding: 2rem 1cm`
- Texte : Flex 1, pas de padding horizontal interne
- Menu : `margin-left: 1rem`, `padding-right: 1cm`, `margin-top: 20px` pour alignement vertical

### Metahism (`pages/metahism.vue`)

**Structure :**
- Titre "MÉTAHISME" avec barre rouge (s'allonge au hover)
- Texte justifié en dessous
- Styles dans `assets/css/pages/metahism.scss`

**Caractéristiques :**
- Titre aligné avec navbar (même padding horizontal)
- Espacement titre-texte : `calc(4rem - 1cm)`
- Padding global : `2rem 1cm`

### Artworks (`pages/artworks.vue`)

**Utilise :** `components/oeuvreGallery.vue`

**Structure :**
- Plusieurs `CarouselSection` (Déploiements, Archétypes, Transcriptions, Dessins)
- Chaque section a un titre et un carrousel horizontal

**Styles dans `carousselSection.vue` :**
- Titre : `margin-top: 2rem` pour espacement vers le bas
- Padding wrapper : `calc(1cm - 1rem)` en bas (réduit de 1rem)
- Barre rouge s'allonge au hover (comme homepage)

### Analyses (`pages/analyses.vue`)

**Structure :**
- Tabs en haut pour filtrer les analyses
- Image principale
- Titre avec barre rouge (s'allonge au hover)
- Contenu avec text-align justify
- Bouton "Voir plus/Voir moins"

**Caractéristiques :**
- Tabs : Rouge au hover/actif (barre rouge qui s'étend)
- Navigation directe via query param : `/analyses?tab=portant`
- Titre utilise même style que homepage

---

## 🔗 Liens & Navigation

### Structure des Routes

**Routes principales :**
- `/fr/` ou `/en/` - Homepage
- `/fr/biography` - Biographie
- `/fr/metahism` - Métahisme
- `/fr/artworks` - Galerie principale
- `/fr/analyses` - Analyses
- `/fr/deployments` - Catégorie déploiements
- `/fr/archetypes` - Catégorie archétypes
- `/fr/transcriptions` - Catégorie transcriptions
- `/fr/drawings` - Catégorie dessins
- `/fr/search?q=...` - Recherche

### Navigation Interne

**Liens avec query params :**
- Analyses avec onglet : `/analyses?tab=portant`
- Le composant écoute `route.query.tab` pour activer le bon onglet

**Liens internes (biographie) :**
- Ancre : `#Expérimentation`, `#Language`, etc.
- Scroll smooth avec offset pour compenser le header

---

## 🎨 Styles Spécifiques

### Titres avec Barre Rouge

**Homepage (animée au hover) :**
```scss
.section-header {
    display: inline-flex;
    flex-direction: column;
    width: max-content;
    
    .section-title { /* styles titre */ }
    
    .section-divider {
        transform: scaleX(0.3); // 30% par défaut
        transition: transform var(--transition-medium);
    }
    
    &:hover .section-divider {
        transform: scaleX(1); // 100% au hover
    }
}
```

**Biography/Metahism (fixe à 30%) :**
```scss
h3 { /* styles titre */ }

.section-title-divider {
    transform: scaleX(0.3); // Toujours 30%
    // Pas de transition, pas de hover
}
```

### Navbar

**Padding :**
- Desktop : `padding: 1rem 1cm` (horizontal aligné avec contenu)
- Tablette : `padding: 1rem 1.5rem`
- Mobile : `padding: 0.75rem 1rem`

**Menu items :**
- Hover : Barre rouge qui s'étend sous le texte
- Actif : Rouge avec barre complète

### Carrousels

**Titres de section :**
- `margin-top: 2rem` pour espacement vers le bas
- Barre rouge s'anime au hover (comme homepage)

**Wrapper :**
- Padding bottom réduit : `calc(1cm - 1rem)`

---

## 🛠️ Technologies & Dépendances

**Core :**
- Nuxt 3.15.2
- Vue 3 (latest)
- TypeScript 5.8.3

**Styling :**
- SCSS (sass-embedded)
- CSS Custom Properties pour runtime

**Internationalisation :**
- @nuxtjs/i18n 9.2.0

**Backend/Services :**
- Supabase (@supabase/supabase-js) - Base de données
- AWS S3 - Stockage des images

**Images :**
- @nuxt/image 1.9.0

**Tooling :**
- ESLint + Prettier
- TypeScript strict mode

---

## 📝 Règles de Nommage

### Fichiers
- Composants Vue : PascalCase (`HomeHero.vue`)
- Fichiers SCSS : kebab-case (`home.scss`, `_tokens.scss`)
- Fichiers TypeScript : kebab-case (`use-oeuvres.ts`) ou camelCase (`useOeuvres.ts`)
- Pages : kebab-case (`biography.vue`, `metahism.vue`)

### CSS Classes
- kebab-case : `.section-title`, `.carousel-header`
- BEM optionnel pour composants complexes

### Variables TypeScript
- camelCase : `biographyContent`, `currentLocale`
- Interfaces : PascalCase avec préfixe `I` : `IAnalysis`, `ITab`

### Composants Vue
- PascalCase : `<HomeHero />`, `<CarouselSection />`
- Props : camelCase avec types définis

---

## 🔄 Workflow de Modification

### Ajouter une Nouvelle Page

1. Créer `pages/[nom].vue`
2. Créer `assets/css/pages/[nom].scss`
3. Utiliser les CSS custom properties
4. Padding horizontal : `1cm` (aligné avec navbar)
5. Max-width : `var(--max-width-content)`
6. Importer le style : `<style lang="scss" src="~/assets/css/pages/[nom].scss"></style>`

### Modifier les Styles Existants

1. Identifier le fichier SCSS concerné
2. Utiliser les CSS custom properties existantes
3. Si nouvelle variable nécessaire, l'ajouter à `_tokens.scss` ET `main.scss`
4. Tester le responsive
5. Vérifier le linting

### Refactoriser une Page

1. Extraire les styles vers `assets/css/pages/[nom].scss`
2. Décomposer en composants si nécessaire
3. Nettoyer le code (supprimer console.log, variables inutilisées)
4. Ajouter les types TypeScript
5. **Valider que le rendu visuel est strictement identique**
6. Linter et tester

---

## 🎯 Points d'Attention

### ⚠️ Règles Critiques

1. **Toujours utiliser les CSS custom properties** (`var(--color-primary)`) dans les composants
2. **Ne jamais dupliquer les variables CSS** dans plusieurs fichiers
3. **Les styles doivent être centralisés** dans `assets/css/pages/`
4. **Le rendu visuel doit rester identique** après refactorisation
5. **Valider page par page**, jamais plusieurs pages en même temps
6. **Padding horizontal : 1cm** pour alignement avec navbar
7. **Barre rouge :** 30% par défaut, s'étend au hover sur homepage uniquement

### ✅ Checklist Avant Commit

- [ ] Linter passé : `npm run lint:fix`
- [ ] Rendu visuel identique
- [ ] Responsive testé
- [ ] Pas de console.log
- [ ] Pas de variables inutilisées
- [ ] Types TypeScript corrects
- [ ] Styles centralisés dans `assets/css/pages/`
- [ ] Utilisation des CSS custom properties

---

## 📚 Ressources

- **Design Tokens :** `assets/css/_tokens.scss`
- **Styles Globaux :** `assets/css/main.scss`
- **Configuration Nuxt :** `nuxt.config.ts`
- **i18n :** `i18n/i18n.config.ts` et `i18n/locales/`

---

## 🎨 Exemples de Code

### Page Type avec Styles Externes

```vue
<!-- pages/exemple.vue -->
<template>
  <div class="exemple-page">
    <h1>Titre</h1>
    <!-- Contenu -->
  </div>
</template>

<script setup lang="ts">
// Script
</script>

<style lang="scss" src="~/assets/css/pages/exemple.scss"></style>
```

### Styles de Page

```scss
// assets/css/pages/exemple.scss
.exemple-page {
    max-width: var(--max-width-content);
    margin: 0 auto;
    padding: 2rem 1cm;
    font-family: var(--font-family-base);
    color: var(--color-text);
    
    h1 {
        font-family: var(--font-family-heading);
        color: #5e6266;
        // etc.
    }
}
```

### Composant avec Props Typées

```vue
<script setup lang="ts">
interface IMyComponentProps {
    title: string;
    count?: number;
}

const props = withDefaults(defineProps<IMyComponentProps>(), {
    count: 0,
});
</script>
```

---

**Dernière mise à jour :** Décembre 2024

