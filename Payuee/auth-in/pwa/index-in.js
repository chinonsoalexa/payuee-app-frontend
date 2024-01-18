let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  event.preventDefault();

  // Stash the event so it can be triggered later
  deferredPrompt = event;

  // Show a custom install button or similar
  showInstallButton();
});

function showInstallButton() {
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
    });

    // Hide the install button
    installButton.style.display = 'none';
  });
}
