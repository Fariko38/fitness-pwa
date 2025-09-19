const CACHE_NAME = 'fitness-cache-v3'; // incrémente à chaque mise à jour
const urlsToCache = [
    '/',
    '/index.html',
    '/historique.html',
    '/records.html',
    '/style.css',
    '/fitness.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key)))
        )
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});
