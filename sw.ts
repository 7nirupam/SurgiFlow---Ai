/// <reference lib="webworker" />

const CACHE_NAME = 'surgiflow-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/index.css',
];

const sw = self as unknown as ServiceWorkerGlobalScope;

// Install event - cache static assets
sw.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    sw.skipWaiting();
});

// Activate event - clean up old caches
sw.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    sw.clients.claim();
});

// Fetch event - serve from cache, fallback to network
sw.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Push notification event
sw.addEventListener('push', (event) => {
    const data = event.data?.json() ?? {};
    const title = data.title || 'SurgiFlow Notification';
    const options = {
        body: data.body || 'You have a new notification',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        tag: data.tag || 'default',
        data: data.data,
    };

    event.waitUntil(
        sw.registration.showNotification(title, options)
    );
});

// Notification click event
sw.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        sw.clients.openWindow(event.notification.data?.url || '/')
    );
});
