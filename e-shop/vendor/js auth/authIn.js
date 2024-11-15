document.addEventListener('DOMContentLoaded', function () {
    get_auth_status();
    document.getElementById('logOutButton').addEventListener('click', async function(event) {
        event.preventDefault();
        logout();
    })
});

// this is for authenticated pages
function get_auth_status() {
    if (localStorage.getItem('auth') !== 'true') {
        // let's clear auth local storage item
        //  let's log user out the users session has expired
            
        logout();
        // logUserOutIfTokenIsExpired();
        // let's redirect to a non-authenticated page cause the user is not authenticated
        localStorage.removeItem('auth');
        window.location.href = 'https://payuee.com/e-shop/Demo3/login_register';
    }
    check_auth_status();
}

async function check_auth_status() {
    const apiUrl = "https://api.payuee.com/vendor/auth-status";

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
            const errorData = await response.json();

            if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                        logout();
            } else {
                logout();
            }
            return;
        }
        updateVendorName(response.store_name);
        localStorage.setItem('auth', 'true');
    } finally {
        if (localStorage.getItem('auth') !== 'true') {
            window.location.href = 'https://payuee.com/e-shop/Demo3/login_register';
        }
    }
}

// Function to update the vendor name
function updateVendorName(newName) {
    // Get the element by its ID
    const vendorNameElement = document.getElementById("vendorName");

    // Update the text content
    vendorNameElement.textContent = newName;
}

async function logout() {
    // also send a request to the logout api endpoint
    const apiUrl = "https://api.payuee.com/log-out";

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
            // alert('an error occurred. Please try again');
                if (!response.ok) {
        alert('an error occurred. Please try again');
        return;
    }
        return;
      }
        const data = await response.json();
        localStorage.removeItem('auth')
        window.location.href = 'https://payuee.com/e-shop/Demo3/login_register'
    } finally{
        // do nothing
    }
}