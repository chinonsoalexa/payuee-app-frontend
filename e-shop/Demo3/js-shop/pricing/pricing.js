var transactionCodeStatus = false;
var chargeAmount = 0;
var vendorPlan = '';

document.getElementById('basicPlan').addEventListener('click', function(event) {
    event.preventDefault();
    chargeAmount = 1500;
    processPayment();
})

function processPayment() {
    const transactionCodeSection = document.getElementById('transactionCodeSection');
    const createTransactionCodeSection = document.getElementById('createTransactionCodeSection');

    let cartSubTotalPopUp = document.getElementById('cartSubTotalPopUp');
    let cartShippingTotalPopUp = document.getElementById('cartShippingTotalPopUp');
    let paymentButton1 = document.getElementById('paymentButton');

    if (transactionCodeStatus) {
        // If the user have a transaction code
        transactionCodeSection.classList.remove('d-none');
        createTransactionCodeSection.classList.add('d-none');
    } else {
        // If the user does not have a transaction code
        createTransactionCodeSection.classList.remove('d-none');
        transactionCodeSection.classList.add('d-none');
    }

    cartSubTotalPopUp.textContent =  formatNumberToNaira(chargeAmount);
    cartShippingTotalPopUp.textContent =  formatNumberToNaira(chargeAmount);
    paymentButton1.textContent =  `Pay ${formatNumberToNaira(chargeAmount)}`;

    showModal('checkoutModal');

    const paymentButton = document.getElementById('paymentButton');

    paymentButton.addEventListener("click", async function(event) {
        event.preventDefault(); // Prevent the form from submitting traditionally
                // Simulate checking balance 
                const customerBalance = await getUsersBalance();

                if (customerBalance === null || customerBalance < totalCharge || customerBalance < 1) {
                // Hide checkout modal and show insufficient balance modal
                    paymentModal.hide();
                    let transactionCodeInput = document.getElementById('transactionCodeInput');
                    transactionCodeInput.value = "";
                    setTimeout(function () {
                        hideModal(insufficientBalanceModal);
                        // Fund Wallet button logic (you can customize this for your wallet integration)
                        const fundWalletButton = document.getElementById('fundWalletButton');
                        fundWalletButton.addEventListener('click', function () {
                            // Logic to fund the wallet goes here
                            window.location.href = 'https://payuee.com/fund-wallet';
                        });
                        return;
                    }, 300); // Delay for smooth transition
                } else {

                    
                }
    })
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