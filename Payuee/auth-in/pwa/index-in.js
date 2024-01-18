let deferredPrompt;

// Check if the user is on a mobile device
const isMobileDevice = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

// Check if the PWA has been installed
const isAppInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
};

// Function to show the install button
const showInstallButton = () => {
  // Display a button or UI element to prompt the user to install the app
  const installButton = document.getElementById('install-button');
  installButton.style.display = 'block';

  installButton.addEventListener('click', () => {
    // Trigger the deferredPrompt to show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }

      // Reset the deferredPrompt to null
      deferredPrompt = null;

      // Hide the install button
      installButton.style.display = 'none';
    });
  });
};

// Check if the user is on a mobile device and the PWA is not installed after 5 seconds
setTimeout(() => {
  if (isMobileDevice() && !isAppInstalled()) {
    showInstallButton();
  }
}, 5000);

// Event listener for beforeinstallprompt
window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  event.preventDefault();

  // Stash the event so it can be triggered later
  deferredPrompt = event;
});
