document.getElementById("start-camera").addEventListener("click", async function() {
  const video = document.getElementById("video");
  const resultSpan = document.getElementById("result");
  const startButton = document.getElementById("start-camera");

  // Hide the button and display the video element
  video.style.display = "block";
  
  const codeReader = new ZXing.BrowserQRCodeReader(100); // Faster scan delay

  try {
    // Check if there's already an active stream
    if (!video.srcObject) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      
      video.srcObject = stream;
      
      // Start scanning for QR code
      codeReader.decodeFromVideoElement(video, (result, error) => {
        if (result) {
          resultSpan.textContent = result.text;
          console.log("QR Code Detected:", result.text);

          // Stop scanning and close the camera
          codeReader.reset();
          stream.getTracks().forEach(track => track.stop()); // Stop the camera stream
          video.srcObject = null; // Clear the video source
        } else if (error && !(error instanceof ZXing.NotFoundException)) {
          console.error("QR Code scan error:", error);
        }
      });
    }
  } catch (error) {
    console.error("Error accessing camera:", error);
    alert("Could not access the camera.");
  }
});
