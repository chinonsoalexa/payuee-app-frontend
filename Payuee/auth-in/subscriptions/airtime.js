var validated = true
var amountInput
var amountInputNumber
var phone
var selectedCarrierValue
var paymentMethod

document.getElementById('airtime-button').addEventListener('click', function(event) {
        // Prevent the default behavior (in this case, the redirect)
        event.preventDefault();
        buy_airtime()
})

document.getElementById('back-to-airtime').addEventListener('click', function(event) {
    // Prevent the default behavior (in this case, the redirect)
    event.preventDefault();
    enableAirtimeDiv()
})

document.getElementById('continue-buy-airtime').addEventListener('click', async function(event) {
    event.preventDefault();
    var amount = parseInt(amountInput.value, 10);
    var finalAmount = amount * 100
    // Using toString()
    var finalAmountString1 = finalAmount.toString();

    if (validated) {
        activatePreloader();

        const user = {
            Amount: finalAmountString1,
        };

        const apiUrl = "https://payuee.onrender.com/paystack/init-transaction";

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
                } else {
                    showError('passwordError', 'An error occurred. Please try again.');
                }

                return;
            }

            const responseData = await response.json();
            window.location.href = responseData.data.authorization_url;
        } finally {
            deactivatePreloader();
        }
    }
});


async function buy_airtime(){
    validated = true
    // let's take all fields and validate
    phone = document.getElementById("phone-number").value;
    amountInput = document.getElementById("amount-input");
    amountInputNumber = parseInt(amountInput.value, 10);
    // let's get the selected value
    selectedCarrierValue = getSelectedValue("carrierSelect");
    console.log(selectedCarrierValue)

    if (phone.length > 12 || phone.length < 11) {
        validated = false
        showError('phone-error', 'Phone number should be at least 11 digits.');
    }

    if (isNaN(amountInputNumber) || amountInputNumber > 5000 || amountInputNumber < 95) {
        validated = false
        showError('amount-error', 'Minimum: ₦95.00 and Maximum: ₦5,000.00');
    }

    // let's check the radio button that was checked
    paymentMethod = radioButtonCheck('input[name="flexRadioDefault"]');

    console.log('Checked radio button:', paymentMethod);

    // let's send a post request to make an airtime purchase

    if (validated) {
        disableAirtimeDiv()   
        // now our invoice div is enabled let's supply it data gotten from the airtime div
        // Get the span element by its id
        var invoice_date = document.getElementById('invoice_date');
        var payment_method = document.getElementById('payment_method');
        var phone_number = document.getElementById('phone_number');
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
        }else{
         payment_method.textContent = "Paystack";
        }
        // let's update the phone number to be recharged
        phone_number.textContent = phone;
        // let's update the operator to be used for recharge
        if (paymentMethod == "mtn") {
            invoice_operator.textContent = "MTN";
        }else if (paymentMethod == "airtel") {
            invoice_operator.textContent = "Airtel";
        }else if (paymentMethod == "etisalat") {
            invoice_operator.textContent = "9mobile";
        }else if (paymentMethod == "glo") {
            invoice_operator.textContent = "GLO";
        }
        // let's get the transaction charge of this transaction
        let percentage = 1.5;
        // Calculate 1.5% of the original number
        let TransactionCharge = (percentage / 100) * amountInputNumber;
        let updatedTransactionCharge = TransactionCharge + 20;
        let stringTransactionCharge = updatedTransactionCharge.toFixed(2);
        invoice_charge.textContent = '₦' + stringTransactionCharge;
        // let's get the actual charge
        invoice_service_charge.textContent = '₦' + amountInput.value.toFixed(2);
        // let's calculate the total charge for the user
        let totalCharge = amountInputNumber + updatedTransactionCharge;
        let updatedTotalCharge = totalCharge.toFixed(2);
        invoice_total_charge.textContent = '₦' + updatedTotalCharge;
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

// Function to disable the div and its content
function disableAirtimeDiv() {
    document.getElementById('airtime-section').classList.add('disabled');
    document.getElementById('airtime-section').disabled = true;

    document.getElementById('invoice-section').classList.remove('disabled');
    document.getElementById('invoice-section').disabled = false;
}

// Function to enable the div and its content
function enableAirtimeDiv() {
    document.getElementById('airtime-section').classList.remove('disabled');
    document.getElementById('airtime-section').disabled = false;

    document.getElementById('invoice-section').classList.add('disabled');
    document.getElementById('invoice-section').disabled = true;
}

function activatePreloader() {
    console.log("activated the preloader")
    // Create a new preloader wrapper
    var customPreloader = $('<div>', {
        'class': 'preloader__wrap'
    });

    // Append your existing preloader HTML content
    customPreloader.html(`
    <div class="preloader__wrap">
    <div class="preloader__box">
       <div class="circle">
          <img src="assets/img/preloader/preloader.png" alt="preloader">
        </div>
        <div class="recharge">
            <img src="assets/img/preloader/rechage.png" alt="rechage">
        </div>
        <span class="pretext">
            Payuee
        </span>
        </div>
    </div>
    `);

    // Append the new preloader to the body
    $('body').append(customPreloader);
    console.log("appended the preloader")
}

// Function to deactivate (hide) the preloader
function deactivatePreloader() {
    $('.preloader__wrap').fadeOut();
    console.log("deactivated the preloader")
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