// Function called when a QR code is successfully scanned
function onScanSuccess(decodedText, decodedResult) {
  document.getElementById('result').innerText = decodedText; // Display the result
  console.log(`QR Code scanned: ${decodedText}`);
  const reader = document.getElementById('reader');
  reader.classList.add('hidden');

  html5QrcodeScanner.clear().then(() => {
    console.log("Scanner stopped.");
  }).catch((error) => {
    console.error("Error stopping scanner:", error);
  });
}

// Function called when there's a scanning error (e.g., QR code not found)
function onScanFailure(error) {
  console.warn(`QR Code scan error: ${error}`);
}

// Initialize the QR Code scanner, but don't start immediately
const html5QrcodeScanner = new Html5QrcodeScanner(
  "reader", 
  {
    fps: 10,            // Frames per second for scanning
    qrbox: { width: 250, height: 250 } // Define scan area size
  }
);

// Start scanning when the "Start Scanning" button is clicked
document.getElementById("startScan").addEventListener("click", () => {
  const orderIDInput = document.getElementById('orderID');
  const trackOrder = document.getElementById('trackOrder');
  const reader = document.getElementById('reader');
  const stopScan = document.getElementById('stopScan');
  // Hide order ID input and show video element
  orderIDInput.classList.add('hidden');
  trackOrder.classList.add('hidden');
  reader.classList.remove('hidden');
  stopScan.classList.remove('hidden');

  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    })
    .catch((error) => {
      console.error("Camera access denied or unavailable:", error);
    });
});

// Stop scanning when the "Stop Scanning" button is clicked
document.getElementById("stopScan").addEventListener("click", () => {
  const orderIDInput = document.getElementById('orderID');
  const trackOrder = document.getElementById('trackOrder');
  const stopScan = document.getElementById('stopScan');
  const reader = document.getElementById('reader');
  // Hide order ID input and show video element
  orderIDInput.classList.remove('hidden');
  trackOrder.classList.remove('hidden');
  reader.classList.add('hidden');
  stopScan.classList.add('hidden');

  html5QrcodeScanner.clear().then(() => {
    console.log("Scanner stopped.");
  }).catch((error) => {
    console.error("Error stopping scanner:", error);
  });
});