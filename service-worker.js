// This service worker will cache the application shell and assets,
// allowing the app to work offline.

const CACHE_NAME = 'asset-tracker-cache-v1';
// A list of all the essential files that make up the application shell.
const URLS_TO_CACHE = [
  '/',
  'My_Asset.html',
  'manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  // Firebase SDKs
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-analytics.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js',
  // PWA Icons
  'https://placehold.co/192x192/3b82f6/FFFFFF?text=AT',
  'https://placehold.co/512x512/3b82f6/FFFFFF?text=AT',
  
  // NEW: Your modular app scripts must be cached
  'js/firebase-init.js',
  'js/app-core.js',
  'js/app-charts.js',
  'js/app-ui.js'
];

// Event listener for the 'install' event (service worker lifecycle)
self.addEventListener('install', event => {
  console.log('[Service Worker] Install Event: Caching App Shell');
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(error => {
        console.error('[Service Worker] Failed to cache files during install:', error);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Event listener for the 'activate' event (service worker lifecycle)
// Used to clean up old caches.
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate Event: Cleaning old caches');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Ensure the service worker starts controlling all clients immediately
  event.waitUntil(self.clients.claim());
});

// Event listener for the 'fetch' event. 
// This is where the service worker intercepts network requests and serves cached files when offline.
self.addEventListener('fetch', event => {
  // We only want to handle GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If we find a match in the cache, return it.
        if (response) {
          return response;
        }

        // If no match is found in the cache, fetch it from the network.
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response.
            if (!response || response.status !== 200) {
              return response;
            }

            // We don't cache Firebase/Firestore API calls as they are constantly changing.
            if(event.request.url.includes('firebase') || event.request.url.includes('firestore.googleapis.com')) {
                return response;
            }

            // Clone the response because it's a stream that can only be consumed once.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(error => {
            // This will be triggered if the network request fails,
            // which is expected when the user is offline.
            console.log('Fetch failed; app shell provided if available.', error);
            // Optionally, return a default offline page here
            return caches.match('My_Asset.html'); 
        });
      })
  );
});
