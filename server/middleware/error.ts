export default defineEventHandler((event) => {
  event.node.res.setHeader('Access-Control-Allow-Origin', '*');
  event.node.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  event.node.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});
