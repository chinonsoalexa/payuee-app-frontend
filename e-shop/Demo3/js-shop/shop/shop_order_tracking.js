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
        if (result) {
          resultSpan.textContent = result.text;
          console.log("QR Code Detected:", result.text);

          codeReader.reset();
          stream.getTracks().forEach(track => track.stop());
          video.srcObject = null;
          scanning = false;
        } else if (error && !(error instanceof ZXing.NotFoundException)) {
          console.error("QR Code scan error:", error);
        }
      });
    }
  } catch (error) {
    console.error("Error accessing camera:", error);
    alert("Could not access the camera.");
    scanning = false;
  }
});