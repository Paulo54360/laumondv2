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
    const output = execSync(`aws s3 cp s3://plaumondpicture/${key} - 2>&1`, {
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
    const output = execSync(`aws s3 ls s3://plaumondpicture/${folderPath}/ --recursive 2>&1`, {
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

  // 1. Trouver la catégorie dans Supabase
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, name, path')
    .ilike('name', `%${config.categoryName}%`)
    .limit(1);

  if (catError || !categories || categories.length === 0) {
    console.error(`❌ Catégorie "${config.categoryName}" non trouvée dans Supabase`);
    console.error(`   Créez d'abord la catégorie dans Supabase`);
    return { added: 0, updated: 0, skipped: 0 };
  }

  const category = categories[0];
  console.log(`✅ Catégorie trouvée: ${category.name} (ID: ${category.id})\n`);

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
      const { data: existing, error: searchError } = await supabase
        .from('artworks')
        .select('id, title, image_urls')
        .eq('category_id', category.id)
        .eq('folder_path', folderPath)
        .eq('subcategory', subfolder)
        .limit(10);

      if (searchError) {
        console.error(`     ❌ Erreur lors de la recherche:`, searchError.message);
        skipped++;
        continue;
      }

      // Chercher si une œuvre avec le même chemin exact existe
      const artworkToUpdate = existing?.find((art) => {
        try {
          const urls =
            typeof art.image_urls === 'string' ? JSON.parse(art.image_urls) : art.image_urls || [];
          return urls.some((url: string) => url.includes(`/${num}.jpg`));
        } catch {
          return false;
        }
      });

      if (artworkToUpdate) {
        // L'œuvre existe, mettre à jour si nécessaire
        if (artworkToUpdate.title !== cleanTitle) {
          const { error: updateError } = await supabase
            .from('artworks')
            .update({
              title: cleanTitle,
              image_urls: JSON.stringify(imageUrls),
              updated_at: new Date().toISOString(),
            })
            .eq('id', artworkToUpdate.id);

          if (updateError) {
            console.error(`     ⚠️  Erreur mise à jour "${cleanTitle}":`, updateError.message);
            skipped++;
          } else {
            updated++;
            if (updated % 10 === 0) console.log(`     ✅ ${updated} mis à jour...`);
          }
        } else {
          skipped++;
        }
      } else {
        // Vérifier si une œuvre avec le même titre existe déjà
        const { data: byTitle, error: titleError } = await supabase
          .from('artworks')
          .select('id')
          .eq('category_id', category.id)
          .eq('title', cleanTitle)
          .limit(1);

        if (titleError) {
          console.error(`     ❌ Erreur recherche par titre:`, titleError.message);
          skipped++;
          continue;
        }

        if (byTitle && byTitle.length > 0) {
          // Déjà existant avec ce titre
          skipped++;
        } else {
          // Créer une nouvelle œuvre
          const { data: newArtwork, error: insertError } = await supabase
            .from('artworks')
            .insert({
              title: cleanTitle,
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
            // Si erreur de contrainte unique, essayer avec un suffixe
            if (insertError.code === '23505') {
              let suffix = 2;
              let uniqueTitle = `${cleanTitle} (${suffix})`;
              let success = false;

              while (!success && suffix < 20) {
                const { data: retryArtwork, error: retryError } = await supabase
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

                if (!retryError && retryArtwork) {
                  added++;
                  success = true;
                  if (added % 10 === 0) console.log(`     ✅ ${added} ajouté...`);
                } else {
                  suffix++;
                  uniqueTitle = `${cleanTitle} (${suffix})`;
                }
              }

              if (!success) {
                skipped++;
              }
            } else {
              console.error(`     ❌ Erreur ajout "${cleanTitle}":`, insertError.message);
              skipped++;
            }
          } else if (newArtwork) {
            added++;
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
      categoryName: 'Archétype',
      subfolders: [], // À compléter
      fileRanges: [],
    },
    {
      s3Path: 'Deployments',
      categoryName: 'Déploiement',
      subfolders: [], // À compléter
      fileRanges: [],
    },
    {
      s3Path: 'Drawings+',
      categoryName: 'Dessin',
      subfolders: [], // À compléter
      fileRanges: [],
    },
  ];

  // Détecter automatiquement les sous-dossiers pour chaque catégorie
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
