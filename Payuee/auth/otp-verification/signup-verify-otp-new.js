let resendTimer;
let lastResendTime = 0;

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
            // credentials: 'include', // set credentials to include cookies
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
                    showError('otpError', 'invalid email verification link.');
                    // if error is invalid otp let's show the user button to resend an otp verification link
                    document.getElementById('resendOTP').style.display='block';
                } else if  (errorData.error === 'OTP  Expired') {
                    // redirect user to verify email ID
                    showError('otpError', 'This email verification link has expired please, try resending a verification link.');
                    // if error is otp expired let's show the user button to resend an otp verification link
                    document.getElementById('resendOTP').style.display='block';
                } else if  (errorData.error === 'otp not found') {
                    // Handle other error cases
                    showError('otpError', 'Email not found.');
                } else {
                    showError('otpError', 'An error occurred. Please try again.');
                }
                hideLoadingIcon();
                return;
            }
            // const data = await response.json();
            hideLoadingIcon();
            showError('otpError', 'Email address verified...');
            localStorage.setItem('auth', 'true');
            window.location.href = '../index-in.html'
        } finally{
           // do nothing cause error has been handled
            hideLoadingIcon();
        }
        // Hide loading icon after request completes
        hideLoadingIcon();
});

document.getElementById("resendOTP").addEventListener('click', async function () {
    await resendOTP();
});

async function resendOTP() {
    document.getElementById('verifyText').textContent = 'Please  check your email for verification link.'
    startResendTimer()
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
}

// Function to show loading icon
function showLoadingIcon() {
    document.getElementById('loading-icon-container').style.display = 'block';
}

// Function to hide loading icon
function hideLoadingIcon() {
    document.getElementById('loading-icon-container').style.display = 'none';
}

function showError(id, message) {
    var errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.color = 'red';
}

// Add this function to reactivate the button styles
function reactivateButtonStyles() {
    var resendButton = document.getElementById('submitPassword');
    resendButton.classList.remove('deactivated');
}

// Add this function to remove onclick and on hover styles
function deactivateButtonStyles() {
    var resendButton = document.getElementById('submitPassword');
    // Disable the button
    resendButton.classList.add('deactivated'); // Add a class to the button
}

function startResendTimer() {
    checkIfStillCounting = false

    if (checkIfStillCounting) {
        showError('otpError', "Please wait at least 1 minute before resending.");
        return;
    }

    const resendButton = document.getElementById('resendOTP');
    // resendButton.disabled = true; // Disable the button

    let seconds = 60; // Set the countdown time to 5 minutes (300 seconds)

    let timerActive = true;

    resendTimer = setInterval(function () {
        seconds--;
    
        if (timerActive) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            resendButton.innerHTML = `Resend (${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds})`;
            // Save the last reset time as a string 
            localStorage.setItem('lastResendTime', Date.now().toString());
            checkIfStillCounting = true
        }
    
        if (seconds <= 0) {
            clearInterval(resendTimer);
            resendButton.innerHTML = 'Resend';
            // resendButton.disabled = false; // Enable the button
            lastResendTime = Date.now(); // Record the time of the last resend
            reactivateButtonStyles(); // Reactivate button styles
            timerActive = false; // Set the timer as inactive
            localStorage.removeItem('lastResendTime');
        }
        if (timerActive) {
            deactivateButtonStyles();
        }
    }, 1000);
}

function continueResendTimer() {
    const storedLastResendTimeString = localStorage.getItem('lastResendTime');
    const storedLastResendTime = storedLastResendTimeString ? parseInt(storedLastResendTimeString) : 0;

    const now = Date.now();
    const timeDifference = now - storedLastResendTime;
    const minimumInterval = 60 * 1000; // 5 minutes in milliseconds

    document.getElementById('input1').value = usersLastInputValue;

    const resendButton = document.getElementById('resendOTP');
    // resendButton.disabled = true; // Disable the button

    // Calculate the remaining time based on the difference
    let seconds = Math.max(0, Math.floor((minimumInterval - timeDifference) / 1000));

    let timerActive = true;

    resendTimer = setInterval(function () {
        seconds--;

        if (timerActive) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            resendButton.innerHTML = `Resend (${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds})`;
        }

        if (seconds <= 0) {
            clearInterval(resendTimer);
            resendButton.innerHTML = 'Resend';
            // resendButton.disabled = false; // Enable the button
            localStorage.setItem('lastResendTime', Date.now().toString()); // Update last reset time
            reactivateButtonStyles(); // Reactivate button styles
            timerActive = false; // Set the timer as inactive
            localStorage.removeItem('lastResendTime');
        }

        if (timerActive) {
            deactivateButtonStyles();
        }
    }, 1000);
}