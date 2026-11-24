// NEXORA — service worker v99: busca SEMPRE a versão nova do jogo na internet primeiro (assim atualizar o index.html no GitHub chega ao app);
// só usa a cópia guardada se estiver sem internet.
const CACHE = 'nexora-v99';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || !r.url.startsWith(self.location.origin)) return;   // Firebase e fontes passam direto
  e.respondWith((async () => {
    try {
      const res = await fetch(r, { cache: 'no-store' });
      if (res && res.ok) { const c = await caches.open(CACHE); c.put(r, res.clone()); }
      return res;
    } catch (err) {
      const hit = await caches.match(r); if (hit) return hit;
      throw err;
    }
  })());
});
