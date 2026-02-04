-- Migration S3.1: Table artwork_images pour gérer les images par œuvre
-- Remplace progressivement artworks.image_urls (JSON)
-- À exécuter après 20260203000001_add_deleted_at_artworks.sql

CREATE TABLE IF NOT EXISTS artwork_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id INTEGER NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  filename TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_artwork_images_artwork_id
  ON artwork_images (artwork_id);

CREATE INDEX IF NOT EXISTS idx_artwork_images_position
  ON artwork_images (artwork_id, position)
  WHERE deleted_at IS NULL;

COMMENT ON TABLE artwork_images IS 'Images associées aux œuvres (remplace image_urls JSON)';
