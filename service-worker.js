const CACHE_NAME = 'whiteboard-cache-v1';
const urlsToCache = [
  '/image/',
  '/image/index.html',
  '/image/assets/index-0N8X_cIM.js', // 実際のファイル名に合わせて
  '/image/assets/index-CJsT-0fR.css',
  '/image/icon-192.png',
  '/image/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
