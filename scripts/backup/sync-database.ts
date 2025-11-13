import { PrismaClient } from '@prisma/client';

import { categoryTitles } from './update-descriptions';

const categoryMapping: Record<string, { name: string; path: string }> = {
  transcriptions: { name: 'Transcriptions', path: 'Transcriptions' },
  archetype: { name: 'Archétype', path: 'Archetypes' },
  deploiement: { name: 'Déploiement', path: 'Deployments' },
  drawing: { name: 'Dessin', path: 'Drawings' },
};

const S3_BASE_URL = 'https://plaumondpicture.s3.eu-west-3.amazonaws.com';

const prisma = new PrismaClient();

async function syncDatabase() {
  try {
    // Nettoyage de la base de données
    await prisma.artwork.deleteMany();
    await prisma.category.deleteMany();
    console.log('Base de données nettoyée');

    // Création des catégories
    const categories = await Promise.all(
      Object.entries(categoryMapping).map(([key, { name, path }]) =>
        prisma.category.create({
          data: {
            name,
            path: `images/${key}`,
          },
        })
      )
    );

    const categoryMap = new Map(
      categories.map((category) => [category.name.toLowerCase(), category.id])
    );

    let totalImages = 0;

    // Importation des images
    for (const [categoryKey, artworks] of Object.entries(categoryTitles)) {
      const categoryId = categoryMap.get(categoryMapping[categoryKey].name.toLowerCase());
      if (!categoryId) {
        console.log(`Catégorie non trouvée: ${categoryKey}`);
        continue;
      }

      for (const [folderId, artwork] of Object.entries(artworks)) {
        const imageUrls = Object.keys(artwork.images).map((imageId) => {
          const s3Path = `${S3_BASE_URL}/${categoryMapping[categoryKey].path}/${folderId}/${imageId}.jpg`;
          console.log(`Importation de l'image: ${s3Path}`);
          return s3Path;
        });

        await prisma.artwork.upsert({
          where: {
            title_categoryId: {
              title: artwork.title,
              categoryId,
            },
          },
          update: {
            subcategory: folderId,
            folderPath: `${categoryMapping[categoryKey].path}/${folderId}`,
            imageUrls: JSON.stringify(imageUrls),
          },
          create: {
            title: artwork.title,
            categoryId,
            subcategory: folderId,
            folderPath: `${categoryMapping[categoryKey].path}/${folderId}`,
            imageUrls: JSON.stringify(imageUrls),
          },
        });

        totalImages += imageUrls.length;
      }
    }

    // Vérification finale
    const totalCategories = await prisma.category.count();
    const totalArtworks = await prisma.artwork.count();

    console.log("\nRésumé de l'importation:");
    console.log(`- Nombre de catégories: ${totalCategories}`);
    console.log(`- Nombre d'œuvres: ${totalArtworks}`);
    console.log(`- Nombre total d'images: ${totalImages}`);
  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

syncDatabase().catch((error) => {
  console.error("Erreur lors de l'exécution du script:", error);
  process.exit(1);
});
