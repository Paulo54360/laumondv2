import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const searchTerm = query.q as string;

    if (!searchTerm) {
      return { artworks: [] };
    }

    const artworks = await prisma.artwork.findMany({
      where: {
        title: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      },
      include: {
        category: true
      },
      orderBy: {
        title: 'asc'
      }
    });

    return {
      artworks: artworks.map(artwork => ({
        ...artwork,
        imageUrls: JSON.parse(artwork.imageUrls)
      }))
    };
  } catch (error) {
    console.error('Erreur de recherche:', error);
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la recherche'
    });
  }
}); 