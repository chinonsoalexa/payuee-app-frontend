(async function () {
    try {
        // Run get_auth_status immediately when the script loads and get daysRemaining as a promise
        const daysRemaining = await get_auth_status();
        console.log("this is the days remaining: " + daysRemaining);

        // Wait for the DOM to fully load before running DOM-dependent scripts
        // document.addEventListener("DOMContentLoaded", function () {
            feather.replace();

            // Ensure initializeDomFeatures runs with the resolved daysRemaining
            console.log("Data loaded, initializing DOM features...");
            initializeDomFeatures(daysRemaining); // Pass daysRemaining here
        // });
    } catch (error) {
        console.error("Error during initialization:", error);
    }
})();

async function get_auth_status() {
    if (localStorage.getItem("auth") !== "true") {
        // Clear local storage and logout the user if session expired
        logout();
        localStorage.removeItem("auth");
        window.location.href = "https://payuee.com/e-shop/v/login_register";
        return Promise.reject("User not authenticated");
    }

    try {
        return await check_auth_status();
    } catch (error) {
        console.error("Error in get_auth_status:", error);
        throw error; // Pass the error up the chain
    }
}

async function check_auth_status() {
    const apiUrl = "https://api.payuee.com/vendor/auth-status";
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            const errorData = await response.json();
            handleAuthError(errorData.error);
            return Promise.reject("Authentication error");
        }

        const responseData = await response.json();
        const { store_details } = responseData;

        console.log("Days remaining:", store_details.days_remaining);

        // Set auth status and update local storage
        localStorage.setItem("auth", "true");

        // Return daysRemaining as a resolved value
        return store_details.days_remaining;
    } catch (error) {
        console.error("Error during authentication status check:", error);
        throw error; // Pass the error up the chain
    }
}

function handleAuthError(error) {
    if (error === "vendor not found") {
        window.location.href = "https://payuee.com/e-shop/pricing";
    } else if (
        error === "No Authentication cookie found" ||
        error === "Unauthorized attempt! JWT's not valid!" ||
        error === "No Refresh cookie found"
    ) {
        logout();
    } else {
        logout();
    }
}

function initializeDomFeatures(daysRemaining) {
    console.log("Initializing DOM features...");
    // Handle expiration notice
    const expirationNotice = document.getElementById("expirationNotice");

    if (expirationNotice) {
        if (daysRemaining > 0 && daysRemaining <= 7) {
            expirationNotice.innerHTML = `
                <p>Your subscription expires in <strong>${daysRemaining} days</strong>. Click here to renew now!</p>
            `;
            expirationNotice.classList.remove("hidden");
            expirationNotice.classList.add("visible");

            // Add click event to redirect
            expirationNotice.addEventListener("click", function () {
                redirectToRenewPage();
            });
        } else if (daysRemaining <= 0) {
            expirationNotice.innerHTML = `
                <p>Your subscription has <strong>fully expired</strong>. Please renew to continue using the service.</p>
            `;
            expirationNotice.classList.remove("hidden");
            expirationNotice.classList.add("error"); // Assuming you have a CSS class for errors
        }
    }

    // Add event listener to logout button
    const logOutButton = document.getElementById("logOutButton");
    if (logOutButton) {
        logOutButton.addEventListener("click", function (event) {
            event.preventDefault();
            logout();
        });
    }
}

function redirectToRenewPage() {
    const renewalPageURL = "https://payuee.com/e-shop/pricing"; // Replace with your actual renewal page URL
    window.location.href = renewalPageURL;
}

async function logout() {
    const apiUrl = "https://api.payuee.com/log-out";
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            alert("An error occurred. Please try again");
            return;
        }

        localStorage.removeItem("auth");
        window.location.href = "https://payuee.com/e-shop/v/login_register";
    } catch (error) {
        console.error("Logout failed:", error);
    }
}
