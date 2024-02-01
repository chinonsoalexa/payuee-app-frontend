document.getElementById('recharge-button').addEventListener('click', function(event) {
    // Prevent the default behavior (in this case, the redirect)
    event.preventDefault();
    buy_recharge_pin()
})

document.getElementById('back-to-airtime').addEventListener('click', function(event) {
    // Prevent the default behavior (in this case, the redirect)
    event.preventDefault();
    enableCardPinDiv()
})

function buy_recharge_pin(){
    var validated = true
    // let's take all fields and validate
    var amountInput = document.getElementById("pin-number");
    var amount = parseInt(amountInput.value, 10);
    var description = document.getElementById("description").value;
    // let's get the selected value
    var selectedRechargeValue = getSelectedValue("rechargeSelect");
    var rechargeValue = parseInt(selectedRechargeValue, 10);

    if (amount < 10 && rechargeValue < 500) {
        validated = false;
        showError('pin-error', 'Minimum 10 pins per order, except for ₦500+ recharge.');
    }else if (amountInput.value.trim() === '') {
        validated = false;
        showError('pin-error', 'Please enter amount of pin to recharge.');
    }

    // let's check the radio button that was checked
   let checkedButton = radioButtonCheck('input[name="flexRadioDefault"]');

    console.log('Checked radio button:', checkedButton);

    // let's send a post request to make an airtime purchase

    if (validated) {
        disableCardPinDiv()
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
        console.log('payment method: ' + paymentMethod)
        if (paymentMethod == "wallet") {
            payment_method.textContent = "Wallet";
            invoice_charge.textContent = '₦' + '0.00';
            let updatedTotalCharge = amountInputNumber.toFixed(2);
            invoice_total_charge.textContent = '₦' + updatedTotalCharge;
            invoice_service_charge.textContent = '₦' + amountInput.value;
        }else if (paymentMethod == "paystack") {
            payment_method.textContent = "Paystack";
                // let's get the transaction charge of this transaction
            let percentage = 1.5;
            // Calculate 1.5% of the original number
            let TransactionCharge = (percentage / 100) * amountInputNumber;
            let updatedTransactionCharge = TransactionCharge + 20;
            let stringTransactionCharge = updatedTransactionCharge.toFixed(2);
            invoice_charge.textContent = '₦' + stringTransactionCharge;
            totalCharge = amountInputNumber + updatedTransactionCharge;
            let totalChargeForPaystack = amountInputNumber + updatedTransactionCharge;
            let updatedTotalCharge = totalChargeForPaystack.toFixed(2);
            invoice_total_charge.textContent = '₦' + updatedTotalCharge;
            console.log('updated total charge is: ' + updatedTotalCharge)
        }
        // let's update the phone number to be recharged
        phone_number.textContent = phone;
        // let's update the operator to be used for recharge
        if (selectedCarrierValue == "mtn") {
            invoice_operator.textContent = "MTN";
        }else if (selectedCarrierValue == "airtel") {
            invoice_operator.textContent = "Airtel";
        }else if (selectedCarrierValue == "etisalat") {
            invoice_operator.textContent = "9mobile";
        }else if (selectedCarrierValue == "glo") {
            invoice_operator.textContent = "GLO";
        }
     
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