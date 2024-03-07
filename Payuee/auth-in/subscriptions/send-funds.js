var sendFundsToStatus = "payuee";
var payueeEmailId;
var payueeAmount = 0;
var validated;
var transCharge = 0;
var BankType;
var BankCountryType;
var AccountNumber;
var AccountName;
var Description;
var BankCode;
var Bank;
var Currency;
   
   // Get the radio buttons by name
   const radioButtons = document.querySelectorAll('input[name="flexRadioDefault"]');

   // Add an event listener to each radio button
radioButtons.forEach(button => {
    button.addEventListener('change', function() {
        // Perform your desired action here
        console.log(`Selected option: ${this.id}`);
        this.id = sendFundsToStatus;

        if (this.id === "payuee") {
            enableTransferDiv()
        } else if (this.id === "paystack") { 
            disableTransferDiv()
        }
    });
});

document.getElementById("sendMoney").addEventListener("click", function(event) {
    event.preventDefault();
        validated = true;
    if (sendFundsToStatus == "payuee") {
        payueeEmailId = document.getElementById("payueeEmailId").value;
        payueeAmount = document.getElementById("payueeAmount").value;
        if (payueeEmailId  == "") {
            validated = false;
            showError('emailError', "Please enter an  email address");
        } else if (!isValidEmail(payueeEmailId)) {
            validated = false;
            showError('emailError', "Please enter a valid email address");
        } 
        if (payueeAmount == "") {
            validated = false;
            showError('amountError', "Please enter an amount to transfer");
        } else if (payueeAmount < 50) {
            validated = false;
            showError('amountError', "Please minimum transfer amount is ₦50");
        } else if (payueeAmount > 100000) {
            validated = false;
            showError('amountError', "Please maximum transfer amount is ₦100,000");
        } 
        if (validated == true) {
            FundsToSend(payueeEmailId, payueeAmount);
        }
    }
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

function FundsToSend(email, amount) {
    const installPopup = document.getElementById('balance-popup');
    const cancelButton = document.getElementById('cancel-btn');
    const sendButton = document.getElementById('send-btn');
    const FundsToSend = document.getElementById('FundsToSend');
    const UserToSendTo = document.getElementById('UserToSendTo');

    FundsToSend.textContent = formatNumberToNaira(amount);
    UserToSendTo.textContent = email;

      installPopup.style.display = 'block';

    // Cancel button click event
    cancelButton.addEventListener('click', () => {
      installPopup.style.display = 'none';
    });
    sendButton.addEventListener('click', async () => {
        // let's approve and send the transaction
        await sendFunds()
      });
}

function formatNumberToNaira(number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(number);
}

function isValidEmail(email) {
    // Simple email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

async function sendFunds() {
    if (validated) {
        deactivateButtonStyles();
        const user = {
            ServiceID: "sendFunds",
            Amount:  payueeAmount,
            TranCharge:  transCharge,
            BankType:        BankType,
            BankCountryType: BankCountryType,
            EmailID:        payueeEmailId,
            AccountNumber:   AccountNumber,
            AccountName:     AccountName,
            Description:     Description,
            BankCode:        BankCode,
            Bank:            Bank,
            Currency:        Currency,
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
                window.location.href = "https://payuee.vercel.app/Payuee/successful.html"
                return
            }
        } finally {
            reactivateButtonStyles();
        }
    }
}


// Add this function to remove onclick and on hover styles
function deactivateButtonStyles() {
    var resendButton = document.getElementById('sendMoney');
    resendButton.classList.add('deactivated'); // Add a class to the button
}

// Add this function to reactivate the button styles
function reactivateButtonStyles() {
    var resendButton = document.getElementById('sendMoney');
    // Remove all existing classes
    resendButton.className = '';
    // Add the original class 'cmn__btn'
    resendButton.classList.add('cmn__btn');
}
