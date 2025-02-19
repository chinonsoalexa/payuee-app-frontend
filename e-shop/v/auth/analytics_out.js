document.addEventListener('DOMContentLoaded', async function() {
    // Get the current URL
    const currentUrl = new URL(window.location.href);

    // Extract parameters using URLSearchParams
    const params = new URLSearchParams(currentUrl.search);

    // Define valid social media platforms
    const validMedia = ["tiktok", "facebook", "twitter-x", "google", "instagram", "whatsapp"];

    // Get individual parameter values
    let mediaLocation = params.get("social");

    // Validate mediaLocation
    if (!validMedia.includes(mediaLocation)) {
        mediaLocation = "others";
    }

    var analyticsData = sessionStorage.getItem('site_visits_from_socials');

    if (analyticsData === null) {
        // Key does not exist in sessionStorage
        sessionStorage.setItem('site_visits_from_socials', 'true');

        fetch(`https://api.payuee.com/site-social-analytics/${mediaLocation}`, {
            method: 'GET'
        });
    }
});
