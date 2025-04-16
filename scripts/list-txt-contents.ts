import { promises as fs } from 'fs';
import { join } from 'path';

// Structure des catégories et leurs sous-dossiers
const categories = {
  deploiement: ['00', '01', '02', '03', '04', '05'],
  transcriptions: Array.from({ length: 17 }, (_, i) => String(i + 1).padStart(2, '0')),
  archetype: Array.from({ length: 8 }, (_, i) => String(i + 2).padStart(2, '0')),
  drawing: Array.from({ length: 5 }, (_, i) => String(i + 1).padStart(2, '0'))
};

// Titres pour chaque catégorie et sous-dossier
const titles: Record<string, Record<string, string>> = {
  deploiement: {
    '00': "Concordance Universelle - 2022",
    '01': "L'Extension De La Pensée, L.28P  - Saint Anastase - Paris",
    '02': "Le Portant \"524C\" - Espace Commines - Paris",
    '03': "Mutation De La Pensée Globale Et La Projection De La Protection - PYO Gallery LA - Los Angeles",
    '04': "L'Equilibre Du Présent - Collection Privée",
    '05': "Intéraction Quantique - Galerie Du Théatre De La Ville - Brive"
  },
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
  drawing: {
    '01': "Etudes Préparatoires",
    '02': "Etude Préparatoire Sur L'Instantanéité",
    '03': "Etudes Préparatoires",
    '04': "Etude Préparatoire Sur La Perception Des Interactions De L'infiniment Grand Et De L'Infiniment Petit",
    '05': "Etude Préparatoire De La Genèse De Pensée Du MétaHisme - Interaction Des Etats Superposés"
  }
};

async function createStructureAndListContents() {
  const baseDir = join(process.cwd(), 'public', 'images');
  let createdCount = 0;
  let errorCount = 0;

  // Créer le dossier de base s'il n'existe pas
  await fs.mkdir(baseDir, { recursive: true });

  // Pour chaque catégorie
  for (const [category, folders] of Object.entries(categories)) {
    console.log(`\n=== ${category.toUpperCase()} ===`);
    const categoryPath = join(baseDir, category);
    await fs.mkdir(categoryPath, { recursive: true });

    // Pour chaque sous-dossier dans la catégorie
    for (const folder of folders) {
      const folderPath = join(categoryPath, folder);
      const txtFile = join(folderPath, 'description.txt');

      try {
        // Créer le sous-dossier
        await fs.mkdir(folderPath, { recursive: true });

        // Créer le fichier description.txt avec le titre
        if (titles[category]?.[folder]) {
          await fs.writeFile(txtFile, titles[category][folder]);
          console.log(`\n${category}/${folder}:`);
          console.log(`"${titles[category][folder]}"`);
          createdCount++;
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
  console.log(`- Fichiers créés: ${createdCount}`);
  console.log(`- Erreurs: ${errorCount}`);
}

createStructureAndListContents().catch(console.error); 