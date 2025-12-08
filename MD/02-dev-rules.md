# Règles dev (KISS + TDD)

## Principes
- KISS/YAGNI : ne coder que le strict nécessaire ; pas de refacto opportuniste ni de feature cachée.
- Respecter l'architecture de `01-context.md` (styles centralisés, page par page).
- Sécurité : pas de secrets en clair, `.env` jamais commité ni copié dans le repo.

## Cycle TDD
1) Écrire ou compléter un test qui échoue (Vitest + @vue/test-utils ou @nuxt/test-utils ; ajouter la dépendance si manquante).
2) Coder le minimum pour faire passer le test.
3) Refactor léger si besoin, puis relancer tests + lint.

### Types de tests à privilégier
- Composants UI : rendu du titre/barre rouge selon props, texte i18n affiché, classes clés présentes (`section-header`, `section-divider`) ; interactions simples (clic bouton → event, carrousel change de slide) ; états loading/erreur (spinner, message).
- Composables : logique pure (formatage, filtrage, debounce) ; hooks data (Supabase/S3) avec client mocké, gestion succès/erreur/fallback.
- i18n : clés utilisées (pas de texte en dur), fallback langue par défaut, routes préfixées.
- Routes server (Nitro) : 200 avec payload attendu ; 4xx/5xx si entrée invalide, message structuré.
- Intégration légère : scénario “happy path” court sur un composant clé (ex : sélection onglet → contenu change).
- Styles : éviter les snapshots lourds ; vérifier présence des classes et des états plutôt que tout le DOM.

## Checklist Definition of Done
- Tests verts et ciblés ; éviter les snapshots massifs.
- `npm run lint:fix` passé ; aucun `console.log` ni import inutilisé.
- Rendu visuel conservé (si UI) et responsive vérifié.
- Chaînes/données UI via `useI18n`.

## À éviter
- Dupliquer des variables SCSS/CSS : utiliser `var(--color-...)` définies dans `main.scss`.
- Mélanger plusieurs pages/features dans une même livraison.
- Styles inline : interdit, utiliser `assets/css/`.
- Fichiers géants : extraire la logique dans `composables/` et les sous-composants.
