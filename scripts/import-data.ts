import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { categoryTitles } from './update-descriptions'

// Charger les variables d'environnement
config()

const categoryMapping: Record<string, { name: string; path: string }> = {
  transcriptions: { name: 'Transcriptions', path: 'Transcriptions' },
  archetype: { name: 'Archétype', path: 'Archetypes' },
  deploiement: { name: 'Déploiement', path: 'Deployments' },
  drawing: { name: 'Dessin', path: 'Drawings' },
}

const S3_BASE_URL = 'https://plaumondpicture.s3.eu-west-3.amazonaws.com'

async function importData() {
  try {
    console.log('Début de l\'importation des données...')
    
    const supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_KEY || ''
    )

    // Suppression des données existantes
    console.log('Nettoyage des tables existantes...')
    await supabase.from('artworks').delete().neq('id', 0)
    await supabase.from('categories').delete().neq('id', 0)
    console.log('✅ Tables nettoyées')

    // Création des catégories
    console.log('\nCréation des catégories...')
    const categories = []
    for (const [key, { name, path }] of Object.entries(categoryMapping)) {
      const { data, error } = await supabase
        .from('categories')
        .insert({ name, path: `images/${key}` })
        .select()
      
      if (error) throw error
      categories.push({ key, ...data[0] })
      console.log(`- Catégorie créée: ${name}`)
    }

    // Import des œuvres
    console.log('\nImport des images...')
    let totalImages = 0

    for (const category of categories) {
      const artworks = categoryTitles[category.key]
      
      for (const [folderId, artwork] of Object.entries(artworks)) {
        for (const [imageId, description] of Object.entries(artwork.images)) {
          const imageUrl = `${S3_BASE_URL}/${categoryMapping[category.key].path}/${folderId}/${imageId}.jpg`
          const imageTitle = `${artwork.title} - ${description}`

          const { error } = await supabase
            .from('artworks')
            .insert({
              title: imageTitle,
              category_id: category.id,
              subcategory: folderId,
              folder_path: `${categoryMapping[category.key].path}/${folderId}`,
              image_urls: JSON.stringify([imageUrl]),
              description: description
            })

          if (error) throw error
          console.log(`- Image importée: ${imageTitle}`)
          totalImages++
        }
      }
    }

    // Résumé
    const { count: categoryCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })

    const { count: artworkCount } = await supabase
      .from('artworks')
      .select('*', { count: 'exact', head: true })

    console.log('\n✅ Importation terminée avec succès!')
    console.log('Résumé:')
    console.log(`- Nombre de catégories: ${categoryCount}`)
    console.log(`- Nombre d'images: ${artworkCount}`)
    console.log(`- Total attendu d'images: ${totalImages}`)

  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error)
  }
}

importData() 