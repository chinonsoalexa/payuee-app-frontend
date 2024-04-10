var plan;
var servicePlanID;
var phone;
var bundle;
var autoRenew;
var paymentMethod;
var totalCharge;
var planID;
var validated = true;
var transCharge = 0;

document.getElementById('buy-data').addEventListener('click', function(event) {
    event.preventDefault();
    // Prevent the default behavior (in this case, the redirect)
    buy_data();
});

document.getElementById('back-to-data').addEventListener('click', function(event) {
    // Prevent the default behavior (in this case, the redirect)
    event.preventDefault();
    enableDataDiv();
})

document.getElementById('continue-buy-data').addEventListener('click', async function(event) {
    event.preventDefault();

    if (validated) {
        deactivateButtonStyles();
        const user = {
            PaymentType: paymentMethod,
            ServiceID: "data",
            NetworkPlan: servicePlanID,
            PlanID: planID,
            Bundle:      bundle,
            Price:  totalCharge, 
            TranCharge: transCharge,
            PhoneNumber: phone,
            AutoRenew:   autoRenew,
        };
        console.log('this is the data to be sent: ' + JSON.stringify(user));
        console.log('the plan id to be sent is: ' + planID);
        // var value.data
        // error message from paystack
        // {"message":"Invalid Amount Sent","status":false}

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

                console.log('here 1')
                if (responseData.success == 'data successfully bought') {
                    window.location.href = "https://payuee.com/successful.html"
                    return
                } else {
                window.location.href = responseData.success.data.authorization_url;
                return
                }
        } finally {
            reactivateButtonStyles();
        }
    }
});

function buy_data(){
    validated = true
    // let's take all fields and validate
    phone = document.getElementById("phone-number").value;

    if (phone.length > 11 || phone.length < 11) {
        validated = false
        showError('phone-error', 'Phone number should be at least 11 digits.');
    }

    // let's check the radio button that was checked to determine the payment option
    paymentMethod = radioButtonCheck('input[name="flexRadioDefault"]');

    var autorenewCheckbox = document.getElementById("autorenew");

    // Check if the checkbox is checked
    if (autorenewCheckbox.checked) {
        autoRenew = true;
    } else {
        autoRenew = false;
    }

    // let's send a post request to make an airtime purchase

    if (validated) {
        disableDataDiv()
          // now our invoice div is enabled let's supply it data gotten from the airtime div
        // Get the span element by its id
        var invoice_date = document.getElementById('invoice_date');
        var payment_method = document.getElementById('payment_method');
        var phone_number = document.getElementById('phone_number');
        var invoice_data_plan = document.getElementById('invoice_data_plan');
        var invoice_bundle = document.getElementById('invoice_bundle');
        var invoice_auto_renew = document.getElementById('invoice_auto_renew');
        var invoice_charge = document.getElementById('invoice_charge');
        var invoice_service_charge = document.getElementById('invoice_service_charge');
        var invoice_total_charge = document.getElementById('invoice_total_charge');

        // let's update all fields to user entered fields
        // let's update the date field
        invoice_date.textContent = getCurrentDate();
        invoice_service_charge
        // let's update the payment method field
        console.log('payment method: ' + paymentMethod)
        if (paymentMethod == "wallet") {
            payment_method.textContent = "Wallet";
            invoice_charge.textContent = '₦' + '0.00';
            invoice_total_charge.textContent = formatNumberToNaira(totalCharge);
            invoice_service_charge.textContent = formatNumberToNaira(totalCharge);
        }else if (paymentMethod == "paystack") {
            payment_method.textContent = "Paystack";
            // let's get the transaction charge of this transaction
            let updatedTransactionCharge = calculateTotalCharge(totalCharge)
            invoice_charge.textContent = formatNumberToNaira(updatedTransactionCharge);
            transCharge = updatedTransactionCharge;
            invoice_service_charge.textContent = formatNumberToNaira(totalCharge);
            invoice_total_charge.textContent = formatNumberToNaira(totalCharge + transCharge);
        }
        // let's update the phone number to be recharged
        // console.log(phone);
        phone_number.textContent = phone;
        invoice_data_plan.textContent = plan;
        invoice_bundle.textContent = bundle;
        invoice_auto_renew.textContent = autoRenew;


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
function disableDataDiv() {
    document.getElementById('data-section').classList.add('disabled');
    document.getElementById('data-section').disabled = true;

    document.getElementById('invoice-section').classList.remove('disabled');
    document.getElementById('invoice-section').disabled = false;
}

// Function to enable the div and its content
function enableDataDiv() {
    document.getElementById('data-section').classList.remove('disabled');
    document.getElementById('data-section').disabled = false;

    document.getElementById('invoice-section').classList.add('disabled');
    document.getElementById('invoice-section').disabled = true;
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
currentSpan.textContent = 'Select Bundle';

// Create the list ul inside nice-select
var listUl = document.createElement('ul');
listUl.className = 'list';

// Create an option li inside the list
var optionLi = document.createElement('li');
optionLi.className = 'option focus selected';
optionLi.setAttribute('data-value', 'plans');
optionLi.textContent = 'Loading Bundles...';

// Append elements to build the structure
listUl.appendChild(optionLi);
niceSelectDiv.appendChild(currentSpan);
niceSelectDiv.appendChild(listUl);

// Append the nice-select div to planSelectDiv
planSelectDiv.appendChild(niceSelectDiv);

// this variable is used to get the data-value so it's very essential
var dataValue

document.addEventListener('DOMContentLoaded', function() {
    var container = document.getElementById('getDataDiv'); // Replace 'containerId' with your actual container ID

    if (container) {
        container.addEventListener('click', async function(event) {
            if (event.target.closest('.nice-select') && event.target.classList.contains('option')) {
                // Your code to handle the click event
                // You can call your function here or perform any other actions
                await getSelectedPlan(dataValue)
            }
        });
    } else {
        console.error('Container not found.');
    }
});

// add an event listener to the list in order to retrieve the data-value
document.addEventListener('DOMContentLoaded', function() {
    var planSelect = document.getElementById('planSelectId');

    if (planSelect) {
        planSelect.addEventListener('click', function(event) {
            var clickedElement = event.target;

            // Check if the clicked element has the required classes
            if (
                clickedElement.classList.contains('option') &&
                clickedElement.classList.contains('focus') &&
                clickedElement.classList.contains('selected')
            ) {
                // Get the data-value attribute of the clicked list item
                dataValue = clickedElement.getAttribute('data-value');
            }
        });
    } else {
        console.error('NiceSelect container not found.');
    }
});

async function getSelectedPlan(dataValue) {

    // Check if the selected value is not the default option
    if (dataValue !== '1') {
        // var plansSelect = document.getElementById('planSelectId');
        // plansSelect.innerHTML = '<option value="plans">Select a Plan</option>';

        // Perform a task based on the selected value
        switch (dataValue) {
            case '2':
                await requestPlan('mtn_sme', 'MTN SME');
                servicePlanID = 'mtn_sme'
                // console.log('running 2')
                break;
            case '3':
                await requestPlan('mtncg', 'MTN CG');
                servicePlanID = 'mtncg'
                // console.log('running 3')
                break;
            case '4':
                await requestPlan('airtel_cg', "Airtel CG");
                servicePlanID = 'airtel_cg'
                // console.log('running 4')
                break;
            case '5':
                await requestPlan('etisalat_data', '9mobile');
                servicePlanID = 'etisalat_data'
                // console.log('running 5')
                break;
            case '6':
                await requestPlan('glo_data', 'GLO');
                servicePlanID = 'glo_data'
                // console.log('running 6')
                break;
            default:
                // Handle other cases
                break;
        }
    }
}

async function requestPlan(plan_id, plan_name) {
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
        var data;
        if (response.ok) {
            data = await response.json();
        
            var plansList = document.querySelector('#planSelectId .nice-select .list');
            var niceSelectCurrentSpan = document.querySelector('#planSelectId .nice-select .current');
        
            // Clear existing list items
            plansList.innerHTML = '';
        
            // console.log(data);
            // console.log('plans for subscription', data.plans);
            // Sort the 'plans' array based on the 'price' property
            data.plans.sort((a, b) => a.price.localeCompare(b.price));

            data.plans.forEach(plan => {
                var listItem = document.createElement('li');
                listItem.className = 'option';
                listItem.setAttribute('data-value', plan.price);
                listItem.setAttribute('plan-id', plan.value);
                listItem.textContent = `${plan.displayName}`;
        
                // Add a click event listener to each listItem
                listItem.addEventListener('click', function (event) {
                    var dataPrice = '';
        
                    // Remove 'focus' class from all list items
                    plansList.querySelectorAll('.option').forEach(item => {
                        item.classList.remove('focus');
                    });
        
                    // Get the data-value attribute of the clicked list item
                    if (event.target.classList.contains('option')) {
                        dataPrice = event.target.getAttribute('data-value');
                    }

                    // Get the data-value attribute of the clicked list item
                    if (event.target.classList.contains('option')) {
                        planID = event.target.getAttribute('plan-id');
                    }
        
                    // Add 'focus' class to the clicked list item
                    event.target.classList.add('focus');
        
                    // Remove commas and parse the dataValue to a number
                    const numericValue = parseFloat(dataPrice);
                    totalCharge = numericValue;
                    bundle = plan.displayName;
                    planID = plan.value; 
        
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
                niceSelectCurrentSpan.textContent = `Select a Bundle`;
            } else {
                niceSelectCurrentSpan.textContent = `Error getting plans`;
            }
        } else {
            // console.error('Failed to fetch plans');
        }
        
    } catch (error) {
            subscriptionError(plan_name);
        // console.error('Error fetching plans:', error);
        // Handle other errors
    }
}

function subscriptionError(operator_name) {
    const installPopup = document.getElementById('subErrorPopup');
    const cancelButton = document.getElementById('okay-btn');
    const dataSubName = document.getElementById('dataSubName');

    dataSubName.textContent = operator_name;

    installPopup.style.display = 'block';

    // Cancel button click event
    cancelButton.addEventListener('click', () => {
        installPopup.style.display = 'none';
    });
}


function calculateTotalCharge(originalPrice) {
    let additionalPercentage = 1.5;
    let paystackPercentage = 1.5;
    
    // Calculate the total amount to ensure you receive 500 naira after Paystack's fees
    let totalAmount = originalPrice / (1 - (paystackPercentage / 100)) * (1 + additionalPercentage / 100);
    let secondPrice = totalAmount - originalPrice;

    if (originalPrice > 5000) {
        return Math.ceil(secondPrice += 25);
    }

    return Math.ceil(secondPrice += 5);
}

// for the plan operator selector

// Assuming 'planSelectId' is the ID of the div wrapping the select element
var planSelectDiv = document.getElementById('getDataDiv');

// Create a new div for nice-select
var niceSelectDiv = document.createElement('div');
niceSelectDiv.className = 'nice-select';  // Add your class here
niceSelectDiv.id = 'planSelectId';   // Add your ID here
niceSelectDiv.setAttribute('tabindex', '0');

// Create the current span inside nice-select
var currentSpan = document.createElement('span');
currentSpan.className = 'current';
currentSpan.textContent = 'Select a Plan';

// Create the list ul inside nice-select
var listUl = document.createElement('ul');
listUl.className = 'list';

// Sample array of options
var options = [
    { value: '2', text: 'MTN-SME-Data (*461*4#)' },
    { value: '3', text: 'MTN-Corporate-Gifting (*131*4#)' },
    { value: '4', text: 'Airtel-Corporate-Gifting (*323)' },
    { value: '5', text: '9mobile-Data (*323#)' },
    { value: '6', text: 'Glo-Corporate-Gifting (*323#)' }
];

// Loop through options and create list items
options.forEach(option => {
    var listItem = document.createElement('li');
    listItem.className = 'option';
    listItem.setAttribute('data-value', option.value);
    listItem.textContent = option.text;

    // Add a click event listener to each listItem
    listItem.addEventListener('click', function (event) {
        // Remove 'select' class from all list items
        listUl.querySelectorAll('.option').forEach(item => {
            item.classList.remove('focus');
            item.classList.remove('selected');
        });

        // Add 'select' class to the clicked list item
        event.target.classList.add('selected');
        event.target.classList.add('focus');

        // Set the value to be displayed
        var displayInput = document.getElementById('displayInput');
        displayInput.value = option.text; // Set the value based on your requirement
        plan = option.text;
        // console.log('this is the display value of the option: ' + option.text);

        // Your code to handle the click event
        // You can call your function here or perform any other actions
    });

    listUl.appendChild(listItem);
});

// Append elements to build the structure
niceSelectDiv.appendChild(currentSpan);
niceSelectDiv.appendChild(listUl);

// Append the nice-select div to planSelectDiv
planSelectDiv.appendChild(niceSelectDiv);


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

function insufficientFunds() {
    const installPopup = document.getElementById('balance-popup');
    const cancelButton = document.getElementById('cancel-btn');
    const balance = document.getElementById('insufficientFunds');

    balance.textContent = formatNumberToNaira(totalCharge);

      installPopup.style.display = 'block';

    // Cancel button click event
    cancelButton.addEventListener('click', () => {
      installPopup.style.display = 'none';
    });
}

function formatNumberToNaira(number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(number);
}

function logUserOutIfTokenIsExpired() {
    // also send a request to the logout api endpoint
    const apiUrl = "https://payuee.onrender.com/log-out";

    const requestOptions = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    credentials: 'include', // set credentials to include cookies
    };
    
try {
    const response = fetch(apiUrl, requestOptions);

        // const data = response.json();
        localStorage.removeItem('auth')
        window.location.href = '../index.html'
    } finally{
        // do nothing
    }
}

// Add this function to remove onclick and on hover styles
function deactivateButtonStyles() {
    var resendButton = document.getElementById('continue-buy-data');
    resendButton.classList.add('deactivated'); // Add a class to the button
}

// Add this function to reactivate the button styles
function reactivateButtonStyles() {
    var resendButton = document.getElementById('continue-buy-data');
    // Remove all existing classes
    resendButton.className = '';
    // Add the original class 'cmn__btn'
    resendButton.classList.add('cmn__btn');
}