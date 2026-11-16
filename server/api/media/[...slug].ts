import { GetObjectCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
  getMethod,
  getRequestHeader,
  setResponseHeader,
  setResponseStatus,
  createError,
  type H3Event,
} from 'h3';

/**
 * Proxy Media S3 :
 * Permet de servir les médias S3 de façon sécurisée sous des URLs relatives (/api/media/...)
 * - Masque l'URL S3 et le nom du bucket dans l'inspecteur d'élément
 * - Restreint l'accès aux requêtes légitimes (localhost, *.vercel.app, same-origin)
 * - Cache les images avec des en-têtes HTTP optimisés
 */

function contentTypeForKey(key: string, s3ContentType?: string): string {
  if (s3ContentType && s3ContentType !== 'application/octet-stream') {
    return s3ContentType;
  }
  const lower = key.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.txt')) return 'text/plain; charset=utf-8';
  return 'image/jpeg';
}

function isOriginAllowed(event: H3Event): boolean {
  const referer = getRequestHeader(event, 'referer');
  const origin = getRequestHeader(event, 'origin');
  const host = getRequestHeader(event, 'host');

  // Si aucun referer ni origin (ex. rendu SSR interne Nuxt ou client avec politique Referer stricte)
  if (!referer && !origin) {
    return true;
  }

  const target = origin || referer || '';
  try {
    const url = new URL(target);
    const hostname = url.hostname.toLowerCase();

    // 1. Autoriser localhost et 127.0.0.1 (tous ports)
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      return true;
    }

    // 2. Autoriser Vercel (*.vercel.app pour prod & preview)
    if (hostname.endsWith('.vercel.app')) {
      return true;
    }

    // 3. Autoriser le même host (Same-Origin)
    if (host) {
      const currentHost = host.split(':')[0].toLowerCase();
      if (hostname === currentHost) {
        return true;
      }
    }

    // 4. Domaines personnalisés configurables (ex: production Vercel personnalisée)
    const allowedEnv = process.env.ALLOWED_MEDIA_DOMAINS;
    if (allowedEnv) {
      const domains = allowedEnv.split(',').map((d) => d.trim().toLowerCase());
      if (domains.some((d) => hostname === d || hostname.endsWith(`.${d}`))) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  if (method !== 'GET' && method !== 'HEAD') {
    throw createError({ statusCode: 405, statusMessage: 'Méthode non autorisée' });
  }

  // Contrôle d'accès anti-hotlinking (Localhost, Vercel, Same-Origin)
  if (!isOriginAllowed(event)) {
    throw createError({ statusCode: 403, statusMessage: 'Accès non autorisé' });
  }

  const slugParam = event.context.params?.slug;
  if (!slugParam) {
    throw createError({ statusCode: 400, statusMessage: 'Chemin média manquant' });
  }

  const rawKey = Array.isArray(slugParam) ? slugParam.join('/') : slugParam;
  let key: string;
  try {
    key = decodeURIComponent(rawKey).replace(/^\/+/, '');
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Chemin média invalide' });
  }

  // Sécurité anti path traversal
  if (!key || key.includes('..')) {
    throw createError({ statusCode: 400, statusMessage: 'Chemin média invalide' });
  }

  const config = useRuntimeConfig();
  const bucket = config.s3Bucket as string;
  const awsAccessKeyId = config.awsAccessKeyId as string;
  const awsSecretAccessKey = config.awsSecretAccessKey as string;
  const awsRegion = config.awsRegion as string;

  if (!bucket || !awsAccessKeyId || !awsSecretAccessKey || !awsRegion) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration AWS manquante pour le serveur de médias',
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
      const headResponse = await s3.send(
        new HeadObjectCommand({
          Bucket: bucket,
          Key: key,
        })
      );
      const ct = contentTypeForKey(key, headResponse.ContentType);
      setResponseHeader(event, 'Content-Type', ct);
      if (headResponse.ContentLength != null) {
        setResponseHeader(event, 'Content-Length', String(headResponse.ContentLength));
      }
      if (headResponse.ETag) {
        setResponseHeader(event, 'ETag', headResponse.ETag);
      }
      setResponseHeader(
        event,
        'Cache-Control',
        'public, max-age=86400, stale-while-revalidate=604800'
      );
      setResponseStatus(event, 200);
      return '';
    } catch (err: unknown) {
      const e = err as { name?: string; $metadata?: { httpStatusCode?: number } };
      const name = e.name ? String(e.name) : '';
      const is404 =
        name === 'NotFound' || name === 'NoSuchKey' || e.$metadata?.httpStatusCode === 404;
      throw createError({
        statusCode: is404 ? 404 : 502,
        statusMessage: is404 ? 'Média introuvable' : 'Erreur lors du chargement du média',
      });
    }
  }

  try {
    const getResponse = await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

    if (!getResponse.Body) {
      throw createError({ statusCode: 404, statusMessage: 'Média introuvable' });
    }

    const contentType = contentTypeForKey(key, getResponse.ContentType);
    setResponseHeader(event, 'Content-Type', contentType);
    if (getResponse.ContentLength != null) {
      setResponseHeader(event, 'Content-Length', String(getResponse.ContentLength));
    }
    if (getResponse.ETag) {
      setResponseHeader(event, 'ETag', getResponse.ETag);
    }
    setResponseHeader(
      event,
      'Cache-Control',
      'public, max-age=86400, stale-while-revalidate=604800'
    );

    // Transformation en tableau d'octets supportée nativement par le SDK v3 et Nitro
    const bytes = await getResponse.Body.transformToByteArray();
    return bytes;
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'statusCode' in err) {
      throw err;
    }
    const e = err as { name?: string; $metadata?: { httpStatusCode?: number } };
    const name = e.name ? String(e.name) : '';
    const is404 =
      name === 'NotFound' || name === 'NoSuchKey' || e.$metadata?.httpStatusCode === 404;
    throw createError({
      statusCode: is404 ? 404 : 502,
      statusMessage: is404 ? 'Média introuvable' : 'Erreur lors du chargement du média',
    });
  }
});
