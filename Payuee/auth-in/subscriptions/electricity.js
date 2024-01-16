document.getElementById('electricity-button').addEventListener('click', function(event) {
    // Prevent the default behavior (in this case, the redirect)
    event.preventDefault();
    pay_electricity_bill()
})

function pay_electricity_bill(){
var validated = true
// let's take all fields and validate
var phone = document.getElementById("phone-number").value;
var meterNumber = document.getElementById("meter-number").value;
var amountInput = document.getElementById("bill-amount");
var amount = parseInt(amountInput.value, 10);
// let's get the selected value
var selectedCarrierValue = getSelectedValue("carrierSelect");
console.log(selectedCarrierValue)

if (phone.length > 12 || phone.length < 11) {
    validated = false
    showError('phone-error', 'Phone number should be at least 11 digits.');
}
console.log(phone)

if (isNaN(amount) || amount > 10000 || amount < 1000) {
    validated = false
    showError('bill-error', 'Minimum: ₦1,000.00 and Maximum: ₦10,000.00');
}
console.log(amount)

if (meterNumber === '') {
    validated = false
    showError('meter-error', 'meter number should not be empty.');
}
console.log(meterNumber)

// let's check the radio button that was checked
let checkedButton = radioButtonCheck('input[name="flexRadioDefault"]');

console.log('Checked radio button:', checkedButton);

// let's send a post request to make an airtime purchase

if (validated) {

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