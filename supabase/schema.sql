-- ==============================================================================
-- SCHEMA COMPLET SUPABASE / POSTGRESQL (DISASTER RECOVERY / RESTAURATION COMPLÈTE)
-- Projet : Patrick Laumond (laumond-nuxt)
-- 
-- Ce fichier permet de reconstruire l'intégralité de la base de données à partir de zéro
-- (tables, relations, contraintes, index, RLS et catégories initiales).
-- Exécuter dans : Supabase Dashboard -> SQL Editor (ou via supabase db push).
-- ==============================================================================

-- 0. Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. Table: categories
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertion idempotente des catégories par défaut
INSERT INTO categories (id, name, path) VALUES
  (9, 'Transcriptions', 'images/transcriptions'),
  (10, 'Archétype', 'images/archetype'),
  (11, 'Déploiement', 'images/deploiement'),
  (12, 'Dessin', 'images/drawing'),
  (13, 'Archetypes', 'Archetypes'),
  (14, 'Deployments', 'Deployments'),
  (15, 'Drawings+', 'Drawings+'),
  (16, 'Autres', 'autres')
ON CONFLICT (id) DO UPDATE 
  SET name = EXCLUDED.name, path = EXCLUDED.path;

-- Mise à jour de la séquence de clé primaire pour categories
SELECT setval('categories_id_seq', (SELECT GREATEST(MAX(id), 16) FROM categories));

-- ------------------------------------------------------------------------------
-- 2. Table: artworks (Œuvres)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS artworks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  description_fr TEXT,
  description_en TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  subcategory TEXT,
  folder_path TEXT,
  image_urls TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

COMMENT ON COLUMN artworks.deleted_at IS 'Soft delete: NULL = actif, non NULL = dans la corbeille';

-- ------------------------------------------------------------------------------
-- 3. Table: artwork_images (Images associées aux œuvres)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS artwork_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id INTEGER NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  filename TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

COMMENT ON TABLE artwork_images IS 'Images associées aux œuvres (remplace progressivement image_urls)';

-- ------------------------------------------------------------------------------
-- 4. Tables: site_texts et site_texts_history (Textes éditoriaux)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_texts (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  content_fr TEXT,
  content_en TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS site_texts_history (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL,
  content_fr TEXT,
  content_en TEXT,
  saved_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE site_texts IS 'Textes éditoriaux (biographie, métahisme, analyses, accueil) FR/EN';
COMMENT ON TABLE site_texts_history IS 'Historisation des versions précédentes des textes éditoriaux';

-- ------------------------------------------------------------------------------
-- 5. Index de performance & recherche
-- ------------------------------------------------------------------------------
-- Artworks
CREATE INDEX IF NOT EXISTS idx_artworks_deleted_at
  ON artworks (deleted_at)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_artworks_category_id
  ON artworks (category_id);

CREATE INDEX IF NOT EXISTS idx_artworks_category_created
  ON artworks (category_id, created_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_artworks_title_trgm
  ON artworks USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_artworks_title_en_trgm
  ON artworks USING gin (title_en gin_trgm_ops);

-- Artwork images
CREATE INDEX IF NOT EXISTS idx_artwork_images_artwork_id
  ON artwork_images (artwork_id);

CREATE INDEX IF NOT EXISTS idx_artwork_images_position
  ON artwork_images (artwork_id, position)
  WHERE deleted_at IS NULL;

-- Site texts
CREATE INDEX IF NOT EXISTS idx_site_texts_slug
  ON site_texts (slug);

CREATE INDEX IF NOT EXISTS idx_site_texts_category
  ON site_texts (category);

CREATE INDEX IF NOT EXISTS idx_site_texts_history_slug
  ON site_texts_history (slug);

-- ------------------------------------------------------------------------------
-- 6. Row Level Security (RLS) & Politiques d'accès
-- ------------------------------------------------------------------------------
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE artwork_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_texts_history ENABLE ROW LEVEL SECURITY;

-- Suppression préventive si déjà existantes
DROP POLICY IF EXISTS "Public read artworks" ON artworks;
DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Public read artwork_images" ON artwork_images;
DROP POLICY IF EXISTS "Public read site_texts" ON site_texts;
DROP POLICY IF EXISTS "Authenticated read site_texts_history" ON site_texts_history;

-- Politiques de lecture publique
CREATE POLICY "Public read artworks" ON artworks
  FOR SELECT TO anon, authenticated
  USING (deleted_at IS NULL);

CREATE POLICY "Public read categories" ON categories
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Public read artwork_images" ON artwork_images
  FOR SELECT TO anon, authenticated
  USING (deleted_at IS NULL);

CREATE POLICY "Public read site_texts" ON site_texts
  FOR SELECT TO anon, authenticated
  USING (true);

-- Politiques restreintes
CREATE POLICY "Authenticated read site_texts_history" ON site_texts_history
  FOR SELECT TO authenticated
  USING (true);
