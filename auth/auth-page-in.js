window.addEventListener('onbeforeunload', function() {
    // Clear analytics data from local storage
    localStorage.removeItem('analyticsData');
});

// Listen for the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function () {
    var analyticsData = localStorage.getItem('analyticsData');

    if (analyticsData === null) {
        // Key does not exist in localStorage
        localStorage.setItem('analyticsData', 'true');

        fetch('https://payuee.onrender.com/payuee-analytics', {
            method: 'GET'
        });

        // Make a GET request to a URL
        // fetch('https://payuee.onrender.com/payuee-analytics')
        // .then(response => {
        //     // Check if the response is OK (status code 200)
        //     if (!response.ok) {
        //         // throw new Error('Network response was not ok');
        //         return;
        //     }
        //     // Parse the JSON response
        //     return response.json();
        // })
        // .then(data => {
        //     // Do something with the JSON data
        //     // console.log(data);
        // })
        // .finally(() => {
        //     // This block will execute regardless of success or failure
        //     // You can use it for cleanup or any other operations
        // });
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