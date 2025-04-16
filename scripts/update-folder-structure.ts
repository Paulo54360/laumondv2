import { promises as fs } from 'fs';
import { join } from 'path';

// Structure des dossiers principaux
const folders = [
  '00',
  '01', '02', '03', '04', '05',  // deploiement
  '06', '07', '08', '09', '10',  // transcriptions début
  '11', '12', '13', '14', '15',
  '16', '17', '18', '19', '20',
  '21', '22',                    // transcriptions fin
  '23', '24', '25', '26', '27',  // archetype
  '28', '29', '30',              // drawing
];

// Titres pour chaque dossier
const titles: Record<string, string> = {
  '00': "Concordance Universelle - 2022",
  '01': "L'Extension De La Pensée, L.28P  - Saint Anastase - Paris",
  '02': "Le Portant \"524C\" - Espace Commines - Paris",
  '03': "Mutation De La Pensée Globale Et La Projection De La Protection - PYO Gallery LA - Los Angeles",
  '04': "L'Equilibre Du Présent - Collection Privée",
  '05': "Intéraction Quantique - Galerie Du Théatre De La Ville - Brive",
  // Transcriptions
  '06': "L'Œuvre De Damoclès Et L'Energie Quantique De La Pensée",
  '07': "L'Ascension Potentielle",
  '08': "Les Cinq Points Cardinaux - Quinta Essentia",
  '09': "L'Interdépendance Universelle",
  '10': "La Puissance De La Résistance",
  '11': "Le Grand Saut",
  '12': "L'Aube Du Soulèvement De L'Invisible",
  '13': "L'Energie Du Vide",
  '14': "Le Mythe De Pandore",
  '15': "Le Détachement De Soi",
  '16': "Hors Du Dedans",
  '17': "L'Inextricable Enchevêtrement Du Réel",
  '18': "Le Tout",
  '19': "L'Effet H.Casimir",
  '20': "L'Intrication Quantique",
  '21': "Aléa Du Mi-Clos",
  '22': "Le Corps De L'Esprit De L'Âme",
  // Archetype
  '23': "Vice-Versa",
  '24': "Equilibrium",
  '25': "Double Pression - Effet De Mouvement De Rotation Central",
  '26': "L'Infini",
  '27': "Retrait - Collection Privée",
  // Drawing
  '28': "Etudes Préparatoires",
  '29': "Etude Préparatoire Sur L'Instantanéité",
  '30': "Etude Préparatoire De La Genèse De Pensée Du MétaHisme - Interaction Des Etats Superposés"
};

async function updateFolderStructure() {
  const baseDir = join(process.cwd(), 'public', 'images');
  let createdCount = 0;
  let errorCount = 0;

  // Créer le dossier de base s'il n'existe pas
  await fs.mkdir(baseDir, { recursive: true });

  for (const folder of folders) {
    const folderPath = join(baseDir, folder);
    const txtFile = join(folderPath, `description.txt`);

    try {
      // Créer le dossier
      await fs.mkdir(folderPath, { recursive: true });

      // Créer le fichier description.txt avec le titre
      if (titles[folder]) {
        await fs.writeFile(txtFile, titles[folder]);
        console.log(`✓ Créé: ${folder}/description.txt`);
        createdCount++;
      } else {
        console.log(`! Pas de titre pour le dossier ${folder}`);
      }
    } catch (error) {
      console.error(`✗ Erreur pour ${folder}:`, error);
      errorCount++;
    }
  }

  console.log(`\nRésumé:`);
  console.log(`- Dossiers créés: ${createdCount}`);
  console.log(`- Erreurs: ${errorCount}`);
}

updateFolderStructure().catch(console.error); 