import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';

type FilePart = {
  filename?: string;
  type?: string;
  data: Buffer;
};

type ParsedForm = {
  title: string;
  description: string;
  categoryId: number;
  deletedImageUrls: string[];
  files: FilePart[];
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png']);

function parseDeletedUrls(raw: string): string[] {
  if (!raw || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((u): u is string => typeof u === 'string' && u.length > 0)
      : [];
  } catch {
    return [];
  }
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

  const getFirst = (name: string): string =>
    (fields.get(name)?.[0]?.data?.toString() || '').trim();

  const title = getFirst('title');
  const description = getFirst('description');
  const categoryIdRaw = getFirst('categoryId');
  const deletedImageUrls = parseDeletedUrls(getFirst('deletedImageUrls'));

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

  return {
    title,
    description,
    categoryId,
    deletedImageUrls,
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

  const id = getRouterParam(event, 'id');
  const artworkId = id ? Number(id) : NaN;
  if (!id || Number.isNaN(artworkId)) {
    throw createError({ statusCode: 400, statusMessage: 'ID œuvre invalide' });
  }

  const config = useRuntimeConfig();
  const supabaseUrl = config.supabaseUrl;
  const serviceRoleKey = config.supabaseServiceRoleKey;
  const awsAccessKeyId = config.awsAccessKeyId;
  const awsSecretAccessKey = config.awsSecretAccessKey;
  const awsRegion = config.awsRegion;
  const bucket = config.s3Bucket;
  const publicBase = config.public.apiUrl;

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

  const { title, description, categoryId, deletedImageUrls, files } =
    await parseMultipart(event);

  for (const file of files) {
    if (!ALLOWED_MIME.has(file.type || '')) {
      throw createError({ statusCode: 400, statusMessage: 'Format de fichier non accepté' });
    }
    if (file.data.length > MAX_FILE_SIZE) {
      throw createError({ statusCode: 400, statusMessage: 'Fichier trop volumineux (max 10MB)' });
    }
  }

  const { data: artwork, error: fetchError } = await supabase
    .from('artworks')
    .select('id, folder_path, category_id, image_urls')
    .eq('id', artworkId)
    .is('deleted_at', null)
    .single();

  if (fetchError || !artwork) {
    if (fetchError?.code === 'PGRST116') {
      throw createError({ statusCode: 404, statusMessage: 'Œuvre introuvable' });
    }
    throw createError({ statusCode: 500, statusMessage: 'Erreur chargement œuvre' });
  }

  const folderPath = artwork.folder_path as string;
  if (!folderPath) {
    throw createError({ statusCode: 400, statusMessage: 'Œuvre sans dossier S3' });
  }

  const { data: existingImages } = await supabase
    .from('artwork_images')
    .select('id, url, position')
    .eq('artwork_id', artworkId)
    .is('deleted_at', null)
    .order('position', { ascending: true });

  function ensureUrlArray(val: unknown): string[] {
    if (!val) return [];
    if (Array.isArray(val)) return val.filter((u): u is string => typeof u === 'string');
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val) as unknown;
        return Array.isArray(parsed)
          ? parsed.filter((u): u is string => typeof u === 'string')
          : val.trim().startsWith('http')
            ? [val.trim()]
            : [];
      } catch {
        return val.trim().startsWith('http') ? [val.trim()] : [];
      }
    }
    return [];
  }

  const legacyUrls = ensureUrlArray(artwork.image_urls);
  const deletedSet = new Set(deletedImageUrls);

  let keptImages: Array<{ url: string; position: number }>;
  if (existingImages && existingImages.length > 0) {
    keptImages = (existingImages as Array<{ url: string; position: number }>).filter(
      (img) => !deletedSet.has(img.url)
    );
  } else {
    keptImages = legacyUrls
      .filter((url) => !deletedSet.has(url))
      .map((url, idx) => ({ url, position: idx }));
  }

  if (keptImages.length === 0 && files.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'L’œuvre doit conserver au moins une image',
    });
  }

  const s3Client = new S3Client({
    region: awsRegion,
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  });

  const newUrls: string[] = [];
  const maxPos = keptImages.reduce((m, img) => Math.max(m, img.position), -1);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const pos = maxPos + 1 + i;
    const num = String(pos + 1).padStart(2, '0');
    const imageKey = `${folderPath}/${num}.jpg`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: imageKey,
        Body: file.data,
        ContentType: file.type || 'image/jpeg',
      })
    );

    const imageUrl = `${publicBase}/${imageKey}`;
    newUrls.push(imageUrl);

    const segments = imageUrl.split('/');
    const filename = segments[segments.length - 1] ?? 'image.jpg';
    await supabase.from('artwork_images').insert({
      artwork_id: artworkId,
      url: imageUrl,
      filename,
      position: pos,
    });
  }

  const finalUrls = [...keptImages.map((img) => img.url), ...newUrls];

  if (deletedSet.size > 0) {
    await supabase
      .from('artwork_images')
      .update({ deleted_at: new Date().toISOString() })
      .eq('artwork_id', artworkId)
      .in('url', deletedImageUrls);
  }

  const textKey = `${folderPath}/01.txt`;
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: textKey,
      Body: title,
      ContentType: 'text/plain',
    })
  );

  const { error: updateError } = await supabase
    .from('artworks')
    .update({
      title,
      title_en: title,
      description: description || null,
      description_fr: description || null,
      description_en: description || null,
      category_id: categoryId,
      image_urls: JSON.stringify(finalUrls),
      updated_at: new Date().toISOString(),
    })
    .eq('id', artworkId);

  if (updateError) {
    console.error('Erreur update artwork', updateError);
    throw createError({ statusCode: 500, statusMessage: 'Erreur mise à jour œuvre' });
  }

  return {
    success: true,
    data: { artworkId, imageUrls: finalUrls },
  };
});
