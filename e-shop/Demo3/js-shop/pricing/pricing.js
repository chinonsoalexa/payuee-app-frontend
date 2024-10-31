var transactionCodeStatus = false;
const basicPlanId = 1500; // ID for Basic Plan
var chargeAmount = 0;
var vendorPlan = '';
var TransactionCode = '';

// Plan selection event listener
function handlePlanSelection(event, amount) {
    event.preventDefault();
    chargeAmount = amount;
    updatePlanNotice(chargeAmount);
    processPayment();
}

// Add event listeners for each plan button only once
document.getElementById('basicPlan').addEventListener('click', (event) => handlePlanSelection(event, 1500));
document.getElementById('businessPlan').addEventListener('click', (event) => handlePlanSelection(event, 5500));
document.getElementById('premiumPlan').addEventListener('click', (event) => handlePlanSelection(event, 13500));

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

    const paymentButton = document.getElementById('paymentButton');

    // Remove existing click listener before adding a new one
    paymentButton.removeEventListener("click", handlePaymentClick);

    // Define the event listener function for payment
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

        const customerBalance = await getUsersBalance();

        if (customerBalance === null || customerBalance < chargeAmount || customerBalance < 1) {
            hideModal('checkoutModal');
            const checkoutButton = document.getElementById('paymentButton');
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
                    showModal('insufficientBalanceModal');
                }
            } catch (error) {
                // showToastMessageE(error.error);
            }
            document.getElementById('transactionCodeInput').value = "";
            document.getElementById('createTransactionCodeInput').value = "";
        }
    }

    // Add the click event listener only once
    paymentButton.addEventListener("click", handlePaymentClick);
}


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

async function placeOrder() {
    const checkbox = document.getElementById('autoRenewCheckbox');
    const isChecked = checkbox.checked;

    if (chargeAmount == 1500) {
        vendorPlan = "basic";
    } else if (chargeAmount == 5500) {
        vendorPlan = "business";
    } else if (chargeAmount == 13500) {
        vendorPlan = "premium";
    }

    // Construct the request body
    const requestBody = {
        plan_type: vendorPlan,
        auto_renew: isChecked,
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