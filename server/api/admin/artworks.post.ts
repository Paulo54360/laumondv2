import { S3Client, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';

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
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png']);

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
    ['drawings', 'Drawings+'],
    ['drawing', 'Drawings+'],
    ['dessin', 'Drawings+'],
    ['drawings+', 'Drawings+'],
    ['transcriptions', 'Transcriptions'],
    ['transcription', 'Transcriptions'],
  ]);
  return map.get(normalized) || null;
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

async function listFolders(s3: S3Client, bucket: string, prefix: string): Promise<string[]> {
  const folders = new Set<string>();
  let continuationToken: string | undefined;
  do {
    const res = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: `${prefix}/`,
        Delimiter: '/',
        ContinuationToken: continuationToken,
      })
    );
    for (const common of res.CommonPrefixes || []) {
      const match = common.Prefix?.match(new RegExp(`^${prefix}/(\\d+)/$`));
      if (match?.[1]) folders.add(match[1]);
    }
    continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (continuationToken);
  return Array.from(folders);
}

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Non authentifié' });
  }

  const config = useRuntimeConfig();
  const supabaseUrl = config.supabaseUrl;
  const serviceRoleKey = config.supabaseServiceRoleKey;
  const awsAccessKeyId = config.awsAccessKeyId;
  const awsSecretAccessKey = config.awsSecretAccessKey;
  const awsRegion = config.awsRegion;
  const bucket = config.s3Bucket;

  if (!supabaseUrl || !serviceRoleKey) {
    throw createError({ statusCode: 500, statusMessage: 'Configuration Supabase manquante' });
  }
  if (!awsAccessKeyId || !awsSecretAccessKey || !awsRegion || !bucket) {
    throw createError({ statusCode: 500, statusMessage: 'Configuration AWS manquante' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
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

  const folders = await listFolders(s3, bucket, prefix);
  const maxFolder = folders
    .map((f) => Number(f))
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => b - a)[0];
  const nextFolderNum = (maxFolder ?? 0) + 1;
  const folder = String(nextFolderNum).padStart(2, '0');
  const folderPath = `${prefix}/${folder}`;
  const publicBase = config.public.apiUrl;

  const imageUrls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const num = String(i + 1).padStart(2, '0');
    const imageKey = `${folderPath}/${num}.jpg`;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: imageKey,
        Body: file.data,
        ContentType: file.type || 'image/jpeg',
      })
    );

    const imageUrl = `${publicBase}/${imageKey}`;
    imageUrls.push(imageUrl);
  }

  const textKey = `${folderPath}/01.txt`;
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: textKey,
      Body: title,
      ContentType: 'text/plain',
    })
  );

  const { data: inserted, error: insertError } = await supabase
    .from('artworks')
    .insert({
      title,
      title_en: title,
      description: description || null,
      description_fr: description || null,
      description_en: description || null,
      category_id: categoryId,
      folder_path: folderPath,
      subcategory: folder,
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
