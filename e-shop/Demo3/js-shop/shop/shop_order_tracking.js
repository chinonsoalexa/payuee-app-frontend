document.getElementById("start-camera").addEventListener("click", async function() {
    const video = document.getElementById("video");
    const resultSpan = document.getElementById("result");
    const startButton = document.getElementById("start-camera");
  
    // Hide the button and show the video element
    startButton.style.display = "none";
    video.style.display = "block";
  
    // Initialize the ZXing code reader
    const codeReader = new ZXing.BrowserQRCodeReader(500); // Scanning delay set to 500ms
  
    try {
      // Get the video stream from the user's camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      video.srcObject = stream;
  
      // Start scanning the QR code from the video stream
      codeReader.decodeFromVideoElement(video, (result, error) => {
        if (result) {
          // Display the QR code result
          resultSpan.textContent = result.text;
          console.log("QR Code Result:", result.text);
  
          // Stop scanning once a QR code is detected
          codeReader.reset();
          stream.getTracks().forEach(track => track.stop()); // Stop the camera
        } else if (error && !(error instanceof ZXing.NotFoundException)) {
          console.error("QR Code scan error:", error);
        }
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access the camera.");
    }
  });
  