const CACHE_VERSION = 'v20250811-2';
const CACHE_NAME = `sw-cache-${CACHE_VERSION}`;

const urlsToCache = [
  '/', // 根目錄
  '/index.html?v=20250811-2',
  '/manifest.json?v=20250811-2',
  '/icon.png?v=20250811-2',
  '/service-worker.js?v=20250811-2',
  'https://unpkg.com/cropperjs@1.5.13/dist/cropper.min.css',
  'https://unpkg.com/cropperjs@1.5.13/dist/cropper.min.js',
  'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(name) {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
