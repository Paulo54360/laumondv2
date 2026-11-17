import type { User } from '@supabase/supabase-js';
import { getHeader, createError, type H3Event } from 'h3';

import { getSupabaseAdminClient } from './supabase';

const DEFAULT_ADMIN_EMAILS = ['plaumond@yahoo.fr'];

function getAllowedAdminEmails(): string[] {
  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envList = (process.env.ADMIN_ALLOWED_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const set = new Set([...DEFAULT_ADMIN_EMAILS, ...envList]);
  if (envEmail) set.add(envEmail);
  return Array.from(set);
}

/**
 * Vérifie l'authentification et les droits administrateurs d'une requête API.
 * Lève une erreur 401 si le token est manquant ou invalide,
 * et 403 si l'utilisateur n'a pas les droits administrateur.
 */
export async function requireAdminUser(event: H3Event): Promise<User> {
  const authHeader = getHeader(event, 'authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Non authentifié' });
  }

  const supabase = getSupabaseAdminClient();
  const { data: userData, error: userError } = await supabase.auth.getUser(token);

  if (userError || !userData.user) {
    throw createError({ statusCode: 401, statusMessage: 'Session invalide' });
  }

  const user = userData.user;
  const userRole = (user.app_metadata?.role as string | undefined)?.toLowerCase();
  const userEmail = user.email?.trim().toLowerCase();

  const isRoleAdmin = userRole === 'admin';
  const isEmailAdmin = userEmail ? getAllowedAdminEmails().includes(userEmail) : false;

  if (!isRoleAdmin && !isEmailAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Accès interdit : privilèges administrateur requis',
    });
  }

  return user;
}
