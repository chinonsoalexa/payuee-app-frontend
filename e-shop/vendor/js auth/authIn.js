let daysRemaining = 14;

(async function () {
    // Run get_auth_status immediately when the script loads
    await get_auth_status();

    // Wait for the DOM to fully load before running DOM-dependent scripts
    document.addEventListener("DOMContentLoaded", function () {
        feather.replace();
        initializeDomFeatures();
    });
})();

function initializeDomFeatures() {
    // Handle expiration notice
    const expirationNotice = document.getElementById("expirationNotice");

    if (expirationNotice && daysRemaining > 0 && daysRemaining <= 7) {
        expirationNotice.innerHTML = `
            <p>Your subscription expires in <strong>${daysRemaining} days</strong>. Click here to renew now!</p>
        `;
        expirationNotice.classList.remove("hidden");
        expirationNotice.classList.add("visible");

        // Add click event to redirect
        expirationNotice.addEventListener("click", function () {
            redirectToRenewPage();
        });
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

async function get_auth_status() {
    if (localStorage.getItem("auth") !== "true") {
        // Clear local storage and logout the user if session expired
        logout();
        localStorage.removeItem("auth");
        window.location.href = "https://payuee.com/e-shop/v/login_register";
        return;
    }

    await check_auth_status();
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
            if (errorData.error == "vendor not found") { 
                window.location.href = "https://payuee.com/e-shop/pricing";
                return;
            }
            if (
                errorData.error === "No Authentication cookie found" ||
                errorData.error === "Unauthorized attempt! JWT's not valid!" ||
                errorData.error === "No Refresh cookie found"
            ) {
                logout();
            } else {
                logout();
            }
            return;
        }

        const responseData = await response.json();
        const { store_details, store_name, total_products } = responseData;

        // Update global daysRemaining variable
        daysRemaining = store_details.days_remaining;

        // Onboarding flow for new vendors
        if (
            window.location.pathname !== "/e-shop/vendor/update-shipping-fees" &&
            total_products < 1
        ) {
            swal({
                title: `Hi ${store_name}! Welcome to Payuee e-Shop! Let's get you started...`,
                icon: "success",
                buttons: {
                    confirm: true,
                },
            }).then((result) => {
                if (result) {
                    window.location.href = "update-shipping-fees.html";
                }
            });
        }

        // Set auth status and update local storage
        localStorage.setItem("auth", "true");
    } catch (error) {
        console.error("Error during authentication status check:", error);
        logout();
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
    // Send a request to the logout API endpoint
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

        // localStorage.removeItem("auth");
        // window.location.href = "https://payuee.com/e-shop/v/login_register";
    } catch (error) {
        console.error("Logout failed:", error);
    }
}
