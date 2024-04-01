var billAmount;
var validated = true;
var transCharge = 0;

document.getElementById('fund_wallet').addEventListener('click', async function(event) {
event.preventDefault();
// Get the input element
let  firstBillAmount = parseInt(document.getElementById('billAmountInput').value, 10);

if (firstBillAmount < 100) {
    validated = false;
    showError('bill_amount_error', 'Minimum Deposit: ₦100.00');
} else if (firstBillAmount > 200000) {
    validated = false;
    showError('bill_amount_error', 'Maximum Deposit: ₦200,000.00');
}

if (validated) {
    deactivateButtonStyles();
    const user = {
        ServiceID: "fundWallet",
        Amount:  billAmount,
        TranCharge:  transCharge,
    };

    const apiUrl = "https://payuee.onrender.com/payuee/init-transaction";

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
            }else {
                showError('passwordError', 'An error occurred. Please try again.');
            }

            return;
        }

        const responseData = await response.json();

        if (responseData.hasOwnProperty('success')){
            if (responseData.success.hasOwnProperty('data')) {
                window.location.href = responseData.success.data.authorization_url;
                return
            }
        } else {
            window.location.href = "https://payuee.com/successful.html"
            return
        }
    } finally {
        reactivateButtonStyles();
    }
}
});
   
// Get the radio buttons by name
const radioButtons = document.querySelectorAll('input[name="flexRadioDefault"]');

// Add an event listener to each radio button
radioButtons.forEach(button => {
    button.addEventListener('change', function() {
        // Perform your desired action here
        console.log(`Selected option: ${this.id}`);

        if (this.id === "transfer") {
            enablePaystackDiv()
        } else if (this.id === "paystack") { 
            disablePaystackDiv()
        }
    });
});

 // Function to disable the div and its content
function disablePaystackDiv() {
    deactivateButtonStyles();
    document.getElementById('fund_payuee1').classList.remove('disabled');
    document.getElementById('fund_payuee1').disabled = false;
    document.getElementById('fund_payuee2').classList.remove('disabled');
    document.getElementById('fund_payuee2').disabled = false;
    document.getElementById('fund_payuee3').classList.remove('disabled');
    document.getElementById('fund_payuee3').disabled = false;
    document.getElementById('fund_payuee4').classList.remove('disabled');
    document.getElementById('fund_payuee4').disabled = false;
}

// Function to enable the div and its content
function enablePaystackDiv() {
    reactivateButtonStyles();
    document.getElementById('fund_payuee1').classList.add('disabled');
    document.getElementById('fund_payuee1').disabled = true;
    document.getElementById('fund_payuee2').classList.add('disabled');
    document.getElementById('fund_payuee2').disabled = true;
    document.getElementById('fund_payuee3').classList.add('disabled');
    document.getElementById('fund_payuee3').disabled = true;
    document.getElementById('fund_payuee4').classList.add('disabled');
    document.getElementById('fund_payuee4').disabled = true;
}

// Add this function to remove onclick and on hover styles
function deactivateButtonStyles() {
    var resendButton = document.getElementById('fund_wallet');
    resendButton.classList.add('deactivated'); // Add a class to the button
}

// Add this function to reactivate the button styles
function reactivateButtonStyles() {
    var resendButton = document.getElementById('fund_wallet');
    // Remove all existing classes
    resendButton.className = '';
    // Add the original class 'cmn__btn'
    resendButton.classList.add('cmn__btn');
}

const displayInput = document.getElementById('displayInput'); // Move this line up

// Add an event listener for the input event
billAmountInput.addEventListener('input', function() {
    // Run your checks or functions here
    checkAndProcessInput(this.value);
});

// Example function to check and process input
function checkAndProcessInput(inputValue) {
    if (inputValue.length === 0) {
        displayInput.value = 'Transaction Charge';
    } else {
        transCharge = calculateTotalCharge(parseInt(inputValue));      
        // Modify the value property
        billAmount = parseInt(inputValue);
        displayInput.value = formatNumberToNaira(transCharge);
    }
}

function formatNumberToNaira(number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(number);
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

function calculateTotalCharge(originalPrice) {
    let additionalPercentage = 1.5;
    let paystackPercentage = 1.5;
    
    // Calculate the total amount to ensure you receive 500 naira after Paystack's fees
    let totalAmount = originalPrice / (1 - (paystackPercentage / 100)) * (1 + additionalPercentage / 100);
    // console.log("original price amount is " + Math.ceil(originalPrice));
    // console.log("Total amount is " + Math.ceil(totalAmount));
    let secondPrice = totalAmount - originalPrice;
    // console.log("second price amount is " + Math.ceil(secondPrice));

    if (originalPrice > 5000) {
        return Math.ceil(secondPrice += 25);
    }

    return Math.ceil(secondPrice += 5);
}