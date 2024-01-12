//     // Your JavaScript code here
//     console.log('Script loaded');
console.log('Script is running');


// Add an event listener to the select element
// document.getElementById('operator-select').addEventListener('change', async function () {
//     console.log('Change event triggered');

//     try {
//         await getSelectedPlan();
//         console.log('getSelectedPlan executed successfully');
//     } catch (error) {
//         console.error('Error in getSelectedPlan:', error);
//     }
// });

document.getElementById('buy-data').addEventListener('click', function() {
    // Prevent the default behavior (in this case, the redirect)
    // buy_data()
    getSelectedPlan();
})

function buy_data(event){
    event.preventDefault();
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

// Assuming 'planSelectId' is the ID of the div wrapping the select element
var planSelectDiv = document.getElementById('planSelectId');

// Create a new div for nice-select
var niceSelectDiv = document.createElement('div');
niceSelectDiv.className = 'nice-select';
niceSelectDiv.setAttribute('tabindex', '0');

// Create the current span inside nice-select
var currentSpan = document.createElement('span');
currentSpan.className = 'current';
currentSpan.textContent = 'Select a Plan';

// Create the list ul inside nice-select
var listUl = document.createElement('ul');
listUl.className = 'list';

// Create an option li inside the list
var optionLi = document.createElement('li');
optionLi.className = 'option focus selected';
optionLi.setAttribute('data-value', 'plans');
optionLi.textContent = 'Select a Plan';

// Append elements to build the structure
listUl.appendChild(optionLi);
niceSelectDiv.appendChild(currentSpan);
niceSelectDiv.appendChild(listUl);

// Append the nice-select div to planSelectDiv
planSelectDiv.appendChild(niceSelectDiv);

// Add an event listener to the select element
document.getElementById('operator-select').addEventListener('change', async function () {
    console.log('Change event triggered');

    try {
        await getSelectedPlan();
        console.log('getSelectedPlan executed successfully');
    } catch (error) {
        console.error('Error in getSelectedPlan:', error);
    }
});


async function getSelectedPlan() {
    console.log('getSelectedPlan function entered');
    var operatorSelect = document.getElementById('operator-select');
    // var niceSelectCurrentSpan = document.querySelector('#planSelectId .nice-select .current');
// 
    // Get the selected value
    var selectedValue = operatorSelect.value;
    // console.log('Selected Value:', selectedValue);

    // Update nice-select current span text
    // niceSelectCurrentSpan.textContent = operatorSelect.options[operatorSelect.selectedIndex].text;

    // Check if the selected value is not the default option
    if (selectedValue !== '1') {
        var plansSelect = document.getElementById('plansSelect');
        plansSelect.innerHTML = '<option value="plans">Select a Plan</option>';

        // Perform a task based on the selected value
        switch (selectedValue) {
            case '2':
                console.log('Calling requestPlan function');
                await requestPlan('mtn_sme');
                console.log('requestPlan function called successfully');
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
    }
}

async function requestPlan(plan_id) {
    const userAgent = navigator.userAgent;
    console.log('User-Agent:', userAgent);
    try {
        const url = `https://payuee.onrender.com/plans/data?service=${plan_id}`;
        const headers = {
            'Content-Type': 'application/json',
        };

        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });

        if (response.ok) {
            const data = await response.json();

            var plansList = document.querySelector('#planSelectId .nice-select .list');
            var niceSelectCurrentSpan = document.querySelector('#planSelectId .nice-select .current');

            // Clear existing list items
            plansList.innerHTML = '';

            console.log(data);
            console.log('plans for subscription', data.plans);

            data.plans.forEach(plan => {
                var listItem = document.createElement('li');
                listItem.className = 'option';
                listItem.setAttribute('data-value', plan.value);
                listItem.textContent = `${plan.displayName} - ₦${plan.price}`;
                niceSelectCurrentSpan.textContent = `${plan.displayName} - ₦${plan.price}`;
                console.log('display name:', plan.value);
                plansList.appendChild(listItem);
            });

        } else {
            console.error('Failed to fetch plans');
        }
    } catch (error) {
        console.error('Error fetching plans:', error);
        // Handle other errors
    }
}
