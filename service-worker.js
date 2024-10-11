// const CACHE_NAME = 'payuee';
// const CACHE_VERSION = '0.03'; // Incremented cache version
// const CACHE_KEY = CACHE_NAME + '-' + CACHE_VERSION;

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

// // Event listener for installing the service worker
// self.addEventListener('install', (event) => {
//     event.waitUntil(
//         // caches.open(CACHE_KEY).then((cache) => {
//         //     return cache.addAll(FILES_TO_CACHE)
//         // })
//     );
// });

// // Event listener for fetch requests
// self.addEventListener('fetch', (event) => {
//     // Ignore cross-origin requests (like API calls)
//     if (event.request.mode !== 'navigate') {
//         return;
//     }

//     event.respondWith(
//         caches.match(event.request)
//             .then(response => {
//                 // If there is a match in the cache, return it
//                 if (response) {
//                     return response;
//                 }

//                 // Otherwise, fetch from the network
//                 return fetch(event.request).then(networkResponse => {
//                     // Optionally cache the new network response (static files)
//                     if (event.request.url.startsWith(self.location.origin)) {
//                         return caches.open(CACHE_KEY).then(cache => {
//                             cache.put(event.request, networkResponse.clone());
//                             return networkResponse;
//                         });
//                     }
//                     return networkResponse;
//                 });
//             })
//             .catch(() => {
//                 // Fallback if neither cache nor network is available
//                 return caches.match('/no-internet-error.html');
//             })
//     );
// });
