export default defineEventHandler((event) => {
  const origin = getHeader(event, 'origin') || '';
  const path = event.path || '';

  // Sur les routes admin, restreindre les requêtes cross-origin non autorisées
  if (path.startsWith('/api/admin')) {
    const host = getHeader(event, 'host');
    const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
    const isSameHost = host ? origin.includes(host) : false;

    if (origin && !isSameHost && !isLocalhost) {
      if (event.method === 'OPTIONS') {
        setResponseStatus(event, 403);
        return 'Forbidden';
      }
      return;
    }
  }

  setResponseHeader(event, 'Access-Control-Allow-Origin', origin || '*');
  setResponseHeader(
    event,
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  setResponseHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (event.method === 'OPTIONS') {
    setResponseStatus(event, 204);
    return '';
  }
});
