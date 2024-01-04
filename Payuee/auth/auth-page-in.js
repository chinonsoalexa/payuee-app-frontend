// Listen for the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function () {
    // Run your authentication status check function
    get_auth_status();
});

function get_auth_status() {
    if (localStorage.getItem('auth') === 'true') {
        // let's redirect to a authenticated page cause the user is not authenticated
        window.location.href = '../index-in.html';
    }
}