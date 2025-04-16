import { promises as fs } from 'fs';
import { join } from 'path';

// Structure des dossiers par catégorie avec leurs sous-dossiers
const structure = {
  transcriptions: {
    '01': ['01', '02', '03', '04', '05'],
    '02': ['01', '02', '03', '04'],
    '03': ['01', '02', '03', '04', '05'],
    '04': ['01', '02', '03', '04'],
    '05': ['01', '02', '03', '04', '05'],
    '06': ['01', '02', '03', '04'],
    '07': ['01', '02', '03', '04', '05'],
    '08': ['01', '02', '03', '04'],
    '09': ['01', '02', '03', '04', '05'],
    '10': ['01', '02', '03', '04'],
    '11': ['01', '02', '03', '04', '05'],
    '12': ['01', '02', '03', '04'],
    '13': ['01', '02', '03', '04', '05'],
    '14': ['01', '02', '03', '04'],
    '15': ['01', '02', '03', '04', '05'],
    '16': ['01', '02', '03', '04'],
    '17': ['01', '02', '03', '04', '05']
  },
  archetype: {
    '02': ['01', '02', '03', '04'],
    '03': ['01', '02', '03', '04', '05'],
    '04': ['01', '02', '03', '04'],
    '05': ['01', '02', '03', '04', '05'],
    '06': ['01', '02', '03', '04'],
    '07': ['01', '02', '03', '04', '05'],
    '08': ['01', '02', '03', '04'],
    '09': ['01', '02', '03', '04', '05']
  },
  deploiement: {
    '00': ['01', '02', '03', '04', '05'],
    '01': ['01', '02', '03', '04'],
    '02': ['01', '02', '03', '04', '05'],
    '03': ['01', '02', '03', '04'],
    '04': ['01', '02', '03', '04', '05'],
    '05': ['01', '02', '03', '04']
  },
  drawing: {
    '01': ['01', '02', '03', '04', '05'],
    '02': ['01', '02', '03', '04'],
    '03': ['01', '02', '03', '04', '05'],
    '04': ['01', '02', '03', '04'],
    '05': ['01', '02', '03', '04', '05']
  }
};

// Titres exacts pour chaque catégorie
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
    '01': "Etudes Préparatoires",
    '02': "Etude Préparatoire Sur L'Instantanéité",
    '03': "Etudes Préparatoires",
    '04': "Etude Préparatoire Sur La Perception Des Interactions De L'infiniment Grand Et De L'Infiniment Petit",
    '05': "Etude Préparatoire De La Genèse De Pensée Du MétaHisme - Interaction Des Etats Superposés"
  }
};

async function createArtworkStructure() {
  const baseDir = join(process.cwd(), 'public', 'images');
  let createdCount = 0;
  let errorCount = 0;

  // Créer le dossier de base s'il n'existe pas
  await fs.mkdir(baseDir, { recursive: true });

  for (const [category, folders] of Object.entries(structure)) {
    console.log(`\nCréation de la catégorie: ${category}`);
    
    const categoryPath = join(baseDir, category);
    await fs.mkdir(categoryPath, { recursive: true });

    const categoryTitles = titles[category];
    if (!categoryTitles) {
      console.log(`! Pas de titres trouvés pour la catégorie ${category}`);
      continue;
    }

    for (const [folder, subfolders] of Object.entries(folders)) {
      const folderPath = join(categoryPath, folder);
      const txtFile = join(folderPath, 'description.txt');

      try {
        // Créer le dossier principal
        await fs.mkdir(folderPath, { recursive: true });

        // Créer le fichier description.txt avec le titre
        const title = categoryTitles[folder];
        if (title) {
          await fs.writeFile(txtFile, title);
          console.log(`✓ Créé: ${category}/${folder}`);
          createdCount++;

          // Créer les sous-dossiers
          for (const subfolder of subfolders) {
            const subfolderPath = join(folderPath, subfolder);
            await fs.mkdir(subfolderPath, { recursive: true });
            
            // Créer un fichier description.txt vide dans chaque sous-dossier
            const subTxtFile = join(subfolderPath, 'description.txt');
            await fs.writeFile(subTxtFile, '');
            
            console.log(`  ✓ Créé sous-dossier: ${category}/${folder}/${subfolder}`);
            createdCount++;
          }
        } else {
          console.log(`! Pas de titre pour ${category}/${folder}`);
        }
      } catch (error) {
        console.error(`✗ Erreur pour ${category}/${folder}:`, error);
        errorCount++;
      }
    }
  }

  console.log(`\nRésumé:`);
  console.log(`- Dossiers et sous-dossiers créés: ${createdCount}`);
  console.log(`- Erreurs: ${errorCount}`);
}

createArtworkStructure().catch(console.error); 