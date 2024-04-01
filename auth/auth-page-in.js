// document.addEventListener("DOMContentLoaded", function() {
//     // Check if the URL ends with .html
//     if (window.location.pathname.endsWith('.html')) {
//       // Get the current URL without the .html extension
//       var newUrl = window.location.pathname.slice(0, -5);
      
//       // Update the URL using the HTML5 History API
//       history.replaceState({}, document.title, newUrl);
//     }
//   });
// Listen for the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function () {
    // Run your authentication status check function
    get_auth_status();
});

// this would be for unauthenticated pages
function get_auth_status() {
    if (localStorage.getItem('auth') === 'true') {
        // let's redirect to a authenticated page cause the user is not authenticated
        window.location.href = '../index-in.html';
    }
}