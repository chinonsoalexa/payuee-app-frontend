let storedVendorName = null; // Temporary storage for the API response
let isPremium = false;
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
        }
        // Update the vendor name immediately if DOM is already loaded
        updateVendorName(responseData.store_name);
        localStorage.setItem('auth', 'true');
    } finally {
        if (localStorage.getItem('auth') !== 'true') {
            window.location.href = 'https://payuee.com/e-shop/Demo3/login_register';
        }
    }
}

function updateVendorName(newName) {vendorName1
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