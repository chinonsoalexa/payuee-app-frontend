document.addEventListener("DOMContentLoaded", function (){
    // Call the function to check the user from the URL
    checkUserFromURL();
})

function checkUserFromURL() {
    // Get the current page URL
    const currentURL = window.location.href;

    // Create a URL object to easily access query parameters
    const urlParams = new URL(currentURL).searchParams;

    // Get the 'user' and 'token' parameters from the URL
    const user = urlParams.get('user');
    const token = urlParams.get('token');

    // Check if the 'user' parameter exists
    if (user) {
        const reset_password = document.getElementById("reset_password");
        // Add a class
        reset_password.classList.remove("d-none");

        document.getElementById('confirm_password_button').addEventListener('click', async function (event) {
            event.preventDefault(); // Prevent form submission
            
            let newPassword = document.getElementById('customerNewPasswordInput').value;
            let confirmPassword = document.getElementById('customerConfirmPasswordInput').value;

            if (newPassword == "" || confirmPassword == "") {
                showToastMessageE('Please fill in all fields with new password');
                return;
            }

            if (newPassword !== confirmPassword) {
                showToastMessageE('Transaction pin do not match');
                return;
            }

            // Pattern to match an 8-digit numeric password
            const passwordPattern = /^\d{6}$/;

            if (!passwordPattern.test(confirmPassword)) {
                showToastMessageE('Transaction Pin must be exactly 6 digits long.');
                return;
            }
        
            disableButton('confirm_password_button');
            await confirmEmailOtp(user, confirmPassword, token);
        });
    } else {
        // Select the element you want to modify
        const send_email = document.getElementById("send_email");
        // Remove a class
        send_email.classList.remove("d-none");

        document.getElementById('send_email_button').addEventListener('click', async function (event) {
            event.preventDefault(); // Prevent form submission
            
            if (!isValidEmail(document.getElementById('customerNameEmailInput').value)) {
                showToastMessageE("Please enter a valid email address");
                return;
            }
        
            disableButton('send_email_button');
            await sendEmailOtp(document.getElementById('customerNameEmailInput').value);
        });
    }
}

function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

async function sendEmailOtp(emailOTP) {

    // send a post request with the otp
    const otp = {
        Email: emailOTP,
    };

    const apiUrl = "https://api.payuee.com/app/forgotten-trans-pin-email";

    const requestOptions = {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        credentials: 'include', // set credentials to include cookies
        body: JSON.stringify(otp),
    };
    
    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            // throw new Error(`HTTP error! Status: ${response.status}`);
            data = await response.json();
            if (data.error == 'User already exist, please verify your email ID') {
                showToastMessageE("User already exist, please verify your email ID");
            } else {
                showToastMessageE('An error occurred. Please try again.');
            }
            return;
        } 
        const data = await response.json();

        showToastMessageS(data.success);

    } finally {
        enableButton('send_email_button');
    }
}

async function confirmEmailOtp(user, confirmPassword, token) {

    // send a post request with the otp
    const otp = {
        Email: user,
        SentOTP: token,
        Password: confirmPassword,
    };

    const apiUrl = "https://api.payuee.com/app/forgotten-trans-pin-verification";

    const requestOptions = {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        credentials: 'include', // set credentials to include cookies
        body: JSON.stringify(otp),
    };
    
    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            // throw new Error(`HTTP error! Status: ${response.status}`);
            data = await response.json();
            if (data.error == 'User already exist, please verify your email ID') {
                showToastMessageE("User already exist, please verify your email ID");
            } else {
                showToastMessageE('An error occurred. Please try again.');
            }
            return;
        } 
        const data = await response.json();

        showToastMessageS(data.success);
        document.getElementById('customerNewPasswordInput').value = '';
        document.getElementById('customerConfirmPasswordInput').value = '';

        // Redirect after 3 seconds (3000 milliseconds)
        setTimeout(function() {
            // Retrieve `redirectTo` from Local Storage
            const redirectTo = localStorage.getItem('redirectTo');

            // Check if `redirectTo` has a valid URL before redirecting
            if (redirectTo) {
                // Remove `redirectTo` from local storage after using it
                localStorage.removeItem('redirectTo');
                window.location.href = redirectTo;
            } else {
                // Remove `redirectTo` from local storage after using it
                localStorage.removeItem('redirectTo');
                // Fallback to the home page if `redirectTo` is empty
                window.location.href = 'https://app.payuee.com/e-shop/home';
            }
        }, 2000); // Adjust the delay time in milliseconds as needed

    } finally {
        enableButton('confirm_password_button');
    }
}

function showToastMessageS(message) {
    document.getElementById('toastMessage2').textContent = message;
    const toastElement = document.getElementById('liveToast3'); // Get the toast element
    const toast = new bootstrap.Toast(toastElement); // Initialize the toast
    toast.show(); // Show the toast
}

function showToastMessageE(message) {
    document.getElementById('toastError').textContent = message;
    const toastElement = document.getElementById('liveToast1'); // Get the toast element
    const toast = new bootstrap.Toast(toastElement); // Initialize the toast
    toast.show(); // Show the toast
}

// Get the button element
const sendEmailButton = document.getElementById("send_email_button");

// Function to disable the button
function disableButton(button_id) {
    const sendEmailButton = document.getElementById(button_id);
    sendEmailButton.disabled = true;
    sendEmailButton.classList.add("disabled"); // Optional: add a disabled style class if desired
}

// Function to enable the button
function enableButton(button_id) {
    const sendEmailButton = document.getElementById(button_id);
    sendEmailButton.disabled = false;
    sendEmailButton.classList.remove("disabled"); // Optional: remove disabled style class
}