// Get references to loading icon
const loadingIcon = document.getElementById('loading-icon');

document.addEventListener('DOMContentLoaded', async function () {
        showLoadingIcon()
        // Get the current URL
        const currentUrl = new URL(window.location.href);

        // Extract parameters using URLSearchParams
        const params = new URLSearchParams(currentUrl.search);

        // Get individual parameter values
        const userID = params.get("user");
        const token = params.get("token");

        // localStorage.getItem('code');
        const user = {
            Email: userID,
            SentOTP: token,
          };

          const apiUrl = "https://payuee.onrender.com/email-verification";

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
                // Parse the response JSON
                const errorData = await response.json();
                // Check the error message
                // Handle fetch-related errors
                if (errorData.error === 'failed to get OTP') {
                    // Perform actions specific to this error
                    showError('otpError', 'an error occurred verifying email .');
                } else if  (errorData.error === 'Wrong OTP') {
                    // Handle other error cases
                    showError('otpError', 'Wrong email verification link.');
                } else if  (errorData.error === 'OTP  Expired') {
                    // redirect user to verify email ID
                    showError('otpError', 'This email verification link has expired please try sending another one.');
                    // if error is otp expired let's show the user button to resend an otp verification link
                    document.getElementById('resendOtp').style.display='block';
                } else {
                    showError('passwordError', 'An error occurred. Please try again.');
                }
                hideLoadingIcon();
                return;
            }
            // const data = await response.json();
            hideLoadingIcon();
            window.location.href = '../../../Payuee/page/signup-confirm-otp-new.html'
        } finally{
           // do nothing cause error has been handled
            hideLoadingIcon();
        }
        // Hide loading icon after request completes
        hideLoadingIcon();
});

document.getElementById("submitButtonContainer").addEventListener('click', async function () {
    // Get the current URL
    const currentUrl = new URL(window.location.href);

    // Extract parameters using URLSearchParams
    const params = new URLSearchParams(currentUrl.search);

    // Get individual parameter values
    const userID = params.get("user");

    const resendOTP = {
        Email: userID,
    };

    const apiUrl = "https://payuee.onrender.com/resend-otp";

    const requestOptions = {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        credentials: 'include', // set credentials to include cookies
        body: JSON.stringify(resendOTP),
    };
    
    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            // throw new Error(`HTTP error! Status: ${response.status}`);
            data = await response.json();
            if (data.error == 'Failed to get previous email OTP') {
                showError('otpError', "Email not found, please re-enter your email address.");
            } else {
                showError('otpError', 'An error occurred. Please try again.');
            }
            return;
        } 
        const data = await response.json();
    } finally {
        // do nothing cause error has been handled
        reactivateButtonStyles();
    }
    reactivateButtonStyles();
})

// Function to show loading icon
function showLoadingIcon() {
    loadingIcon.style.display = 'inline';
}

// Function to hide loading icon
function hideLoadingIcon() {
    loadingIcon.style.display = 'none';
}

function showError(id, message) {
    var errorElement = document.getElementById(id);
    errorElement.textContent = message;
}

// Add this function to reactivate the button styles
function reactivateButtonStyles() {
    var resendButton = document.getElementById('submitPassword');
    resendButton.classList.remove('deactivated');
    
    clearError('otpError');
}

// Add this function to remove onclick and on hover styles
function deactivateInputStyles() {
    var currentInput = document.getElementById('submitPassword');
    // Disable the input field
    currentInput.disabled = true;
}