var totalCharge;
var transCharge = 0;
var selectedCarrierValue;
var amountInput;
var selectedRechargeValue;
var paymentMethod;
var validated = true;

document.getElementById('recharge-button').addEventListener('click', function(event) {
    // Prevent the default behavior (in this case, the redirect)
    event.preventDefault();
    buy_recharge_pin();
})

document.getElementById('back-to-airtime').addEventListener('click', function(event) {
    // Prevent the default behavior (in this case, the redirect)
    event.preventDefault();
    enableCardPinDiv();
})

document.getElementById('continue-buy-recharge-pin').addEventListener('click', async function(event) {
    event.preventDefault();

    if (validated) {
        deactivateButtonStyles();
        console.log('total charge: ', totalCharge)
        console.log('transaction charge: ', transCharge)
        const user = {
            ServiceID: "rechargePin",
            PaymentType: paymentMethod,
            Network:    selectedCarrierValue,
            Price:  totalCharge,
            TranCharge: transCharge,
            Value:       selectedRechargeValue,
            NumberOfPin: amountInput,
        };

        const apiUrl = "https://payuee.com/payuee/init-transaction";

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include', // set credentials to include cookies
            body: JSON.stringify(user),
        };

        try {
            const response = await fetch(apiUrl, requestOptions);

            console.log(response);
            if (!response.ok) {
                const errorData = await response.json();

                console.log(errorData);

                if (errorData.error === 'User already exist, please login') {
                    showError('passwordError', 'User already exists. Please signin.');
                } else if  (errorData.error === 'Please login using your google account') {
                    showError('passwordError', 'Please login using your google account.');
                } else if  (errorData.error === 'User already exist, please verify your email ID') {
                    showErrorUserExist('passwordError', 'User already exist, please verify your email ID.');
                } else if  (errorData.error === 'email verification failed') {
                    showError('passwordError', 'An error occurred while sending you a verification email. Please try resending.');
                } else if  (errorData.error === 'User already exist, please signin') {
                    showError('passwordError', 'Please login, you already have an existing account with us.');
                } else if  (errorData.error === 'This email is invalid because it uses illegal characters. Please enter a valid email') {
                    showError('passwordError', 'This is an invalid email address. Please enter a valid email address.');
                }else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!") {
                    // let's log user out the users session has expired
                    logUserOutIfTokenIsExpired();
                } else if  (errorData.error === 'insufficient funds') {
                    insufficientFunds();
                } else {
                    showError('passwordError', 'An error occurred. Please try again.');
                }

                return;
            }

            const responseData = await response.json();

            if (responseData.success == 'recharge pin successfully bought') {
                console.log('here 2')
                window.location.href = "https://payuee.com/successful.html"
                return
            } else {
            console.log('here 3')
            window.location.href = responseData.success.data.authorization_url;
            return
            }
        } finally {
            reactivateButtonStyles();
        }
    }
});

function buy_recharge_pin(){
    validated = true

    // let's take all fields and validate
    amountInput = document.getElementById("pin-number").value;
    var amount = parseInt(amountInput, 10);
    // var description = document.getElementById("description").value;

    // let's get the selected value
    selectedRechargeValue = getSelectedValue("rechargeSelect");
    var rechargeValue = parseInt(selectedRechargeValue, 10);

    selectedCarrierValue = getSelectedValue("carrierSelect");

    if (amount < 10 && rechargeValue < 500) {
        validated = false;
        showError('pin-error', 'Minimum 10 pins per order, except for ₦500+ recharge.');
    }else if (amountInput.trim() === '') {
        validated = false;
        showError('pin-error', 'Please enter amount of pin to recharge.');
    }

    // let's check the radio button that was checked
    paymentMethod = radioButtonCheck('input[name="flexRadioDefault"]');

    // let's send a post request to make an airtime purchase

    var amountInputNumber = amount * rechargeValue;

    if (validated) {
        disableCardPinDiv()
        // now our invoice div is enabled let's supply it data gotten from the airtime div
        // Get the span element by its id
        var invoice_date = document.getElementById('invoice_date');
        var payment_method = document.getElementById('payment_method');
        var invoice_card_amount = document.getElementById('invoice_card_amount');
        var invoice_card_value = document.getElementById('invoice_card_value');
        var invoice_operator = document.getElementById('invoice_operator');
        var invoice_charge = document.getElementById('invoice_charge');
        var invoice_service_charge = document.getElementById('invoice_service_charge');
        var invoice_total_charge = document.getElementById('invoice_total_charge');

        // let's update all fields to user entered fields
        // let's update the date field
        invoice_date.textContent = getCurrentDate();
        // let's update the payment method field
        if (paymentMethod == "wallet") {
            payment_method.textContent = "Wallet";
            invoice_charge.textContent = '₦' + '0.00';
            totalCharge = amountInputNumber;
            invoice_total_charge.textContent = formatNumberToNaira(amountInputNumber);
            invoice_service_charge.textContent = formatNumberToNaira(amountInputNumber);
        }else if (paymentMethod == "paystack") {
            payment_method.textContent = "Paystack";
             // let's get the transaction charge of this transaction
            transCharge = calculateTotalCharge(amountInputNumber);
            invoice_charge.textContent = formatNumberToNaira(transCharge);
            totalCharge =  amountInputNumber;
            invoice_service_charge.textContent = formatNumberToNaira(amountInputNumber);
            invoice_total_charge.textContent = formatNumberToNaira(amountInputNumber + transCharge);
        }

        // let's update the phone number to be recharged
        // phone_number.textContent = phone;
        // let's update the operator to be used for recharge
        // console.log("operator: " + selectedCarrierValue);
        if (selectedCarrierValue == "mtn") {
            invoice_operator.textContent = "MTN";
        }else if (selectedCarrierValue == "airtel") {
            invoice_operator.textContent = "Airtel";
        }else if (selectedCarrierValue == "etisalat") {
            invoice_operator.textContent = "9mobile";
        }else if (selectedCarrierValue == "glo") {
            invoice_operator.textContent = "GLO";
        }

        invoice_card_amount.textContent = amountInput;
        invoice_card_value.textContent = selectedRechargeValue;
     
        // let's calculate the total charge for the user
    }
}

function getSelectedValue(id) {
    // Get the select element by its ID
    var selectElement = document.getElementById(id);

    // Get the selected value
    var selectedValue = selectElement.value;

    // Return the selected value
    return selectedValue;
}

function calculateTotalCharge(originalPrice) {
    let additionalPercentage = 1.5;
    let paystackPercentage = 1.5;
    
    // Calculate the total amount to ensure you receive 500 naira after Paystack's fees
    let totalAmount = originalPrice / (1 - (paystackPercentage / 100)) * (1 + additionalPercentage / 100);
    let secondPrice = totalAmount - originalPrice;

    if (originalPrice > 5000) {
        return Math.ceil(secondPrice += 25);
    }

    return Math.ceil(secondPrice += 5);
}

// Function to disable the div and its content
function disableCardPinDiv() {
    document.getElementById('card-pin-section').classList.add('disabled');
    document.getElementById('card-pin-section').disabled = true;

    document.getElementById('invoice-section').classList.remove('disabled');
    document.getElementById('invoice-section').disabled = false;
}

// Function to enable the div and its content
function enableCardPinDiv() {
    document.getElementById('card-pin-section').classList.remove('disabled');
    document.getElementById('card-pin-section').disabled = false;

    document.getElementById('invoice-section').classList.add('disabled');
    document.getElementById('invoice-section').disabled = true;
}

function showError(id, message, duration = 5000) {
    var errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.display = 'block'; // Change display to 'block'
    errorElement.style.color = 'red'; // Set text color to red

    // Set a timeout to hide the error message after the specified duration
    setTimeout(function () {
        errorElement.textContent = ''; // Clear the error message
        errorElement.style.display = 'none'; // Hide the error message
    }, duration);
}

function radioButtonCheck(idName) {
        let radioButtonCheck = ''
        // Get all radio buttons with the name 'flexRadioDefault'
        const radioButtons = document.querySelectorAll(idName);

        // Loop through the radio buttons
        radioButtons.forEach(function(radioButton) {
            // Check if the radio button is checked
            if (radioButton.checked) {
                // Log the id of the checked radio button
                radioButtonCheck = radioButton.id
            }
        });
        return radioButtonCheck
}

function getCurrentDate() {
    // Get the current date
    var currentDate = new Date();

    // Extract day, month, and year components
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
    var year = currentDate.getFullYear();

    // Ensure two-digit format for day and month
    day = (day < 10) ? '0' + day : day;
    month = (month < 10) ? '0' + month : month;

    // Format the date as "DD/MM/YYYY"
    var formattedDate = day + '/' + month + '/' + year;
    return formattedDate;
}

function formatNumberToNaira(number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(number);
}

function insufficientFunds() {
    const installPopup = document.getElementById('balance-popup');
    const cancelButton = document.getElementById('cancel-btn');
    const balance = document.getElementById('insufficientFunds');

    balance.textContent = formatNumberToNaira(totalCharge);

      installPopup.style.display = 'block';

    // Cancel button click event
    cancelButton.addEventListener('click', () => {
      installPopup.style.display = 'none';
    });
}

function logUserOutIfTokenIsExpired() {
    // also send a request to the logout api endpoint
    const apiUrl = "https://payuee.com/log-out";

    const requestOptions = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    credentials: 'include', // set credentials to include cookies
    };
    
try {
    const response = fetch(apiUrl, requestOptions);

        // const data = response.json();
        localStorage.removeItem('auth')
        window.location.href = '../index.html'
    } finally{
        // do nothing
    }
}

// Add this function to remove onclick and on hover styles
function deactivateButtonStyles() {
    var resendButton = document.getElementById('continue-buy-recharge-pin');
    resendButton.classList.add('deactivated'); // Add a class to the button
}

// Add this function to reactivate the button styles
function reactivateButtonStyles() {
    var resendButton = document.getElementById('continue-buy-recharge-pin');
    // Remove all existing classes
    resendButton.className = '';
    // Add the original class 'cmn__btn'
    resendButton.classList.add('cmn__btn');
}