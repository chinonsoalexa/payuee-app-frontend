document.getElementById("start-camera").addEventListener("click", async function() {
  const video = document.getElementById("video");
  const resultSpan = document.getElementById("result");
  let scanning = false; // Flag to prevent reinitializing the scan

  // Display the video element
  video.style.display = "block";
  const codeReader = new ZXing.BrowserQRCodeReader(100); // Fast scan delay

  try {
    // Prevent reinitialization if already scanning
    if (!scanning) {
      scanning = true; // Set scanning flag to true

      // Request access to the camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      video.srcObject = stream; // Set the video source to the stream

      // Start decoding from the video element
      codeReader.decodeFromVideoElement(video, (result, error) => {
        if (result) {
          // QR code detected
          resultSpan.textContent = result.text;
          console.log("QR Code Detected:", result.text);
          
          // Stop scanning and release resources
          stopScanning(codeReader, stream, video);
        } else if (error && !(error instanceof ZXing.NotFoundException)) {
          console.error("QR Code scan error:", error);
        }
      });
    }
  } catch (error) {
    console.error("Error accessing camera:", error);
    alert("Could not access the camera.");
    scanning = false; // Reset the flag on error
  }
});

// Function to stop scanning and release resources
function stopScanning(codeReader, stream, video) {
  codeReader.reset(); // Stop decoding
  stream.getTracks().forEach(track => track.stop()); // Stop camera stream
  video.srcObject = null; // Clear video source
  scanning = false; // Reset the scanning flag
}
