import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import sharp from 'sharp';
import { slugify } from '../server/utils/slugify';

config();

const S3_BUCKET = process.env.S3_BUCKET || 'plaumondpicture';
const S3_REGION = process.env.AWS_REGION || 'eu-west-3';
const S3_BASE_URL = 'https://plaumondpicture.s3.eu-west-3.amazonaws.com';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY!;

const s3 = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const supabase = createClient(supabaseUrl, supabaseKey);

function extractKeyFromUrl(urlOrPath: string): string {
  let cleaned = urlOrPath.trim();
  if (cleaned.startsWith(S3_BASE_URL)) {
    cleaned = cleaned.replace(S3_BASE_URL, '');
  }
  return decodeURIComponent(cleaned.replace(/^\/+/, ''));
}

async function getObjectBuffer(key: string): Promise<Buffer | null> {
  try {
    const res = await s3.send(
      new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      }),
      { abortSignal: AbortSignal.timeout(15000) }
    );
    if (!res.Body) return null;
    const bytes = await res.Body.transformToByteArray();
    return Buffer.from(bytes);
  } catch (err: any) {
    if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
      return null;
    }
    console.error(`⚠️ Erreur getObject sur ${key}:`, err.message);
    return null;
  }
}

export async function migrateArtwork(artwork: any, dryRun = false) {
  // Parser les URLs actuelles
  let oldUrls: string[] = [];
  if (Array.isArray(artwork.image_urls)) {
    oldUrls = artwork.image_urls;
  } else if (typeof artwork.image_urls === 'string') {
    try {
      const parsed = JSON.parse(artwork.image_urls);
      if (Array.isArray(parsed)) oldUrls = parsed;
    } catch {
      if (artwork.image_urls.trim()) oldUrls = [artwork.image_urls.trim()];
    }
  }

  if (oldUrls.length === 0 && artwork.folder_path) {
    oldUrls = [`${S3_BASE_URL}/${artwork.folder_path}/01.jpg`];
  }

  if (oldUrls.length === 0) {
    return;
  }

  // Si déjà migré en .webp
  const alreadyWebp = oldUrls.every((u) => u.endsWith('.webp'));
  if (alreadyWebp && artwork.folder_path && !artwork.folder_path.match(/\/\d{2}$/)) {
    console.log(`⏩ Déjà migré : Œuvre #${artwork.id} ("${artwork.title}")`);
    return;
  }

  const categoryPrefix = artwork.folder_path?.split('/')[0] || 'Archetypes';
  // Tronquer le slug à 40 caractères max pour respecter varchar(50) de subcategory
  const cleanSlug = slugify(artwork.title).slice(0, 40) || `art-${artwork.id}`;
  const targetFolder = `${categoryPrefix}/${cleanSlug}`;

  console.log(`\n🎨 Migration Œuvre #${artwork.id} : "${artwork.title}"`);
  console.log(`   📁 ${artwork.folder_path} -> ${targetFolder}`);

  const newUrls: string[] = [];

  for (let i = 0; i < oldUrls.length; i++) {
    const oldUrl = oldUrls[i];
    const oldKey = extractKeyFromUrl(oldUrl);
    const num = String(i + 1).padStart(2, '0');
    const targetKey = `${targetFolder}/${num}.webp`;
    const targetUrl = `${S3_BASE_URL}/${targetKey}`;

    if (dryRun) {
      console.log(`   [DRYRUN] ${oldKey} -> ${targetKey}`);
      newUrls.push(targetUrl);
      continue;
    }

    // Récupérer l'ancienne image
    const oldBuffer = await getObjectBuffer(oldKey);
    if (!oldBuffer) {
      console.error(`   ❌ Image source introuvable sur S3 : ${oldKey}`);
      continue;
    }

    // Convertir en WebP avec sharp (85% qualité, auto-rotation EXIF)
    const webpBuffer = await sharp(oldBuffer)
      .rotate()
      .webp({ quality: 85 })
      .toBuffer();

    // Upload vers S3
    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: targetKey,
        Body: webpBuffer,
        ContentType: 'image/webp',
      }),
      { abortSignal: AbortSignal.timeout(20000) }
    );

    const oldSize = Math.round(oldBuffer.length / 1024);
    const newSize = Math.round(webpBuffer.length / 1024);
    const savings = Math.round(((oldBuffer.length - webpBuffer.length) / oldBuffer.length) * 100);
    console.log(`   ✅ ${targetKey} (${oldSize} Ko -> ${newSize} Ko, -${savings}%)`);
    newUrls.push(targetUrl);
  }

  if (!dryRun && newUrls.length > 0) {
    const { error: updateError } = await supabase
      .from('artworks')
      .update({
        folder_path: targetFolder,
        subcategory: cleanSlug,
        image_urls: JSON.stringify(newUrls),
        updated_at: new Date().toISOString(),
      })
      .eq('id', artwork.id);

    if (updateError) {
      console.error(`   ❌ Erreur Supabase pour #${artwork.id}:`, updateError.message);
    } else {
      console.log(`   💾 Supabase OK pour #${artwork.id}`);
    }
  }
}

async function run() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  const { data: artworks, error } = await supabase
    .from('artworks')
    .select('id, title, folder_path, image_urls, category_id')
    .is('deleted_at', null)
    .order('id', { ascending: true });

  if (error || !artworks) {
    console.error('❌ Erreur Supabase:', error);
    process.exit(1);
  }

  const toMigrate = artworks.filter((a) => {
    const urls = typeof a.image_urls === 'string' ? a.image_urls : JSON.stringify(a.image_urls || '');
    return !urls.includes('.webp') || (a.folder_path && a.folder_path.match(/\/\d{2}$/));
  });

  console.log(`🚀 Démarrage de la migration vers WebP et dossiers sémantiques...`);
  console.log(`📦 ${toMigrate.length} œuvres restantes à migrer sur un total de ${artworks.length}.`);

  for (const art of toMigrate) {
    await migrateArtwork(art, dryRun);
  }

  console.log('\n🎉 Migration terminée avec succès !');
}

if (process.argv[1]?.includes('migrate-to-webp-slugs')) {
  run().catch(console.error);
}
