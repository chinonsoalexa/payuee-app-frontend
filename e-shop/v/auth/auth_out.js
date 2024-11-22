// Check if user is authenticated and redirect to the authenticated page if so
function get_auth_status() {
    if (localStorage.getItem('auth') === 'true') {
        // Push user to authenticated home page
        window.location.href = 'https://payuee.com/e-shop/home';
    } else {
        // Only check authentication status if not already authenticated
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
            // Redirect to logout if authentication fails
            logout();
            return;
        }

        const responseData = await response.json(); // Parse response JSON

        // Update local storage and redirect to home on successful authentication
        localStorage.setItem('auth', 'true');
        window.location.href = 'https://payuee.com/e-shop/home';

    } catch (error) {
        console.error("Error checking authentication status:", error);
        logout();
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
            // Show error if logout request fails
            showToastMessageE('An error occurred during logout.');
            return;
        }

        const data = await response.json();
        localStorage.removeItem('auth'); // Clear authentication state
        window.location.href = 'https://payuee.com/e-shop/login_register'; // Redirect to login page

    } catch (error) {
        console.error("Error during logout:", error);
        showToastMessageE("Failed to log out. Please try again.");
    }
}

// Display error messages in a toast
function showToastMessageE(message) {
    document.getElementById('toastError').textContent = message;
    const toastElement = document.getElementById('liveToast1');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

// Initial call to check authentication status on page load
get_auth_status();
