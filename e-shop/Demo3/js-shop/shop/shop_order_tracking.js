document.getElementById("start-camera").addEventListener("click", async function() {
  const video = document.getElementById("video");
  const resultSpan = document.getElementById("result");
  // const startButton = document.getElementById("start-camera");

  // Flag to prevent reinitializing the scan
  let scanning = false;

  // Display the video element
  video.style.display = "block";

  const codeReader = new ZXing.BrowserQRCodeReader(100); // Fast scan delay

  try {
    // Check if already scanning to prevent reinitialization
    if (!scanning) {
      scanning = true;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      video.srcObject = stream;

      // Start decoding from video element
      codeReader.decodeFromVideoElement(video, (result, error) => {
        if (result) {
          resultSpan.textContent = result.text;
          console.log("QR Code Detected:", result.text);

          // Stop scanning once a result is found
          codeReader.reset();
          stream.getTracks().forEach(track => track.stop()); // Stop camera stream
          video.srcObject = null; // Clear video source to fully stop
          scanning = false; // Reset the flag
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
