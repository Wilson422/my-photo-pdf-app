// 版本號請每次更新都同步修改
const CACHE_VERSION = 'v20250726-5';
const CACHE_NAME = `sw-cache-${CACHE_VERSION}`;

// 你要快取的檔案（請根據實際情況加入所有本地資源與重要 CDN）
const urlsToCache = [
  '/', // 如果你的 index.html 在根目錄
  '/index.html?v=20250726-5',
  '/manifest.json?v=20250726-5',
  '/icon.png?v=20250726-5',
  '/service-worker.js?v=20250726-5',
  // Cropperjs 與 jsPDF CDN 可視需求加上
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
      // 刪除舊版本的 cache
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
  // 只針對 GET 請求做快取
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(function(response) {
      // CACHE 命中則直接回傳，否則從網路取得
      return response || fetch(event.request);
    })
  );
});
