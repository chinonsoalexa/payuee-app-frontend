var autoRenew;
var decoderType;
var decoderTextType;
var decoderPlanValue;
var decoderPlanText;
var decoderPlanPrice;
var paymentMethod;
var decoderNumber;
var mobileNumber;

// validation for selecting the decoder type
var clickedSelectOperator = false;
var clickedSelectPlan = false;
var validated = true;
var transCharge = 0;

document.getElementById('tv-button').addEventListener('click', function(event) {
    // Prevent the default behavior (in this case, the redirect)
    event.preventDefault();
    decoder_subscription();
})

var dstv = [
    { value: 'dstv-padi', text: 'DStv Padi - ₦3,600', price: 3600 },
    { value: 'dstv-yanga', text: 'DStv Yanga - ₦5,100', price: 5100 },
    { value: 'dstv-confam', text: 'DStv Confam - ₦9,300', price: 9300 },
    { value: 'dstv6', text: 'DStv Asia - ₦12,400', price: 12400 },
    { value: 'dstv79', text: 'DStv Compact - ₦15,700', price: 15700 },
    { value: 'dstv7', text: 'DStv Compact Plus - ₦25,000', price: 25000 },
    { value: 'dstv3', text: 'DStv Premium - ₦37,000', price: 37000 },
    { value: 'dstv10', text: 'DStv Premium Asia - ₦42,000', price: 42000 },
    { value: 'dstv9', text: 'DStv Premium-French - ₦57,500', price: 57500 },
    { value: 'confam-extra', text: 'DStv Confam + ExtraView - ₦14,300', price: 14300 },
    { value: 'yanga-extra', text: 'DStv Yanga + ExtraView - ₦10,100', price: 10100 },
    { value: 'padi-extra', text: 'DStv Padi + ExtraView - ₦8,600', price: 8600 },
    { value: 'com-asia', text: 'DStv Compact + Asia - ₦28,100', price: 28100 },
    { value: 'dstv30', text: 'DStv Compact + Extra View - ₦20,700', price: 20700 },
    { value: 'com-frenchtouch', text: 'DStv Compact + French Touch - ₦21,500', price: 21500 },
    { value: 'dstv33', text: 'DStv Premium – Extra View - ₦42,000', price: 42000 },
    { value: 'dstv40', text: 'DStv Compact Plus – Asia - ₦37,400', price: 37400 },
    { value: 'com-frenchtouch-extra', text: 'DStv Compact + French Touch + ExtraView - ₦26,500', price: 26500 },
    { value: 'com-asia-extra', text: 'DStv Compact + Asia + ExtraView - ₦33,100', price: 33100 },
    { value: 'dstv43', text: 'DStv Compact Plus + French Plus - ₦45,500', price: 45500 },
    { value: 'complus-frenchtouch', text: 'DStv Compact Plus + French Touch - ₦30,800', price: 30800 },
    { value: 'dstv45', text: 'DStv Compact Plus – Extra View - ₦30,000', price: 30000 },
    { value: 'complus-french-extraview', text: 'DStv Compact Plus + FrenchPlus + Extra View - ₦50,500', price: 50500 },
    { value: 'dstv47', text: 'DStv Compact + French Plus - ₦36,200', price: 36200 },
    { value: 'dstv48', text: 'DStv Compact Plus + Asia + ExtraView - ₦42,400', price: 42400 },
    { value: 'dstv61', text: 'DStv Premium + Asia + Extra View - ₦54,400', price: 54400 },
    { value: 'dstv62', text: 'DStv Premium + French + Extra View - ₦51,000', price: 51000 },
    { value: 'hdpvr-access-service', text: 'DStv HDPVR Access Service - ₦5,000', price: 5000 },
    { value: 'frenchplus-addon', text: 'DStv French Plus Add-on - ₦20,500', price: 20500 },
    { value: 'asia-addon', text: 'DStv Asian Add-on - ₦12,400', price: 12400 },
    { value: 'frenchtouch-addon', text: 'DStv French Touch Add-on - ₦5,800', price: 5800 },
    { value: 'extraview-access', text: 'ExtraView Access - ₦5,000', price: 5000 },
    { value: 'french11', text: 'DStv French 11 - ₦9,000', price: 9000 }
];

var gotv = [
    { value: 'gotv-smallie', text: 'GOtv Smallie - ₦1,575', price: 1575 },
    { value: 'gotv-jinja', text: 'GOtv Jinja - ₦3,300', price: 3300 },
    { value: 'gotv-jolli', text: 'GOtv Jolli - ₦4,850', price: 4850 },
    { value: 'gotv-max', text: 'GOtv Max - ₦7,200', price: 7200 },
    { value: 'gotv-supa', text: 'GOtv Supa - ₦9,600', price: 9600 },
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

document.getElementById('continue-sub-decoder').addEventListener('click', async function(event) {
    event.preventDefault();

    if (validated) {

        deactivateButtonStyles('continue-sub-decoder');
        const user = {
            PaymentType: paymentMethod,
            ServiceID: "decoder",
            Price:  Number(decoderPlanPrice), 
            TranCharge: transCharge,
            PhoneNumber: mobileNumber,
            Operator:      decoderType,
            Bundle:       decoderPlanText,
            DecoderNumber: decoderNumber,
            VariationID:   decoderPlanValue,
            Plan:          decoderPlanText,
            AutoRenew:   autoRenew,
        };
        // console.log('this is the data to be sent: ' + JSON.stringify(user));

        const apiUrl = "https://api.payuee.com/payuee/init-transaction";

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

                // console.log('here 1')
                if (responseData.success == 'data successfully bought') {
                    // console.log('here 2')
                    window.location.href = "https://payuee.com/successful.html"
                    return
                } else {
                // console.log('here 3')
                window.location.href = responseData.success.data.authorization_url;
                return
                }
        } finally {
            reactivateButtonStyles('continue-sub-decoder');
        }
    }
});

function decoder_subscription(){
    validated = true

    // deactivateButtonStyles('tv-button');
    if (!clickedSelectPlan) {
        validated = false;
        showError('decoder-operator-error', 'Please select a plan'); 
    }

    if (!clickedSelectOperator) {
        validated = false;
        showError('decoder-operator-error', 'Please select an operator'); 
    }

    // let's get the selected value
    decoderNumber = document.getElementById("decoder-number").value;

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
    mobileNumber = document.getElementById("mobile-number").value;
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

    // let's send a post request to make an airtime purchase

    if (validated) {
        disableTvDiv();
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
        if (paymentMethod == "wallet") {
            payment_method.textContent = "Wallet";
            invoice_charge.textContent = '₦' + '0.00';
            invoice_service_charge.textContent = formatNumberToNaira(decoderPlanPrice);
            invoice_total_charge.textContent = formatNumberToNaira(decoderPlanPrice);
            // console.log('updated total charge for wallet is: ' + updatedTotalCharge)
        }else if (paymentMethod == "paystack") {
            payment_method.textContent = "Paystack";
            // let's get the transaction charge of this transaction
            transCharge = calculateTotalCharge(decoderPlanPrice); // Add NGN20 as processing fee
            invoice_charge.textContent = formatNumberToNaira(transCharge);
            invoice_service_charge.textContent = formatNumberToNaira(decoderPlanPrice);
            invoice_total_charge.textContent = formatNumberToNaira(parseFloat(decoderPlanPrice) + transCharge);
        }
        
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

    balance.textContent = formatNumberToNaira(decoderPlanPrice);

      installPopup.style.display = 'block';

    // Cancel button click event
    cancelButton.addEventListener('click', () => {
      installPopup.style.display = 'none';
    });
}

function logUserOutIfTokenIsExpired() {
    // also send a request to the logout api endpoint
    const apiUrl = "https://api.payuee.com/log-out";

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

        // Add logic to change font size based on conditions
        if (data.length >= 10) {
            listItem.style.fontSize = '11px'; // Change font size to 11px
        }
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
