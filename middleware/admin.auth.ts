export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) return;

  const { getSession } = useAdminAuth();
  const session = await getSession();

  if (to.path === '/admin/login') {
    if (session?.user) {
      return navigateTo('/admin/upload');
    }
    return;
  }

  if (!session?.user) {
    return navigateTo('/admin/login');
  }
});
