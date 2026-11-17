-- Migration S3.2: Sécurisation RLS (Row Level Security) et Index de Performance
-- À exécuter dans Supabase SQL Editor (Dashboard -> SQL Editor)

-- 1. Activation de la Row Level Security sur toutes les tables
ALTER TABLE IF EXISTS artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS artwork_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_texts_history ENABLE ROW LEVEL SECURITY;

-- 2. Suppression préventive des anciennes politiques si existantes
DROP POLICY IF EXISTS "Public read artworks" ON artworks;
DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Public read artwork_images" ON artwork_images;
DROP POLICY IF EXISTS "Public read site_texts" ON site_texts;
DROP POLICY IF EXISTS "Authenticated read site_texts_history" ON site_texts_history;

-- 3. Politiques de LECTURE publiques (visiteurs / clé anon et authenticated)
-- Seules les œuvres non supprimées (soft-delete) sont visibles publiquement
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

-- L'historique des textes n'est accessible qu'aux utilisateurs connectés (admin)
CREATE POLICY "Authenticated read site_texts_history" ON site_texts_history
  FOR SELECT TO authenticated
  USING (true);

-- Note de sécurité : Aucune politique INSERT, UPDATE, DELETE n'est accordée au rôle 'anon'.
-- Toutes les mutations d'administration passent obligatoirement par les endpoints API
-- serveur de Nuxt qui utilisent le rôle 'service_role' (qui outrepasse le RLS de manière contrôlée).

-- 4. Index de performance
-- Index sur la catégorie et date de création pour accélérer la galerie (/galerie/[category])
CREATE INDEX IF NOT EXISTS idx_artworks_category_id
  ON artworks (category_id);

CREATE INDEX IF NOT EXISTS idx_artworks_category_created
  ON artworks (category_id, created_at DESC)
  WHERE deleted_at IS NULL;

-- 5. Extension et index de recherche trigramme (accélération des ILIKE sur la recherche)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_artworks_title_trgm
  ON artworks USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_artworks_title_en_trgm
  ON artworks USING gin (title_en gin_trgm_ops);
