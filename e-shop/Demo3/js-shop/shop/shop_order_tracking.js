import { Html5Qrcode } from "html5-qrcode";

document.getElementById("start-camera").addEventListener("click", async function() {
  const resultSpan = document.getElementById("result");
  
  // Create a new instance of Html5Qrcode
  const html5QrCode = new Html5Qrcode("video");
  
  // Start the camera and scanning process
  try {
    // Start camera with the desired configuration
    const cameraId = await Html5Qrcode.getCameras().then(devices => {
      return devices.length ? devices[0].id : null; // Choose the first camera
    });

    if (cameraId) {
      html5QrCode.start(
        cameraId, 
        {
          fps: 10, // Set frames per second
          qrbox: 250 // Size of scanning box
        },
        (decodedText, decodedResult) => {
          // QR code scanned
          resultSpan.textContent = decodedText;
          console.log("QR Code Detected:", decodedText);
          
          // Stop scanning once a result is found
          html5QrCode.stop().then(() => {
            console.log("QR Code scanning stopped.");
          }).catch(err => {
            console.error("Failed to stop scanning:", err);
          });
        },
        (errorMessage) => {
          // Parsing error (not critical)
          console.warn("QR Code scan error:", errorMessage);
        }
      ).catch(err => {
        console.error("Error starting camera:", err);
        alert("Could not start the camera.");
      });
    }
  } catch (error) {
    console.error("Error accessing cameras:", error);
    alert("Could not access cameras.");
  }
});
