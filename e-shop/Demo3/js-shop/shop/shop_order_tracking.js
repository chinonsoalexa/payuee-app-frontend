(async function() {
  const video = document.getElementById("video");
  const resultSpan = document.getElementById("result");

  // Use ZXing's BrowserQRCodeReader for real-time scanning
  const codeReader = new ZXing.BrowserQRCodeReader();

  try {
    // Get video stream from the user's camera
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
    video.srcObject = stream;

    // Start scanning the QR code from the video stream
    codeReader.decodeFromVideoElement(video, (result, error) => {
      if (result) {
        resultSpan.textContent = result.text;
        console.log("QR Code Result:", result.text);
        codeReader.reset(); // Stops scanning once QR code is found
      } else if (error && !(error instanceof ZXing.NotFoundException)) {
        console.error("QR Code scan error:", error);
      }
    });
  } catch (error) {
    console.error("Error accessing camera:", error);
  }
})();
