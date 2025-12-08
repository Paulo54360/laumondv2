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

async function checkCategories() {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, path')
    .order('name', { ascending: true });

  if (error) {
    console.error('❌ Erreur:', error);
    return;
  }

  console.log('\n📋 Catégories dans Supabase:\n');
  categories?.forEach((cat) => {
    console.log(`  - ID: ${cat.id}, Nom: "${cat.name}", Path: "${cat.path}"`);
  });
  console.log(`\nTotal: ${categories?.length || 0} catégorie(s)\n`);
}

checkCategories().catch(console.error);
