// Service Worker for caching strategies and offline support

const CACHE_NAME = 'ai-evaluation-system-v1';
const STATIC_CACHE_NAME = 'ai-evaluation-static-v1';
const DYNAMIC_CACHE_NAME = 'ai-evaluation-dynamic-v1';
const API_CACHE_NAME = 'ai-evaluation-api-v1';

// Cache URLs to pre-cache
const STATIC_URLS_TO_CACHE = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  // Add other static assets
];

// API URLs to cache
const API_URLS_TO_CACHE = [
  '/api/dashboard/stats',
  '/api/auth/user',
  // Add frequently accessed API endpoints
];

// Installation event
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');

  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_URLS_TO_CACHE);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
  );
});

// Activation event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME &&
                cacheName !== STATIC_CACHE_NAME &&
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName !== API_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== self.location.origin && !url.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(getResponseWithStrategy(request));
});

// Determine caching strategy based on request type
async function getResponseWithStrategy(request) {
  const url = new URL(request.url);

  // Static assets - Cache First strategy
  if (isStaticAsset(request)) {
    return cacheFirst(request, STATIC_CACHE_NAME);
  }

  // API calls - Network First strategy with timeout fallback
  if (url.pathname.startsWith('/api/')) {
    return networkFirst(request, API_CACHE_NAME, 3000);
  }

  // Dynamic pages - Stale While Revalidate strategy
  if (isPageRequest(request)) {
    return staleWhileRevalidate(request, DYNAMIC_CACHE_NAME);
  }

  // Default - Network with fallback
  return networkFirst(request, DYNAMIC_CACHE_NAME, 5000);
}

// Check if request is for static asset
function isStaticAsset(request) {
  return request.url.includes('/static/') ||
         request.url.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/);
}

// Check if request is for page
function isPageRequest(request) {
  return request.mode === 'navigate' ||
         (request.headers.get('accept')?.includes('text/html'));
}

// Cache First strategy
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Not in cache, fetch from network
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache First strategy failed:', error);
    throw error;
  }
}

// Network First strategy with timeout
async function networkFirst(request, cacheName, timeout = 3000) {
  const cache = await caches.open(cacheName);

  try {
    // Try network with timeout
    const networkPromise = fetch(request);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Network timeout')), timeout)
    );

    const networkResponse = await Promise.race([networkPromise, timeoutPromise]);

    if (networkResponse.ok) {
      // Cache the successful response
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('[SW] Network request failed, trying cache:', error.message);
  }

  // Fallback to cache
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // If no cached response, return appropriate offline response
  return getOfflineResponse(request);
}

// Stale While Revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Always fetch from network in background
  const networkPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch((error) => {
    console.log('[SW] Background fetch failed:', error);
  });

  // Return cached response immediately if available
  if (cachedResponse) {
    networkPromise; // Continue network request in background
    return cachedResponse;
  }

  // No cached response, wait for network
  try {
    return await networkPromise;
  } catch (error) {
    return getOfflineResponse(request);
  }
}

// Get offline response based on request type
function getOfflineResponse(request) {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/api/')) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Offline - No cached data available',
        offline: true
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  if (isPageRequest(request)) {
    return caches.match('/offline.html') || new Response(
      '<h1>Offline</h1><p>You are currently offline. Please check your connection.</p>',
      {
        status: 503,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }

  return new Response('Offline - No cached version available', { status: 503 });
}

// Background sync for API requests that failed offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-api') {
    event.waitUntil(syncFailedRequests());
  }
});

// Sync failed requests made while offline
async function syncFailedRequests() {
  try {
    const failedRequests = await getFailedRequests();

    for (const request of failedRequests) {
      try {
        await fetch(request.url, request.options);
        await removeFailedRequest(request.id);
        console.log('[SW] Background sync successful for:', request.url);
      } catch (error) {
        console.error('[SW] Background sync failed for:', request.url, error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Get failed requests from IndexedDB
async function getFailedRequests() {
  // Implementation would use IndexedDB to store failed requests
  // For now, return empty array
  return [];
}

// Remove failed request from IndexedDB after successful sync
async function removeFailedRequest(requestId) {
  // Implementation would remove from IndexedDB
  console.log('[SW] Removing failed request:', requestId);
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: data.data,
      actions: [
        {
          action: 'view',
          title: 'View'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Periodic background sync for data updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-cache') {
    event.waitUntil(updateCache());
  }
});

// Update cached data periodically
async function updateCache() {
  try {
    // Refresh cached API data
    for (const apiUrl of API_URLS_TO_CACHE) {
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const cache = await caches.open(API_CACHE_NAME);
          const request = new Request(apiUrl);
          await cache.put(request, response);
        }
      } catch (error) {
        console.log('[SW] Failed to update cache for:', apiUrl);
      }
    }
    console.log('[SW] Cache updated successfully');
  } catch (error) {
    console.error('[SW] Cache update failed:', error);
  }
}

// Cleanup old cache entries
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_UPDATED') {
    // Handle cache update messages from main thread
    console.log('[SW] Cache update message received');
  }
});

console.log('[SW] Service Worker loaded successfully');