-- Migration S3.1: Tables pour textes éditoriaux (Biographie, Métahisme, Analyses)
-- À exécuter manuellement dans Supabase SQL Editor

CREATE TABLE IF NOT EXISTS site_texts (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  content_fr TEXT,
  content_en TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS site_texts_history (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL,
  content_fr TEXT,
  content_en TEXT,
  saved_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_texts_slug ON site_texts (slug);
CREATE INDEX IF NOT EXISTS idx_site_texts_history_slug ON site_texts_history (slug);

COMMENT ON TABLE site_texts IS 'Textes éditoriaux (biographie, métahisme, analyses) FR/EN';
