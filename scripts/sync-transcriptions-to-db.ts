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
      console.error(`⚠️  Erreur lors de la lecture de ${key}:`, errorMsg.substring(0, 100));
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
    } else {
      console.error(`❌ Erreur lors de la liste de ${folderPath}:`, errorMsg.substring(0, 100));
    }
    return [];
  }
}

async function syncTranscriptions() {
  console.log('🔄 Synchronisation des Transcriptions vers Supabase\n');

  // 1. Trouver la catégorie "Transcriptions"
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, name, path')
    .ilike('name', '%transcriptions%')
    .limit(1);

  if (catError || !categories || categories.length === 0) {
    console.error('❌ Catégorie "Transcriptions" non trouvée dans Supabase');
    console.error("   Créez d'abord la catégorie dans Supabase");
    return;
  }

  const category = categories[0];
  console.log(
    `✅ Catégorie trouvée: ${category.name} (ID: ${category.id}, path: ${category.path})`
  );

  // 2. Lister tous les sous-dossiers de Transcriptions
  const files = listS3Files('Transcriptions');
  const subfolders = new Set<string>();

  files.forEach((line) => {
    const match = line.match(/Transcriptions\/(\d+)\//);
    if (match) {
      subfolders.add(match[1].padStart(2, '0'));
    }
  });

  console.log(`\n📁 Sous-dossiers trouvés: ${Array.from(subfolders).sort().join(', ')}\n`);

  // 3. Pour chaque sous-dossier, lire les fichiers .txt et créer/update les œuvres
  let added = 0;
  let updated = 0;
  let skipped = 0;

  for (const subfolder of Array.from(subfolders).sort()) {
    console.log(`\n📂 Traitement de Transcriptions/${subfolder}...`);

    // Lister les fichiers .txt dans ce sous-dossier
    const txtFiles: { number: string; title: string }[] = [];

    for (let i = 1; i <= 20; i++) {
      const num = i.toString().padStart(2, '0');
      const txtPath = `Transcriptions/${subfolder}/${num}.txt`;
      const title = readS3File(txtPath);

      if (title && title.trim()) {
        txtFiles.push({ number: num, title: title.trim() });
      }
    }

    console.log(`   ${txtFiles.length} titre(s) trouvé(s)`);

    // Pour chaque titre, vérifier s'il existe dans Supabase
    for (const { number, title } of txtFiles) {
      const folderPath = `Transcriptions/${subfolder}`;
      const imageUrl = `${S3_BASE_URL}/${folderPath}/${number}.jpg`;

      // Vérifier si l'œuvre existe déjà
      const { data: existing, error: searchError } = await supabase
        .from('artworks')
        .select('id, title, image_urls')
        .eq('category_id', category.id)
        .eq('folder_path', folderPath)
        .eq('subcategory', subfolder)
        .limit(1);

      if (searchError) {
        console.error(`   ❌ Erreur lors de la recherche:`, searchError);
        skipped++;
        continue;
      }

      // Vérifier si une œuvre avec le même titre existe déjà dans cette catégorie
      const { data: byTitle, error: titleError } = await supabase
        .from('artworks')
        .select('id')
        .eq('category_id', category.id)
        .eq('title', title)
        .limit(1);

      if (titleError) {
        console.error(`   ❌ Erreur lors de la recherche par titre:`, titleError);
        skipped++;
        continue;
      }

      if (existing && existing.length > 0) {
        // L'œuvre existe déjà, vérifier si le titre a changé
        const artwork = existing[0];
        if (artwork.title !== title) {
          // Mettre à jour le titre
          const { error: updateError } = await supabase
            .from('artworks')
            .update({ title, updated_at: new Date().toISOString() })
            .eq('id', artwork.id);

          if (updateError) {
            console.error(
              `   ⚠️  Erreur lors de la mise à jour de "${title}":`,
              updateError.message
            );
            skipped++;
          } else {
            console.log(`   ✅ Mis à jour: "${title}" (ID: ${artwork.id})`);
            updated++;
          }
        } else {
          skipped++;
        }
      } else if (byTitle && byTitle.length > 0) {
        // Une œuvre avec le même titre existe déjà, skip
        skipped++;
      } else {
        // Créer une nouvelle œuvre
        // Construire l'image_urls
        const imageUrls = [imageUrl];

        const { data: newArtwork, error: insertError } = await supabase
          .from('artworks')
          .insert({
            title,
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
            let uniqueTitle = `${title} (${suffix})`;
            let success = false;

            while (!success && suffix < 10) {
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
                console.log(`   ✅ Ajouté: "${uniqueTitle}" (ID: ${retryArtwork.id})`);
                added++;
                success = true;
              } else {
                suffix++;
                uniqueTitle = `${title} (${suffix})`;
              }
            }

            if (!success) {
              console.error(`   ❌ Impossible d'ajouter "${title}" (conflit de titre)`);
              skipped++;
            }
          } else {
            console.error(`   ❌ Erreur lors de l'ajout de "${title}":`, insertError.message);
            skipped++;
          }
        } else if (newArtwork) {
          console.log(`   ✅ Ajouté: "${title}" (ID: ${newArtwork.id})`);
          added++;
        }
      }
    }
  }

  console.log(`\n\n📊 Résumé:`);
  console.log(`   ✅ Ajouté: ${added}`);
  console.log(`   🔄 Mis à jour: ${updated}`);
  console.log(`   ⏭️  Ignoré: ${skipped}`);
  console.log(`   📦 Total traité: ${added + updated + skipped}`);
}

syncTranscriptions().catch(console.error);
