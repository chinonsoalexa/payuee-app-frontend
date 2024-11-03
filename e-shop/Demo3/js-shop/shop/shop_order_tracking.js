const videoElement = document.getElementById('preview');
    const resultSpan = document.getElementById('result');
    const startCameraButton = document.getElementById('start-camera');
    const orderIDInput = document.getElementById('orderID');
    const trackOrderButton = document.getElementById('trackOrder');

    let scanner; // Scanner object declared outside click events for reusability

    // Start camera button click handler
    startCameraButton.addEventListener('click', async function() {
      if (scanning) return; // Prevent re-initialization
      scanning = true;

      // Hide order ID input and show video element
      orderIDInput.classList.add('hidden');
      videoElement.classList.remove('hidden');

      try {
        const cameras = await Instascan.Camera.getCameras();
        if (cameras.length > 0) {
          scanner = new Instascan.Scanner({ video: videoElement });
          scanner.addListener('scan', function (content) {
            console.log("QR Code Detected:", content);
            resultSpan.textContent = content; // Display scanned data

            // Add logic to handle the scanned order ID (e.g., send to server, display tracking information)

            scanning = false;
            stopScanner(); // Stop scanning after successful detection
          });
          await scanner.start(cameras[0]);
        } else {
          console.error('No cameras found.');
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        scanning = false;
      }
    });

    // Track order button click handler
    trackOrderButton.addEventListener('click', function(event) {
      event.preventDefault();

      // Logic to handle order ID input (e.g., validate, submit to server for tracking)

      // Reset scanning state if previously triggered
      scanning = false;
      stopScanner();

      // Optionally, show order ID input and hide video element
      orderIDInput.classList.remove('hidden');
      videoElement.classList.add('hidden');
    });

    function stopScanner() {
      if (scanner) {
        scanner.stop().then(() => {
          console.log("Scanner stopped.");
        }).catch(error => {
          console.error("Error stopping scanner:", error);
        });
      }
    }