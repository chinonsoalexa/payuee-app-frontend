// Get references to loading icon
const loadingIcon = document.getElementById('loading-icon');

document.addEventListener('DOMContentLoaded', async function () {
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

          const apiUrl = "https://payuee.onrender.comemail-verification";

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include', // set credentials to include cookies
            body: JSON.stringify(user),
          };
          
        try {
            showLoadingIcon()
            const response = await fetch(apiUrl, requestOptions);
            if (!response.ok) {
                // Parse the response JSON
                const errorData = await response.json();
                // Check the error message
                // Handle fetch-related errors
                console.log(errorData);
                console.log('error message: ', errorData.error);
                if (errorData.error === 'failed to get OTP') {
                    // Perform actions specific to this error
                    showError('otpError', 'an error occurred verifying email .');
                } else if  (errorData.error === 'Wrong OTP') {
                    // Handle other error cases
                    showError('otpError', 'Wrong email verification link.');
                } else if  (errorData.error === 'OTP  Expired') {
                    // redirect user to verify email ID
                    showError('otpError', 'This email verification link has expired please try sending another one.');
                    // window.location.href = '/verify';
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