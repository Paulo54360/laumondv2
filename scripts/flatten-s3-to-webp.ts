import { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
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

function extractKey(urlOrPath: string): string {
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
    return null;
  }
}

async function flattenAll() {
  console.log('🚀 Démarrage du passage en structure 100% PLATE (sans aucun sous-dossier)...');

  const { data: artworks, error } = await supabase
    .from('artworks')
    .select('id, title, folder_path, image_urls, category_id')
    .is('deleted_at', null)
    .order('id', { ascending: true });

  if (error || !artworks) {
    console.error('❌ Erreur Supabase:', error);
    process.exit(1);
  }

  console.log(`📦 ${artworks.length} œuvres à traiter.`);

  const seenKeys = new Set<string>();
  const keptS3Keys = new Set<string>();

  for (const art of artworks) {
    const cat = art.folder_path?.split('/')[0] || 'Archetypes';
    let baseSlug = slugify(art.title).slice(0, 36) || `art-${art.id}`;
    let targetKey = `${cat}/${baseSlug}.webp`;

    if (seenKeys.has(targetKey)) {
      baseSlug = `${baseSlug}-${art.id}`;
      targetKey = `${cat}/${baseSlug}.webp`;
    }
    seenKeys.add(targetKey);
    keptS3Keys.add(targetKey);

    let currentUrl = '';
    if (Array.isArray(art.image_urls) && art.image_urls[0]) {
      currentUrl = art.image_urls[0];
    } else if (typeof art.image_urls === 'string') {
      try {
        const parsed = JSON.parse(art.image_urls);
        if (Array.isArray(parsed) && parsed[0]) currentUrl = parsed[0];
      } catch {
        currentUrl = art.image_urls;
      }
    }

    if (!currentUrl && art.folder_path) {
      currentUrl = `${S3_BASE_URL}/${art.folder_path}/01.jpg`;
    }

    const currentKey = extractKey(currentUrl);

    // Si le fichier cible est déjà en place
    if (currentKey === targetKey) {
      continue;
    }

    // Récupérer le buffer (soit le webp déjà créé, soit l'ancien jpg)
    let buffer = await getObjectBuffer(currentKey);
    if (!buffer && currentKey.endsWith('.webp')) {
      // Fallback sur le .jpg correspondant si le .webp n'a pas été trouvé
      const jpgKey = currentKey.replace(/\.webp$/, '.jpg');
      buffer = await getObjectBuffer(jpgKey);
    }

    if (!buffer) {
      console.error(`❌ Impossible de trouver l'image pour #${art.id} (${currentKey})`);
      continue;
    }

    // S'assurer que le buffer est en WebP
    let webpBuffer: Buffer;
    if (currentKey.endsWith('.webp')) {
      webpBuffer = buffer;
    } else {
      webpBuffer = await sharp(buffer).rotate().webp({ quality: 85 }).toBuffer();
    }

    // Écrire le fichier directement à la racine de la catégorie S3
    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: targetKey,
        Body: webpBuffer,
        ContentType: 'image/webp',
      }),
      { abortSignal: AbortSignal.timeout(15000) }
    );

    const newUrl = `${S3_BASE_URL}/${targetKey}`;

    // Mettre à jour Supabase
    await supabase
      .from('artworks')
      .update({
        folder_path: cat,
        subcategory: baseSlug,
        image_urls: JSON.stringify([newUrl]),
        updated_at: new Date().toISOString(),
      })
      .eq('id', art.id);

    console.log(`✅ [${cat}] #${art.id} : "${art.title}" -> ${targetKey}`);
  }

  console.log('\n🧹 Nettoyage des anciens dossiers et sous-dossiers sur S3...');
  // Lister tous les objets S3 et supprimer tout ce qui n'est pas dans keptS3Keys (sauf authors/ et metahism/)
  let continuationToken: string | undefined;
  const toDelete: Array<{ Key: string }> = [];

  do {
    const listRes = await s3.send(
      new ListObjectsV2Command({
        Bucket: S3_BUCKET,
        ContinuationToken: continuationToken,
      })
    );

    for (const obj of listRes.Contents || []) {
      const key = obj.Key;
      if (!key) continue;

      // Ne pas toucher aux répertoires spéciaux non-œuvres
      if (key.startsWith('authors/') || key.startsWith('metahism/')) {
        continue;
      }

      // Si ce n'est pas un des nouveaux fichiers plats
      if (!keptS3Keys.has(key)) {
        toDelete.push({ Key: key });
      }
    }

    continuationToken = listRes.IsTruncated ? listRes.NextContinuationToken : undefined;
  } while (continuationToken);

  console.log(`🗑️  ${toDelete.length} anciens fichiers/sous-dossiers à supprimer sur S3...`);

  // Suppression par lots de 1000 (limite AWS DeleteObjects)
  while (toDelete.length > 0) {
    const batch = toDelete.splice(0, 1000);
    await s3.send(
      new DeleteObjectsCommand({
        Bucket: S3_BUCKET,
        Delete: { Objects: batch },
      })
    );
    console.log(`   Supprimé un lot de ${batch.length} anciens objets.`);
  }

  console.log('\n✨ Terminé ! L’arborescence S3 est désormais 100% plate et propre sans aucun sous-dossier !');
}

flattenAll().catch(console.error);
