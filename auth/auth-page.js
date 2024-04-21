
// Listen for the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function () {
    var analyticsData = localStorage.getItem('analyticsData');

    if (analyticsData === null) {
        // Key does not exist in localStorage
        localStorage.setItem('analyticsData', 'true');

        fetch('https://payuee.onrender.com/payuee-analytics', {
            method: 'GET'
        });
    }

    // Run the authentication status check function
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

// this is to log users out
document.getElementById('logout-button').addEventListener('click', async function (event) {
    event.preventDefault()
    await logout()
})

document.getElementById('logout-button2').addEventListener('click', async function (event) {
    event.preventDefault()
    await logout()
})

async function logout() {
    // also send a request to the logout api endpoint
    const apiUrl = "https://payuee.onrender.com/log-out";

    const requestOptions = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    credentials: 'include', // set credentials to include cookies
    };
    
try {
    const response = await fetch(apiUrl, requestOptions);
    
    if (!response.ok) {
            alert('an error occurred. Please try again');
        return;
      }
        const data = await response.json();
        localStorage.removeItem('auth')
        window.location.href = '../index.html'
    } finally{
        // do nothing
    }
}