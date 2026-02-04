import { createClient } from '@supabase/supabase-js';

type CategoryRow = {
  id: number;
  name: string;
  path: string | null;
};

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Non authentifié' });
  }

  const config = useRuntimeConfig();
  const supabaseUrl = config.supabaseUrl;
  const serviceRoleKey = config.supabaseServiceRoleKey;

  if (!supabaseUrl || !serviceRoleKey) {
    throw createError({ statusCode: 500, statusMessage: 'Configuration Supabase manquante' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data: userData, error: userError } = await supabase.auth.getUser(token);

  if (userError || !userData.user) {
    throw createError({ statusCode: 401, statusMessage: 'Session invalide' });
  }

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, path')
    .order('name', { ascending: true });

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Erreur chargement catégories' });
  }

  return { categories: (data ?? []) as CategoryRow[] };
});
