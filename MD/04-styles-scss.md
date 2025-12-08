# Règles styles & SCSS

## Design tokens & usage
- Source unique : `assets/css/_tokens.scss` (SCSS variables), exposés en CSS custom properties via `assets/css/main.scss`.
- Dans les pages/composants : toujours consommer `var(--color-...)`, pas les variables SCSS.
- Si nouvelle variable : l’ajouter dans `_tokens.scss` **et** la propager dans `main.scss` (pas ailleurs).

## Fichiers et structure
- Un fichier de styles par page dans `assets/css/pages/[page].scss`.
- Un fichier de styles par composant complexe dans `assets/css/components/[component].scss`.
- Pas de styles inline. Utilisez `<style scoped>` pour des ajustements mineurs uniquement.
- Composants globaux : styles importés ou scoped, utilisant `var(--...)`.
- Principe : la typographie de base (h1, h2, h3, p, span, liens) est définie globalement dans `assets/css/main.scss` à partir des tokens. L’usage dans les templates se limite à écrire `<h2>...</h2>` ou `<p>...</p>` pour obtenir le style harmonisé (pas de styles inline ni de duplication locale).

## Typographie & palette
- Police : Inter (400/500/600).
- Couleurs clés (codes exacts) :
  - Rouge primaire : `#cc0000`
  - Rouge dark : `#a20101`
  - Gris muted : `#999999`
  - Gris muted light : `#bfbfbf`
  - Gris muted dark / quasi-noir : `#525252`
  - Texte principal : `#2c3e50`
  - Texte très foncé : `#333333`
  - Fond principal : `#ffffff`
  - Fond alternatif clair : `#f8f9fa`
  - Surface grisée : `#f5f5f5`
- Titres : uppercase, letter-spacing `0.22em`, barre rouge 3px sous le titre.

## Titres & barre rouge
- Homepage : barre rouge démarre à 30% (`scaleX(0.3)`) et s’étend à 100% au hover (`scaleX(1)`), transition medium.
- Autres pages (biography, metahism...) : barre fixe à 30%, pas d’animation.
- Structure type :
  - wrapper `.section-header` en colonne, largeur `max-content`.
  - `.section-title` avec la typo ci-dessus.
  - `.section-divider` largeur `calc(100% - 0.22em)`, hauteur 3px, transform `scaleX(0.3)`.

## Layout & spacing
- Padding horizontal standard : `1cm` (aligné navbar). Max-width contenu : `1200px` (var `--max-width-content`).
- Texte : justifié (`text-align: justify`), line-height ~1.7. Breakpoints : 768/1024/1280px.
- Navbar : padding `1rem 1cm` desktop (réduit sur tablette/mobile).
- Carrousels : titres margin-top ~2rem, padding bas `calc(1cm - 1rem)`.

## Bonnes pratiques CSS/SCSS
- Ne pas dupliquer les variables : toujours via tokens + custom properties.
- Pas de fichiers géants : découper, mais rester minimal (KISS).
- Préférer classes kebab-case ; BEM acceptable pour composants complexes.
- Vérifier responsive à chaque ajout de styles, conserver le rendu existant.
