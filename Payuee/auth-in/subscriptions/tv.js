var autoRenew;
var decoderType;
var decoderTextType;
var decoderPlanValue;
var decoderPlanText;
var decoderPlanPrice;
var paymentMethod;

// validation for selecting the decoder type
var clickedSelectOperator = false;
var clickedSelectPlan = false;
var validated = true

document.getElementById('tv-button').addEventListener('click', function(event) {
    // Prevent the default behavior (in this case, the redirect)
    event.preventDefault();
    decoder_subscription();
})

var dstv = [
    { value: 'dstv-padi', text: 'DStv Padi - ₦2,950', price: 2950 },
    { value: 'dstv-yanga', text: 'DStv Yanga - ₦4,200', price: 4200 },
    { value: 'dstv-confam', text: 'DStv Confam - ₦7,400', price: 7400 },
    { value: 'dstv6', text: 'DStv Asia - ₦9,900', price: 9900 },
    { value: 'dstv79', text: 'DStv Compact - ₦12,500', price: 12500 },
    { value: 'dstv7', text: 'DStv Compact Plus - ₦19,800', price: 19800 },
    { value: 'dstv3', text: 'DStv Premium - ₦29,500', price: 29500 },
    { value: 'dstv10', text: 'DStv Premium Asia - ₦33,000', price: 33000 },
    { value: 'dstv9', text: 'DStv Premium-French - ₦45,600', price: 45600 },
    { value: 'confam-extra', text: 'DStv Confam + ExtraView - ₦11,400', price: 11400 },
    { value: 'yanga-extra', text: 'DStv Yanga + ExtraView - ₦8,200', price: 8200 },
    { value: 'padi-extra', text: 'DStv Padi + ExtraView - ₦6,950', price: 6950 },
    { value: 'com-asia', text: 'DStv Compact + Asia - ₦22,400', price: 22400 },
    { value: 'dstv30', text: 'DStv Compact + Extra View - ₦16,500', price: 16500 },
    { value: 'com-frenchtouch', text: 'DStv Compact + French Touch - ₦17,100', price: 17100 },
    { value: 'dstv33', text: 'DStv Premium – Extra View - ₦33,500', price: 33500 },
    { value: 'dstv40', text: 'DStv Compact Plus – Asia - ₦29,700', price: 29700 },
    { value: 'com-frenchtouch-extra', text: 'DStv Compact + French Touch + ExtraView - ₦21,100', price: 21100 },
    { value: 'com-asia-extra', text: 'DStv Compact + Asia + ExtraView - ₦26,400', price: 26400 },
    { value: 'dstv43', text: 'DStv Compact Plus + French Plus - ₦35,900', price: 35900 },
    { value: 'complus-frenchtouch', text: 'DStv Compact Plus + French Touch - ₦24,400', price: 24400 },
    { value: 'dstv45', text: 'DStv Compact Plus – Extra View - ₦23,800', price: 23800 },
    { value: 'complus-french-extraview', text: 'DStv Compact Plus + FrenchPlus + Extra View - ₦39,900', price: 39900 },
    { value: 'dstv47', text: 'DStv Compact + French Plus - ₦28,600', price: 28600 },
    { value: 'dstv48', text: 'DStv Compact Plus + Asia + ExtraView - ₦33,700', price: 33700 },
    { value: 'dstv61', text: 'DStv Premium + Asia + Extra View - ₦43,400', price: 43400 },
    { value: 'dstv62', text: 'DStv Premium + French + Extra View - ₦40,700', price: 40700 },
    { value: 'hdpvr-access-service', text: 'DStv HDPVR Access Service - ₦4,000', price: 4000 },
    { value: 'frenchplus-addon', text: 'DStv French Plus Add-on - ₦16,100', price: 16100 },
    { value: 'asia-addon', text: 'DStv Asian Add-on - ₦9,900', price: 9900 },
    { value: 'frenchtouch-addon', text: 'DStv French Touch Add-on - ₦4,600', price: 4600 },
    { value: 'extraview-access', text: 'ExtraView Access - ₦4,000', price: 4000 },
    { value: 'french11', text: 'DStv French 11 - ₦7,200', price: 7200 },
];

var gotv = [
    { value: 'gotv-smallie', text: 'GOtv Smallie - ₦1,300', price: 1300 },
    { value: 'gotv-jinja', text: 'GOtv Jinja - ₦2,700', price: 2700 },
    { value: 'gotv-jolli', text: 'GOtv Jolli - ₦3,950', price: 3950 },
    { value: 'gotv-max', text: 'GOtv Max - ₦5,700', price: 5700 },
    { value: 'gotv-supa', text: 'GOtv Supa - ₦7,600', price: 7600 },
];

var startime = [
    { value: 'nova', text: 'Startimes Nova - ₦1,500', price: 1500 },
    { value: 'basic', text: 'Startimes Basic - ₦2,600', price: 2600 },
    { value: 'smart', text: 'Startimes Smart - ₦3,500', price: 3500 },
    { value: 'classic', text: 'Startimes Classic - ₦3,800', price: 3800 },
    { value: 'super', text: 'Startimes Super - ₦6,500', price: 6500 },
];

document.getElementById('back-to-tv').addEventListener('click', function(event) {
    // Prevent the default behavior (in this case, the redirect)
    event.preventDefault();
    enableTvDiv()
})

function decoder_subscription(){
    // deactivateButtonStyles('tv-button');
    if (!clickedSelectPlan) {
        validated = false;
        showError('decoder-operator-error', 'Please select a plan'); 
    }

    if (!clickedSelectOperator) {
        validated = false;
        showError('decoder-operator-error', 'Please select an operator'); 
    }

    // var description = document.getElementById("description").value;
    // let's get the selected value
    var decoderNumber = document.getElementById("decoder-number").value;

    if (decoderNumber.length < 10) {
        validated = false;
        showError('decoder-number-error', 'Decoder number should be at least 10 digits.'); 
    }else if (decoderNumber.length > 10) {
        validated = false;
        showError('decoder-number-error', 'Decoder number should be 10 digits.'); 
    }else if (decoderNumber.trim() === '') {
        validated = false;
        showError('decoder-number-error', 'Please enter a decoder number.');
    }

    // let's take all fields and validate
    var mobileNumber = document.getElementById("mobile-number").value;
    // var number = parseInt(mobileNumber.value, 10);

    if (mobileNumber.length < 11) {
        validated = false;
        showError('mobile-error', 'Phone number should be at least 11 digits.'); 
    }else if (mobileNumber.length > 11) {
        validated = false;
        showError('mobile-error', 'Phone number should be 11 digits.'); 
    }else if (mobileNumber.trim() === '') {
        validated = false;
        showError('mobile-error', 'Please enter mobile number.');
    }

    var autorenewCheckbox = document.getElementById("autoRenewDecoder");

    // Check if the checkbox is checked
    if (autorenewCheckbox.checked) {
        autoRenew = true;
    } else {
        autoRenew = false;
    }

    // let's check the radio button that was checked
    paymentMethod = radioButtonCheck('input[name="flexRadioDefault"]');

    // console.log('Checked radio button:', paymentMethod);

    // let's send a post request to make an airtime purchase

        console.log('here 0');
        console.log('this is validated status: ' + validated);
        // reactivateButtonStyles('tv-button')
    if (validated) {
        console.log('here 1');
        disableTvDiv();
        console.log('here 2');
         // now our invoice div is enabled let's supply it data gotten from the airtime div
        // Get the span element by its id
        var invoice_date = document.getElementById('invoice_date');
        var payment_method = document.getElementById('payment_method');
        var phone_number = document.getElementById('phone_number');
        var invoice_decoder_operator = document.getElementById('invoice_decoder_operator');
        var invoice_decoder_plan = document.getElementById('invoice_decoder_plan');
        var invoice_decoder_auto_renew = document.getElementById('invoice_decoder_auto_renew');
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
            // paymentMethod = "wallet";
            invoice_charge.textContent = '₦' + '0.00';
            console.log('this is decoderPlanPrice wallet: ' +decoderPlanPrice)
            invoice_service_charge.textContent = formatNumberToNaira(decoderPlanPrice);
            invoice_total_charge.textContent = formatNumberToNaira(decoderPlanPrice);
            // console.log('updated total charge for wallet is: ' + updatedTotalCharge)
        }else if (paymentMethod == "paystack") {
            payment_method.textContent = "Paystack";
            // paymentMethod = "paystack";
            // let's get the transaction charge of this transaction
            let percentage = 1.5;
            // Calculate 1.5% of the original number
            let TransactionCharge = (percentage / 100) * decoderPlanPrice;
            let updatedTransactionCharge = TransactionCharge + 20; // Add NGN20 as processing fee
            invoice_charge.textContent = formatNumberToNaira(Math.ceil(updatedTransactionCharge));
            invoice_service_charge.textContent = formatNumberToNaira(decoderPlanPrice);
            // let totalChargeForPaystack = decoderPlanPrice + updatedTransactionCharge;
            console.log('this is decoderPlanPrice paystack: ' +decoderPlanPrice);
            console.log('this is decoder transaction Price paystack: ' +Math.ceil(updatedTransactionCharge));
            invoice_total_charge.textContent = formatNumberToNaira(decoderPlanPrice + Math.ceil(updatedTransactionCharge));
        }
        console.log('decoder text type: ' + decoderTextType);
        console.log('decoder plan type: ' + decoderPlanText);
        // let's update the phone number to be recharged
        phone_number.textContent = mobileNumber;
        invoice_decoder_operator.textContent = decoderTextType;
        invoice_decoder_plan.textContent = decoderPlanText;
        invoice_decoder_auto_renew.textContent = autoRenew;
    }
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
function disableTvDiv() {
    document.getElementById('tv-section').classList.add('disabled');
    document.getElementById('tv-section').disabled = true;

    document.getElementById('invoice-section').classList.remove('disabled');
    document.getElementById('invoice-section').disabled = false;
}

// Function to enable the div and its content
function enableTvDiv() {
    document.getElementById('tv-section').classList.remove('disabled');
    document.getElementById('tv-section').disabled = false;

    document.getElementById('invoice-section').classList.add('disabled');
    document.getElementById('invoice-section').disabled = true;
}


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

function formatNumberToNaira(number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(number);
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
function deactivateButtonStyles(tv_button) {
    var resendButton = document.getElementById(tv_button);
    resendButton.classList.add('deactivated'); // Add a class to the button
}

// Add this function to reactivate the button styles
function reactivateButtonStyles(tv_button) {
    var resendButton = document.getElementById(tv_button);
    // Remove all existing classes
    resendButton.className = '';
    // Add the original class 'cmn__btn'
    resendButton.classList.add('cmn__btn');
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
optionLi.textContent = 'Select Your Operator First';

// Append elements to build the structure
listUl.appendChild(optionLi);
niceSelectDiv.appendChild(currentSpan);
niceSelectDiv.appendChild(listUl);

// Append the nice-select div to planSelectDiv
planSelectDiv.appendChild(niceSelectDiv);

document.addEventListener('DOMContentLoaded', function() {
    var container = document.getElementById('getDataDiv');
    var dataValue;

    if (container) {
        container.addEventListener('click', function(event) {
            if (event.target.closest('.nice-select') && event.target.classList.contains('option')) {
                dataValue = event.target.getAttribute('data-value');
                // console.log("just clicked on " + dataValue);
                clickedSelectOperator = true;
                getSelectedPlan(dataValue);
            }
        });
    } else {
        console.error('Container not found.');
    }
});

function getSelectedPlan(dataValue) {
    var data;

    switch (dataValue) {
        case 'dstv':
            data = dstv;
            break;
        case 'gotv':
            data = gotv;
            break;
        case 'startimes':
            data = startime;
            break;
        default:
            // Handle other cases
            break;
    }

    displaySecondaryList(data);
}

function displaySecondaryList(data) {
    var plansList = document.querySelector('#planSelectId .nice-select .list');
    var niceSelectCurrentSpan = document.querySelector('#planSelectId .nice-select .current');

    // Clear existing list items
    plansList.innerHTML = '';

    // Sort the 'data' array based on the 'text' property
    data.sort((a, b) => a.text.localeCompare(b.text));

    data.forEach(plan => {
        var listItem = document.createElement('li');
        listItem.className = 'option';
        listItem.setAttribute('data-value', plan.value);
        listItem.setAttribute('data-text', plan.text);
        listItem.setAttribute('data-price', plan.price);
        listItem.textContent = `${plan.text}`;

        // Add a click event listener to each listItem
        listItem.addEventListener('click', function (event) {
            decoderPlanValue = '';

            // Remove 'focus' class from all list items
            plansList.querySelectorAll('.option').forEach(item => {
                item.classList.remove('focus');
            });

            // Get the data-value attribute of the clicked list item
            if (event.target.classList.contains('option')) {
                decoderPlanValue = event.target.getAttribute('data-value');
                decoderPlanText = event.target.getAttribute('data-text');
                decoderPlanPrice = event.target.getAttribute('data-price');
            }
            clickedSelectPlan = true;
            // console.log('clicked plan: ', decoderPlanValue);

            //  console.log('data value/type1: ', decoderPlanValue)
            //  console.log('data price/type2: ', decoderPlanPrice)
            // console.log('data text/type3: ', decoderPlanText)

            // Add 'focus' class to the clicked list item
            event.target.classList.add('focus');

        });

        plansList.appendChild(listItem);
    });

    // Update nice-select current span text after the loop
    if (data.length > 0) {
        niceSelectCurrentSpan.textContent = `Select a Plan`;
    } else {
        niceSelectCurrentSpan.textContent = `Error getting plans`;
    }
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
currentSpan.textContent = 'Select Your Operator';

// Create the list ul inside nice-select
var listUl = document.createElement('ul');
listUl.className = 'list';

// array for options
var options = [
    { value: 'dstv', text: 'DSTV' },
    { value: 'gotv', text: 'GOTV' },
    { value: 'startimes', text: 'Startimes' }
];

// Loop through options and create list items
options.forEach(option => {
    var listItem = document.createElement('li');
    listItem.className = 'option';
    listItem.setAttribute('data-value', option.value);
    listItem.setAttribute('data-text', option.text);
    listItem.textContent = option.text;

    // Add a click event listener to each listItem
    listItem.addEventListener('click', function (event) {
        // console.log('event.target:', event.target); // Add this line for debugging
        decoderType = '';
        decoderTextType='';
    
        // Get the data-value attribute of the clicked list item
        if (event.target.classList.contains('option')) {
            decoderType = event.target.getAttribute('data-value');
            decoderTextType = event.target.getAttribute('data-text');
        }
        // console.log('data price/type: ', decoderType)
        // console.log('data text/type: ', decoderTextType)
    
        // Add 'focus' class to the clicked list item
        event.target.classList.add('focus');
    });
    
    listUl.appendChild(listItem);
});

// Append elements to build the structure
niceSelectDiv.appendChild(currentSpan);
niceSelectDiv.appendChild(listUl);

// Append the nice-select div to planSelectDiv
planSelectDiv.appendChild(niceSelectDiv);
