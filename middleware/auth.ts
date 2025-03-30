export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) return;
  const user = await getCurrentUser();
  if (user) {
    if (to.path === '/' || to.path === '/register') {
      return await navigateTo('/admin');
    }
  }

  if (!user && to.path === '/admin') {
    return await navigateTo('/');
  }
});
