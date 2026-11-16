import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const S3_BASE_URL = 'https://plaumondpicture.s3.eu-west-3.amazonaws.com';

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variables d'environnement Supabase manquantes");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function extractS3Key(urlOrPath: string): string {
  let cleaned = urlOrPath.trim();
  if (cleaned.startsWith(S3_BASE_URL)) {
    cleaned = cleaned.replace(S3_BASE_URL, '');
  }
  return decodeURIComponent(cleaned.replace(/^\/+/, ''));
}

async function runAudit() {
  console.log('🔍 Début de l’audit croisé Supabase vs S3...\n');

  // 1. Récupération de tous les objets S3
  console.log('📦 Énumération des fichiers S3...');
  const rawS3Output = execSync(`aws s3 ls "s3://plaumondpicture/" --recursive`, {
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024,
  });

  const s3Objects = new Map<string, { size: number; date: string }>();
  const s3AllKeys = new Set<string>();

  for (const line of rawS3Output.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Format: 2023-05-22 10:32:28     214198 Archetypes/02/01.jpg
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 4) {
      const date = `${parts[0]} ${parts[1]}`;
      const size = parseInt(parts[2], 10);
      const key = parts.slice(3).join(' ');
      s3Objects.set(key, { size, date });
      s3AllKeys.add(key);
    }
  }

  console.log(`✅ ${s3AllKeys.size} objets trouvés dans le bucket S3.\n`);

  // 2. Récupération des données Supabase
  console.log('🗄️  Récupération des œuvres dans Supabase...');
  const { data: artworks, error: artworksError } = await supabase
    .from('artworks')
    .select('id, title, title_en, image_urls, folder_path, category_id, subcategory, deleted_at')
    .is('deleted_at', null);

  if (artworksError || !artworks) {
    console.error('❌ Erreur Supabase:', artworksError);
    process.exit(1);
  }

  const { data: categories } = await supabase.from('categories').select('id, name, path');
  const catMap = new Map<number, string>();
  categories?.forEach((c) => catMap.set(c.id, `${c.name} (${c.path})`));

  console.log(`✅ ${artworks.length} œuvres actives récupérées dans Supabase.\n`);

  // 3. Analyse croisée BDD -> S3
  const referencedKeys = new Set<string>();
  const missingImages: Array<{
    artworkId: number;
    title: string;
    expectedKey: string;
    source: string;
  }> = [];

  const artworksWithoutAnyImages: Array<{ id: number; title: string }> = [];

  for (const art of artworks) {
    let images: string[] = [];
    if (Array.isArray(art.image_urls)) {
      images = art.image_urls;
    } else if (typeof art.image_urls === 'string') {
      try {
        const parsed = JSON.parse(art.image_urls);
        if (Array.isArray(parsed)) images = parsed;
      } catch {
        if (art.image_urls.trim()) images = [art.image_urls.trim()];
      }
    }

    // Si aucune image dans image_urls, tester le fallback folder_path/01.jpg
    if (images.length === 0 && art.folder_path) {
      images = [`${art.folder_path}/01.jpg`];
    }

    if (images.length === 0) {
      artworksWithoutAnyImages.push({ id: art.id, title: art.title || 'Sans titre' });
      continue;
    }

    let foundAtLeastOne = false;
    for (const img of images) {
      const key = extractS3Key(img);
      referencedKeys.add(key);

      if (s3AllKeys.has(key)) {
        foundAtLeastOne = true;
      } else {
        missingImages.push({
          artworkId: art.id,
          title: art.title || 'Sans titre',
          expectedKey: key,
          source: img,
        });
      }
    }

    // Référencer aussi le .txt éventuel pour l'analyse des orphelins
    if (art.folder_path) {
      referencedKeys.add(`${art.folder_path}/01.txt`);
    }
  }

  // 4. Analyse S3 -> BDD (Fichiers Orphelins)
  const orphanFiles: Array<{ key: string; size: number }> = [];
  const systemFiles: string[] = [];
  const txtFiles: string[] = [];

  for (const [key, meta] of s3Objects.entries()) {
    if (key.endsWith('.DS_Store') || key.includes('__MACOSX')) {
      systemFiles.push(key);
      continue;
    }
    if (key.endsWith('.txt')) {
      txtFiles.push(key);
      continue;
    }
    if (!referencedKeys.has(key)) {
      orphanFiles.push({ key, size: meta.size });
    }
  }

  // 5. Répartition par dossiers actuels sur S3
  const prefixesSummary: Record<string, number> = {};
  for (const key of s3AllKeys) {
    const root = key.split('/')[0] || 'root';
    prefixesSummary[root] = (prefixesSummary[root] || 0) + 1;
  }

  // 6. Affichage du Rapport
  console.log('====================================================');
  console.log('📊 RAPPORT DE L’AUDIT BDD (SUPABASE) vs S3');
  console.log('====================================================\n');

  console.log(`📁 Répartition des fichiers dans S3 par dossier racine :`);
  for (const [prefix, count] of Object.entries(prefixesSummary)) {
    console.log(`   - "${prefix}" : ${count} fichiers`);
  }
  console.log('');

  console.log(`🚨 IMAGES MANQUANTES OU HALLUCINÉES (404 en base) : ${missingImages.length}`);
  if (missingImages.length === 0) {
    console.log('   ✅ Aucune image manquante ! Toutes les images déclarées existent sur S3.');
  } else {
    for (const m of missingImages.slice(0, 15)) {
      console.log(`   ❌ [Oeuvre #${m.artworkId} - "${m.title}"] -> Manquante : "${m.expectedKey}"`);
    }
    if (missingImages.length > 15) {
      console.log(`   ... et ${missingImages.length - 15} autres images manquantes.`);
    }
  }
  console.log('');

  console.log(`⚠️ ŒUVRES SANS AUCUNE IMAGE RÉFÉRENCÉE : ${artworksWithoutAnyImages.length}`);
  if (artworksWithoutAnyImages.length > 0) {
    for (const a of artworksWithoutAnyImages) {
      console.log(`   - Œuvre #${a.id} : "${a.title}"`);
    }
  }
  console.log('');

  console.log(`🗑️ FICHIERS SYSTÈME PARASITES (ex: .DS_Store) : ${systemFiles.length}`);
  for (const s of systemFiles) {
    console.log(`   - ${s}`);
  }
  console.log('');

  console.log(`📝 FICHIERS TEXTE (.txt) SUR S3 : ${txtFiles.length}`);
  console.log('');

  console.log(`👻 FICHIERS IMAGES ORPHELINS SUR S3 (Non reliés à la BDD) : ${orphanFiles.length}`);
  if (orphanFiles.length === 0) {
    console.log('   ✅ Aucun fichier image orphelin.');
  } else {
    for (const o of orphanFiles.slice(0, 20)) {
      console.log(`   - "${o.key}" (${Math.round(o.size / 1024)} Ko)`);
    }
    if (orphanFiles.length > 20) {
      console.log(`   ... et ${orphanFiles.length - 20} autres fichiers orphelins.`);
    }
  }
  console.log('\n====================================================');
}

runAudit().catch(console.error);
