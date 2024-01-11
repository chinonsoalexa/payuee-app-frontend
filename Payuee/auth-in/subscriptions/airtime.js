document.getElementById('recharge-button').addEventListener('click', function() {
        // Prevent the default behavior (in this case, the redirect)
        event.preventDefault();
        buy_airtime()
})

function buy_airtime(){
    var validated = true
    // let's take all fields and validate
    var phone = document.getElementById("phone-number").value;
    var amountInput = document.getElementById("amount-input");
    var amount = parseInt(amountInput.value, 10);
    // let's get the selected value
    // var selectedCarrierValue = getSelectedValue("carrierSelect");

    if (phone.length > 12 || phone.length < 11) {
        validated = false
        showError('phone-error', 'Phone number should be at least 11 digits.');
    }

    if (isNaN(amount) || amount > 5000 || amount < 95) {
        validated = false
        showError('amount-error', 'Minimum: ₦95 and Maximum:₦5000.');
    }

    // let's check if the radio button is checked
    // Get all radio buttons with the name 'flexRadioDefault'
    const radioButtons = document.querySelectorAll('input[name="flexRadioDefault"]');

    // Loop through the radio buttons
    radioButtons.forEach(function(radioButton) {
        // Check if the radio button is checked
        if (radioButton.checked) {
            // Log the id of the checked radio button
            console.log('Checked radio button:', radioButton.id);
        }
    });

    // let's send a post request to make an airtime purchase


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