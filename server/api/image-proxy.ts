import { GetObjectCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getMethod } from 'h3';

/**
 * Proxy S3 : le serveur récupère l'objet via le SDK AWS (credentials)
 * et le renvoie au client, pour contourner CORS et accéder aux buckets privés.
 * GET : corps du fichier ; HEAD : métadonnées uniquement (vérif. présence sans CORS).
 */

function contentTypeForKey(key: string, s3?: string | undefined): string {
  if (s3) return s3;
  const lower = key.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.txt')) return 'text/plain; charset=utf-8';
  return 'image/jpeg';
}

export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  if (method !== 'GET' && method !== 'HEAD') {
    throw createError({ statusCode: 405, statusMessage: 'Méthode non autorisée' });
  }

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

  const s3 = new S3Client({
    region: awsRegion,
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  });

  if (method === 'HEAD') {
    try {
      const response = await s3.send(
        new HeadObjectCommand({
          Bucket: bucket,
          Key: key,
        })
      );
      const ct = contentTypeForKey(key, response.ContentType);
      setResponseHeader(event, 'Content-Type', ct);
      if (response.ContentLength != null) {
        setResponseHeader(event, 'Content-Length', String(response.ContentLength));
      }
      setResponseHeader(event, 'Cache-Control', 'public, max-age=86400');
      setResponseStatus(event, 200);
      return '';
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'statusCode' in err) {
        throw err;
      }
      const e = err as { name?: string; $metadata?: { httpStatusCode?: number } };
      const name = e.name ? String(e.name) : '';
      const http404 = e.$metadata?.httpStatusCode === 404;
      const code = name === 'NotFound' || name === 'NoSuchKey' || http404 ? 404 : 502;
      throw createError({
        statusCode: code,
        statusMessage: code === 404 ? 'Image introuvable' : "Erreur lors du chargement de l'image",
      });
    }
  }

  try {
    const response = await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

    if (!response.Body) {
      throw createError({ statusCode: 404, statusMessage: 'Image introuvable' });
    }

    const contentType = contentTypeForKey(key, response.ContentType);
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
