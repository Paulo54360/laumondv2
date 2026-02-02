## EPIC 1 — Cartographier l’existant (Audit)

- **Story 1.1**: Lister la structure actuelle du projet (dossiers, pages, layouts, composants principaux).
- **Story 1.2**: Cartographier les flux de données (composables/services, appels API, accès DB/Supabase).
- **Story 1.3**: Recenser les dépendances clés (libs Nuxt/Vue, plugins, middlewares, modules Nuxt).
- **Story 1.4**: Identifier le code mort / deprecated / fichiers manifestement non utilisés.

---

## EPIC 2 — Définir l’architecture cible simple

- **Story 2.1**: Définir la structure cible des dossiers (pages, layouts, composants, composables, styles, config).
- **Story 2.2**: Définir les conventions de nommage et d’emplacement (où vont les appels aux données, où mettre la logique métier).
- **Story 2.3**: Définir les règles pour les styles (tokens, fichiers SCSS, components vs pages).
- **Story 2.4**: Documenter cette architecture cible dans un court doc (par ex. `docs/architecture-laumond-nuxt.md`).

---

## EPIC 3 — Nettoyage & simplification du code

- **Story 3.1**: Supprimer le code mort / fichiers non utilisés identifiés dans l’EPIC 1.
- **Story 3.2**: Réduire les duplications évidentes (composants/logiciels copiés-collés).
- **Story 3.3**: Simplifier les zones les plus complexes (pages ou composants “monstres”) sans changer le comportement.
- **Story 3.4**: Mettre à jour/importer les composants/composables pour respecter la nouvelle structure (EPIC 2).

---

## EPIC 4 — Réorganisation des pages & composants

- **Story 4.1**: Réorganiser les `pages` et `layouts` selon l’architecture cible (sans changer le rendu).
- **Story 4.2**: Extraire les composants génériques (ex: sections réutilisées) dans `components/base` ou équivalent.
- **Story 4.3**: Nettoyer et typer proprement les `composables` (useX) et leur usage dans les pages.
- **Story 4.4**: Ajouter des tests de base (smoke tests/route rendering) pour sécuriser les pages critiques.

---

## EPIC 5 — Styles & cohérence visuelle (sans changer le design)

- **Story 5.1**: Aligner tous les styles sur les tokens/couleurs/typo de référence (fichiers SCSS/tokens existants).
- **Story 5.2**: Regrouper/clarifier les fichiers de style par page/feature, supprimer les styles morts.
- **Story 5.3**: Documenter brièvement comment ajouter/modifier une section côté styles.

---

## EPIC 6 — Prod, CI/CD & garde-fous

- **Story 6.1**: Documenter le pipeline actuel (Docker, CI, déploiement VPS) sous forme simple.
- **Story 6.2**: Ajouter des vérifications minimales avant déploiement (scripts/tests simples, si pas déjà).
- **Story 6.3**: Mettre en place une checklist de déploiement “sans stress” basée sur ton flux actuel.

---

## EPIC 7 — Documentation & transmission

- **Story 7.1**: Rédiger un README projet à jour (objectif, stack, comment lancer, comment déployer).
- **Story 7.2**: Rédiger un mini “How to” pour ajouter une page/section sans casser l’archi.
- **Story 7.3**: Ajouter une courte section “Conventions & bonnes pratiques” (pour ton futur toi).

## EPIC 1 — Cartographier l’existant (Audit)

- **Story 1.1**: Lister la structure actuelle du projet (dossiers, pages, layouts, composants principaux).
- **Story 1.2**: Cartographier les flux de données (composables/services, appels API, accès DB/Supabase).
- **Story 1.3**: Recenser les dépendances clés (libs Nuxt/Vue, plugins, middlewares, modules Nuxt).
- **Story 1.4**: Identifier le code mort / deprecated / fichiers manifestement non utilisés.

---

## EPIC 2 — Définir l’architecture cible simple

- **Story 2.1**: Définir la structure cible des dossiers (pages, layouts, composants, composables, styles, config).
- **Story 2.2**: Définir les conventions de nommage et d’emplacement (où vont les appels aux données, où mettre la logique métier).
- **Story 2.3**: Définir les règles pour les styles (tokens, fichiers SCSS, components vs pages).
- **Story 2.4**: Documenter cette architecture cible dans un court doc (par ex. `docs/architecture-laumond-nuxt.md`).

---

## EPIC 3 — Nettoyage & simplification du code

- **Story 3.1**: Supprimer le code mort / fichiers non utilisés identifiés dans l’EPIC 1.
- **Story 3.2**: Réduire les duplications évidentes (composants/logiciels copiés-collés).
- **Story 3.3**: Simplifier les zones les plus complexes (pages ou composants “monstres”) sans changer le comportement.
- **Story 3.4**: Mettre à jour/importer les composants/composables pour respecter la nouvelle structure (EPIC 2).

---

## EPIC 4 — Réorganisation des pages & composants

- **Story 4.1**: Réorganiser les `pages` et `layouts` selon l’architecture cible (sans changer le rendu).
- **Story 4.2**: Extraire les composants génériques (ex: sections réutilisées) dans `components/base` ou équivalent.
- **Story 4.3**: Nettoyer et typer proprement les `composables` (useX) et leur usage dans les pages.
- **Story 4.4**: Ajouter des tests de base (smoke tests/route rendering) pour sécuriser les pages critiques.

---

## EPIC 5 — Styles & cohérence visuelle (sans changer le design)

- **Story 5.1**: Aligner tous les styles sur les tokens/couleurs/typo de référence (fichiers SCSS/tokens existants).
- **Story 5.2**: Regrouper/clarifier les fichiers de style par page/feature, supprimer les styles morts.
- **Story 5.3**: Documenter brièvement comment ajouter/modifier une section côté styles.

---

## EPIC 6 — Prod, CI/CD & garde-fous

- **Story 6.1**: Documenter le pipeline actuel (Docker, CI, déploiement VPS) sous forme simple.
- **Story 6.2**: Ajouter des vérifications minimales avant déploiement (scripts/tests simples, si pas déjà).
- **Story 6.3**: Mettre en place une checklist de déploiement “sans stress” basée sur ton flux actuel.

---

## EPIC 7 — Documentation & transmission

- **Story 7.1**: Rédiger un README projet à jour (objectif, stack, comment lancer, comment déployer).
- **Story 7.2**: Rédiger un mini “How to” pour ajouter une page/section sans casser l’archi.
- **Story 7.3**: Ajouter une courte section “Conventions & bonnes pratiques” (pour ton futur toi).

