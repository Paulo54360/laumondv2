import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import ws from 'ws';

export function getSupabaseAdminClient(): SupabaseClient {
  const config = useRuntimeConfig();
  const supabaseUrl = config.supabaseUrl;
  const serviceRoleKey = config.supabaseServiceRoleKey;

  if (!supabaseUrl || !serviceRoleKey) {
    throw createError({ statusCode: 500, statusMessage: 'Configuration Supabase manquante' });
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
    realtime: { transport: ws },
  });
}
