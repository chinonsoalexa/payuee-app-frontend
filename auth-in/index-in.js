let deferredPrompt;

// Check if the PWA has been installed
const isAppInstalled = () => {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
};

// Check if the user is on an iPhone
const isiPhone = () => {
    return /iPhone/i.test(navigator.userAgent);
};

document.addEventListener('DOMContentLoaded', () => {

    const installPopup = document.getElementById('install-popup');
    const installButton = document.getElementById('install-btn');
    const cancelButton = document.getElementById('cancel-btn');

    // Show the popup only if the PWA is not installed and the user is not on an iPhone
    if (!isAppInstalled() && !isiPhone()) {
        setTimeout(() => {
            installPopup.style.display = 'block';
        }, 2000);
    }

    // Install button click event
    installButton.addEventListener('click', () => {
        // Trigger the PWA installation prompt (assuming deferredPrompt is set globally)
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    // User accepted the A2HS prompt
                } else {
                    // User dismissed the A2HS prompt
                }
                deferredPrompt = null;
            });
        }

        // Hide the popup
        installPopup.style.display = 'none';
    });

    // Cancel button click event
    cancelButton.addEventListener('click', () => {
        // Hide the popup without triggering the PWA installation
        installPopup.style.display = 'none';
    });
});

// Event listener for beforeinstallprompt
window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    event.preventDefault();

    // Stash the event so it can be triggered later
    deferredPrompt = event;
});

// Check if the user is on a mobile device
// const isMobile = () => {
//   return /Mobi|Android/i.test(navigator.userAgent);
// };

// Register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../../service-worker.js')
        .then(registration => {
            //   console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
            //   console.error('Service Worker registration failed:', error);
        });
}
