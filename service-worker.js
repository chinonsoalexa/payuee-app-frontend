// const CACHE_NAME = 'payuee';
// const CACHE_VERSION = '0.03'; // Incremented cache version
// const CACHE_KEY = CACHE_NAME + '-' + CACHE_VERSION;

// // Cache expiration time in milliseconds (1 week)
// // const CACHE_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days
// const CACHE_EXPIRATION_TIME =  30 * 60 * 1000; // 30 minutes

// const FILES_TO_CACHE = [
//     '/',
//     '/index.html',
//     '/manifest.json',
//     '/index-in.html',
//     '/data.html', 
//     '/airtime.html', 
//     '/electricity.html', 
//     '/faq.html', 
//     '/chat-us.html', 
//     '/educational-payments.html', 
//     '/fund-wallet.html', 
//     '/notification.html', 
//     '/password-change.html', 
//     '/personal-information.html', 
//     '/recharge-pin.html', 
//     '/send-funds.html', 
//     '/subscriptions.html', 
//     '/transaction.html', 
//     '/tv.html', 
//     // '/verified-number.html', 
//     '/help-support.html', 
//     // '/no-internet-error.html', 

//     // auth page to cache
//     '/page/about.html', 
//     '/page/blog-details.html', 
//     '/page/blog-list.html', 
//     '/page/chat-us.html', 
//     '/page/faq.html', 
//     '/page/forgot-email-to-send.html', 
//     '/page/forgot-password.html', 
//     '/page/forgot-sent-email.html', 
//     '/page/password.html', 
//     '/page/signin-new.html', 
//     '/page/signup-confirm-otp-new.html', 
//     '/page/signup-new.html', 
//     '/page/signup-verify-otp-new.html', 

//     // js auth pages to cache
//     '/auth/forgot-password/forgot-email-to-send.js',
//     '/auth/forgot-password/forgot-password.js',
//     '/auth/forgot-password/forgot-sent-email.js',
//     '/auth/otp-verification/signup-confirm-otp-new.js',
//     '/auth/otp-verification/signup-verify-otp-new.js',
//     // '/auth/otp-verification/verify-email.js',
//     '/auth/signin/signin-new.js',
//     // '/auth/signup-new.js',
//     '/auth/404.js',
//     '/auth/auth-page-in.js',
//     '/auth/auth-page.js',

//     // js auth-in page
//     '/auth-in/blog/blogList.js',
//     '/auth-in/blog/blogListDetails.js',
//     '/auth-in/blog/blogListOut.js',
//     '/auth-in/blog/blogListOutDetails.js',
//     '/auth-in/profile/password-change.js',
//     '/auth-in/profile/personal-information.js',
//     '/auth-in/profile/subscriptions.js',
//     '/auth-in/profile/success-trans-id.js',
//     '/auth-in/profile/transaction.js',
//     '/auth-in/subscriptions/airtime.js',
//     '/auth-in/subscriptions/cancel-transaction.js',
//     '/auth-in/subscriptions/data.js',
//     '/auth-in/subscriptions/educational-payments.js',
//     '/auth-in/subscriptions/electricity.js',
//     '/auth-in/subscriptions/email-subscription.js',
//     '/auth-in/subscriptions/fund-wallet.js',
//     '/auth-in/subscriptions/halfSuccessful.js',
//     '/auth-in/subscriptions/recharge-pin.js',
//     '/auth-in/subscriptions/send-funds.js',
//     '/auth-in/subscriptions/success.js',
//     '/auth-in/subscriptions/tv.js',
//     '/auth-in/index-in.js',

//     // css file cache
//     '/assets/css/animate.css',
//     '/assets/css/bootstrap.min.css',
//     '/assets/css/datepickerboot.css',
//     '/assets/css/google-font.css',
//     '/assets/css/magnific-popup.min.css',
//     '/assets/css/main.css',
//     '/assets/css/nice-select.css',
//     '/assets/css/odometer.min.css',
//     '/assets/css/owl.carousel.min.css',
//     '/assets/css/owl.theme.default.css',
//     '/assets/css/owl.video.play.html',
//     '/assets/css/popup.css',
//     '/assets/css/prism.css',
//     '/assets/css/tutorialsVideo.css',

//     // images file cache
//     '/assets/img/logo/payuee-logo.png',

//     // js raw file cache
//     // '/assets/js/*.js',
// ];
// // Store the cache creation time in local storage
// const CACHE_CREATION_TIME_KEY = 'cache_creation_time';

// // Event listener for installing the service worker
// self.addEventListener('install', (event) => {
//     const now = Date.now();
//     localStorage.setItem(CACHE_CREATION_TIME_KEY, now);

//     event.waitUntil(
//         caches.open(CACHE_KEY).then((cache) => {
//             return cache.addAll(FILES_TO_CACHE);
//         })
//     );
// });

// // Event listener for activating the service worker and clearing old caches
// self.addEventListener('activate', (event) => {
//     event.waitUntil(
//         caches.keys().then((cacheNames) => {
//             return Promise.all(
//                 cacheNames.map((cacheName) => {
//                     if (cacheName !== CACHE_KEY) {
//                         return caches.delete(cacheName);
//                     }
//                 })
//             );
//         })
//     );
// });

// // Event listener for fetch requests with cache expiration logic
// self.addEventListener('fetch', (event) => {
//     event.respondWith(
//         caches.match(event.request).then((response) => {
//             if (response) {
//                 const cacheCreationTime = localStorage.getItem(CACHE_CREATION_TIME_KEY);
//                 const cacheAge = Date.now() - cacheCreationTime;

//                 // Invalidate the cache if it is older than the expiration time
//                 if (cacheAge > CACHE_EXPIRATION_TIME) {
//                     return fetchAndUpdateCache(event.request);
//                 }

//                 return response;
//             }

//             return fetchAndUpdateCache(event.request);
//         })
//     );
// });

// // Function to fetch from the network and update the cache
// function fetchAndUpdateCache(request) {
//     return fetch(request).then((networkResponse) => {
//         if (request.url.startsWith(self.location.origin)) {
//             caches.open(CACHE_KEY).then((cache) => {
//                 cache.put(request, networkResponse.clone());
//             });
//         }
//         return networkResponse;
//     });
// }