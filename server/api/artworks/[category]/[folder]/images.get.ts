import { promises as fs } from 'fs';
import { join } from 'path';

// Extensions d'images autorisées
const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif'];

export default defineEventHandler(async (event) => {
  try {
    const { category, folder } = event.context.params;
    
    // Construire le chemin du dossier
    const folderPath = join(process.cwd(), 'public', 'images', category, folder);
    
    // Vérifier si le dossier existe
    try {
      await fs.access(folderPath);
    } catch {
      throw createError({
        statusCode: 404,
        message: `Folder ${category}/${folder} not found`
      });
    }
    
    // Lire le contenu du dossier
    const files = await fs.readdir(folderPath);
    
    // Filtrer pour ne garder que les images
    const images = files.filter(file => {
      const ext = file.toLowerCase().split('.').pop();
      return ALLOWED_IMAGE_EXTENSIONS.includes(`.${ext}`);
    });
    
    // Trier les images par nom
    images.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    
    return images;
  } catch (error: any) {
    console.error('Error fetching images:', error);
    
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    });
  }
}); 