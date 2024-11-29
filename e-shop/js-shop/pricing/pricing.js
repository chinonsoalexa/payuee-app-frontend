var transactionCodeStatus = false;
const basicPlanId = 1500; // ID for Basic Plan
var chargeAmount = 0;
var vendorPlan = '';
var TransactionCode = '';

document.addEventListener('DOMContentLoaded', async function(event) {
    event.preventDefault();
   await getSubscriptionDetails();
})

// Plan selection event listener
function handlePlanSelection(event, amount) {
    event.preventDefault();
    chargeAmount = amount;
    updatePlanNotice(chargeAmount);
    processPayment();
}

// Add event listeners for each plan button only once
document.getElementById('basicPlan').addEventListener('click', (event) => handlePlanSelection(event, 1500));
document.getElementById('businessPlan').addEventListener('click', (event) => handlePlanSelection(event, 7500));
document.getElementById('premiumPlan').addEventListener('click', (event) => handlePlanSelection(event, 15500));

function processPayment() {
    const transactionCodeSection = document.getElementById('transactionCodeSection');
    const createTransactionCodeSection = document.getElementById('createTransactionCodeSection');

    let cartSubTotalPopUp = document.getElementById('cartSubTotalPopUp');
    let cartShippingTotalPopUp = document.getElementById('cartShippingTotalPopUp');
    let paymentButton1 = document.getElementById('paymentButton');

    if (transactionCodeStatus) {
        transactionCodeSection.classList.remove('d-none');
        createTransactionCodeSection.classList.add('d-none');
    } else {
        createTransactionCodeSection.classList.remove('d-none');
        transactionCodeSection.classList.add('d-none');
    }

    cartSubTotalPopUp.textContent = formatNumberToNaira(chargeAmount);
    cartShippingTotalPopUp.textContent = formatNumberToNaira(chargeAmount);
    paymentButton1.textContent = `Pay ${formatNumberToNaira(chargeAmount)}`;

    showModal('checkoutModal');
}

// Define the event listener function for payment (only added once)
async function handlePaymentClick(event) {
    event.preventDefault();

    // Fetch the transaction code based on the current transactionCodeStatus
    if (transactionCodeStatus) {
        const transactionCode = document.getElementById('transactionCodeInput');
        TransactionCode = transactionCode ? transactionCode.value.trim() : "";
    } else {
        const newTransactionCode = document.getElementById('createTransactionCodeInput');
        TransactionCode = newTransactionCode ? newTransactionCode.value.trim() : "";
    }

    // Ensure validation only occurs after the user enters input
    if (TransactionCode === "" || TransactionCode.length !== 6) {
        showToastMessageE(TransactionCode === "" ? "Please fill in the transaction code field" : "Transaction code should be 6 digits");
        return;
    }

    const checkoutButton = document.getElementById('paymentButton');
    checkoutButton.disabled = true;
   if (basicPlanId == chargeAmount) {
      customerBalance == chargeAmount;
   }
    const customerBalance = await getUsersBalance();

    if (customerBalance === null || customerBalance < chargeAmount || customerBalance < 1) {
        hideModal('checkoutModal');
        checkoutButton.disabled = false;
        document.getElementById('transactionCodeInput').value = "";
        setTimeout(() => {
            showModal('insufficientBalanceModal');
            const fundWalletButton = document.getElementById('fundWalletButton');
            fundWalletButton.addEventListener('click', () => {
                window.location.href = 'https://payuee.com/fund-wallet';
            });
        }, 300);
    } else {
        try {
            const result = await placeOrder();
            if (result.success) {
                hideModal('checkoutModal');
                document.getElementById('amountToCharge').textContent = formatNumberToNaira(chargeAmount);
                document.getElementById('chargeInfo').textContent = result.success.description;
                showModal('transactionSuccessModal');
                document.getElementById('transactionCodeInput').value = "";
                document.getElementById('createTransactionCodeInput').value = "";
            } else {
                hideModal('checkoutModal');
                showToastMessageE(result.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        document.getElementById('transactionCodeInput').value = "";
        document.getElementById('createTransactionCodeInput').value = "";
    }
}

// Add the click event listener to paymentButton once
const paymentButton = document.getElementById('paymentButton');
paymentButton.addEventListener("click", handlePaymentClick);


const transactionCodeInput = document.getElementById('transactionCodeInput');

// Restrict input to numeric values only and show error if non-numeric characters are entered
transactionCodeInput.addEventListener('input', function () {
    const nonNumericChars = /\D/g;
    if (nonNumericChars.test(this.value)) {
        // Show error message if non-numeric characters are found
        showToastMessageE("Only numbers are allowed");
    }
    // Remove any non-digit characters from the input value
    this.value = this.value.replace(nonNumericChars, '');
});

const createTransactionCodeInput = document.getElementById('createTransactionCodeInput');

// Restrict input to numeric values only and show error if non-numeric characters are entered
createTransactionCodeInput.addEventListener('input', function () {
    const nonNumericChars = /\D/g;
    if (nonNumericChars.test(this.value)) {
        // Show error message if non-numeric characters are found
        showToastMessageE("Only numbers are allowed");
    }
    // Remove any non-digit characters from the input value
    this.value = this.value.replace(nonNumericChars, '');
});

function showToastMessageE(message) {
    document.getElementById('toastError').textContent = message;
    const toastElement = document.getElementById('liveToast1'); // Get the toast element
    const toast = new bootstrap.Toast(toastElement); // Initialize the toast
    toast.show(); // Show the toast
}

// Function to handle rendering products and showing modals
function showModal(modalID) {

    // Show the specified modal programmatically
    const modalElement = document.getElementById(modalID);
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
}

// Function to hide the modal programmatically
function hideModal(modalID) {
    const modalElement = document.getElementById(modalID);
    const modalInstance = bootstrap.Modal.getInstance(modalElement); // Retrieve the existing modal instance
    if (modalInstance) {
        modalInstance.hide(); // Hide the modal
    }
}

// Helper function to format numbers into Naira currency
function formatNumberToNaira(amount) {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
}

// Function to handle plan selection
function updatePlanNotice(selectedPlanId) {
    const basicPlanNotice = document.getElementById('basicPlanNotice');
    
    if (selectedPlanId === basicPlanId) {
      basicPlanNotice.classList.remove('d-none'); // Show free trial message
    } else {
      basicPlanNotice.classList.add('d-none'); // Hide free trial message for other plans
    }
  }

async function getUsersBalance() {
    let userBalance = 0;
    // Endpoint URL
    const apiUrl = "https://api.payuee.com/check-balance";

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
            const data = await response.json();
            // showToastMessageE(`response: ${data}`);
            return;
        }else {
            // Process the response data
            const data = await response.json();
            userBalance = data.success;
        }

    } catch (error) {
        console.error('Error fetching user balance: ', error);
    }
    return userBalance;
}

async function getSubscriptionDetails() {
    // Endpoint URL
    const apiUrl = "https://api.payuee.com/get-subscription-status";

    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',  // Include cookies with the request
    };
    
    try {
        const response = await fetch(apiUrl, requestOptions);
        
        if (response.ok) {
            const data = await response.json();
            transactionCodeStatus = data.status;
                // Check if success data is empty or undefined
            if (!data.success || Object.keys(data.success).length === 0) {
                console.log("No subscription data available");
                return; // Exit the function if success is empty
            }
            const plan = data.success.subscription_type;
            const days = data.success.days_remaining;
            if (days <= 7) {
                showToastMessageE(data.success.notification);
            }

            // Select buttons by their IDs
            const basicButton = document.getElementById("basicPlan");
            const businessButton = document.getElementById("businessPlan");
            const premiumButton = document.getElementById("premiumPlan");

            // Reset button text for all plans to "Purchase"
            basicButton.innerText = "Purchase";
            businessButton.innerText = "Purchase";
            premiumButton.innerText = "Purchase";

            // Function to set button text and style based on remaining days
            const updateButtonText = (button, isActivePlan) => {
                if (isActivePlan) {
                    button.innerText = days <= 7 ? "Renew" : "Active Plan";
                    button.classList.add("active-plan");
                }
            };

            // Update button text based on the active plan and remaining days
            if (plan === "basic") {
                updateButtonText(basicButton, true);
            } else if (plan === "business") {
                updateButtonText(businessButton, true);
            } else if (plan === "premium") {
                updateButtonText(premiumButton, true);
            }

        } else {
            console.log("Failed to fetch subscription status");
        }

    } catch (error) {
        console.error("Error fetching subscription details: ", error);
    }
}

async function placeOrder() {
    const checkbox = document.getElementById('autoRenewCheckbox');
    const isChecked = checkbox.checked;

    if (chargeAmount == 1500) {
        vendorPlan = "basic";
    } else if (chargeAmount == 7500) {
        vendorPlan = "business";
    } else if (chargeAmount == 15500) {
        vendorPlan = "premium";
    }

    // Construct the request body
    const requestBody = {
        plan_type: vendorPlan,
        auto_renew: isChecked,
        trans_code: String(TransactionCode),
    };

    try {
        // Send POST request using Fetch API and wait for the response
        const response = await fetch('https://api.payuee.com/manage-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',  // Include cookies with the request
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (!data.ok) {
            if (data.error == "wrong subscription plan") {
                showToastMessageE("wrong subscription plan");
            } else if (data.error == "wrong transaction code") {
                showToastMessageE("wrong transaction code");
            } else {
                showToastMessageE(data.error);
            }
        }

        const checkoutButton = document.getElementById('paymentButton');
    
        checkoutButton.disabled = false;

        // Return the response data so the calling function can use it
        return data;
    } catch (error) {
        const checkoutButton = document.getElementById('paymentButton');
    
        checkoutButton.disabled = false;
        // Handle any errors that occur
        console.error('Error:', error);
        throw error; // Propagate the error so calling function can handle it
    }
}