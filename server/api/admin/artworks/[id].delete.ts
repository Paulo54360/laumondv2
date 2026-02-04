import { DeleteObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';

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
  const publicBase = (config.public.apiUrl as string)?.replace(/\/$/, '') || '';

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

  const { data: artwork, error: fetchError } = await supabase
    .from('artworks')
    .select('id, folder_path, image_urls')
    .eq('id', artworkId)
    .single();

  if (fetchError || !artwork) {
    if (fetchError?.code === 'PGRST116') {
      throw createError({ statusCode: 404, statusMessage: 'Œuvre introuvable' });
    }
    throw createError({ statusCode: 500, statusMessage: 'Erreur chargement œuvre' });
  }

  const s3Client = new S3Client({
    region: awsRegion,
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  });

  const folderPath = artwork.folder_path as string | null;
  if (folderPath) {
    try {
      const listRes = await s3Client.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: `${folderPath}/`,
        })
      );
      const objects = listRes.Contents ?? [];
      for (const obj of objects) {
        if (obj.Key) {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: bucket,
              Key: obj.Key,
            })
          );
        }
      }
    } catch (s3Err) {
      console.error('Erreur suppression S3', s3Err);
    }
  }

  const { error: deleteError } = await supabase
    .from('artworks')
    .delete()
    .eq('id', artworkId);

  if (deleteError) {
    console.error('Erreur suppression DB artwork', deleteError);
    throw createError({ statusCode: 500, statusMessage: 'Erreur suppression œuvre' });
  }

  return {
    success: true,
    data: { artworkId },
  };
});
