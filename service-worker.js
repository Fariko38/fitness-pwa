const CACHE_NAME = 'fitness-cache-v1';
const FILES_TO_CACHE = [
  'fitness-tracker.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// Installation : cache les fichiers essentiels
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting(); // active immédiatement
});

// Activation : supprime les anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim(); // prend le contrôle immédiatement
});

// Fetch : stratégie "Network first, fallback cache"
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // copie dans le cache
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Message pour skipWaiting (mise à jour immédiate)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
