import { PrismaClient } from '@prisma/client';
import { categoryTitles } from './update-descriptions';

const prisma = new PrismaClient();
const S3_BASE_URL = 'https://plaumondpicture.s3.eu-west-3.amazonaws.com';

const getCategoryS3Path = (categoryName: string): string => {
  const categoryMap: Record<string, string> = {
    'deploiement': 'Deployments',
    'transcriptions': 'Transcriptions',
    'archetype': 'Archetypes',
    'drawing': 'Drawings'
  };
  return categoryMap[categoryName] || categoryName;
};

async function clearDatabase() {
  console.log('Nettoyage de la base de données...');
  await prisma.artwork.deleteMany();
  await prisma.category.deleteMany();
  console.log('Base de données nettoyée.');
}

async function seedDescriptions() {
  try {
    console.log('Début de l\'importation des œuvres...\n');

    // Nettoyer la base de données d'abord
    await clearDatabase();

    let totalArtworks = 0;
    let totalImages = 0;

    // Pour chaque catégorie
    for (const [categoryName, artworks] of Object.entries(categoryTitles)) {
      console.log(`\n=== Traitement de la catégorie: ${categoryName} ===`);

      // Récupérer ou créer la catégorie
      const category = await prisma.category.upsert({
        where: { name: categoryName },
        update: {
          path: `images/${categoryName}`
        },
        create: {
          name: categoryName,
          path: `images/${categoryName}`
        }
      });

      console.log(`Catégorie créée: ${category.name} (ID: ${category.id})`);

      // Pour chaque œuvre dans la catégorie
      for (const [folderId, artwork] of Object.entries(artworks)) {
        const s3CategoryPath = getCategoryS3Path(categoryName);
        
        // Construire les URLs S3 pour les images
        const imageUrls = Object.keys(artwork.images).map(imageId => 
          `${S3_BASE_URL}/${s3CategoryPath}/${folderId}/${imageId}.jpg`
        );

        try {
          // Créer ou mettre à jour l'œuvre
          const dbArtwork = await prisma.artwork.upsert({
            where: {
              title_categoryId: {
                title: artwork.title,
                categoryId: category.id
              }
            },
            update: {
              folderPath: `${s3CategoryPath}/${folderId}`,
              subcategory: folderId,
              imageUrls: JSON.stringify(imageUrls)
            },
            create: {
              title: artwork.title,
              categoryId: category.id,
              folderPath: `${s3CategoryPath}/${folderId}`,
              subcategory: folderId,
              imageUrls: JSON.stringify(imageUrls)
            }
          });

          totalArtworks++;
          totalImages += imageUrls.length;

          console.log(`✓ Importé: ${categoryName}/${folderId}`);
          console.log(`  ID: ${dbArtwork.id}`);
          console.log(`  Titre: ${dbArtwork.title}`);
          console.log(`  Images: ${imageUrls.length}`);
          console.log(`  URLs: ${JSON.stringify(imageUrls, null, 2)}\n`);
        } catch (error) {
          console.error(`Erreur lors de l'importation de ${categoryName}/${folderId}:`, error);
        }
      }
    }

    console.log('\nRésumé de l\'importation:');
    console.log(`- Total des œuvres importées: ${totalArtworks}`);
    console.log(`- Total des images: ${totalImages}`);

    // Vérification finale
    const artworkCount = await prisma.artwork.count();
    const categoryCount = await prisma.category.count();
    console.log('\nVérification de la base de données:');
    console.log(`- Nombre de catégories: ${categoryCount}`);
    console.log(`- Nombre d'œuvres: ${artworkCount}`);

  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Lancer l'importation
seedDescriptions().catch(console.error); 