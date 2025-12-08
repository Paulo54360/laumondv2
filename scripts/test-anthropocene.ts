import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variables d'environnement Supabase manquantes");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSearch() {
  const searchTerms = [
    "L'ANTHROPOCÈNE",
    "L'Anthropocène",
    'Anthropocène',
    'anthropocène',
    'ANTHROPOCENE',
    'anthropocene',
  ];

  for (const term of searchTerms) {
    console.log(`\n🔍 Recherche pour: "${term}"`);

    const searchPattern = `%${term.trim()}%`;

    // Recherche dans title
    const { data: byTitle, error: errorTitle } = await supabase
      .from('artworks')
      .select('id, title, folder_path')
      .ilike('title', searchPattern)
      .limit(10);

    if (errorTitle) {
      console.error('  ❌ Erreur:', errorTitle);
    } else {
      console.log(`  ✅ Title: ${byTitle?.length || 0} résultat(s)`);
      byTitle?.forEach((art) => {
        console.log(`     - "${art.title}" (folder: ${art.folder_path})`);
      });
    }

    // Recherche dans description
    const { data: byDescription, error: errorDescription } = await supabase
      .from('artworks')
      .select('id, title, folder_path, description')
      .not('description', 'is', null)
      .ilike('description', searchPattern)
      .limit(10);

    if (errorDescription) {
      console.error('  ❌ Erreur description:', errorDescription);
    } else {
      console.log(`  ✅ Description: ${byDescription?.length || 0} résultat(s)`);
      byDescription?.forEach((art) => {
        const descPreview = art.description?.substring(0, 50) || '';
        console.log(`     - "${art.title}" - "${descPreview}..."`);
      });
    }
  }

  // Vérifier si l'œuvre existe directement
  console.log(`\n📋 Recherche exacte dans tous les titres contenant "anthropocène"...`);
  const { data: allArtworks, error: allError } = await supabase
    .from('artworks')
    .select('id, title, folder_path, subcategory')
    .order('title', { ascending: true });

  if (allError) {
    console.error('❌ Erreur:', allError);
  } else {
    const matching =
      allArtworks?.filter(
        (art) =>
          art.title.toLowerCase().includes('anthropocène') ||
          art.title.toLowerCase().includes('anthropocene')
      ) || [];

    console.log(`   Trouvé ${matching.length} œuvre(s) avec "anthropocène" dans le titre:`);
    matching.forEach((art) => {
      console.log(
        `   - ID: ${art.id}, Titre: "${art.title}", Folder: ${art.folder_path}, Subcategory: ${art.subcategory}`
      );
    });
  }
}

testSearch().catch(console.error);
