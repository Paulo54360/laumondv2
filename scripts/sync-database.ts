import { PrismaClient } from '@prisma/client'
import { categoryTitles } from './update-descriptions'

interface Image {
  title: string
  path: string
}

interface CategoryData {
  title: string
  images: Image[]
}

const categoryMapping: Record<string, { name: string; path: string }> = {
  transcriptions: { name: 'Transcriptions', path: 'transcriptions' },
  archetype: { name: 'Archétype', path: 'archetype' },
  deploiement: { name: 'Déploiement', path: 'deploiement' },
  drawing: { name: 'Dessin', path: 'drawing' },
}

const prisma = new PrismaClient()

async function syncDatabase() {
  try {
    // Nettoyage de la base de données
    await prisma.artwork.deleteMany()
    await prisma.category.deleteMany()
    console.log('Base de données nettoyée')

    // Création des catégories
    const categories = await Promise.all(
      Object.entries(categoryMapping).map(([key, { name, path }]) =>
        prisma.category.create({
          data: {
            name,
            path,
          },
        })
      )
    )

    const categoryMap = new Map(
      categories.map((category) => [category.path, category.id])
    )

    let totalImages = 0

    // Importation des images
    for (const [categoryKey, artworks] of Object.entries(categoryTitles)) {
      const categoryId = categoryMap.get(categoryMapping[categoryKey].path)
      if (!categoryId) continue

      for (const artwork of artworks) {
        const imageUrls = artwork.images.map((image) => {
          const fullImagePath = `images/${categoryMapping[categoryKey].path}/${image.path}`
          console.log(`Importation de l'image: ${fullImagePath}`)
          return fullImagePath
        })

        await prisma.artwork.create({
          data: {
            title: artwork.title,
            categoryId,
            subcategory: '',
            folderPath: `images/${categoryMapping[categoryKey].path}`,
            imageUrls: JSON.stringify(imageUrls),
          },
        })

        totalImages += imageUrls.length
      }
    }

    // Vérification finale
    const totalCategories = await prisma.category.count()
    const totalArtworks = await prisma.artwork.count()

    console.log('\nRésumé de l\'importation:')
    console.log(`- Nombre de catégories: ${totalCategories}`)
    console.log(`- Nombre d'œuvres: ${totalArtworks}`)
    console.log(`- Nombre total d'images: ${totalImages}`)

  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

syncDatabase()
  .catch((error) => {
    console.error('Erreur lors de l\'exécution du script:', error)
    process.exit(1)
  })