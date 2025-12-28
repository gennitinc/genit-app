const CACHE_NAME = 'gennit-ai-v2';
const RUNTIME_CACHE = 'gennit-runtime-v2';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/favicon.ico',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching assets');
        return cache.addAll(PRECACHE_ASSETS).catch((error) => {
          console.error('[Service Worker] Error caching assets:', error);
          // Continue even if some assets fail to cache
        });
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip API requests and socket.io
  if (
    event.request.url.includes('/api/') ||
    event.request.url.includes('/socket.io/')
  ) {
    return;
  }

  // Skip Next.js JavaScript chunks - always fetch fresh
  // This prevents cached component code from being served
  if (
    event.request.url.includes('_next/static') ||
    event.request.url.includes('_next/data') ||
    event.request.url.includes('_next/chunks') ||
    (event.request.destination === 'script' && event.request.url.includes('_next'))
  ) {
    return;
  }

  event.respondWith(
    // For HTML pages, try network first, then cache
    // This ensures users get the latest version
    fetch(event.request)
      .then((response) => {
        // Don't cache if not a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Only cache non-JavaScript assets (images, CSS, etc.)
        // Don't cache JavaScript files to avoid stale component code
        const shouldCache = 
          event.request.destination !== 'script' &&
          !event.request.url.includes('.js') &&
          !event.request.url.includes('_next');

        if (shouldCache) {
          // Clone the response
          const responseToCache = response.clone();

          caches.open(RUNTIME_CACHE)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }

        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return offline page if available
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

