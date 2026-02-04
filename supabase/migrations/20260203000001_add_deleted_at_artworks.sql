-- Migration S3.1: Ajout de deleted_at pour soft delete (corbeille)
-- À exécuter manuellement dans Supabase SQL Editor ou via supabase db push

ALTER TABLE artworks
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_artworks_deleted_at
  ON artworks (deleted_at)
  WHERE deleted_at IS NULL;

COMMENT ON COLUMN artworks.deleted_at IS 'Soft delete: NULL = actif, non NULL = dans la corbeille';
