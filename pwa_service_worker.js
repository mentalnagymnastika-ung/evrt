const CACHE_NAME = 'umg-cache-v1.8';
const ASSETS_TO_CACHE = [
  'index.html',
  'p_izvestaj.html',
  'administracija.html',
  'manifest.json'
];

// Instalacija Service Workera i keširanje osnovnih resursa
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Aktivacija i čišćenje starih keševa
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Strategija: Mreža sa padom na keš (Network first, fallback to cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
