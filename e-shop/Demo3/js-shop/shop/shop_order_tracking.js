document.getElementById("start-camera").addEventListener("click", async function() {
  const video = document.getElementById("video");
  const resultSpan = document.getElementById("result");

  // Flag to prevent reinitializing the scan
  let scanning = false;

  // Display the video element
  video.style.display = "block";

  const codeReader = new ZXing.BrowserQRCodeReader(5000); // Fast scan delay

  try {
    if (!scanning) {
      scanning = true;
      
      // Await for the stream before setting video source
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      
      video.srcObject = stream;

      codeReader.decodeFromVideoElement(video, (result, error) => {
        // ... (rest of your code remains the same)
      });
    }
  } catch (error) {
    // ... (error handling remains the same)
  }
});