import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { categoryTitles } from './update-descriptions'

// Charger les variables d'environnement
config()

async function cleanTitles() {
  try {
    console.log('Début du nettoyage des titres...')
    
    const supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_KEY || ''
    )

    // Récupérer toutes les œuvres
    const { data: artworks, error: fetchError } = await supabase
      .from('artworks')
      .select('*')
    
    if (fetchError) throw fetchError
    
    console.log(`Récupération de ${artworks?.length || 0} œuvres.`)
    
    let updatedCount = 0
    
    // Pour chaque œuvre, nettoyer le titre
    for (const artwork of artworks || []) {
      // Extraction du titre principal (avant le premier " - ")
      const titleParts = artwork.title.split(' - ')
      const mainTitle = titleParts[0]
      
      // Mise à jour uniquement si le titre contient un " - "
      if (titleParts.length > 1 && mainTitle) {
        const { error: updateError } = await supabase
          .from('artworks')
          .update({ title: mainTitle })
          .eq('id', artwork.id)
        
        if (updateError) {
          console.error(`Erreur lors de la mise à jour du titre pour l'ID ${artwork.id}:`, updateError)
          continue
        }
        
        updatedCount++
        console.log(`Titre nettoyé: "${artwork.title}" → "${mainTitle}"`)
      }
    }
    
    console.log(`\n✅ Nettoyage terminé. ${updatedCount} titres ont été mis à jour.`)
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage des titres:', error)
  }
}

// Exécuter la fonction
cleanTitles() 