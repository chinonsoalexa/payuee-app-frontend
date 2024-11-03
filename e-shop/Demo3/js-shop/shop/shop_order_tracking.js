document.getElementById("start-camera").addEventListener("click", function() {
  // Hide the start button once the scanner starts
  document.getElementById("start-camera").style.display = "none";

  const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      // Handle the result of a successful QR code scan
      document.getElementById("result").textContent = decodedText;
      console.log("QR Code Detected:", decodedText);

      // Stop the scanner after scanning the QR code
      html5QrcodeScanner.clear().then(() => {
          console.log("Camera stopped.");
      }).catch((error) => {
          console.error("Error stopping camera:", error);
      });
  };

  const qrCodeErrorCallback = (errorMessage) => {
      // Ignore non-critical errors (optional)
      console.log("Scanning error:", errorMessage);
  };

  // Start the QR code scanner
  const html5QrcodeScanner = new Html5Qrcode("qr-reader");
  html5QrcodeScanner.start(
      { facingMode: "environment" }, // Set to "environment" for rear camera
      { fps: 10, qrbox: { width: 250, height: 250 } },
      qrCodeSuccessCallback,
      qrCodeErrorCallback
  ).catch((error) => {
      console.error("Unable to start scanning:", error);
      alert("Could not access the camera.");
  });
});
