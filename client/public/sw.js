const CACHE_NAME = 'codecrack-ai-cache-v1';
const assets = ['/', '/index.html', '/src/main.jsx', '/index.css'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(assets)));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((cacheResponse) => cacheResponse || fetch(event.request)));
});
