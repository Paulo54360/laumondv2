import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

// Structure des catégories
const categories = {
  deploiement: { name: 'deploiement', folders: ['00', '01', '02', '03', '04', '05'] },
  transcriptions: { 
    name: 'transcriptions', 
    folders: Array.from({ length: 17 }, (_, i) => String(i + 1).padStart(2, '0'))
  },
  archetype: { 
    name: 'archetype', 
    folders: Array.from({ length: 8 }, (_, i) => String(i + 2).padStart(2, '0'))
  },
  drawing: { 
    name: 'drawing', 
    folders: Array.from({ length: 5 }, (_, i) => String(i + 1).padStart(2, '0'))
  }
};

// Extensions d'images autorisées
const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg'];

async function readDescriptionFile(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
    return null;
  }
}

async function getImagesFromFolder(folderPath: string): Promise<string[]> {
  try {
    const files = await fs.readdir(folderPath);
    return files.filter(file => {
      const ext = file.toLowerCase().split('.').pop();
      return ALLOWED_IMAGE_EXTENSIONS.includes(`.${ext}`);
    }).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch (error) {
    console.error(`Erreur lors de la lecture du dossier ${folderPath}:`, error);
    return [];
  }
}

async function importArtworks() {
  const baseDir = join(process.cwd(), 'public', 'images');
  let importedCount = 0;
  let errorCount = 0;

  try {
    // Pour chaque catégorie
    for (const [categoryKey, category] of Object.entries(categories)) {
      console.log(`\n=== Traitement de la catégorie ${categoryKey.toUpperCase()} ===`);

      // Créer ou récupérer la catégorie dans la base de données
      const dbCategory = await prisma.category.upsert({
        where: { name: category.name },
        update: { path: join('images', category.name) },
        create: {
          name: category.name,
          path: join('images', category.name)
        }
      });

      // Pour chaque sous-dossier
      for (const folder of category.folders) {
        const folderPath = join(baseDir, category.name, folder);
        const descriptionPath = join(folderPath, 'description.txt');

        try {
          // Lire la description
          const description = await readDescriptionFile(descriptionPath);
          if (!description) {
            console.log(`! Pas de description pour ${category.name}/${folder}`);
            continue;
          }

          // Récupérer les images
          const images = await getImagesFromFolder(folderPath);
          if (images.length === 0) {
            console.log(`! Pas d'images trouvées dans ${category.name}/${folder}`);
            continue;
          }

          // Créer les chemins d'images relatifs
          const imageUrls = images.map(img => 
            join('images', category.name, folder, img)
          );

          // Créer ou mettre à jour l'œuvre dans la base de données
          const artwork = await prisma.artwork.upsert({
            where: {
              title_categoryId: {
                title: description,
                categoryId: dbCategory.id
              }
            },
            update: {
              imageUrls: JSON.stringify(imageUrls),
              folderPath: join('images', category.name, folder),
              subcategory: folder
            },
            create: {
              title: description,
              categoryId: dbCategory.id,
              subcategory: folder,
              folderPath: join('images', category.name, folder),
              imageUrls: JSON.stringify(imageUrls)
            }
          });

          console.log(`✓ Importé: ${category.name}/${folder}`);
          console.log(`  Titre: ${artwork.title}`);
          console.log(`  Images: ${images.length}`);
          importedCount++;
        } catch (error) {
          console.error(`✗ Erreur pour ${category.name}/${folder}:`, error);
          errorCount++;
        }
      }
    }

    console.log(`\nRésumé:`);
    console.log(`- Œuvres importées: ${importedCount}`);
    console.log(`- Erreurs: ${errorCount}`);

  } catch (error) {
    console.error('Erreur générale:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Lancer l'importation
importArtworks().catch(console.error); 