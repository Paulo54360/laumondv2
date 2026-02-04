# Styles — Comment ajouter ou modifier

Référence : `docs/architecture-laumond-nuxt.md`, `.cursorrules`. Objectif : garder les styles alignés sur les tokens et la structure existante, sans changer le rendu visuel.

---

## 1. Où mettre les styles

| Cas                         | Emplacement                        | Exemple                                               |
| --------------------------- | ---------------------------------- | ----------------------------------------------------- |
| **Nouvelle page**           | `assets/css/pages/[page].scss`     | `pages/contact.vue` → `assets/css/pages/contact.scss` |
| **Page existante**          | Même fichier `pages/[page].scss`   | Modifier `home.scss` pour la homepage                 |
| **Composant layout/global** | `assets/css/components/[nom].scss` | `navbar.scss` pour la Navbar                          |
| **Composant léger**         | `<style scoped>` dans le `.vue`    | Préférer `var(--color-...)`                           |
| **Tokens / variables**      | `assets/css/_tokens.scss`          | Couleurs, espacements, breakpoints                    |
| **Patterns réutilisables**  | `assets/css/_mixins.scss`          | Section header, grille, etc.                          |

---

## 2. Utiliser les tokens (obligatoire)

- **Couleurs** : toujours `var(--color-...)`. Pas de `#333`, `#ccc`, etc. en dur.
  - Exemples : `var(--color-primary)`, `var(--color-text)`, `var(--color-border)`, `var(--color-surface)`.
- **Typo** : `var(--font-family-base)`, `var(--font-weight-medium)`.
- **Espacements** : `var(--spacing-sm)`, `var(--spacing-md)`.
- **Transitions** : `var(--transition-fast)`, `var(--transition-medium)`.
- **Layout** : `var(--max-width-content)`, `var(--header-height)`.

Si une valeur n’existe pas en token, l’ajouter dans `_tokens.scss` puis l’exposer dans `main.scss` (`:root`).

---

## 3. Importer un fichier de page

Dans le composant Vue de la page :

```vue
<style lang="scss" src="~/assets/css/pages/[page].scss"></style>
```

Exemple : `pages/biography.vue` → `src="~/assets/css/pages/biography.scss"`.

---

## 4. Titre de section + barre rouge

- **Homepage** : barre animée au survol → utiliser le composant `BaseSectionTitle` avec `animated="true"` (ou le mixin `section-header(true)` en SCSS).
- **Autres pages** : barre fixe 30 % → `BaseSectionTitle` avec `animated="false"` ou le mixin `section-header(false)`.

Les styles du titre et de la barre viennent de `_mixins.scss` (`section-header`) et/ou du composant `BaseSectionTitle`.

---

## 5. Responsive

Breakpoints dans `_tokens.scss` : `$breakpoint-sm` (640px), `$breakpoint-md` (768px), `$breakpoint-lg` (1024px), `$breakpoint-xl` (1280px). Mixins : `@include sm { }`, `@include md { }`, etc.

Vérifier navbar et contenu sur 768px / 1024px / 1280px (cf. `.cursorrules`).

---

## 6. Styles morts

Lors d’un refactor ou d’une suppression de feature, supprimer les règles SCSS et les classes qui ne sont plus utilisées. Pas de nettoyage automatique ; à faire au cas par cas.

---

## 7. Références

- Architecture : `docs/architecture-laumond-nuxt.md` (§ 3.7 `assets/css/`)
- Règles projet : `.cursorrules` (couleurs, typo, layout)
- Tokens : `assets/css/_tokens.scss`
- Variables CSS globales : `assets/css/main.scss` (`:root`)
