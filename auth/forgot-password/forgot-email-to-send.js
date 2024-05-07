// Focus on the first input field when the page loads
window.onload = function () {
    document.getElementById('verify-email').focus();
};

// event listener to resend otp
document.getElementById('verify-email-button').addEventListener('click', async function () {
    await resetPasswordEmail('verify-email');
});

async function resetPasswordEmail(currentInput) {
    currentInput = document.getElementById(currentInput);

    if (!currentInput) {
        return; // Return early if the input is not found
    }

    if (currentInput.value === '') {
        // show error
        showError('emailError', "Please enter your email address.", 5000);
        return;
    } 
    
    if (!isValidEmail(currentInput.value)) {
        // show error
        showError('emailError', "Please enter a valid email address.", 5000);
        return;
    }

    deactivateButtonStyles();
    // send a post request with the otp
    const otp = {
        Email: currentInput.value,
    };

    const apiUrl = "https://api.payuee.com/forgotten-password-email";

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
            let data = await response.json();
            if (data.error == 'Failed to get previous email OTP') {
                showError('emailError', "Email not found, please re-enter your email address.");
            } else {
                showError('emailError', 'An error occurred. Please try again.');
            }
            return;
        } 
        const data = await response.json();

        window.location.href = 'forgot-sent-email.html'
        reactivateButtonStyles();
    } finally {
        // do nothing cause error has been handled
        reactivateButtonStyles();
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

// Add this function to remove onclick and on hover styles
function deactivateButtonStyles() {
    var resendButton = document.getElementById('verify-email-button');
    // resendButton.className = '';
    resendButton.classList.add('deactivated'); // Add a class to the button
}

// Add this function to reactivate the button styles
function reactivateButtonStyles() {
    var resendButton = document.getElementById('verify-email-button');
    // // Remove all existing classes
    // resendButton.className = '';
    resendButton.classList.remove('deactivated');
    // Add the original class 'cmn__btn'
    resendButton.classList.add('cmn__btn');
}
