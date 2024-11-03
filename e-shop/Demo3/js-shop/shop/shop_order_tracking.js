document.getElementById("start-camera").addEventListener("click", async function() {
  const video = document.getElementById("video");
  const resultSpan = document.getElementById("result");
  const startButton = document.getElementById("start-camera");

  // Hide the button and show the video element
  startButton.style.display = "none";
  video.style.display = "block";

  // Initialize qr-scanner
  const qrScanner = new QrScanner(video, result => {
      resultSpan.textContent = result;
      console.log("QR Code Detected:", result);

      // Stop scanning after detecting a QR code
      qrScanner.stop();
      video.style.display = "none";
      startButton.style.display = "block"; // Show button again if needed
  }, {
      // Optional: specify facingMode to "environment" for rear camera
      preferredCamera: 'environment'
  });

  // Start the scanner
  try {
      await qrScanner.start();
  } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access the camera.");
      video.style.display = "none";
      startButton.style.display = "block";
  }
});
