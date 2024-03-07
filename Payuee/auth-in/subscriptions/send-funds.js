var sendFundsToStatus = "payuee";
var payueeEmailId;
var payueeAmount;
   
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
    let status = true;
    if (sendFundsToStatus == "payuee") {
        payueeEmailId = document.getElementById("payueeEmailId").value;
        payueeAmount = document.getElementById("payueeAmount").value;
        if (payueeEmailId  == "") {
            status = false;
            showError('emailError', "Please enter an  email address");
        } else if (!isValidEmail(payueeEmailId)) {
            status = false;
            showError('emailError', "Please enter a valid email address");
        } 
        if (payueeAmount == "") {
            status = false;
            showError('amountError', "Please enter an amount to transfer");
        } else if (payueeAmount < 50) {
            status = false;
            showError('amountError', "Please minimum transfer amount is ₦50");
        } else if (payueeAmount > 100000) {
            status = false;
            showError('amountError', "Please maximum transfer amount is ₦100,000");
        } 
        if (status == true) {
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
    sendButton.addEventListener('click', () => {
        // let's approve and send the transaction
        sendFunds()
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

function sendFunds() {
    
}