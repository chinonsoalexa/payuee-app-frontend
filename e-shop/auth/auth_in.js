document.addEventListener('DOMContentLoaded', () => {

    // Check if `LoginLink1` exists and add event listener
    const loginLink1 = document.getElementById('logoutLink1');
    if (loginLink1) {
        loginLink1.addEventListener('click', function (e) {
            e.preventDefault();
            logout2();
        });
    }

    // Check if `LoginLink2` exists and add event listener
    const loginLink2 = document.getElementById('logoutLink2');
    if (loginLink2) {
        loginLink2.addEventListener('click', function (e) {
            e.preventDefault();
            logout2();
        });
    }
});

// Function to check if the user is authenticated and redirect if not
function get_auth_status() {
    if (localStorage.getItem('auth') !== 'true') {
        // Clear user auth data and redirect to login if not authenticated
        logout();
    } else {
        check_auth_status();
    }
}

// Function to verify the user's authentication status with the server
async function check_auth_status() {
    const apiUrl = "https://api.payuee.com/user-auth-status";
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include', // Set credentials to include cookies
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            logout(); // Redirect if authentication fails
            return;
        }

        const responseData = await response.json();
        localStorage.setItem('auth', 'true'); // Update auth status on success

    } catch (error) {
        // Optionally, handle network errors here (e.g., by showing a message)
        console.error("Error checking auth status:", error);
        logout();
    }
}

// Function to log out the user and redirect to the login page
async function logout() {
    const apiUrl = "https://api.payuee.com/log-out";
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include', // Set credentials to include cookies
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            showToastMessageE('An error occurred while logging out.');
            return;
        }

        // If logout API call succeeds, clear local storage and redirect
        localStorage.removeItem('auth');
        window.location.href = 'https://payuee.com/e-shop/v/login_register';

    } catch (error) {
        console.error("Error during logout:", error);
        showToastMessageE("Failed to log out. Please try again.");
    }
}

async function logout2() {
    const apiUrl = "https://api.payuee.com/log-out";
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include', // Set credentials to include cookies
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            showToastMessageE('An error occurred while logging out.');
            return;
        }

        // If logout API call succeeds, clear local storage and redirect
        localStorage.removeItem('auth');
        window.location.href = 'https://payuee.com/e-shop/v/login_register';

    } catch (error) {
        // console.error("Error during logout:", error);
        showToastMessageE("Failed to log out. Please try again.");
    }
}

// Function to show an error message toast
function showToastMessageE(message) {
    document.getElementById('toastError').textContent = message;
    const toastElement = document.getElementById('liveToast1');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

// Call get_auth_status on page load or as needed to enforce authentication
get_auth_status();
