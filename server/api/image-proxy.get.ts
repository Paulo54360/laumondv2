import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

/**
 * Proxy d'images S3 : le serveur récupère l'objet via le SDK AWS (credentials)
 * et le renvoie au client, pour contourner CORS et accéder aux buckets privés.
 */
export default defineEventHandler(async (event) => {
  const urlParam = getQuery(event).url;
  if (typeof urlParam !== 'string' || !urlParam.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Paramètre url manquant' });
  }

  const config = useRuntimeConfig();
  const apiUrl = (config.public.apiUrl as string)?.replace(/\/$/, '') || '';
  if (!apiUrl) {
    throw createError({ statusCode: 500, statusMessage: 'Configuration apiUrl manquante' });
  }

  const decoded = decodeURIComponent(urlParam);
  if (!decoded.startsWith(apiUrl)) {
    throw createError({ statusCode: 400, statusMessage: 'URL non autorisée' });
  }

  let key: string;
  try {
    const pathname = new URL(decoded).pathname;
    key = pathname.startsWith('/') ? pathname.slice(1) : pathname;
    if (!key) {
      throw new Error('Clé vide');
    }
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'URL invalide' });
  }

  const bucket = config.s3Bucket as string;
  const awsAccessKeyId = config.awsAccessKeyId as string;
  const awsSecretAccessKey = config.awsSecretAccessKey as string;
  const awsRegion = config.awsRegion as string;

  if (!bucket || !awsAccessKeyId || !awsSecretAccessKey || !awsRegion) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration AWS manquante pour le proxy images',
    });
  }

  try {
    const s3 = new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    });

    const response = await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

    if (!response.Body) {
      throw createError({ statusCode: 404, statusMessage: 'Image introuvable' });
    }

    const contentType =
      response.ContentType || (key.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg');
    setResponseHeader(event, 'Content-Type', contentType);
    setResponseHeader(event, 'Cache-Control', 'public, max-age=86400');

    const chunks: Uint8Array[] = [];
    for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }
    const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    return result;
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'statusCode' in err) {
      throw err;
    }
    const code =
      err && typeof err === 'object' && 'name' in err && err.name === 'NoSuchKey' ? 404 : 502;
    throw createError({
      statusCode: code,
      statusMessage: code === 404 ? 'Image introuvable' : "Erreur lors du chargement de l'image",
    });
  }
});
