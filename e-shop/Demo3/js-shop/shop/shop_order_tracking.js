    const videoElement = document.getElementById('preview');
    const resultSpan = document.getElementById('result');
    const orderID = document.getElementById('orderID');
    const startCameraButton = document.getElementById('start-camera');

    let scanner;
    let scanning = false;

    startCameraButton.addEventListener('click', async function() {
      if (scanning) return; // Prevent re-initialization
      scanning = true;

      // Hide order ID input and show video element
      orderID.classList.add('hidden'); // Assuming you have an orderID element
      videoElement.classList.remove('hidden');

      try {
        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }});
        videoElement.srcObject = stream;

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

    // Track order button click handler (assuming you have this functionality)
    // ...

    function stopScanner() {
      if (scanner) {
        scanner.stop().then(() => {
          console.log("Scanner stopped.");
        }).catch(error => {
          console.error("Error stopping scanner:", error);
        });
      }
    }