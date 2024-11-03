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
  orderID.classList.add('hidden');
  videoElement.classList.remove('hidden');

  try {
    // Request camera permission
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }});
    videoElement.srcObject = stream; // Set stream directly to video element

    const cameras = await Instascan.Camera.getCameras();
    if (cameras.length > 0) {
      scanner = new Instascan.Scanner({ video: videoElement });
      scanner.addListener('scan', function(content) {
        console.log("QR Code Detected:", content);
        resultSpan.textContent = content;

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

function stopScanner() {
  if (scanner) {
    scanner.stop().then(() => {
      console.log("Scanner stopped.");
    }).catch(error => {
      console.error("Error stopping scanner:", error);
    });
  }
}
