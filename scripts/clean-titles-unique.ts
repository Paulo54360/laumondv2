import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Charger les variables d'environnement
config()

async function cleanTitlesUnique() {
  try {
    console.log('Début du nettoyage des titres avec unicité...')
    
    const supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_KEY || ''
    )

    // Récupérer toutes les œuvres groupées par catégorie
    const { data: artworks, error: fetchError } = await supabase
      .from('artworks')
      .select('*')
      .order('title', { ascending: true })
    
    if (fetchError) throw fetchError
    
    console.log(`Récupération de ${artworks?.length || 0} œuvres.`)
    
    // Grouper les œuvres par catégorie et titre de base
    const artworksByCategory: Record<number, Record<string, any[]>> = {}
    
    for (const artwork of artworks || []) {
      const categoryId = artwork.category_id
      const titleParts = artwork.title.split(' - ')
      const baseTitle = titleParts[0]
      
      // Initialiser le groupe de catégorie s'il n'existe pas
      if (!artworksByCategory[categoryId]) {
        artworksByCategory[categoryId] = {}
      }
      
      // Initialiser le groupe de titre s'il n'existe pas
      if (!artworksByCategory[categoryId][baseTitle]) {
        artworksByCategory[categoryId][baseTitle] = []
      }
      
      // Ajouter l'œuvre au groupe
      artworksByCategory[categoryId][baseTitle].push(artwork)
    }
    
    let updatedCount = 0
    
    // Pour chaque catégorie
    for (const categoryId in artworksByCategory) {
      // Pour chaque titre de base
      for (const baseTitle in artworksByCategory[categoryId]) {
        const artworksGroup = artworksByCategory[categoryId][baseTitle]
        
        // Si nous avons plusieurs œuvres avec le même titre de base
        if (artworksGroup.length > 1) {
          console.log(`\nTraitement du groupe: "${baseTitle}" (${artworksGroup.length} œuvres)`)
          
          // Stocker la première occurence sans suffixe
          const firstArtwork = artworksGroup[0]
          const firstTitle = baseTitle
          
          console.log(`- Première œuvre: "${firstArtwork.title}" → "${firstTitle}"`)
          
          // Mettre à jour la première œuvre avec le titre de base
          if (firstArtwork.title !== firstTitle) {
            const { error: updateError } = await supabase
              .from('artworks')
              .update({ title: firstTitle })
              .eq('id', firstArtwork.id)
            
            if (updateError) {
              console.error(`  Erreur: ${updateError.message}`)
              continue
            }
            
            updatedCount++
          }
          
          // Pour les œuvres suivantes, ajouter un suffixe numérique
          for (let i = 1; i < artworksGroup.length; i++) {
            const artwork = artworksGroup[i]
            // Récupérer la description de l'œuvre à partir du titre complet
            const titleParts = artwork.title.split(' - ')
            const description = titleParts.length > 1 ? titleParts.slice(1).join(' - ') : `Vue ${i}`
            
            // Créer un nouveau titre unique avec un suffixe court et informatif
            const newTitle = `${baseTitle} (${i})`
            
            console.log(`- ID ${artwork.id}: "${artwork.title}" → "${newTitle}"`)
            
            // Mise à jour du titre
            const { error: updateError } = await supabase
              .from('artworks')
              .update({ 
                title: newTitle,
                description: description  // Assurer que la description est préservée
              })
              .eq('id', artwork.id)
            
            if (updateError) {
              console.error(`  Erreur: ${updateError.message}`)
              continue
            }
            
            updatedCount++
          }
        } 
        // S'il n'y a qu'une seule œuvre, on nettoie simplement le titre
        else if (artworksGroup.length === 1) {
          const artwork = artworksGroup[0]
          
          // Si le titre contient une description
          if (artwork.title !== baseTitle) {
            // Extraire la description
            const titleParts = artwork.title.split(' - ')
            const description = titleParts.length > 1 ? titleParts.slice(1).join(' - ') : artwork.description
            
            console.log(`Titre nettoyé: "${artwork.title}" → "${baseTitle}"`)
            
            // Mise à jour du titre
            const { error: updateError } = await supabase
              .from('artworks')
              .update({ 
                title: baseTitle,
                description: description || artwork.description  // Préserver la description
              })
              .eq('id', artwork.id)
            
            if (updateError) {
              console.error(`Erreur: ${updateError.message}`)
              continue
            }
            
            updatedCount++
          }
        }
      }
    }
    
    console.log(`\n✅ Nettoyage terminé. ${updatedCount} titres ont été mis à jour.`)
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage des titres:', error)
  }
}

// Exécuter la fonction
cleanTitlesUnique() 