// document.addEventListener('DOMContentLoaded', async function() {
    // Get the current URL
    const currentUrl = new URL(window.location.href);

    // Extract parameters using URLSearchParams
    const params = new URLSearchParams(currentUrl.search);

    // Define valid social media platforms
    const validMedia = ["tiktok", "facebook", "twitter-x", "google", "instagram", "whatsapp"];

    // Get individual parameter values (default to "others" if missing)
    let mediaLocation = params.get("social") || "others";

    // Validate mediaLocation
    if (!validMedia.includes(mediaLocation)) {
        mediaLocation = "others";
    }

    // Check if the analytics data already exists
    if (!sessionStorage.getItem('site_visits_from_socials')) {
        // Set flag to prevent duplicate analytics submission
        sessionStorage.setItem('site_visits_from_socials', 'true');

        // Send request with encoded mediaLocation
        fetch(`https://api.payuee.com/site-social-analytics/${encodeURIComponent(mediaLocation)}`, {
            method: 'GET'
        });
    }
// });

function loadGoogleAnalytics(measurementId) {
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  gtag("js", new Date());
  gtag("config", measurementId);
}

// Call it
loadGoogleAnalytics("G-3QEYDV3845");
