// Simple service worker for offline caching (prototype)
const CACHE_NAME = 'campus-engage-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './dashboard.html',
  './styles.css',
  './app.js',
  './dashboard.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
