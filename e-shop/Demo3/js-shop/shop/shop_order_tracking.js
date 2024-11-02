document.getElementById("start-camera").addEventListener("click", function() {
    const videoContainerId = "video-container"; // ID for the container element
    const resultSpan = document.getElementById("result");
    const startButton = document.getElementById("start-camera");
  
    // Hide the button and show the video element
    startButton.style.display = "none";
  
    // Initialize html5-qrcode scanner
    const html5QrCode = new Html5Qrcode(videoContainerId);
  
    // Start QR code scanning with settings for environment-facing camera
    html5QrCode.start(
      { facingMode: "environment" }, // Use environment camera
      {
        fps: 10,            // Set scan attempts per second
        qrbox: { width: 250, height: 250 }  // Optional scanning box size
      },
      qrCodeMessage => {
        // Display the scanned QR code result
        resultSpan.textContent = qrCodeMessage;
        console.log("QR Code Result:", qrCodeMessage);
  
        // Stop scanning after a successful scan
        html5QrCode.stop().catch(err => console.error("Error stopping scanner:", err));
      },
      errorMessage => {
        // Handle errors or no QR code found
        console.log("No QR Code found or scanning error:", errorMessage);
      }
    ).catch(err => {
      console.error("Error starting camera:", err);
      alert("Could not access the camera.");
    });
  });
  