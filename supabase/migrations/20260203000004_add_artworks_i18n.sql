-- Migration S1.2: Colonnes FR/EN pour titres et descriptions
-- title = FR, description = FR (existant). Ajout title_en, description_en.

ALTER TABLE artworks
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS description_fr TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- description existant = FR (optionnel: migrer description -> description_fr plus tard)
COMMENT ON COLUMN artworks.title_en IS 'Titre anglais';
COMMENT ON COLUMN artworks.description_fr IS 'Description française';
COMMENT ON COLUMN artworks.description_en IS 'Description anglaise';
