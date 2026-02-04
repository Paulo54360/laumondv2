# How to — Ajouter une page ou une section

Objectif : ajouter une nouvelle page ou une section sans casser l’architecture. Référence : [docs/architecture-laumond-nuxt.md](architecture-laumond-nuxt.md).

---

## 1. Ajouter une nouvelle page (route)

1. **Créer le fichier** dans `pages/` :  
   `pages/ma-page.vue` → route `/ma-page` (ou `/fr/ma-page`, `/en/ma-page` avec i18n).

2. **Structure minimale** :

   ```vue
   <template>
     <div class="ma-page">
       <!-- Contenu : composer avec des composants, pas de logique lourde -->
     </div>
   </template>

   <script setup lang="ts">
     definePageMeta({ layout: 'default' });
     // Données : utiliser des composables (useSearch, useS3, etc.) ou props
   </script>

   <style lang="scss" src="~/assets/css/pages/ma-page.scss"></style>
   ```

3. **Styles** : créer `assets/css/pages/ma-page.scss` et utiliser les **tokens** (`var(--color-...)`, etc.). Voir [docs/styles-howto.md](styles-howto.md).

4. **i18n** : tous les textes visibles via `useI18n()` / `$t('cle')`. Ajouter les clés dans `i18n/locales/fr.json` et `en.json`.

5. **Nav** : si la page doit apparaître dans le menu, modifier le composant `Navbar` (liens).

---

## 2. Ajouter une section sur une page existante

- **Homepage** : ajouter un composant dans `pages/index.vue` (ex. section home dans `components/home/`) et l’importer. Styles : réutiliser les classes `.section`, mixins `section-header`, ou `BaseSectionTitle` pour le titre + barre rouge.
- **Autre page** : ajouter le bloc dans le template de la page, et les styles dans le SCSS de la page (`assets/css/pages/[page].scss`) en utilisant les tokens.

---

## 3. Ajouter un composant réutilisable

- **Composant “bête” (sans logique métier)** → `components/base/` (ex. `BaseSectionTitle`, `BaseButton`). Props + events, pas d’appel API ni de `useX()` métier.
- **Composant lié à une feature** → `components/` par feature (ex. `components/gallery/`, `components/layout/`). Les données viennent du parent ou d’un composable utilisé par la page.

---

## 4. Règles pour ne pas casser l’archi

- **Pages** : pas de logique métier lourde ; composer avec composants + composables.
- **Composables** : un par domaine (ex. `useSearch`, `useS3`). Appels API dans les composables, pas dans les composants.
- **Styles** : toujours `var(--color-...)` et tokens ; pas de couleurs en dur. Nouvelle page → nouveau fichier `assets/css/pages/[page].scss`.
- **Textes** : `useI18n()` / `$t()`, pas de chaînes en dur dans l’UI.
- **Tests** : ajouter un smoke test dans `tests/pages/smoke.spec.ts` si la page est critique.

---

## 5. Checklist rapide

- [ ] Fichier dans `pages/` ou section dans une page existante
- [ ] `definePageMeta({ layout: 'default' })` si nouvelle page
- [ ] Styles dans `assets/css/pages/…` avec tokens
- [ ] Textes via i18n (clés FR/EN)
- [ ] Pas de `console.log`, pas d’import inutilisé
- [ ] `npm run lint:fix` et `npm run test -- --run` OK
