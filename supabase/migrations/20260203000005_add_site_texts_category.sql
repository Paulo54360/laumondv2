-- Ajoute une colonne category pour regrouper les textes dans l'admin
-- Valeurs: biography, metahism, homepage, analyses

ALTER TABLE site_texts ADD COLUMN IF NOT EXISTS category TEXT;
CREATE INDEX IF NOT EXISTS idx_site_texts_category ON site_texts (category);
COMMENT ON COLUMN site_texts.category IS 'Catégorie pour regroupement admin: biography, metahism, homepage, analyses';
