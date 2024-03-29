const CACHE_NAME = 'payuee';
const CACHE_VERSION = '0.01'; // Incremented cache version
const CACHE_KEY = CACHE_NAME + '-' + CACHE_VERSION;

const FILES_TO_CACHE = [
    '/',
    '/index-in.html',
    // '/Payuee/', // Assuming Payuee is a folder
    // Add other files or folders to cache as needed
  ];
  
  // Event listener for installing the service worker
self.addEventListener('install', (event) => {
event.waitUntil(
    caches.open(CACHE_KEY).then((cache) => {
    return cache.addAll(FILES_TO_CACHE);
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
