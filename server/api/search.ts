import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const searchTerm = query.q as string;

  if (!searchTerm) {
    return {
      artworks: []
    };
  }

  try {
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
    });

    return {
      artworks
    };
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    throw createError({
      statusCode: 500,
      message: 'Une erreur est survenue lors de la recherche'
    });
  }
}); 