document.addEventListener('DOMContentLoaded', () => {
    // Check if `logoutLink1` exists and add event listener
    const loginLink1 = document.getElementById('logoutLink1');
    if (loginLink1) {
        loginLink1.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    }

    // Check if `logoutLink2` exists and add event listener
    const loginLink2 = document.getElementById('logoutLink2');
    if (loginLink2) {
        loginLink2.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    }

    // Check auth status on page load
    get_auth_status();
});

// Function to check if the user is authenticated and redirect if not
function get_auth_status() {
    if (localStorage.getItem('auth') !== 'true') {
        logout(); // Clear auth data and redirect if not authenticated
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
        credentials: 'include', // Set credentials to include cookies
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            showToastMessageE('An error occurred while logging out.');
            return;
        }

        // Clear local storage and redirect
        localStorage.removeItem('auth');
        location.replace('https://payuee.com/e-shop/v/login_register');

    } catch (error) {
        console.error("Error during logout:", error);
        showToastMessageE("Failed to log out. Please try again.");
    }
}

// Function to show an error message toast
function showToastMessageE(message) {
    const toastErrorElement = document.getElementById('toastError');
    const toastElement = document.getElementById('liveToast1');

    if (toastErrorElement && toastElement) {
        toastErrorElement.textContent = message;
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    } else {
        console.warn("Toast elements not found");
    }
}
