/**
 * Script de vérification Supabase Auth (Story 1.1 - AC3)
 * Vérifie que signInWithPassword retourne un JWT valide.
 *
 * Prérequis : .env avec SUPABASE_URL, SUPABASE_KEY, et un compte créé.
 * Usage : npx tsx scripts/verify-admin-auth.ts [email] [password]
 *
 * Si email/password non fournis en args, utilise ADMIN_EMAIL et ADMIN_PASSWORD depuis .env
 * (pour éviter de taper le mot de passe en clair dans le terminal).
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const email = process.argv[2] || process.env.ADMIN_EMAIL;
const password = process.argv[3] || process.env.ADMIN_PASSWORD;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL et SUPABASE_KEY doivent être définis dans .env');
  process.exit(1);
}

if (!email || !password) {
  console.error(
    '❌ Fournir email et mot de passe : npx tsx scripts/verify-admin-auth.ts <email> <password>'
  );
  console.error('   Ou définir ADMIN_EMAIL et ADMIN_PASSWORD dans .env (sans les committer)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('❌ Échec signInWithPassword:', error.message);
    process.exit(1);
  }

  if (!data.session?.access_token) {
    console.error('❌ Pas de token JWT dans la réponse');
    process.exit(1);
  }

  console.log('✅ signInWithPassword OK — JWT valide reçu');
  console.log('   User ID:', data.user?.id);
}

verify().catch((err: unknown) => {
  console.error('❌ Erreur inattendue:', err);
  process.exit(1);
});
