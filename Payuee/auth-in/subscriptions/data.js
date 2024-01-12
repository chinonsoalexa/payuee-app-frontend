// document.addEventListener('DOMContentLoaded', function() {
//     // Your JavaScript code here
//     console.log('Script loaded');
// });
console.log('Script is running');

var operatorSelect = document.getElementById('operator-select');
console.log('Operator select element:', operatorSelect);

document.getElementById('buy-data').addEventListener('click', function(event) {
    // Prevent the default behavior (in this case, the redirect)
    event.preventDefault();
    // buy_data()
    getSelectedPlan();
})

function buy_data(){
    var validated = true
    // let's take all fields and validate
    var amountInput = document.getElementById("data-number");
    var amount = parseInt(amountInput.value, 10);
    // var description = document.getElementById("description").value;
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

// Add an event listener to the select element
// document.getElementById('operator-select').addEventListener('change', async function () {
//     console.log('Change event triggered');

//     try {
//         await getSelectedPlan();
//         // Additional code to run after getSelectedPlan completes
//     } catch (error) {
//         console.error('Error in change event:', error);
//     }
// });

async function getSelectedPlan() {
    console.log('getSelectedPlan function entered');
    var operatorSelect = document.getElementById('operator-select');
    // Get the select element
    var plansSelect = document.getElementById('plansSelect');

    // Get the selected value
    var selectedValue = operatorSelect.value;
    console.log('Selected Value:', selectedValue);

    // Check if the selected value is not the default option
    // if (selectedValue !== '1') {
    //     plansSelect.innerHTML = '<option value="1">Select a Plan</option>';

        // Perform a task based on the selected value
        switch (selectedValue) {
            case '2':
                await requestPlan('mtn_sme');
                // Add your specific task for this option
                break;
            case '3':
                await requestPlan('mtncg');
                // Add your specific task for this option
                break;
            case '4':
                await requestPlan('airtel_cg');
                // Add your specific task for this option
                break;
            case '5':
                await requestPlan('etisalat_data');
                // Add your specific task for this option
                break;
            case '6':
                await requestPlan('glo_data');
                // Add your specific task for this option
                break;
            default:
                // Handle other cases
                break;
        }
    // }
}

async function requestPlan(plan_id) {
    const userAgent = navigator.userAgent;
    console.log('User-Agent:', userAgent);
    try {
        const url = `https://gsubz.com/api/plans?service=${plan_id}`;
        const headers = {
            'Content-Type': 'application/json',
            'User-Agent': userAgent
        };

        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const data = await response.json();
            
            var selectElement = document.getElementById('plansSelect');
            selectElement.innerHTML = ''; // Clear existing options

            console.log(data);

            data.plans.forEach(plan => {
                var option = document.createElement('option');
                option.value = plan.value;
                option.textContent = `${plan.displayName} - ₦${plan.price}`;
                selectElement.appendChild(option);
            });
        } else {
            console.error('Failed to fetch plans');
        }
    } catch (error) {
        console.error('Error fetching plans:', error);
        // Handle other errors
    }
}


