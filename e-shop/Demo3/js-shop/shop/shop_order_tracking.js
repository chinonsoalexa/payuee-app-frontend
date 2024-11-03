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
          video: { facingMode: "environment",   
width: { ideal: 1280 }, height: { ideal: 720 } }
        });

        video.srcObject = stream;

        // Initialize QuaggaJS with the video stream
        Quagga.init({
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: video
          },
          decoder: {
            readers: ["qrcode_reader"] // Specify QR code reader
          }
        }, function(err) {
          if (err) {
            console.error(err);
            alert("Error initializing QuaggaJS: " + err);
            scanning = false;
            video.srcObject = null;
            return;
          }

          console.log("Initialization finished. Ready to start");
          Quagga.start();
        });

        // Handle decoded data from QuaggaJS
        Quagga.onDetected(function(result) {
          console.log(result);
          const decodedData = result.codeResult.code;
          console.log("Decoded data:", decodedData);
          resultSpan.textContent = decodedData; // Display data

          // You can add actions here based on the decoded data,
          //  like sending it to a server, processing it further, etc.

          Quagga.stop();
          stream.getTracks().forEach(track => track.stop());
          video.srcObject = null;
          scanning = false;
        });
      } else {
        console.error("Camera access not supported by your browser.");
        alert("Camera access not supported.");
        scanning = false;
      }
    }
  } catch (error) {
    console.error("Error accessing camera:", error);
    alert("Could not access the camera.");
    scanning = false;
  }
});