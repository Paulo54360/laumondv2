# Conventions & bonnes pratiques

Court rappel pour garder le projet cohérent. Détails : [.cursorrules](../.cursorrules), [docs/architecture-laumond-nuxt.md](architecture-laumond-nuxt.md).

---

## 1. Code

- **KISS & YAGNI** : coder uniquement ce qui est nécessaire, pas de sur-développement.
- **TypeScript strict** : pas de `any` ; types de retour explicites sur les fonctions (ou respecter la config ESLint).
- **Pas de `console.log`** ni d’imports inutilisés. Lancer `npm run lint:fix` avant commit.
- **Secrets** : jamais dans le code. Utiliser `.env` (jamais committer `.env`).

---

## 2. Nommage

- **Composables** : `useXxx` (ex. `useSearch`, `useNavbar`).
- **Composants base** : `BaseXxx` (ex. `BaseButton`, `BaseSectionTitle`).
- **Composants feature** : nom métier (ex. `GalleryGrid`, `SearchBar`).
- **Endpoints API** : `ressource.action.ts` (ex. `search/index.get.ts`).
- **Interfaces** : préfixe `I` (ex. `IUseNavbarReturn`, `IGalleryArtwork`).

---

## 3. Architecture

- **Pages** : composition uniquement ; logique et données via composables.
- **Composants** : pas d’appel API direct ; données en props ou via composables utilisés par la page.
- **Composables** : logique métier et accès données (`$fetch`, `useFetch`). Un composable par domaine.
- **Styles** : tokens dans `_tokens.scss`, exposés en `var(--color-...)` dans `main.scss`. Toujours utiliser les variables CSS, pas de couleurs en dur.

---

## 4. i18n & textes

- Tous les textes visibles via **`useI18n()`** / **`$t('cle')`**. Pas de chaînes en dur dans l’UI.
- Clés dans `i18n/locales/fr.json` et `en.json`.

---

## 5. Tests & qualité

- **Tests** : Vitest + @vue/test-utils. Tests ciblés, pas de snapshots lourds. Smoke tests des pages critiques dans `tests/pages/smoke.spec.ts`.
- **Definition of Done** : tests passent, lint OK, pas de régression visuelle, textes via i18n.

---

## 6. CI/CD

- Avant push sur `main` : `npm run lint:fix` et `npm run test -- --run` (le workflow les exécute aussi).
- Déploiement : voir [docs/cicd-deployment.md](cicd-deployment.md) (checklist, secrets, Docker).

---

_À mettre à jour si les conventions évoluent._
