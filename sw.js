const CACHE_VERSION = 'life-savings-v20260320c';
const APP_SHELL = [
    './',
    './index.html',
    './videoclub.html',
    './style.css',
    './shell.css',
    './videoclub.css',
    './script.js',
    './shell.js',
    './videoclub.js',
    './index.html?v=20260320c',
    './videoclub.html?v=20260320c',
    './style.css?v=20260320c',
    './shell.css?v=20260320c',
    './videoclub.css?v=20260320c',
    './script.js?v=20260320c',
    './shell.js?v=20260320c',
    './videoclub.js?v=20260320c',
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
        'itunes.apple.com',
        'wikipedia.org',
        'fonts.googleapis.com',
        'fonts.gstatic.com',
        'cdn.jsdelivr.net',
        'sdk.amazonaws.com'
    ].some((host) => requestUrl.hostname.includes(host));
}

async function networkFirst(request, fallbackUrl = null) {
    const cache = await caches.open(CACHE_VERSION);
    try {
        const fresh = await fetch(request);
        if (request.method === 'GET') cache.put(request, fresh.clone());
        return fresh;
    } catch {
        const cached = await cache.match(request);
        if (cached) return cached;
        if (fallbackUrl) {
            const fallback = await cache.match(fallbackUrl);
            if (fallback) return fallback;
        }
        return Response.error();
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
        const fallbackUrl = url.pathname.includes('videoclub')
            ? './videoclub.html'
            : './index.html';
        event.respondWith(networkFirst(request, fallbackUrl));
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
