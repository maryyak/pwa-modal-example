const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/assets/styles.css',
    '/assets/app.js',
    '/manifest.json',
    '/assets/images/icon-128x128.png',
    '/assets/images/icon-512x512.png',
    '/assets/images/close-btn.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache)
                    .catch((error) => {
                        console.error('Failed to cache files:', error);
                    });
            })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.startsWith('chrome-extension://')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then((networkResponse) => {
                        const networkResponseClone = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, networkResponseClone);
                            });
                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('Failed to fetch resource:', error);
                        return new Response('Network error occurred', {
                            status: 408,
                        });
                    });
            })
    );
});


self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});