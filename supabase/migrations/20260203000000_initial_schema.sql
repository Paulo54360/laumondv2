-- Migration S0: Schéma initial categories et artworks
-- Prérequis pour les migrations ultérieures

CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

SELECT setval('categories_id_seq', (SELECT GREATEST(MAX(id), 16) FROM categories));

CREATE TABLE IF NOT EXISTS artworks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  subcategory TEXT,
  folder_path TEXT,
  image_urls TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
