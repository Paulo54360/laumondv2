# Contexte projet

- Produit : site vitrine artistique Patrick Laumond (FR/EN), Nuxt 3 + Vue 3 + TypeScript strict.
- Infra : Supabase (PostgreSQL) + AWS S3 pour médias, hébergement OVH ; déploiement via GitHub Actions vers VPS + PM2.
- Styles : design tokens `assets/css/_tokens.scss`, exposés en CSS custom properties par `assets/css/main.scss`. Toujours consommer `var(--color-...)` dans les pages/composants ; pas de duplicata de variables.
- Structure : pages Nuxt dans `pages/`; composants spécifiques dans `components/[feature]/`; globaux dans `components/`; bases génériques dans `components/base/`; styles par page dans `assets/css/pages/[page].scss` via `<style src>`. Assets publics dans `public/`.
- Identité visuelle : Inter (400/500/600), rouge primaire `#cc0000` / dark `#a20101`, gris `#999` → `#525252`, fond blanc/clair ; titres uppercase, letter-spacing 0.22em, barre rouge 3px (30% fixe sauf hover homepage).
- Layout : padding horizontal 1cm (aligné navbar), max-width contenu 1200px, texte justifié line-height ~1.7.
- Critique : rendu visuel **strictement identique** après refacto ; traiter page par page.
