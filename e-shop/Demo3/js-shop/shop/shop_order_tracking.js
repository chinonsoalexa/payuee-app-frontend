document.getElementById("start-camera").addEventListener("click", async function() {
  const video = document.getElementById("video");
  const resultSpan = document.getElementById("result");

  // Flag to prevent reinitializing the scan
  let scanning = false;

  // Display the video element
  video.style.display = "block";

  try {
    if (!scanning) {
      scanning = true;

      // Check for user permission
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        
        video.srcObject = stream;

        // ... rest of your code using QuaggaJS

      } else {
        console.error("Camera access not supported by your browser.");
        alert("Camera access not supported.");
      }
    }
  } catch (error) {
    console.error("Error accessing camera:", error);
    alert("Could not access the camera.");
    scanning = false;
  }
});