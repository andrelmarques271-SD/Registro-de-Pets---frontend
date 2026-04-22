const CACHE_NAME = 'pets-cache-v2';

const APP_FILES = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// INSTALAR
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES))
  );
});

// ATIVAR (limpa cache antigo)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// FETCH
self.addEventListener('fetch', (event) => {

  // ❗ NÃO CACHEAR API (muito importante)
  if (event.request.url.includes('/animals')) {
    return fetch(event.request);
  }

  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
