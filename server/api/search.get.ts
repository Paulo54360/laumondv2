import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const S3_BASE_URL = 'https://plaumondpicture.s3.eu-west-3.amazonaws.com'

const getCategoryS3Path = (categoryName: string): string => {
  const categoryMap: Record<string, string> = {
    'deploiement': 'Deployments',
    'transcriptions': 'Transcriptions',
    'archetype': 'Archetypes',
    'drawing': 'Drawings'
  }
  return categoryMap[categoryName] || categoryName
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const searchTerm = query.q as string

    console.log('Recherche avec le terme:', searchTerm)

    if (!searchTerm) {
      console.log('Aucun terme de recherche fourni')
      return { artworks: [] }
    }

    const artworks = await prisma.artwork.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        ]
      },
      include: {
        category: true
      },
      orderBy: {
        title: 'asc'
      }
    })

    console.log(`${artworks.length} résultats trouvés`)

    // Retourner les résultats sans modifier les URLs (elles sont déjà au bon format dans la base)
    return {
      artworks: artworks.map(artwork => ({
        ...artwork,
        imageUrls: artwork.imageUrls // Déjà au format JSON string dans la base
      }))
    }

  } catch (error) {
    console.error('Erreur lors de la recherche:', error)
    throw createError({
      statusCode: 500,
      message: 'Une erreur est survenue lors de la recherche'
    })
  } finally {
    await prisma.$disconnect()
  }
}) 