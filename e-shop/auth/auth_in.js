document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for logout links if they exist
    const loginLink1 = document.getElementById('logoutLink1');
    if (loginLink1) {
        loginLink1.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    }

    const loginLink2 = document.getElementById('logoutLink2');
    if (loginLink2) {
        loginLink2.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    }
});

// Function to check if the user is authenticated and redirect if not
function get_auth_status() {
    if (localStorage.getItem('auth') !== 'true') {
        // Redirect to login if auth status is not valid
        logout();
    } else {
        // Verify auth status with the server
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
        credentials: 'include', // Include cookies with the request
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            // If authentication fails, log out the user
            logout();
            return;
        }

        // Update auth status on success
        const responseData = await response.json();
        localStorage.setItem('auth', 'true');

    } catch (error) {
        console.error("Error checking auth status:", error);
        logout(); // Log out on error
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
        credentials: 'include', // Include cookies with the request
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            showToastMessageE('An error occurred while logging out.');
            return;
        }

        // Clear auth data and redirect to login page
        localStorage.removeItem('auth');
        location.replace('https://payuee.com/e-shop/v/login_register');

    } catch (error) {
        console.error("Error during logout:", error);
        showToastMessageE("Failed to log out. Please try again.");
    }
}

// Function to show an error message in a toast
function showToastMessageE(message) {
    const toastErrorElement = document.getElementById('toastError');
    const toastElement = document.getElementById('liveToast1');

    if (toastErrorElement && toastElement) {
        toastErrorElement.textContent = message;
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    } else {
        console.warn("Toast elements not found.");
    }
}

// Check auth status on page load
get_auth_status();