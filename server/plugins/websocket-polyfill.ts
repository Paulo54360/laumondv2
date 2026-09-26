import ws from 'ws';

export default defineNitroPlugin(() => {
  if (typeof globalThis.WebSocket === 'undefined') {
    // @ts-expect-error - ws polyfill for Supabase in Node.js < 22
    globalThis.WebSocket = ws;
  }
});
