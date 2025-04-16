import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const S3_BASE_URL = 'https://plaumondpicture.s3.eu-west-3.amazonaws.com';

// Structure des images par catégorie
const imageStructure: Record<string, Record<string, number>> = {
  transcriptions: {
    '01': 5, '02': 4, '03': 5, '04': 4, '05': 5,
    '06': 4, '07': 5, '08': 4, '09': 5, '10': 4,
    '11': 5, '12': 4, '13': 5, '14': 4, '15': 5,
    '16': 4, '17': 5
  },
  archetype: {
    '02': 4, '03': 5, '04': 4, '05': 5, '06': 4,
    '07': 5, '08': 4, '09': 5
  },
  deploiement: {
    '00': 5, '01': 4, '02': 5, '03': 4, '04': 5, '05': 4
  },
  drawing: {
    '01': 5, '02': 4, '03': 5, '04': 4, '05': 5
  }
};

// Mapping des noms de dossiers vers les noms S3
const categoryMapping: Record<string, string> = {
  'deploiement': 'Deployments',
  'transcriptions': 'Transcriptions',
  'archetype': 'Archetypes',
  'drawing': 'Drawings'
};

// Titres des œuvres par catégorie et dossier
const titles: Record<string, Record<string, string>> = {
  transcriptions: {
    '01': "L'Œuvre De Damoclès Et L'Energie Quantique De La Pensée",
    '02': "L'Ascension Potentielle",
    '03': "Les Cinq Points Cardinaux - Quinta Essentia",
    '04': "L'Interdépendance Universelle",
    '05': "La Puissance De La Résistance",
    '06': "Le Grand Saut",
    '07': "L'Aube Du Soulèvement De L'Invisible",
    '08': "L'Energie Du Vide",
    '09': "Le Mythe De Pandore",
    '10': "Le Détachement De Soi",
    '11': "Hors Du Dedans",
    '12': "L'Inextricable Enchevêtrement Du Réel",
    '13': "Le Tout",
    '14': "L'Effet H.Casimir",
    '15': "L'Intrication Quantique",
    '16': "Aléa Du Mi-Clos",
    '17': "Le Corps De L'Esprit De L'Âme"
  },
  archetype: {
    '02': "Vice-Versa",
    '03': "Equilibrium",
    '04': "Double Pression - Effet De Mouvement De Rotation Central",
    '05': "L'Infini",
    '06': "Retrait - Collection Privée",
    '07': "Mutation De La Pensée Globale",
    '08': "Brisure De Symétrie",
    '09': "Outreconscience"
  },
  deploiement: {
    '00': "Concordance Universelle - 2022",
    '01': "L'Extension De La Pensée, L.28P - Saint Anastase - Paris",
    '02': "Le Portant \"524C\" - Espace Commines - Paris",
    '03': "Mutation De La Pensée Globale Et La Projection De La Protection - PYO Gallery LA - Los Angeles",
    '04': "L'Equilibre Du Présent - Collection Privée",
    '05': "Intéraction Quantique - Galerie Du Théatre De La Ville - Brive"
  },
  drawing: {
    '01': "Etudes Préparatoires I",
    '02': "Etude Préparatoire Sur L'Instantanéité",
    '03': "Etudes Préparatoires II",
    '04': "Etude Préparatoire Sur La Perception Des Interactions De L'infiniment Grand Et De L'Infiniment Petit",
    '05': "Etude Préparatoire De La Genèse De Pensée Du MétaHisme - Interaction Des Etats Superposés"
  }
};

async function syncDatabase() {
  try {
    console.log('Début de la synchronisation...\n');

    // Nettoyer la base de données
    await prisma.artwork.deleteMany();
    await prisma.category.deleteMany();
    console.log('Base de données nettoyée\n');

    let totalArtworks = 0;
    let totalImages = 0;

    // Pour chaque catégorie
    for (const [categoryName, folders] of Object.entries(imageStructure)) {
      console.log(`\n=== Traitement de la catégorie: ${categoryName} ===`);

      // Créer la catégorie dans la base de données
      const dbCategory = await prisma.category.create({
        data: {
          name: categoryName,
          path: `images/${categoryName}`
        }
      });

      // Pour chaque dossier d'œuvre
      for (const [folderId, imageCount] of Object.entries(folders)) {
        const title = titles[categoryName]?.[folderId];
        if (!title) {
          console.log(`! Pas de titre trouvé pour ${categoryName}/${folderId}`);
          continue;
        }

        const s3CategoryName = categoryMapping[categoryName];

        // Créer une entrée pour chaque image
        for (let i = 0; i < imageCount; i++) {
          const imageNum = String(i + 1).padStart(2, '0');
          const imageUrl = `${S3_BASE_URL}/${s3CategoryName}/${folderId}/${imageNum}.jpg`;
          const imageTitle = `${title} - Image ${i + 1}`;

          try {
            // Créer l'œuvre dans la base de données
            const artwork = await prisma.artwork.create({
              data: {
                title: imageTitle,
                categoryId: dbCategory.id,
                subcategory: folderId,
                folderPath: `${s3CategoryName}/${folderId}`,
                imageUrls: JSON.stringify([imageUrl])
              }
            });

            totalArtworks++;
            totalImages++;

            console.log(`✓ Importé: ${categoryName}/${folderId}/${imageNum}.jpg`);
            console.log(`  Titre: ${artwork.title}`);
            console.log(`  URL: ${imageUrl}`);
          } catch (error) {
            console.error(`✗ Erreur lors de l'importation de ${categoryName}/${folderId}/${imageNum}.jpg:`, error);
          }
        }
      }
    }

    console.log('\nRésumé de la synchronisation:');
    console.log(`- Total des œuvres importées: ${totalArtworks}`);
    console.log(`- Total des images: ${totalImages}`);

    // Vérification finale
    const artworkCount = await prisma.artwork.count();
    const categoryCount = await prisma.category.count();
    console.log('\nVérification de la base de données:');
    console.log(`- Nombre de catégories: ${categoryCount}`);
    console.log(`- Nombre d'entrées: ${artworkCount}`);

    // Afficher quelques exemples d'URLs pour vérification
    const sampleArtworks = await prisma.artwork.findMany({
      take: 5,
      include: {
        category: true
      }
    });

    console.log('\nExemples d\'URLs d\'images:');
    sampleArtworks.forEach(artwork => {
      console.log(`- ${artwork.title}:`);
      console.log(`  ${artwork.imageUrls}`);
    });

  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Lancer la synchronisation
syncDatabase().catch(console.error); 