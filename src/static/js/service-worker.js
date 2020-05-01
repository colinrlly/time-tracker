const version = 'v1';
const offlineUrl = '/offline';

this.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(version).then((cache) => cache.addAll([
            offlineUrl,
            'https://fonts.googleapis.com/css2?family=Work+Sans:wght@200;400&display=swap',
        ])),
    );
});

this.addEventListener('fetch', (event) => {
    if (
        event.request.mode === 'navigate'
        || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))
    ) {
        event.respondWith(fetch(event.request.url).catch(() => caches.match(offlineUrl)));
    } else {
        // Respond with everything else if we can
        event.respondWith(caches.match(event.request)
            .then((response) => response || fetch(event.request)));
    }
});
