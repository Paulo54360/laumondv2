import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Charger les variables d'environnement
config()

async function testConnection() {
  try {
    // Test de la connexion Supabase
    console.log('Test de la connexion Supabase...')
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Variables d\'environnement SUPABASE_URL ou SUPABASE_KEY manquantes')
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test de la connexion en récupérant les catégories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
    
    if (categoriesError) throw categoriesError
    
    // Test de la connexion en récupérant les œuvres
    const { data: artworks, error: artworksError } = await supabase
      .from('artworks')
      .select('*')
      .limit(1)
    
    if (artworksError) throw artworksError

    console.log('✅ Connexion Supabase OK')
    console.log('\nRésultats des tests :')
    console.log(`- Nombre de catégories: ${categories.length}`)
    console.log(`- Premier artwork:`, artworks[0]?.title || 'Aucun')

  } catch (error) {
    console.error('❌ Erreur de connexion:', error)
  }
}

testConnection() 