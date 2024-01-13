// document.addEventListener('DOMContentLoaded', function() {
// });

document.getElementById('buy-data').addEventListener('click', function(event) {
    event.preventDefault
    // Prevent the default behavior (in this case, the redirect)
    buy_data()
});

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
optionLi.textContent = 'Loading Plans...';

// Append elements to build the structure
listUl.appendChild(optionLi);
niceSelectDiv.appendChild(currentSpan);
niceSelectDiv.appendChild(listUl);

// Append the nice-select div to planSelectDiv
planSelectDiv.appendChild(niceSelectDiv);

// getSelectedPlan()

console.log('Script is running');
document.addEventListener('DOMContentLoaded', function() {
    var container = document.getElementById('getDataDiv'); // Replace 'containerId' with your actual container ID

    if (container) {
        container.addEventListener('click', async function(event) {
            if (event.target.closest('.nice-select') && event.target.classList.contains('option')) {
                // Your code to handle the click event
                // You can call your function here or perform any other actions
                await getSelectedPlan()
            }
        });
    } else {
        console.error('Container not found.');
    }
});

async function getSelectedPlan() {

    var operatorSelect = document.getElementById('operatorSelect');
    // var niceSelectCurrentSpan = document.querySelector('#planSelectId .nice-select .current');
// 
    // Get the selected value
    var selectedValue = operatorSelect.value;
    console.log('Selected Value:', selectedValue);

    // Update nice-select current span text
    // niceSelectCurrentSpan.textContent = operatorSelect.options[operatorSelect.selectedIndex].text;

    // Check if the selected value is not the default option
    if (selectedValue !== '1') {
        var plansSelect = document.getElementById('plansSelect');
        plansSelect.innerHTML = '<option value="plans">Select a Plan</option>';

        // Perform a task based on the selected value
        switch (selectedValue) {
            case '2':
                await requestPlan('mtn_sme');
                console.log('running 2')
                break;
            case '3':
                await requestPlan('mtncg');
                console.log('running 3')
                break;
            case '4':
                await requestPlan('airtel_cg');
                console.log('running 4')
                break;
            case '5':
                await requestPlan('etisalat_data');
                console.log('running 5')
                break;
            case '6':
                await requestPlan('glo_data');
                console.log('running 6')
                break;
            default:
                // Handle other cases
                break;
        }
    }
}

async function requestPlan(plan_id) {
    // optionLi.textContent = 'Getting Plans...';
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
            include: Credential
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
                listItem.setAttribute('data-value', plan.price);
                listItem.textContent = `${plan.displayName}`;
        
                // Add a click event listener to each listItem
                listItem.addEventListener('click', function (event) {
                    var dataValue = '';
        
                    // Remove 'focus' class from all list items
                    plansList.querySelectorAll('.option').forEach(item => {
                        item.classList.remove('focus');
                    });
        
                    // Get the data-value attribute of the clicked list item
                    if (event.target.classList.contains('option')) {
                        dataValue = event.target.getAttribute('data-value');
                    }
        
                    // Add 'focus' class to the clicked list item
                    event.target.classList.add('focus');
        
                    // Remove commas and parse the dataValue to a number
                    const numericValue = parseFloat(dataValue);
        
                    // Get the input element by its ID
                    var displayInput = document.getElementById('displayInput');
        
                    // Set the value to be displayed
                    // Format the number with commas and a dot, using NGN as the currency
                    var formatter = new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
        
                    var formattedNumber = formatter.format(numericValue); // '₦270,000.00'
        
                    displayInput.value = formattedNumber;
                });
        
                plansList.appendChild(listItem);
            });
        
            // Update nice-select current span text after the loop
            if (data.plans.length > 0) {
                niceSelectCurrentSpan.textContent = `Select a Plan`;
            } else {
                niceSelectCurrentSpan.textContent = `Error getting plans`;
            }
        } else {
            console.error('Failed to fetch plans');
        }
        
    } catch (error) {
        console.error('Error fetching plans:', error);
        // Handle other errors
    }
}
