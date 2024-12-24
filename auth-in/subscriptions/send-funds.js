var sendFundsToStatus = "payuee";
var payueeEmailId = "";
var payueeAmount = 0;
var validated = "";
var transCharge = 0;
var BankType = "";
var BankCountryType = "";
var AccountNumber = "";
var AccountName = "";
var Description = "";
var BankCode = "";
var Bank = "";
var Currency = "NGN";
   
var banksData = null; // Variable to store the loaded JSON data
var GetName = 0

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("sendMoney").addEventListener("click", handleSendMoneyClick);
    document.getElementById('cancel-btn').addEventListener('click', hidePopup);
    document.getElementById('send-btn').addEventListener('click', handleSendFunds);
    document.getElementById('cancel-btn2').addEventListener('click', hideErrorPopup);
});

function handleSendMoneyClick(event) {
    event.preventDefault();
    validateAndSendFunds();
}

function hidePopup() {
    document.getElementById('balance-popup').style.display = 'none';
}

function handleSendFunds() {
    document.getElementById('balance-popup').style.display = 'none';
    sendFunds();
}

function hideErrorPopup() {
    document.getElementById('error-popup').style.display = 'none';
}

// Get the radio buttons by name
const radioButtons = document.querySelectorAll('input[name="flexRadioDefault"]');

// Add an event listener to each radio button
radioButtons.forEach(button => {
    button.addEventListener('change', function () {
        // Perform your desired action here
        // console.log(`Selected option: ${this.id}`);
        payueeEmailId = "";
        payueeAmount = 0;
        validated = "";
        transCharge = 0;
        BankType = "";
        BankCountryType = "";
        AccountNumber = "";
        AccountName = "";
        Description = "";
        BankCode = "";
        Bank = "";
        if (this.id === "payuee") {
            enableTransferDiv();
        } else if (this.id === "paystack") {
            disableTransferDiv();
        }
    });
});

// Function to disable the div and its content
function disableTransferDiv() {
    document.getElementById('fund_payuee1').classList.add('disabled');
    document.getElementById('fund_payuee1').disabled = true;
    document.getElementById('fund_payuee2').classList.add('disabled');
    document.getElementById('fund_payuee2').disabled = true;
    document.getElementById('fund_external_bank1').classList.remove('disabled');
    document.getElementById('fund_external_bank1').disabled = false;
    document.getElementById('fund_external_bank2').classList.remove('disabled');
    document.getElementById('fund_external_bank2').disabled = false;
    if (GetName >= 1) {
        document.getElementById('fund_external_bank2').classList.remove('disabled');
        document.getElementById('fund_external_bank2').disabled = false;
    }
    document.getElementById('fund_external_bank4').classList.remove('disabled');
    document.getElementById('fund_external_bank4').disabled = false;
}

// Function to enable the div and its content
function enableTransferDiv() {
    document.getElementById('fund_payuee1').classList.remove('disabled');
    document.getElementById('fund_payuee1').disabled = false;
    document.getElementById('fund_payuee2').classList.remove('disabled');
    document.getElementById('fund_payuee2').disabled = false;
    document.getElementById('fund_external_bank1').classList.add('disabled');
    document.getElementById('fund_external_bank1').disabled = true;
    document.getElementById('fund_external_bank2').classList.add('disabled');
    document.getElementById('fund_external_bank2').disabled = true;
    if (GetName >= 1) {
        document.getElementById('fund_external_bank3').classList.add('disabled');
        document.getElementById('fund_external_bank3').disabled = true;
    }
    document.getElementById('fund_external_bank4').classList.add('disabled');
    document.getElementById('fund_external_bank4').disabled = true;
}    

function validateAndSendFunds() {
    validated = true;
    if (sendFundsToStatus == "payuee") {
        BankType = "payuee";
        payueeEmailId = document.getElementById("payueeEmailId").value;
        payueeAmount = document.getElementById("payueeAmount").value;
        if (payueeEmailId == "") {
            validated = false;
            showError('emailError', "Please enter an email address");
        } else if (!isValidEmail(payueeEmailId)) {
            validated = false;
            showError('emailError', "Please enter a valid email address");
        }
        if (payueeAmount == "") {
            validated = false;
            showError('amountError', "Please enter an amount to transfer");
        } else if (payueeAmount < 10) {
            validated = false;
            showError('amountError', "Please minimum transfer amount is ₦10");
        } else if (payueeAmount > 100000) {
            validated = false;
            showError('amountError', "Please maximum transfer amount is ₦100,000");
        }
    } else if (sendFundsToStatus == "paystack") {
        BankType = "paystack";
        AccountNumber = document.getElementById("AccountNumber").value;
        payueeAmount = document.getElementById("AmountToTransfer").value;
        if (AccountNumber == "") {
            validated = false;
            showError('accountNumberError', "Please enter an account number");
        } else if (AccountNumber.length < 10) {
            validated = false;
            showError('accountNumberError', "Please enter a complete account number");
        }
        if (payueeAmount == "") {
            validated = false;
            showError('amountToTransferError', "Please enter an amount to transfer");
        } else if (payueeAmount < 10) {
            validated = false;
            showError('amountToTransferError', "Please minimum transfer amount is ₦10");
        } else if (payueeAmount > 100000) {
            validated = false;
            showError('amountToTransferError', "Please maximum transfer amount is ₦100,000");
        }
    }
    if (validated == true) {
        // console.log("this is the bank status: ", sendFundsToStatus);
        if (sendFundsToStatus == "payuee") {
            FundsToSendToPayuee(payueeEmailId, payueeAmount);
        } else if (sendFundsToStatus == "paystack") {
            transCharge = calculateTotalCharge(payueeAmount);
            FundsToSendToPaystack(AccountName, payueeAmount);
        }
    }
}

function calculateTotalCharge(originalPrice) {
    // Apply the fixed charge based on the price range
    if (originalPrice > 50000) {
        return Math.ceil(55); // NGN 55 for transfers above NGN 50,000
    } else if (originalPrice > 5000) {
        return Math.ceil(30); // NGN 30 for transfers between NGN 5,001 and NGN 50,000
    } else {
        return Math.ceil(15); // NGN 15 for transfers of NGN 5,000 and below
    }
}

function FundsToSendToPayuee(email, amount) {
    const installPopup = document.getElementById('balance-popup');
    // const cancelButton = document.getElementById('cancel-btn');
    // const sendButton = document.getElementById('send-btn');
    const FundsToSend = document.getElementById('FundsToSend');
    const UserToSendTo = document.getElementById('UserToSendTo');

    FundsToSend.textContent = formatNumberToNaira(amount);
    UserToSendTo.textContent = email;

      installPopup.style.display = 'block';

    // // Cancel button click event
    // cancelButton.addEventListener('click', () => {
    //   installPopup.style.display = 'none';
    // });
    // sendButton.addEventListener('click', async () => {
    //     // let's approve and send the transaction
    //     installPopup.style.display = 'none';
    //     await sendFunds()
    //   });
}

function FundsToSendToPaystack(name, amount) {
    const installPopup = document.getElementById('balance-popup');
    // const cancelButton = document.getElementById('cancel-btn');
    // const sendButton = document.getElementById('send-btn');
    const FundsToSend = document.getElementById('FundsToSend');
    const UserToSendTo = document.getElementById('UserToSendTo');

    FundsToSend.textContent = formatNumberToNaira(amount);
    UserToSendTo.textContent = name;

      installPopup.style.display = 'block';

    // // Cancel button click event
    // cancelButton.addEventListener('click', () => {
    //   installPopup.style.display = 'none';
    // });
    // sendButton.addEventListener('click', async () => {
    //     // let's approve and send the transaction
    //     installPopup.style.display = 'none';
    //     await sendFunds()
    //   });
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
            BankType: BankType,
            BankCountryType: BankCountryType,
            EmailID: payueeEmailId,
            Amount: parseInt(payueeAmount),
            TranCharge: transCharge,
            AccountNumber: AccountNumber,
            AccountName: AccountName,
            Description: Description,
            BankCode: BankCode,
            Bank: Bank,
            Currency: Currency,
        };
    
        const apiUrl = "https://api.payuee.com/payuee/init-transaction";
    
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
    
            if (!response.ok) {
                const errorData = await response.json();
    
                if  (errorData.error === 'a user with this email was not found') {
                    returnedErrorMessageDisplay('Sorry no user with ' + errorData.email + ' was found');
                }else if  (errorData.error === 'insufficient funds') {
                    returnedErrorMessageDisplay2("Sorry you don't have up to ₦" + payueeAmount + " in your account");
                }else if  (errorData.error === 'This email is invalid because it uses illegal characters. Please enter a valid email') {
                    returnedErrorMessageDisplay('This is an invalid email address. Please enter a valid email address.');
                }else if  (errorData.error === "you can't send funds to self") {
                    returnedErrorMessageDisplay("you can't send funds to self");
                }else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                    // let's log user out the users session has expired
                    logUserOutIfTokenIsExpired();
                }else {
                    returnedErrorMessageDisplay('An error occurred. Please try again.');
                }
    
                return;
            }
    
            const responseData = await response.json();
    
            if (responseData.hasOwnProperty('success')){
                // if (responseData.success.hasOwnProperty('data')) {
                //     // window.location.href = responseData.success.data.authorization_url;
                //     console.log("one");
                //     return
                // }
                // console.log("two");
                // window.location.href = "https://payuee.com/bank-successful.html"
                window.location.href = "https://payuee.com/successful.html"
                return
            } else {
                    // console.log("three");
                    window.location.href = "https://payuee.com/successful.html"
                return
            }
        } finally {
            reactivateButtonStyles();
        }
    }
}

function returnedErrorMessageDisplay(errorMessage) {
    const installPopup = document.getElementById('error-popup');
    const cancelButton = document.getElementById('cancel-btn2');
    const returnedEmailID = document.getElementById('returnedEmailID');

    returnedEmailID.textContent = errorMessage;

      installPopup.style.display = 'block';

    // Cancel button click event
    cancelButton.addEventListener('click', () => {
      installPopup.style.display = 'none';
    });
}

function returnedErrorMessageDisplay2(errorMessage) {
    const installPopup = document.getElementById('error-popup3');
    const cancelButton = document.getElementById('cancel-btn3');
    const returnedEmailID = document.getElementById('returnedEmailID3');

    returnedEmailID.textContent = errorMessage; // Display the error message

    installPopup.style.display = 'block'; // Show the popup

    // Cancel button click event
    cancelButton.addEventListener('click', () => {
        // Redirect to the Fund Wallet page
        window.location.href = '/fund-wallet'; // Replace with the actual URL of the Fund Wallet page
    });
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

var inputElement = document.getElementById("searchBankID");
var searchOptionsDiv = document.getElementById("searchOptions");

document.addEventListener("DOMContentLoaded", function () {

    inputElement.addEventListener("input", function () {
        var inputValue = inputElement.value.trim();

        // Clear previous search options
        searchOptionsDiv.innerHTML = '';

        // Show search options if the input is not empty
        if (inputValue !== "") {
            // Mock search results
            var mockSearchResults = searchBanksByName(inputValue, banksData);

            // Create and append search options
            for (var i = 0; i < mockSearchResults.length; i++) {
                var option = document.createElement("a");
                option.href = "#";
                option.textContent = mockSearchResults[i].name;
        
                // Set data attributes
                option.setAttribute("data-name", mockSearchResults[i].name);
                option.setAttribute("data-code", mockSearchResults[i].code);
                option.setAttribute("data-type", mockSearchResults[i].type);
                option.setAttribute("data-currency", mockSearchResults[i].currency);
        
                searchOptionsDiv.appendChild(option);
            }

            // let's check if mockSearchResults is less than 1 so that we can trow an error
            if (mockSearchResults.length < 1) {
                var option = document.createElement("a");
                option.href = "#";
                option.textContent = "Bank Not Found";
                searchOptionsDiv.appendChild(option);
            }

            // Show search options
            searchOptionsDiv.style.display = "block";
        } else {
            // Hide search options if the input is empty
            searchOptionsDiv.style.display = "none";
        }
    });
});

searchOptionsDiv.addEventListener("click", function (event) {
    event.preventDefault();
    var clickedOption = event.target;
    let name = clickedOption.dataset.name;
    let code = clickedOption.dataset.code;
    let type = clickedOption.dataset.type;
    let currency = clickedOption.dataset.currency;

    sendFundsToStatus = "paystack";
    BankCountryType = type;
    BankCode = code;
    Bank = name;

    // Check if the clicked element is an anchor tag
    if (clickedOption.tagName.toLowerCase() === 'a') {
    // Set input value with the selected bank's name
    inputElement.value = name;

    // Hide or remove the dropdown
    // searchOptionsDiv.innerHTML = ''; // Clear search options
    searchOptionsDiv.style.display = "none";
    // Get the input element
    const accountNumberInput = document.getElementById('AccountNumber').value;

    getAccountDetails(accountNumberInput)
    }

    // Use the retrieved values as needed
    
});

// Function to search for banks by name
function searchBanksByName(query, banksData) {
    query = query.toLowerCase().trim();
    return banksData.filter(bank => bank.name.toLowerCase().includes(query));
}

document.addEventListener("DOMContentLoaded", function () {

    // Load the JSON file
    fetch('bankCodes.json')
        .then(response => response.json())
        .then(data => {
            banksData = data.data; // Store the loaded data
        })
        .catch(error => console.error('Error loading JSON:', error));

        return banksData;
});

// Get the input element
const accountNumberInput = document.getElementById('AccountNumber');

// Add an event listener for the 'input' event
accountNumberInput.addEventListener('input', function () {
    // Get the current value of the input
    // Limit the input to a maximum of 10 digits
    const inputValue = this.value;
    if (inputValue.length > 10) {
        this.value = inputValue.slice(0, 10);
    }
    getAccountDetails(inputValue)
});  

function fillInTheAccountName(accountName) {
    AccountName = accountName;
    const userBankName = document.getElementById('userBankName');
    userBankName.value = accountName;
}

function getAccountDetails(inputValue) {
      // Check if the value is greater than or equal to ten
      if (inputValue.length == 10 && BankCode != "") {
        // Perform your desired action here
        // Make a GET request using fetch
    fetch(`https://api.payuee.com/paystack/verify-account/${inputValue}/${BankCode}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // Add any additional headers if needed
        },
        credentials: 'include', // set credentials to include cookies
            // Add any additional options if needed
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
    })
    .then(data => {
        // Handle the response data here
        // console.log('Response data:', data);
        document.getElementById('fund_external_bank3').classList.remove('disabled');
        document.getElementById('fund_external_bank3').disabled = false;
        GetName = 1;
        if (data.code == "invalid_bank_code"){
            fillInTheAccountName("Invalid Bank Details");
        } else {
            fillInTheAccountName(data.data.account_name);
        }
    })
    .catch(error => {
        // Handle errors here
        // console.error('Error:', error);
    });

    }
}


function logUserOutIfTokenIsExpired() {
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
    const response = fetch(apiUrl, requestOptions);

        // const data = response.json();
        localStorage.removeItem('auth')
        window.location.href = '../indexs.html'
    } finally{
        // do nothing
    }
}