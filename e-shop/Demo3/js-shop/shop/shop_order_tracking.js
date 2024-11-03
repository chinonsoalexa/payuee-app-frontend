document.getElementById("start-camera").addEventListener("click", async function() {
    const video = document.getElementById("video");
    const resultSpan = document.getElementById("result");
    const startButton = document.getElementById("start-camera");
  
    startButton.style.display = "none";
    video.style.display = "block";
  
    const codeReader = new ZXing.BrowserQRCodeReader(500); // Set time between scans
  
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      
      video.srcObject = stream;
  
      codeReader.decodeFromVideoElement(video, (result, error) => {
        if (result) {
          resultSpan.textContent = result.text;
          console.log("QR Code Detected:", result.text);
          codeReader.reset(); // Stop scanning after detecting one code
        } else if (error && !(error instanceof ZXing.NotFoundException)) {
          console.error("QR Code scan error:", error);
        }
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access the camera.");
    }
  });
  