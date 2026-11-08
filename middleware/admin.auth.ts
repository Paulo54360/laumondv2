export default defineNuxtRouteMiddleware(async (to) => {
  // La session Supabase est stockée côté navigateur : impossible de la lire en SSR.
  if (import.meta.server) return;

  // Retire le préfixe de langue (/fr, /en) imposé par la stratégie i18n "prefix".
  const path = to.path.replace(/^\/(fr|en)(?=\/|$)/, '') || '/';
  if (!path.startsWith('/admin')) return;

  const localePath = useLocalePath();
  const { getSession } = useAdminAuth();
  const session = await getSession();

  if (path === '/admin/login') {
    if (session?.user) {
      return navigateTo(localePath('/admin/upload'));
    }
    return;
  }

  if (!session?.user) {
    return navigateTo(localePath('/admin/login'));
  }
});
