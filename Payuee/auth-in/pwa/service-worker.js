const CACHE_NAME = 'Payuee';
const CACHE_VERSION = 'v2'; // Incremented cache version
const CACHE_KEY = CACHE_NAME + '-' + CACHE_VERSION;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_KEY).then((cache) => {
      return cache.addAll([
        '/index-in.html',
        '/Payuee/',
        // Add other files to cache as needed
      ]);
    })
  );
});

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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetchResource(event).catch(() => {
      return caches.match('index-in.html'); // Provide a fallback for offline scenarios
    })
  );
});
