const CACHE_NAME = 'whiteboard-photo-booth-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/index-xxxx.js',
  '/assets/style-xxxx.css',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
