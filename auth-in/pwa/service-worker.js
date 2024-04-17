const CACHE_NAME = 'payuee';
const CACHE_VERSION = '0.02'; // Incremented cache version
const CACHE_KEY = CACHE_NAME + '-' + CACHE_VERSION;

const FILES_TO_CACHE = [
    '/',
    '/index-in.html',
    '/index.html', // Add the page you want to show offline
    '/data.html', 
    '/airtime.html', 
    '/electricity.html', 
    '/faq.html', 
    '/chat-us.html', 
    '/educational-payments.html', 
    '/fund-wallet.html', 
    '/notification.html', 
    '/password-change.html', 
    '/personal-information.html', 
    '/recharge-pin.html', 
    '/send-funds.html', 
    '/subscriptions.html', 
    '/transaction.html', 
    '/tv.html', 
    '/verified-number.html', 
    '/help-support.html', 
    '/no-internet.html', 
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

// Fetch resources from cache or network
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

// Event listener for fetch requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetchResource(event).catch(() => {
            // Fallback to the offline page if the resource is not cached
            return caches.match('/index.html');
        })
    );
});

// Clean up old caches on activate
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



// const CACHE_NAME = 'payuee';
// const CACHE_VERSION = '0.01'; // Incremented cache version
// const CACHE_KEY = CACHE_NAME + '-' + CACHE_VERSION;

// const FILES_TO_CACHE = [
//     '/',
//     '/index-in.html',
//     // '/', // Assuming Payuee is a folder
//     // Add other files or folders to cache as needed
//   ];
  
//   // Event listener for installing the service worker
// self.addEventListener('install', (event) => {
// event.waitUntil(
//     caches.open(CACHE_KEY).then((cache) => {
//     return cache.addAll(FILES_TO_CACHE);
//     })
// );
// });
  
// self.addEventListener('activate', (event) => {
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((name) => {
//           if (name !== CACHE_KEY) {
//             return caches.delete(name);
//           }
//         })
//       );
//     })
//   );
// });

// const fetchResource = (event) => {
//   return caches.match(event.request).then((response) => {
//     if (response) {
//       return response;
//     }

//     return fetch(event.request).then((res) => {
//       if (!res || res.status !== 200 || res.type !== 'basic') {
//         return res;
//       }

//       const clonedResponse = res.clone();
//       caches.open(CACHE_KEY).then((cache) => {
//         cache.put(event.request, clonedResponse);
//       });

//       return res;
//     });
//   });
// };

// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     fetchResource(event).catch(() => {
//       return caches.match('index-in.html'); // Provide a fallback for offline scenarios
//     })
//   );
// });
