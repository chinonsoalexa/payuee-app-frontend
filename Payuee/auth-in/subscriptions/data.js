// Attach the onload event using addEventListener
window.addEventListener('load', getSelectedPlan);

document.getElementById('buy-data').addEventListener('click', function() {
    // Prevent the default behavior (in this case, the redirect)
    event.preventDefault();
    buy_data()
})

function buy_data(){
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

function getSelectedPlan() {
    // Get the select element
    var operatorSelect = document.getElementById('operatorSelect');

    // Add an event listener to the select element
    operatorSelect.addEventListener('change', function() {
        // Get the selected value
        var selectedValue = operatorSelect.value;

        // Perform a task based on the selected value
        switch (selectedValue) {
            case '2':
                requestPlan('mtn_sme')
                // Add your specific task for this option
                break;
            case '3':
                requestPlan('mtncg')
                // Add your specific task for this option
                break;
            case '4':
                requestPlan('airtel_cg')
                // Add your specific task for this option
                break;
            case '5':
                requestPlan('etisalat_data')
                // Add your specific task for this option
                break;
            case '6':
                requestPlan('glo_data')
                // Add your specific task for this option
                break;
            default:
                
                break;
        }
    });
}

function requestPlan(plan_id) {
    fetch('https://gsubz.com/api/plans?service=' + plan_id)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch plans');
            }
            return response.json();
        })
        .then(data => {
            var selectElement = document.getElementById('plansSelect');
            selectElement.innerHTML = ''; // Clear existing options

            console.log(data)
            data.plans.forEach(plan => {
                var option = document.createElement('option');
                option.value = plan.value;
                option.textContent = `${plan.displayName} - ₦${plan.price}`;
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching plans:', error);
            // Handle the error, e.g., display an error message to the user
        });
}
