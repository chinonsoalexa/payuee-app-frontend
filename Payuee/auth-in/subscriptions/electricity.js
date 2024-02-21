var phone;
var meterNumber;
var amount;
var electricSelectValue;
var electricSelectText;
var paymentMethod;

var validated = true

document.getElementById('electricity-button').addEventListener('click', function(event) {
    // Prevent the default behavior (in this case, the redirect)
    event.preventDefault();
    pay_electricity_bill();
})

document.getElementById('back-to-tv').addEventListener('click', function(event) {
    // Prevent the default behavior (in this case, the redirect)
    event.preventDefault();
    enableElectricityDiv();
})

document.getElementById('continue-sub-electricity').addEventListener('click', async function(event) {
    event.preventDefault();

    if (validated) {

        deactivateButtonStyles('continue-sub-decoder');
        const user = {
            PaymentType: paymentMethod,
            ServiceID: "decoder",
            Price:  Math.ceil(decoderPlanPrice), 
            PhoneNumber: mobileNumber,
            Operator:      decoderType,
            Bundle:       decoderPlanText,
            DecoderNumber: decoderNumber,
            VariationID:   decoderPlanValue,
            Plan:          decoderPlanText,
            AutoRenew:   autoRenew,
        };
        // console.log('this is the data to be sent: ' + JSON.stringify(user));

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
                } else if  (errorData.error === 'insufficient funds') {
                    insufficientFunds();
                } else {
                    showError('passwordError', 'An error occurred. Please try again.');
                }

                return;
            }

            const responseData = await response.json();

                // console.log('here 1')
                if (responseData.success == 'data successfully bought') {
                    // console.log('here 2')
                    window.location.href = "https://payuee.vercel.app/Payuee/successful.html"
                    return
                } else {
                // console.log('here 3')
                window.location.href = responseData.success.data.authorization_url;
                return
                }
        } finally {
            reactivateButtonStyles('continue-sub-decoder');
        }
    }
});

function pay_electricity_bill(){
// let's take all fields and validate
phone = document.getElementById("phone-number").value;
let meterNumberValue = document.getElementById("meter-number").value;
meterNumber = parseInt(meterNumberValue.value, 10);
var amountInput = document.getElementById("bill-amount");
amount = parseInt(amountInput.value, 10);

// let's get the selected value for electric state
electricSelectValue = getSelectedValue("electricSelect");
console.log("selected electric value: ", electricSelectValue);

// let's get the selected text for electric state
electricSelectText = getSelectedText("electricSelect");
console.log("selected electric text: ", electricSelectText);

if (phone.length > 11 || phone.length < 11) {
    validated = false;
    showError('phone-error', 'Phone number should be at least 11 digits');
}

if (isNaN(amount) || amount > 10000 || amount < 1000) {
    validated = false;
    showError('bill-error', 'Minimum: ₦1,000.00 and Maximum: ₦10,000.00');
}
// console.log(amount)

if (meterNumber === '') {
    validated = false;
    showError('meter-error', "Meter number can not be empty.");
}else if (meterNumber.length < 10 || meterNumber.length > 10) {
    validated = false;
    showError('meter-error', "Meter number should be at least 10 digits");
}
// console.log(meterNumber);

// let's check the radio button that was checked
paymentMethod = radioButtonCheck('input[name="flexRadioDefault"]');

// console.log('Checked radio button:', paymentMethod);

// let's send a post request to make an airtime purchase

if (validated) {
    disableElectricityDiv();
      // now our invoice div is enabled let's supply it data gotten from the airtime div
        // Get the span element by its id
        var invoice_date = document.getElementById('invoice_date');
        var payment_method = document.getElementById('payment_method');
        var phone_number = document.getElementById('phone_number');
        var invoice_electric_region = document.getElementById('invoice_electric_region');
        var invoice_electric_region_id = document.getElementById('invoice_electric_region_id');
        var invoice_electric_auto_renew = document.getElementById('invoice_electric_auto_renew');
        var invoice_electric_meter_number = document.getElementById('invoice_electric_meter_number');
        var invoice_charge = document.getElementById('invoice_charge');
        var invoice_service_charge = document.getElementById('invoice_service_charge');
        var invoice_total_charge = document.getElementById('invoice_total_charge');

        // let's update all fields to user entered fields
        // let's update the date field
        invoice_date.textContent = getCurrentDate();
        if (paymentMethod == "wallet") {
            payment_method.textContent = "Wallet";
            invoice_charge.textContent = '₦' + '0.00';
            invoice_service_charge.textContent = formatNumberToNaira(decoderPlanPrice);
            invoice_total_charge.textContent = formatNumberToNaira(decoderPlanPrice);
            // console.log('updated total charge for wallet is: ' + updatedTotalCharge)
        }else if (paymentMethod == "paystack") {
            payment_method.textContent = "Paystack";
            // let's get the transaction charge of this transaction
            let percentage = 1.5;
            // Calculate 1.5% of the original number
            let TransactionCharge = (percentage / 100) * decoderPlanPrice;
            let updatedTransactionCharge = TransactionCharge + 20; // Add NGN20 as processing fee
            invoice_charge.textContent = formatNumberToNaira(updatedTransactionCharge);
            invoice_service_charge.textContent = formatNumberToNaira(decoderPlanPrice);
            decoderPlanPrice = parseFloat(decoderPlanPrice) + updatedTransactionCharge;
            invoice_total_charge.textContent = formatNumberToNaira(decoderPlanPrice);
        }
        
        // let's update the phone number to be recharged
        phone_number.textContent = mobileNumber;
        invoice_decoder_operator.textContent = decoderTextType;
        invoice_decoder_plan.textContent = decoderPlanText;
        invoice_decoder_auto_renew.textContent = autoRenew;
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

function getSelectedText(id) {
    // Get the select element by its ID
    var selectElement = document.getElementById(id);

    // Get the selected option
    var selectedOption = selectElement.options[selectElement.selectedIndex];

    // Get the text content of the selected option
    var selectedText = selectedOption.text || selectedOption.innerText;

    // Return the selected text
    return selectedText;
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
function disableElectricityDiv() {
    document.getElementById('electricity-section').classList.add('disabled');
    document.getElementById('electricity-section').disabled = true;

    document.getElementById('invoice-section').classList.remove('disabled');
    document.getElementById('invoice-section').disabled = false;
}

// Function to enable the div and its content
function enableElectricityDiv() {
    document.getElementById('electricity-section').classList.remove('disabled');
    document.getElementById('electricity-section').disabled = false;

    document.getElementById('invoice-section').classList.add('disabled');
    document.getElementById('invoice-section').disabled = true;
}
