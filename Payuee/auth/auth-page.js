// Listen for the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function () {
    // Run your authentication status check function
    get_auth_status();
});

// this is for authenticated pages
function get_auth_status() {
    if (localStorage.getItem('auth') !== 'true') {
        // let's redirect to a non-authenticated page cause the user is not authenticated
        window.location.href = '../index.html';
        // let's clear auth local storage item
        localStorage.removeItem('auth');
    }
}