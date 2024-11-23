// Initial call to check authentication status on page load
// document.addEventListener('DOMContentLoaded', () => {
// });

// Function to check if the user is authenticated and redirect if authenticated
function get_auth_status() {
    if (localStorage.getItem('auth') === 'true') {
        // Redirect to authenticated home page if auth is true
        location.replace('https://payuee.com/e-shop/home');
    } else {
        // Check authentication status with the server if not authenticated
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
            logout(); // Redirect to logout if authentication fails
            return;
        }

        const responseData = await response.json(); // Parse response JSON

        // Store auth status on success and redirect to authenticated home page
        localStorage.setItem('auth', 'true');
        location.replace('https://payuee.com/e-shop/home');

    } catch (error) {
        console.error("Error checking authentication status:", error);
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
            showToastMessageE('An error occurred during logout.');
            return;
        }

        // Clear local storage auth state and redirect to login page
        localStorage.removeItem('auth');
        // location.replace('https://payuee.com/e-shop/v/login_register');

    } catch (error) {
        console.error("Error during logout:", error);
        showToastMessageE("Failed to log out. Please try again.");
    }
}

// Function to display error messages in a toast
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

get_auth_status();
