document.addEventListener('DOMContentLoaded', async function () {
    await getUserInfo();
});

async function getUserInfo() {
    // Endpoint URL
    const apiUrl = "https://api.payuee.com/profile_info";

    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',  // Include cookies with the request
    };
    
    try {
        const response = await fetch(apiUrl, requestOptions);
        
        if (!response.ok) {
            // const data = await response.json();
            // showToastMessageE(`response: ${data}`);
            // updateShippingPrices();
            return;
        }else {
            const userName1 = document.getElementById('userName1');
            const userName2 = document.getElementById('userName2');
            // Process the response data
            const data = await response.json();
            user = data.user;

            if (user) {  // Check if address.customer_email exists
                userName1.textContent = user;
                userName2.textContent = user;
            } else {
                userName1.textContent = "NA";
                userName2.textContent = "NA";
            }

            const fabVendor = document.getElementById("fabVendor");

            if (data.is_vendor === "vendor not found") {
                fabVendor.querySelector(".fab-label").innerText = "Become a Vendor";

                fabVendor.onclick = () => {
                    window.location.href = "https://payuee.com/e-shop/pricing";
                };

                fabVendor.style.display = "flex"; // or "block"
            } else {
                fabVendor.querySelector(".fab-label").innerText = "Welcome " + data.is_vendor;

                fabVendor.onclick = () => {
                    window.open("https://payuee.com/e-shop/vendor/dashboard", "_blank");
                };

                fabVendor.style.display = "flex";
            }
    
        }

    } catch (error) {
        console.error('Error fetching address data:', error);
    }
}


// js button code:
const fabContainer = document.getElementById("fabVendor");
const fabBtn = document.getElementById("vendorDashboardBtn");

let autoInterval;
let holdTimeout;

// Show + shake
function triggerEffect() {
    if (fabContainer.classList.contains("hidden")) return; // Don't run if hidden
    fabContainer.classList.add("show-label");
    shakeButton();

    setTimeout(() => {
    fabContainer.classList.remove("show-label");
    }, 3000);
}

function shakeButton() {
    fabBtn.classList.add("shake");
    setTimeout(() => fabBtn.classList.remove("shake"), 600);
}

// Auto-run every 15s
function startAuto() {
    autoInterval = setInterval(triggerEffect, 15000);
}

function stopAuto() {
    clearInterval(autoInterval);
}

// Initial trigger
setTimeout(triggerEffect, 2000);
startAuto();

// Hover → same as auto
fabContainer.addEventListener("mouseenter", () => {
    triggerEffect();
});

// Mobile hold (long press to dismiss)
fabBtn.addEventListener("touchstart", () => {
    holdTimeout = setTimeout(() => {
    fabContainer.classList.add("hidden"); // Disappear completely
    stopAuto(); // Stop animations
    console.log("FAB dismissed by long hold");
    }, 5000); // hold 5s to hide
});

fabBtn.addEventListener("touchend", () => {
    clearTimeout(holdTimeout);
});

