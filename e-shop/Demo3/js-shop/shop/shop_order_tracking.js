document.getElementById("start-camera").addEventListener("click", async function() {
  const video = document.getElementById("video");
  const resultSpan = document.getElementById("result");
  const startButton = document.getElementById("start-camera");

  video.style.display = "block";

  // Try with a faster scan interval for responsiveness
  const codeReader = new ZXing.BrowserQRCodeReader(100);

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });

    video.srcObject = stream;

    codeReader.decodeFromVideoElement(video, (result, error) => {
      if (result) {
        resultSpan.textContent = result.text;
        console.log("QR Code Detected:", result.text);
        codeReader.reset();
        stream.getTracks().forEach(track => track.stop()); // Stop the camera after detecting
      } else if (error && !(error instanceof ZXing.NotFoundException)) {
        console.error("QR Code scan error:", error);
      } else {
        console.log("Scanning attempt, no QR code found yet."); // Logs when no code is found
      }
    });
  } catch (error) {
    console.error("Error accessing camera:", error);
    alert("Could not access the camera.");
  }
});
