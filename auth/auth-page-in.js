
// Listen for the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function () {
    var analyticsData = sessionStorage.getItem('analyticsData');

    if (analyticsData === null) {
        // Key does not exist in localStorage
        sessionStorage.setItem('analyticsData', 'true');

        fetch('https://payuee.onrender.com/payuee-analytics', {
            method: 'GET'
        });
    }
    
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