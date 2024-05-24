var billAmount;
var validated = true;
var transCharge = 0;

document.getElementById('fund_wallet').addEventListener('click', async function(event) {
    event.preventDefault();

    // Get the input element
    let firstBillAmount = parseInt(document.getElementById('billAmountInput').value, 10);

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
            Amount: billAmount,
            TranCharge: transCharge,
        };
        console.log("this is the request output: ", JSON.stringify(user));

        const apiUrl = "https://api.payuee.com/payuee/init-transaction";

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify(user),
        };

        try {
            const response = await fetch(apiUrl, requestOptions);

            if (!response.ok) {
                const errorData = await response.json();
                handleErrorResponse(errorData);
                return;
            }

            const responseData = await response.json();
            if (responseData.hasOwnProperty('success') && responseData.success.hasOwnProperty('data')) {
                // window.location.href = responseData.success.data.authorization_url;
                return;
            } else {
                // window.location.href = "https://payuee.com/successful.html";
                return;
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
        if (this.id === "transfer") {
            enablePaystackDiv();
        } else if (this.id === "paystack") { 
            disablePaystackDiv();
        }
    });
});

// Function to disable the div and its content
function disablePaystackDiv() {
    deactivateButtonStyles();
    setPaystackDivState(false);
}

// Function to enable the div and its content
function enablePaystackDiv() {
    reactivateButtonStyles();
    setPaystackDivState(true);
}

function setPaystackDivState(disabled) {
    ['fund_payuee1', 'fund_payuee2', 'fund_payuee3', 'fund_payuee4'].forEach(id => {
        const element = document.getElementById(id);
        element.classList.toggle('disabled', disabled);
        element.disabled = disabled;
    });
}

// Function to remove onclick and on hover styles
function deactivateButtonStyles() {
    var resendButton = document.getElementById('fund_wallet');
    resendButton.classList.add('deactivated');
}

// Function to reactivate the button styles
function reactivateButtonStyles() {
    var resendButton = document.getElementById('fund_wallet');
    resendButton.className = '';
    resendButton.classList.add('cmn__btn');
}

const displayInput = document.getElementById('displayInput');

// Add an event listener for the input event
document.getElementById('billAmountInput').addEventListener('input', function() {
    checkAndProcessInput(this.value);
});

function checkAndProcessInput(inputValue) {
    if (inputValue.length === 0) {
        displayInput.value = 'Transaction Charge';
    } else if (parseInt(inputValue) >= 20000){
        transCharge = 0;
        displayInput.value = "₦0.00";
    } else {
        transCharge = calculateTotalCharge(parseInt(inputValue));      
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
    errorElement.style.display = 'block';
    errorElement.style.color = 'red';

    setTimeout(function () {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }, duration);
}

function calculateTotalCharge(originalPrice) {
    let additionalPercentage = 1.5;
    let paystackPercentage = 1.5;
    
    let totalAmount = originalPrice / (1 - (paystackPercentage / 100)) * (1 + additionalPercentage / 100);
    let secondPrice = totalAmount - originalPrice;

    if (originalPrice >= 20000) {
        return 0;
    }

    if (originalPrice >= 5000) {
        return Math.ceil(secondPrice + 25);
    }

    return Math.ceil(secondPrice + 5);
}

function handleErrorResponse(errorData) {
    if (errorData.error === 'User already exist, please login') {
        showError('passwordError', 'User already exists. Please signin.');
    } else if (errorData.error === 'Please login using your google account') {
        showError('passwordError', 'Please login using your google account.');
    } else if (errorData.error === 'User already exist, please verify your email ID') {
        showErrorUserExist('passwordError', 'User already exist, please verify your email ID.');
    } else if (errorData.error === 'email verification failed') {
        showError('passwordError', 'An error occurred while sending you a verification email. Please try resending.');
    } else if (errorData.error === 'User already exist, please signin') {
        showError('passwordError', 'Please login, you already have an existing account with us.');
    } else if (errorData.error === 'This email is invalid because it uses illegal characters. Please enter a valid email') {
        showError('passwordError', 'This is an invalid email address. Please enter a valid email address.');
    } else if (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!") {
        logUserOutIfTokenIsExpired();
    } else {
        showError('passwordError', 'An error occurred. Please try again.');
    }
}

async function logUserOutIfTokenIsExpired() {
    // also send a request to the logout api endpoint
    const apiUrl = "https://api.payuee.com/log-out";

    const requestOptions = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    credentials: 'include', // set credentials to include cookies
    };
    
try {
    console.log("am here logging out12")
    const response = await fetch(apiUrl, requestOptions);

    // Check if the fetch request was successful
    if (!response.ok) {
        throw new Error('Logout request failed');
    }

    console.log("am here logging out")
        const data = response.json();
        localStorage.removeItem('auth')
    console.log("am here logging out3")
    window.location.href = '../index-in.html'
    console.log("am here logging out2")
} finally{
        localStorage.removeItem('auth')
        window.location.href = '../index-in.html'
        // do nothing
    }
}
