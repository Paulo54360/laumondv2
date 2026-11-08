/**
 * Composable admin auth — Supabase Auth pour Patrick (back-office).
 * Expose login, logout, session, user, isAuthenticated.
 */
import {
  createClient,
  type AuthResponse,
  type Session,
  type SupabaseClient,
  type User,
} from '@supabase/supabase-js';

type AdminAuthComposable = {
  user: Ref<User | null>;
  isAuthenticated: ComputedRef<boolean>;
  getSession: () => Promise<Session | null>;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
};

// Singleton navigateur : une seule instance Supabase pour éviter les conflits
// de verrou "Navigator LockManager" sur le token d'authentification.
let browserClient: SupabaseClient | null = null;

function getClient(url?: string, key?: string): SupabaseClient | null {
  if (!url || !key) return null;
  if (import.meta.server) return createClient(url, key, { auth: { persistSession: false } });
  if (!browserClient) browserClient = createClient(url, key);
  return browserClient;
}

export function useAdminAuth(): AdminAuthComposable {
  const config = useRuntimeConfig().public;
  const user = useState<User | null>('adminUser', () => null);
  const isAuthenticated = computed(() => !!user.value);

  const supabase = computed(() =>
    getClient(config.supabaseUrl as string | undefined, config.supabaseKey as string | undefined)
  );

  async function getSession(): Promise<Session | null> {
    const client = supabase.value;
    if (!client) return null;
    const {
      data: { session },
    } = await client.auth.getSession();
    user.value = session?.user ?? null;
    return session;
  }

  async function login(email: string, password: string): Promise<AuthResponse> {
    const client = supabase.value;
    if (!client) {
      throw new Error('Supabase non configuré');
    }
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    user.value = data.user;
    return data;
  }

  async function logout(): Promise<void> {
    const client = supabase.value;
    if (client) {
      await client.auth.signOut();
    }
    user.value = null;
  }

  return {
    user,
    isAuthenticated,
    getSession,
    login,
    logout,
  };
}
