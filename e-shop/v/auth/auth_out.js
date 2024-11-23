// Check if the user is authenticated and redirect to the home page if so
function get_auth_status() {
    if (localStorage.getItem('auth') === 'true') {
        // Redirect to authenticated home page
        window.location.href = 'https://payuee.com/e-shop/home';
    } else {
        // Check authentication status if not already authenticated
        check_auth_status();
    }
}

// Check authentication status by calling the server API
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
        localStorage.setItem('auth', 'true'); // Store auth status on success

        // Redirect to the home page on successful authentication
        window.location.href = 'https://payuee.com/e-shop/home';

    } catch (error) {
        console.error("Error checking authentication status:", error);
        logout(); // Log out on error
    }
}

// Function to log out the user and clear authentication state
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

        localStorage.removeItem('auth'); // Clear authentication state
        location.replace('https://payuee.com/e-shop/v/login_register'); // Redirect to login page

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

// Initial call to check authentication status on page load
get_auth_status();
