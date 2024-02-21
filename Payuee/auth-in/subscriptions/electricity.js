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

function pay_electricity_bill(){
// let's take all fields and validate
var phone = document.getElementById("phone-number").value;
var meterNumber = document.getElementById("meter-number").value;
var amountInput = document.getElementById("bill-amount");
var amount = parseInt(amountInput.value, 10);

// let's get the selected value for electric state
var selectedCarrierValue = getSelectedValue("electricSelect");
console.log("selected electric value: ", selectedCarrierValue);

// let's get the selected text for electric state
var selectedCarrierValue = getSelectedText("electricSelect");
console.log("selected electric text: ", selectedCarrierValue);

if (phone.length > 11 || phone.length < 11) {
    validated = false;
    showError('phone-error', 'Phone number should be at least 11 digits.');
}

if (isNaN(amount) || amount > 10000 || amount < 1000) {
    validated = false;
    showError('bill-error', 'Minimum: ₦1,000.00 and Maximum: ₦10,000.00');
}
console.log(amount)

if (meterNumber === '') {
    validated = false;
    showError('meter-error', "Meter Number can not be empty.");
}
console.log(meterNumber);

// let's check the radio button that was checked
let checkedButton = radioButtonCheck('input[name="flexRadioDefault"]');

console.log('Checked radio button:', checkedButton);

// let's send a post request to make an airtime purchase

if (validated) {
    disableElectricityDiv();
      // now our invoice div is enabled let's supply it data gotten from the airtime div
        // Get the span element by its id
        var invoice_date = document.getElementById('invoice_date');
        var payment_method = document.getElementById('payment_method');
        var phone_number = document.getElementById('phone_number');
        var invoice_electric_operator = document.getElementById('invoice_electric_operator');
        var invoice_electric_plan = document.getElementById('invoice_electric_plan');
        var invoice_electric_auto_renew = document.getElementById('invoice_electric_auto_renew');
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
