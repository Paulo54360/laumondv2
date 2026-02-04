/**
 * Composable admin auth — Supabase Auth pour Patrick (back-office).
 * Expose login, logout, session, user, isAuthenticated.
 */
import { createClient, type AuthResponse, type Session, type User } from '@supabase/supabase-js';

type AdminAuthComposable = {
  user: Ref<User | null>;
  isAuthenticated: ComputedRef<boolean>;
  getSession: () => Promise<Session | null>;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
};

export function useAdminAuth(): AdminAuthComposable {
  const config = useRuntimeConfig().public;
  const user = useState<User | null>('adminUser', () => null);
  const isAuthenticated = computed(() => !!user.value);

  const supabase = computed(() => {
    const url = config.supabaseUrl as string | undefined;
    const key = config.supabaseKey as string | undefined;
    if (!url || !key) return null;
    return createClient(url, key);
  });

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
