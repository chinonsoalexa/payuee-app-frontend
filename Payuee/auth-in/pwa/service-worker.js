// service-worker.js

const CACHE_NAME = 'Payuee';
const CACHE_VERSION = 'v1';
const CACHE_KEY = CACHE_NAME + '-' + CACHE_VERSION;

// Event listener for installing the service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_KEY).then((cache) => {
      return cache.addAll([
        '/',
        '/Payuee/'
        // Add other files to cache as needed
      ]);
    })
  );
});

// Event listener for activating the service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_KEY) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// Function to fetch resources
const fetchResource = (event) => {
  return caches.match(event.request).then((response) => {
    if (response) {
      return response;
    }

    return fetch(event.request).then((res) => {
      if (!res || res.status !== 200 || res.type !== 'basic') {
        return res;
      }

      const clonedResponse = res.clone();
      caches.open(CACHE_KEY).then((cache) => {
        cache.put(event.request, clonedResponse);
      });

      return res;
    });
  });
};

// Event listener for fetching resources
self.addEventListener('fetch', (event) => {
  event.respondWith(fetchResource(event));
});

// Event listener for handling background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-example') {
    event.waitUntil(
      // Perform background sync tasks
      console.log('Background sync example triggered.')
    );
  }
});

// Event listener for handling push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icon.png'
  };

  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});

// Event listener for handling notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // Handle notification click event as needed
});
