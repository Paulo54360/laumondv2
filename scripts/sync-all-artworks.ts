import { execSync } from 'child_process';

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const S3_BASE_URL = 'https://plaumondpicture.s3.eu-west-3.amazonaws.com';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variables d'environnement Supabase manquantes");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Lit le contenu d'un fichier .txt depuis S3
 */
function readS3File(key: string): string {
  try {
    const output = execSync(`aws s3 cp "s3://plaumondpicture/${key}" - 2>&1`, {
      encoding: 'utf-8',
      stdio: 'pipe',
    });
    return output.trim();
  } catch (error: any) {
    const errorMsg = error.stderr || error.stdout || error.message || '';
    if (!errorMsg.includes('AuthorizationHeaderMalformed') && !errorMsg.includes('NoSuchKey')) {
      // Ignorer silencieusement les fichiers manquants
    }
    return '';
  }
}

/**
 * Liste les fichiers dans un dossier S3
 */
function listS3Files(folderPath: string): string[] {
  try {
    const output = execSync(`aws s3 ls "s3://plaumondpicture/${folderPath}/" --recursive 2>&1`, {
      encoding: 'utf-8',
      stdio: 'pipe',
    });
    return output.split('\n').filter((line) => line.trim());
  } catch (error: any) {
    const errorMsg = error.stderr || error.stdout || error.message || '';
    if (
      errorMsg.includes('Unable to locate credentials') ||
      errorMsg.includes('AuthorizationHeaderMalformed')
    ) {
      console.error(`❌ Erreur AWS: Les credentials AWS ne sont pas configurés.`);
      console.error(`   Configurez AWS CLI avec: aws configure`);
      throw error;
    }
    return [];
  }
}

interface CategoryConfig {
  s3Path: string;
  categoryName: string;
  subfolders: string[];
  fileRanges: number[][]; // [min, max] pour chaque sous-dossier
}

async function syncCategory(config: CategoryConfig) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📂 Catégorie: ${config.categoryName}`);
  console.log(`${'='.repeat(60)}\n`);

  // 1. Trouver ou créer la catégorie dans Supabase
  let { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, name, path')
    .ilike('name', `%${config.categoryName}%`)
    .limit(1);

  let category: { id: number; name: string; path: string };

  if (catError || !categories || categories.length === 0) {
    console.log(`⚠️ Catégorie "${config.categoryName}" non trouvée, création...`);
    
    // Créer la catégorie
    const { data: newCat, error: createError } = await supabase
      .from('categories')
      .insert({
        name: config.categoryName,
        path: config.s3Path,
      })
      .select('id, name, path')
      .single();

    if (createError || !newCat) {
      console.error(`❌ Erreur lors de la création de la catégorie "${config.categoryName}":`, createError?.message);
      return { added: 0, updated: 0, skipped: 0 };
    }

    category = newCat;
    console.log(`✅ Catégorie créée: ${category.name} (ID: ${category.id})\n`);
  } else {
    category = categories[0];
    console.log(`✅ Catégorie trouvée: ${category.name} (ID: ${category.id})\n`);
  }

  let added = 0;
  let updated = 0;
  let skipped = 0;

  // 2. Pour chaque sous-dossier
  for (let i = 0; i < config.subfolders.length; i++) {
    const subfolder = config.subfolders[i];
    const [minFile, maxFile] = config.fileRanges[i] || [1, 10];

    console.log(`  📁 ${config.s3Path}/${subfolder} (images ${minFile}-${maxFile})...`);

    // 3. Pour chaque fichier dans la plage
    for (let fileNum = minFile; fileNum <= maxFile; fileNum++) {
      const num = fileNum.toString().padStart(2, '0');
      const txtPath = `${config.s3Path}/${subfolder}/${num}.txt`;
      const title = readS3File(txtPath);

      if (!title || !title.trim()) {
        continue; // Pas de fichier .txt, skip
      }

      const cleanTitle = title.trim();
      const folderPath = `${config.s3Path}/${subfolder}`;
      const imageUrl = `${S3_BASE_URL}/${folderPath}/${num}.jpg`;
      const imageUrls = [imageUrl];

      // 4. Vérifier si l'œuvre existe déjà (par folder_path + numéro)
      // 4. Vérifier si l'œuvre existe déjà (par image_url spécifique)
      // Cette méthode est plus robuste que la recherche par dossier qui peut échouer si la limite est atteinte
      const { data: existing, error: searchError } = await supabase
        .from('artworks')
        .select('id, title, image_urls')
        .eq('category_id', category.id)
        .ilike('image_urls', `%/${num}.jpg%`)
        .limit(1);

      if (searchError) {
        console.error(`     ❌ Erreur lors de la recherche:`, searchError.message);
        skipped++;
        continue;
      }

      // Comme la recherche DB est spécifique, on prend le premier résultat
      const artworkToUpdate = existing && existing.length > 0 ? existing[0] : null;

      if (artworkToUpdate) {
        // L'œuvre existe, mettre à jour si nécessaire
        if (artworkToUpdate.title !== cleanTitle) {
          
          // Essayer de mettre à jour avec gestion des doublons
          let suffix = 1;
          let uniqueTitle = cleanTitle;
          let success = false;
          let retryCount = 0;

          while (!success && retryCount < 10) {
             const { error: updateError } = await supabase
              .from('artworks')
              .update({
                title: uniqueTitle,
                image_urls: JSON.stringify(imageUrls),
                updated_at: new Date().toISOString(),
              })
              .eq('id', artworkToUpdate.id);

            if (updateError) {
              if (updateError.code === '23505') { // Unique violation
                retryCount++;
                suffix++;
                uniqueTitle = `${cleanTitle} (${suffix})`;
              } else {
                console.error(`     ⚠️  Erreur mise à jour "${cleanTitle}":`, updateError.message);
                skipped++;
                break; // Erreur non gérée
              }
            } else {
               updated++;
               success = true;
               if (updated % 10 === 0) console.log(`     ✅ ${updated} mis à jour...`);
            }
          }
           
           if (!success && retryCount >= 10) {
             console.error(`     ⚠️  Impossible de mettre à jour "${cleanTitle}" après plusieurs tentatives (doublons)`);
             skipped++;
           }

        } else {
          skipped++;
        }
      } else {
        // Vérifier si une œuvre avec le même titre existe déjà (pour éviter les doublons à la création)
        // ... Logique existante simplifiée pour création ...
        
        let suffix = 0;
        let uniqueTitle = cleanTitle;
        let success = false;
        let retryCount = 0;

        while (!success && retryCount < 20) {
           // On construit le titre unique si besoin
           if (suffix > 0) uniqueTitle = `${cleanTitle} (${suffix})`;
           
           const { data: newArtwork, error: insertError } = await supabase
            .from('artworks')
            .insert({
              title: uniqueTitle,
              category_id: category.id,
              folder_path: folderPath,
              subcategory: subfolder,
              image_urls: JSON.stringify(imageUrls),
              description: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select('id')
            .single();

           if (insertError) {
             if (insertError.code === '23505') {
               suffix = suffix === 0 ? 2 : suffix + 1;
               retryCount++;
             } else {
               console.error(`     ❌ Erreur ajout "${uniqueTitle}":`, insertError.message);
               skipped++;
               break; 
             }
           } else if (newArtwork) {
             added++;
             success = true;
             if (added % 10 === 0) console.log(`     ✅ ${added} ajouté...`);
           }
        }
      }
    }
  }

  return { added, updated, skipped };
}

async function syncAllArtworks() {
  console.log('🔄 Synchronisation complète S3 → Supabase\n');

  // Configuration des catégories basée sur pages/transcriptions.vue, etc.
  const categories: CategoryConfig[] = [
    {
      s3Path: 'Transcriptions',
      categoryName: 'Transcriptions',
      subfolders: [
        '17',
        '16',
        '15',
        '14',
        '13',
        '12',
        '11',
        '10',
        '09',
        '08',
        '07',
        '06',
        '05',
        '04',
        '03',
        '02',
        '01',
      ],
      fileRanges: [
        [1, 4], // 17
        [1, 9],
        [1, 9],
        [1, 9],
        [1, 9],
        [1, 9], // 13-16
        [1, 9],
        [1, 9],
        [1, 9],
        [1, 9],
        [1, 9], // 09-12
        [1, 8],
        [1, 9],
        [1, 9],
        [1, 9],
        [1, 9], // 05-08
        [1, 9],
        [1, 9],
        [1, 9], // 02-04
        [1, 9], // 01
      ],
    },
    {
      s3Path: 'Archetypes',
      categoryName: 'Archetypes',
      subfolders: ['09', '08', '07', '06', '05', '04', '03', '02'],
      fileRanges: [
        [1, 12],
        [1, 4],
        [1, 8],
        [1, 8],
        [1, 7],
        [1, 7],
        [1, 9],
        [1, 10],
      ],
    },
    {
      s3Path: 'Deployments',
      categoryName: 'Deployments',
      subfolders: ['05', '04', '03', '02', '01', '00'],
      fileRanges: [
        [1, 4],
        [1, 2],
        [1, 6],
        [1, 3],
        [1, 4],
        [1, 7],
      ],
    },
    {
      s3Path: 'Drawings+',
      categoryName: 'Drawings+',
      subfolders: ['05', '04', '03', '02', '01'],
      fileRanges: [
        [1, 8],
        [1, 9],
        [1, 9],
        [1, 9],
        [1, 9],
      ],
    },
  ];

  // Détecter automatiquement les sous-dossiers pour chaque catégorie (si non configuré)
  for (const category of categories) {
    if (category.subfolders.length === 0) {
      console.log(`\n🔍 Détection automatique des sous-dossiers pour ${category.s3Path}...`);
      const files = listS3Files(category.s3Path);
      const subfolders = new Set<string>();

      files.forEach((line) => {
        const match = line.match(new RegExp(`${category.s3Path}/(\\d+)/`));
        if (match) {
          subfolders.add(match[1].padStart(2, '0'));
        }
      });

      category.subfolders = Array.from(subfolders).sort().reverse();

      // Détecter automatiquement les plages de fichiers
      category.fileRanges = category.subfolders.map((subfolder) => {
        let maxFile = 1;
        for (let i = 1; i <= 20; i++) {
          const num = i.toString().padStart(2, '0');
          const txtPath = `${category.s3Path}/${subfolder}/${num}.txt`;
          const title = readS3File(txtPath);
          if (title && title.trim()) {
            maxFile = i;
          }
        }
        return [1, maxFile];
      });

      console.log(`   ✅ ${category.subfolders.length} sous-dossier(s) trouvé(s)`);
    }
  }

  // Synchroniser chaque catégorie
  let totalAdded = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;

  for (const category of categories) {
    if (category.subfolders.length === 0) {
      console.log(`\n⏭️  ${category.s3Path}: Aucun sous-dossier trouvé, ignoré`);
      continue;
    }

    const result = await syncCategory(category);
    totalAdded += result.added;
    totalUpdated += result.updated;
    totalSkipped += result.skipped;
  }

  // Résumé final
  console.log(`\n\n${'='.repeat(60)}`);
  console.log('📊 RÉSUMÉ GLOBAL');
  console.log(`${'='.repeat(60)}`);
  console.log(`   ✅ Ajouté: ${totalAdded}`);
  console.log(`   🔄 Mis à jour: ${totalUpdated}`);
  console.log(`   ⏭️  Ignoré: ${totalSkipped}`);
  console.log(`   📦 Total traité: ${totalAdded + totalUpdated + totalSkipped}`);
  console.log(`${'='.repeat(60)}\n`);
}

syncAllArtworks().catch(console.error);
