// Listen for the DOMContentLoaded event
document.getElementById('not_found').addEventListener('click', function () {
    // Run your authentication status check function
    page_not_found();
});

function page_not_found() {
    if (localStorage.getItem('auth') !== 'true') {
        // let's redirect to a non-authenticated page cause the user is not authenticated
        window.location.href = 'index.html';
        // let's clear auth local storage item
        localStorage.removeItem('auth');
    } else {
        // let's redirect to an authenticated page cause the user is authenticated
        window.location.href = 'index-in.html';
    }
}