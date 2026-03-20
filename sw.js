const CACHE_VERSION = 'life-savings-v20260320a';
const APP_SHELL = [
    './',
    './index.html',
    './index.html?v=20260320a',
    './style.css?v=20260320a',
    './script.js?v=20260320a',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    './login.html'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).catch(() => null)
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys
                .filter((key) => key !== CACHE_VERSION)
                .map((key) => caches.delete(key))
        ))
    );
    self.clients.claim();
});

function isApiRequest(requestUrl) {
    return [
        'pokeapi.co',
        'api.tcgdex.net',
        'api.scryfall.com',
        'cheapshark.com',
        'store.steampowered.com',
        'fonts.googleapis.com',
        'fonts.gstatic.com',
        'cdn.jsdelivr.net',
        'sdk.amazonaws.com'
    ].some((host) => requestUrl.hostname.includes(host));
}

async function networkFirst(request) {
    const cache = await caches.open(CACHE_VERSION);
    try {
        const fresh = await fetch(request);
        if (request.method === 'GET') cache.put(request, fresh.clone());
        return fresh;
    } catch {
        return await cache.match(request) || await cache.match('./index.html');
    }
}

async function cacheFirst(request) {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(request);
    if (cached) return cached;
    const fresh = await fetch(request);
    if (request.method === 'GET') cache.put(request, fresh.clone());
    return fresh;
}

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request));
        return;
    }

    if (isApiRequest(url)) {
        event.respondWith(networkFirst(request));
        return;
    }

    if (request.destination === 'image' || url.origin === self.location.origin) {
        event.respondWith(cacheFirst(request));
    }
});
