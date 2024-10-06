const CACHE_NAME = 'payuee';
const CACHE_VERSION = '0.03'; // Incremented cache version
const CACHE_KEY = CACHE_NAME + '-' + CACHE_VERSION;

const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/index-in.html',
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
    // '/no-internet-error.html', 

    // auth page to cache
    '/page/about.html', 
    '/page/blog-details.html', 
    '/page/blog-list.html', 
    '/page/chat-us.html', 
    '/page/faq.html', 
    '/page/forgot-email-to-send.html', 
    '/page/forgot-password.html', 
    '/page/forgot-sent-email.html', 
    '/page/password.html', 
    '/page/signin-new.html', 
    '/page/signup-confirm-otp-new.html', 
    '/page/signup-new.html', 
    '/page/signup-verify-otp-new.html', 

    // js auth pages to cache
    '/forgot-password/forgot-email-to-send.js',
    '/forgot-password/forgot-password.js',
    '/forgot-password/forgot-sent-email.js',
    '/otp-verification/signup-confirm-otp-new.js',
    '/otp-verification/signup-verify-otp-new.js',
    '/otp-verification/verify-email.js',
    '/signin/signin-new.js',
    '/signup-new.js',
    '/404.js',
    '/auth-page-in.js',
    '/auth-page.js',

    // js auth-in page
    '/blog/blogList.js',
    '/blog/blogListDetails.js',
    '/blog/blogListOut.js',
    '/blog/blogListOutDetails.js',
    '/profile/password-change.js',
    '/profile/personal-information.js',
    '/profile/subscriptions.js',
    '/profile/success-trans-id.js',
    '/profile/transaction.js',
    '/subscriptions/airtime.js',
    '/subscriptions/cancel-transaction.js',
    '/subscriptions/data.js',
    '/subscriptions/educational-payments.js',
    '/subscriptions/electricity.js',
    '/subscriptions/email-subscription.js',
    '/subscriptions/fund-wallet.js',
    '/subscriptions/halfSuccessful.js',
    '/subscriptions/recharge-pin.js',
    '/subscriptions/send-funds.js',
    '/subscriptions/success.js',
    '/subscriptions/tv.js',
    '/index-in.js',

    // css file cache
    '/assets/css/animate.css',
    '/assets/css/bootstrap.min.css',
    '/assets/css/datepickerboot.css',
    '/assets/css/google-font.css',
    '/assets/css/magnific-popup.min.css',
    '/assets/css/main.css',
    '/assets/css/nice-select.css',
    '/assets/css/odometer.min.css',
    '/assets/css/owl.carousel.min.css',
    '/assets/css/owl.theme.default.css',
    '/assets/css/owl.video.play.html',
    '/assets/css/popup.css',
    '/assets/css/prism.css',
    '/assets/css/tutorialsVideo.css',

    // images file cache
    '/assets/img/logo/payuee-logo.png',

    // js raw file cache
    // '/assets/js/*.js',
];

// Event listener for installing the service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_KEY).then((cache) => {
            return cache.addAll(FILES_TO_CACHE)
            // .catch((error) => {
            //     console.error('Failed to cache:', error);
            // });
        })
    );
});

// Event listener for fetch requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});