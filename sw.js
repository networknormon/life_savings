self.addEventListener('install', (e) => {
    console.log('[Service Worker] Instalado');
});

self.addEventListener('fetch', (e) => {
    // No bloqueamos nada, dejamos que la web funcione con normalidad
});
