var sendFundsToStatus = "payuee";
   
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
        console.log("clicked on the send money button")
        if (sendFundsToStatus == "payuee") {
            let payueeEmailId = document.getElementById("payueeEmailId").value;
            let payueeAmount = document.getElementById("payueeAmount").value;
            FundsToSend(payueeEmailId, payueeAmount);
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
    const sendButton = document.getElementById('send-button');
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
        // installPopup.style.display = 'none';
        // let's approve and send the transaction

      });
}

function formatNumberToNaira(number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(number);
}

document.getElementById('payueeEmailId').addEventListener('input', function() {
    const email = this.value.trim(); // Trim to remove leading and trailing whitespaces

    if (email === "") {
        showError('emailError', "Please enter your email address.");
        return;
    } else if (!isValidEmail(email)) {
        showError('emailError', "Please enter a valid email address.");
        return;
    }
});

function isValidEmail(email) {
    // Simple email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(id, message) {
    // Show error message
    var errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.display = 'block'; // Change display to 'block'
}

function showErrorAgain(id, message) {
    // Show error message
    if (buttonClicks > 0) {
    var errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.display = 'block'; // Change display to 'block'
    }
}

function clearError(id) {
    // Construct the error message element ID
    const errorId = id;
    
    // Get the error message element
    const errorElement = document.getElementById(errorId);

    // Check if the error element exists before manipulating it
    if (errorElement) {
        errorElement.textContent = ''; // Clear the error message
        // errorElement.style.display = 'none'; // Hide the error message
        return;
    }
}

document.getElementById('payueeEmailId').addEventListener('input', function() {
    clearError('emailError');
});