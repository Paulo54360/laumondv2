import { PrismaClient } from '@prisma/client';
import * as fs from 'fs-extra';
import * as path from 'path';

const prisma = new PrismaClient();

// Extensions d'images autorisées
const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif'];

async function scanDirectory(categoryPath: string): Promise<string[]> {
  try {
    const files = await fs.readdir(categoryPath);
    return files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ALLOWED_IMAGE_EXTENSIONS.includes(ext);
    });
  } catch (error) {
    console.error(`Erreur lors de la lecture du dossier ${categoryPath}:`, error);
    return [];
  }
}

async function readTextFile(filePath: string): Promise<string | null> {
  try {
    if (await fs.pathExists(filePath)) {
      return await fs.readFile(filePath, 'utf-8');
    }
    return null;
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
    return null;
  }
}

async function importArtworks() {
  try {
    // Récupérer toutes les catégories
    const categories = await prisma.category.findMany();

    for (const category of categories) {
      console.log(`\nTraitement de la catégorie: ${category.name}`);
      
      const categoryPath = path.join(process.cwd(), 'public', category.path);
      
      // Vérifier si le dossier existe
      if (!(await fs.pathExists(categoryPath))) {
        console.log(`Le dossier ${categoryPath} n'existe pas. Création...`);
        await fs.mkdirp(categoryPath);
        continue;
      }

      // Scanner les sous-dossiers
      const subfolders = await fs.readdir(categoryPath, { withFileTypes: true });
      
      for (const subfolder of subfolders) {
        if (!subfolder.isDirectory()) continue;

        const subfolderPath = path.join(categoryPath, subfolder.name);
        console.log(`\nTraitement du sous-dossier: ${subfolder.name}`);

        // Trouver les images
        const images = await scanDirectory(subfolderPath);
        if (images.length === 0) {
          console.log('Aucune image trouvée dans ce dossier');
          continue;
        }

        // Chercher le fichier texte associé
        const txtFile = path.join(subfolderPath, 'description.txt');
        const description = await readTextFile(txtFile);

        // Créer les chemins d'images relatifs
        const imageUrlsJson = JSON.stringify(
          images.map(img => path.join(category.path, subfolder.name, img))
        );

        // Créer ou mettre à jour l'œuvre dans la base de données
        const artwork = await prisma.artwork.upsert({
          where: {
            title_categoryId: {
              title: subfolder.name,
              categoryId: category.id
            }
          },
          update: {
            imageUrls: imageUrlsJson,
            description: description || undefined
          },
          create: {
            title: subfolder.name,
            categoryId: category.id,
            subcategory: subfolder.name,
            folderPath: path.join(category.path, subfolder.name),
            imageUrls: imageUrlsJson,
            description: description || undefined
          }
        });

        console.log(`Œuvre importée: ${artwork.title}`);
        console.log(`Images trouvées: ${JSON.parse(artwork.imageUrls).length}`);
        console.log(`Description: ${description ? 'Trouvée' : 'Non trouvée'}`);
      }
    }

    console.log('\nImportation terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Lancer l'importation
importArtworks();