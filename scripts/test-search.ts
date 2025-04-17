import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Charger les variables d'environnement
config()

async function testSearch(searchTerm: string) {
  try {
    console.log(`\nRecherche pour: "${searchTerm}"`)
    
    const supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_KEY || ''
    )

    const { data, error } = await supabase
      .from('artworks')
      .select(`
        *,
        categories (
          name,
          path
        )
      `)
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .limit(5)

    if (error) throw error

    if (!data || data.length === 0) {
      console.log('Aucun résultat trouvé')
      return
    }

    console.log(`\n${data.length} résultat(s) trouvé(s):`)
    data.forEach((artwork, index) => {
      console.log(`\n${index + 1}. ${artwork.title}`)
      console.log(`   Catégorie: ${artwork.categories.name}`)
      console.log(`   Description: ${artwork.description}`)
      console.log(`   URL: ${JSON.parse(artwork.image_urls)[0]}`)
    })

  } catch (error) {
    console.error('❌ Erreur lors de la recherche:', error)
  }
}

// Tests avec différents termes de recherche
const searchTerms = [
  'quantique',
  'vue générale',
  'détail',
  'transcendance',
  'mutation'
]

async function runTests() {
  for (const term of searchTerms) {
    await testSearch(term)
  }
}

runTests() 