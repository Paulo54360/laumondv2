import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

import { slugify } from '../../utils/slugify';

type CategoryRow = {
  id: number;
  name: string;
  path: string | null;
};

type FilePart = {
  filename?: string;
  type?: string;
  data: Buffer;
};

type ParsedForm = {
  title: string;
  description: string;
  categoryId: number;
  files: FilePart[];
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

function normalizeCategory(value?: string | null): string {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/^images\//, '')
    .replace(/\s+/g, '');
}

function resolveCategoryPrefix(category: CategoryRow): string | null {
  const normalized = normalizeCategory(category.path || category.name);
  const map = new Map<string, string>([
    ['archetypes', 'Archetypes'],
    ['archetype', 'Archetypes'],
    ['deployments', 'Deployments'],
    ['deploiement', 'Deployments'],
    ['deploiements', 'Deployments'],
    ['drawings', 'Drawings'],
    ['drawing', 'Drawings'],
    ['dessin', 'Drawings'],
    ['drawings+', 'Drawings'],
    ['transcriptions', 'Transcriptions'],
    ['transcription', 'Transcriptions'],
  ]);
  const matched = map.get(normalized);
  if (matched) return matched;

  // Catégorie dynamique personnalisée (ex: Portraits, Auteurs...)
  const raw = (category.path || category.name || '').replace(/^images\//, '').trim();
  if (!raw) return null;
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

async function parseMultipart(event: H3Event): Promise<ParsedForm> {
  const formData = await readMultipartFormData(event);
  if (!formData) {
    throw createError({ statusCode: 400, statusMessage: 'Formulaire invalide' });
  }

  const fields = new Map<string, { data: Buffer; filename?: string; type?: string }[]>();
  for (const part of formData) {
    const name = part.name || '';
    if (!fields.has(name)) {
      fields.set(name, []);
    }
    fields.get(name)!.push({
      data: part.data as Buffer,
      filename: part.filename,
      type: part.type,
    });
  }

  const getFirst = (name: string): string => (fields.get(name)?.[0]?.data?.toString() || '').trim();

  const title = getFirst('title');
  const description = getFirst('description');
  const categoryIdRaw = getFirst('categoryId');

  if (!title) {
    throw createError({ statusCode: 400, statusMessage: 'Titre manquant' });
  }
  const categoryId = Number(categoryIdRaw);
  if (!categoryId || Number.isNaN(categoryId)) {
    throw createError({ statusCode: 400, statusMessage: 'Catégorie invalide' });
  }

  const fileParts = fields.get('files') ?? fields.get('file') ?? [];
  const validFiles = fileParts.filter(
    (p) => p.data && Buffer.isBuffer(p.data) && p.data.length > 0
  );
  if (validFiles.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Au moins une image requise' });
  }

  return {
    title,
    description,
    categoryId,
    files: validFiles.map((p) => ({
      filename: p.filename,
      type: p.type,
      data: p.data,
    })),
  };
}

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Non authentifié' });
  }

  const config = useRuntimeConfig();
  const awsAccessKeyId = config.awsAccessKeyId;
  const awsSecretAccessKey = config.awsSecretAccessKey;
  const awsRegion = config.awsRegion;
  const bucket = config.s3Bucket;

  if (!awsAccessKeyId || !awsSecretAccessKey || !awsRegion || !bucket) {
    throw createError({ statusCode: 500, statusMessage: 'Configuration AWS manquante' });
  }

  const supabase = getSupabaseAdminClient();
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    throw createError({ statusCode: 401, statusMessage: 'Session invalide' });
  }

  const { title, description, categoryId, files } = await parseMultipart(event);

  for (const file of files) {
    if (!ALLOWED_MIME.has(file.type || '')) {
      throw createError({ statusCode: 400, statusMessage: 'Format de fichier non accepté' });
    }
    if (file.data.length > MAX_FILE_SIZE) {
      throw createError({ statusCode: 400, statusMessage: 'Fichier trop volumineux (max 10MB)' });
    }
  }

  const { data: category, error: catError } = await supabase
    .from('categories')
    .select('id, name, path')
    .eq('id', categoryId)
    .single();
  if (catError || !category) {
    throw createError({ statusCode: 400, statusMessage: 'Catégorie introuvable' });
  }

  const prefix = resolveCategoryPrefix(category as CategoryRow);
  if (!prefix) {
    throw createError({ statusCode: 400, statusMessage: 'Catégorie non mappée' });
  }

  const s3 = new S3Client({
    region: awsRegion,
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  });

  // Structure 100% plate sans sous-dossier (ex: Archetypes/jusqu-au-boutisme.webp)
  const baseSlug = slugify(title).slice(0, 36) || 'oeuvre';
  let fileSlug = baseSlug;
  let counter = 1;

  while (true) {
    const candidateKey = `${prefix}/${fileSlug}.webp`;
    const { data: existing } = await supabase
      .from('artworks')
      .select('id')
      .ilike('image_urls', `%"${config.public.apiUrl}/${candidateKey}"%`)
      .is('deleted_at', null)
      .maybeSingle();

    if (!existing) {
      break;
    }
    counter++;
    fileSlug = `${baseSlug}-${counter}`;
  }

  const publicBase = config.public.apiUrl;
  const imageUrls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const imageKey =
      files.length === 1 ? `${prefix}/${fileSlug}.webp` : `${prefix}/${fileSlug}-${i + 1}.webp`;

    // Conversion automatique en WebP optimisé avec sharp
    const webpBuffer = await sharp(file.data).rotate().webp({ quality: 85 }).toBuffer();

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: imageKey,
        Body: webpBuffer,
        ContentType: 'image/webp',
      })
    );

    const imageUrl = `${publicBase}/${imageKey}`;
    imageUrls.push(imageUrl);
  }

  const { data: inserted, error: insertError } = await supabase
    .from('artworks')
    .insert({
      title,
      title_en: title,
      description: description || null,
      description_fr: description || null,
      description_en: description || null,
      category_id: categoryId,
      folder_path: prefix,
      subcategory: fileSlug,
      image_urls: JSON.stringify(imageUrls),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (insertError || !inserted) {
    throw createError({ statusCode: 500, statusMessage: 'Erreur enregistrement œuvre' });
  }

  const artworkImagesRows = imageUrls.map((url, idx) => {
    const segments = url.split('/');
    const filename = segments[segments.length - 1] ?? 'image.jpg';
    return {
      artwork_id: inserted.id,
      url,
      filename,
      position: idx,
    };
  });

  const { error: imagesError } = await supabase.from('artwork_images').insert(artworkImagesRows);

  if (imagesError) {
    console.error('Erreur insertion artwork_images:', imagesError);
  }

  return {
    success: true,
    data: {
      artworkId: inserted.id,
      imageUrls,
    },
  };
});
