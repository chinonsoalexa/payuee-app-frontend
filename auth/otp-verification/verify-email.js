// Focus on the first input field when the page loads
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('verify-email').focus();
});

// event listener to resend otp
document.getElementById('verify-email-button').addEventListener('click', async function () {
    await resendButtonOTP('verify-email');
});

async function resendButtonOTP(currentInput) {
    currentInput = document.getElementById(currentInput);

    if (!currentInput) {
        return; // Return early if the input is not found
    }

    let emailOTP = currentInput.value;

    // let's check if the input is empty and display an error
    if (currentInput.value === '') {
        showError('otpError', "Please enter your email address.", 5000);
        return;
    }
    
    // let's check if the email is valid
    if (!isValidEmail(currentLength)) {
        showError('otpError', "Please enter a valid email address.", 5000);
        return;
    }

    localStorage.setItem('email', emailOTP);

    deactivateButtonStyles();
    // send a post request with the otp
    const otp = {
        Email: emailOTP,
    };

    const apiUrl = "https://payueebackendservice.onrender.com/resend-otp";

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
            errorData = await response.json();
            if (errorData.error == 'Failed to get previous email OTP') {
                showError('emailError', "Email not found, please re-enter your email address.");
            } else {
                showError('emailError', 'An error occurred. Please try again.');
            }
            reactivateButtonStyles();
            return;
        } 
        reactivateButtonStyles();
        // const data = await response.json();
        // if all process was okay let's redirect to the otp page for verification
        window.location.href = 'signup-confirm-otp-new.html'
    } finally {
        // do nothing cause error has been handled
    }
    reactivateButtonStyles();
}

function isValidEmail(email) {
    // Simple email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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