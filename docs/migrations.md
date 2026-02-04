# Migrations base de données (Admin Content Management)

Migrations pour le back-office complet (œuvres + textes éditoriaux). À exécuter **dans l’ordre** via le SQL Editor Supabase (Dashboard → SQL Editor).

## 1. Prérequis

- Accès au projet Supabase (rôle owner ou équivalent)
- `.env` configuré avec `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`

## 2. Ordre d’exécution

### Étape 1 : Soft delete sur `artworks`

Fichier : `supabase/migrations/20260203000001_add_deleted_at_artworks.sql`

- Ajoute la colonne `deleted_at` pour la corbeille
- Crée un index partiel pour les œuvres actives

### Étape 2 : Table `artwork_images`

Fichier : `supabase/migrations/20260203000002_create_artwork_images.sql`

- Crée la table `artwork_images` (id, artwork_id, url, filename, position, created_at, deleted_at)
- Remplace progressivement le champ JSON `artworks.image_urls`

### Étape 3 : Tables textes éditoriaux

Fichier : `supabase/migrations/20260203000003_create_site_texts.sql`

- `site_texts` : Biographie, Métahisme, Analyses (FR/EN)
- `site_texts_history` : historisation avant sauvegarde

### Étape 4 : Colonnes i18n sur `artworks` (S1.2)

Fichier : `supabase/migrations/20260203000004_add_artworks_i18n.sql`

- Ajoute `title_en`, `description_fr`, `description_en` pour les métadonnées FR/EN

### Étape 5 : Catégorie sur `site_texts`

Fichier : `supabase/migrations/20260203000005_add_site_texts_category.sql`

- Ajoute la colonne `category` pour regrouper les textes dans l’admin (biography, metahism, homepage, analyses)

## 3. Migration des données existantes

Après avoir exécuté les migrations SQL :

```bash
# Simulation (affiche ce qui serait fait)
npm run migrate:artwork-images -- --dry-run

# Exécution réelle
npm run migrate:artwork-images
```

Le script copie `artworks.image_urls` vers `artwork_images` et évite les doublons.

### Bootstrap des textes éditoriaux (site_texts)

Pour pré-remplir `site_texts` avec le contenu actuel des fichiers i18n (Biographie, Métahisme, accueil) :

```bash
# Simulation
npm run bootstrap:site-texts -- --dry-run

# Exécution réelle
npm run bootstrap:site-texts
```

Crée les slugs regroupés par catégorie :

- **Biographie** : `biography`
- **Métahisme** : `metahism`
- **Accueil** : `homepage_biography`, `homepage_metahism`, `homepage_hero_*`, `homepage_artwork_*`, `homepage_analysis_*`, etc.
- **Analyses** : `analysis_portant`, `analysis_concordance`, `analysis_aimants`, `analysis_advienne`

## 4. Vérification

- Supabase → Table Editor : vérifier que `artworks` a bien `deleted_at`, que `artwork_images` et `site_texts` existent
- Après migration : `artwork_images` doit contenir une ligne par image pour chaque œuvre

## 5. Rétrocompatibilité

Les endpoints actuels (`/api/gallery/*`, `/api/search`, `/api/admin/artworks`) continuent de lire `image_urls`. Une fois les API mises à jour (Story S3.2), elles liront `artwork_images` en priorité, avec fallback sur `image_urls` si besoin.
