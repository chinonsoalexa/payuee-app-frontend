var validated = true
var amountInput

document.getElementById('airtime-button').addEventListener('click', function(event) {
        // Prevent the default behavior (in this case, the redirect)
        event.preventDefault();
        buy_airtime()
})

document.getElementById('back-to-airtime').addEventListener('click', function(event) {
    // Prevent the default behavior (in this case, the redirect)
    event.preventDefault();
    enableAirtimeDiv()
})

document.getElementById('continue-buy-airtime').addEventListener('click', async function(event) {
    event.preventDefault();

    if (validated) {
        activatePreloader();

        const user = {
            Amount: amountInput.value,
        };

        const apiUrl = "https://payuee.onrender.com/paystack/init-transaction";

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
                } else {
                    showError('passwordError', 'An error occurred. Please try again.');
                }

                return;
            }

            const responseData = await response.json();
            window.location.href = responseData.data.authorization_url;
        } finally {
            deactivatePreloader();
        }
    }
});


async function buy_airtime(){
    validated = true
    // let's take all fields and validate
    var phone = document.getElementById("phone-number").value;
    amountInput = document.getElementById("amount-input");
    var amount = parseInt(amountInput.value, 10);
    // let's get the selected value
    var selectedCarrierValue = getSelectedValue("carrierSelect");
    console.log(selectedCarrierValue)

    if (phone.length > 12 || phone.length < 11) {
        validated = false
        showError('phone-error', 'Phone number should be at least 11 digits.');
    }

    if (isNaN(amount) || amount > 5000 || amount < 95) {
        validated = false
        showError('amount-error', 'Minimum: ₦95.00 and Maximum: ₦5,000.00');
    }

    // let's check the radio button that was checked
   let checkedButton = radioButtonCheck('input[name="flexRadioDefault"]');

    console.log('Checked radio button:', checkedButton);

    // let's send a post request to make an airtime purchase

    if (validated) {
        // first let's make request with details to get the invoice for the transaction
        disableAirtimeDiv()
         
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
function disableAirtimeDiv() {
    document.getElementById('airtime-section').classList.add('disabled');
    document.getElementById('airtime-section').disabled = true;

    document.getElementById('invoice-section').classList.remove('disabled');
    document.getElementById('invoice-section').disabled = false;
}

// Function to enable the div and its content
function enableAirtimeDiv() {
    document.getElementById('airtime-section').classList.remove('disabled');
    document.getElementById('airtime-section').disabled = false;

    document.getElementById('invoice-section').classList.add('disabled');
    document.getElementById('invoice-section').disabled = true;
}

function activatePreloader() {
    console.log("activated the preloader")
    // Create a new preloader wrapper
    var customPreloader = $('<div>', {
        'class': 'preloader__wrap'
    });

    // Append your existing preloader HTML content
    customPreloader.html(`
    <div class="preloader__wrap">
    <div class="preloader__box">
       <div class="circle">
          <img src="assets/img/preloader/preloader.png" alt="preloader">
        </div>
        <div class="recharge">
            <img src="assets/img/preloader/rechage.png" alt="rechage">
        </div>
        <span class="pretext">
            Payuee
        </span>
        </div>
    </div>
    `);

    // Append the new preloader to the body
    $('body').append(customPreloader);
    console.log("appended the preloader")
}

// Function to deactivate (hide) the preloader
function deactivatePreloader() {
    $('.preloader__wrap').fadeOut();
    console.log("deactivated the preloader")
}
