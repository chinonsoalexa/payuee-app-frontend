document.getElementById("start-camera").addEventListener("click", async function() {
  const video = document.getElementById("video");
  const resultSpan = document.getElementById("result");
  let scanning = false; // Flag to prevent reinitializing the scan

  // Display the video element
  video.style.display = "block";

  const codeReader = new ZXing.BrowserQRCodeReader(100); // Fast scan delay

  try {
    // Check if already scanning to prevent reinitialization
    if (!scanning) {
      scanning = true;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      video.srcObject = stream;

      // Start decoding from video element
      codeReader.decodeFromVideoElement(video, (result, error) => {
        if (result) {
          resultSpan.textContent = result.text;
          console.log("QR Code Detected:", result.text);

          // Stop scanning once a result is found
          codeReader.reset();
          stream.getTracks().forEach(track => track.stop()); // Stop camera stream
          video.srcObject = null; // Clear video source to fully stop
          scanning = false; // Reset the flag
        } else if (error && !(error instanceof ZXing.NotFoundException)) {
          console.error("QR Code scan error:", error);
        }
      });
      
      // Use playVideoOnLoad function to handle playback
      playVideoOnLoad(video, () => {
        console.log("Video can play now");
      });
    }
  } catch (error) {
    console.error("Error accessing camera:", error);
    alert("Could not access the camera.");
    scanning = false; // Reset the flag on error
  }
});

function playVideoOnLoad(videoElement, onPlayingCallback) {
  const videoEndedListener = () => stopStreams();
  const videoCanPlayListener = () => tryPlayVideo(videoElement);
  
  videoElement.addEventListener("ended", videoEndedListener);
  videoElement.addEventListener("canplay", videoCanPlayListener);
  videoElement.addEventListener("playing", onPlayingCallback);
  
  tryPlayVideo(videoElement); // Attempt to play the video initially
}

function isVideoPlaying(videoElement) {
  return videoElement.currentTime > 0 && !videoElement.paused && !videoElement.ended && videoElement.readyState > 2;
}

async function tryPlayVideo(videoElement) {
  if (isVideoPlaying(videoElement)) {
    console.warn("Trying to play video that is already playing.");
  } else {
    try {
      await videoElement.play();
    } catch (error) {
      console.warn("It was not possible to play the video.");
    }
  }
}

function stopStreams() {
  // Implement your logic to stop streams here
  console.log("Stopping streams...");
}
