
get_auth_status();

document.addEventListener('DOMContentLoaded', function () {
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
    document.addEventListener('DOMContentLoaded', function () {
        check_auth_status();
    });
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

            if (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                logout();
            } else {
                logout();
            }
            return;
        }

        const responseData = await response.json(); // Parse response JSON
        // Only update if we already have the vendor name from the API response
        if (responseData.store_details.subscription_type == "premium" && responseData.store_details.active) {
            document.getElementById("generateDescriptionAI").style.display = "block";
            document.getElementById("generateTagAI").style.display = "block";
        }
        // Update the vendor name immediately if DOM is already loaded
        updateVendorName(responseData.store_name);

        // Get references to the buttons
        const publishButton = document.getElementById('publishButton');
        if (publishButton) {
            const upgradeButton = document.getElementById('upgradeButton');

            // Check the subscription status and display the appropriate button
            if (!responseData.store_details.active) {
                // Subscription has expired, show Upgrade button
                publishButton.style.display = 'none'; // Hide the "Publish" button
                upgradeButton.style.display = 'block'; // Show the "Upgrade" button
                // Add an event listener for the click event
                upgradeButton.addEventListener("click", function() {
                    // Redirect to a different page (change the URL as needed)
                    window.location.href = "https://payuee.com/e-shop/Demo3/pricing.html";  // Replace with your desired URL
                });
            } else {
                // Subscription is still active, show Update button
                publishButton.style.display = 'block'; // Show the "Publish" button
                upgradeButton.style.display = 'none'; // Hide the "Upgrade" button
            }
        }
        localStorage.setItem('auth', 'true');
    } finally {
        if (localStorage.getItem('auth') !== 'true') {
            window.location.href = 'https://payuee.com/e-shop/Demo3/login_register';
        }
    }
}

function updateVendorName(newName) {
    const vendorName1Element = document.getElementById("vendorName1");
    const vendorNameElement = document.getElementById("vendorName");
    if (vendorNameElement) {
        vendorNameElement.textContent = newName;
    }
    if (vendorName1Element) {
        vendorName1Element.textContent = newName;
    }
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