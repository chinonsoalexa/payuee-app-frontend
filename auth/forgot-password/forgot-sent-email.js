let resendTimer;
let lastResendTime = 0;

// Focus on the first input field when the page loads
window.onload = function () {
    // Retrieve the last reset time and continue if available
    continueResendTimer()
};

// event listener to resend otp
document.getElementById('resend-otp').addEventListener('click', async function () {
    await resendButtonOTP();
});

async function resendButtonOTP() {
    startResendTimer()
    deactivateButtonStyles();
    // Get the current URL
    const currentUrl = new URL(window.location.href);

    // Extract parameters using URLSearchParams
    const params = new URLSearchParams(currentUrl.search);

    // Get individual parameter values
    const userID = params.get("user");

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
    }
    reactivateButtonStyles();
}

function startResendTimer() {
    checkIfStillCounting = false

    if (checkIfStillCounting) {
        showError('otpError', "Please wait at least 1 minute before resending.");
        return;
    }

    const resendButton = document.getElementById('resend-otp');
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
            resendButton.disabled = false; // Enable the button
            lastResendTime = Date.now(); // Record the time of the last resend
            reactivateButtonStyles(); // Reactivate button styles
            timerActive = false; // Set the timer as inactive
            localStorage.removeItem('lastResendTime');
            localStorage.removeItem('inputValue');
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
    const minimumInterval = 60 * 1000; // 1 minute in milliseconds

    const resendButton = document.getElementById('resend-otp');
    // resendButton.disabled = true; // Disable the button

    // Calculate the remaining time based on the difference
    let seconds = Math.max(0, Math.floor((minimumInterval - timeDifference) / 1000));

    let timerActive = true;

    resendTimer = setInterval(function () {
        if (seconds <= 0) {
            clearInterval(resendTimer);
            resendButton.innerHTML = 'Resend OTP';
            resendButton.disabled = false; // Enable the button
            localStorage.setItem('inputValue', usersLastInputValue);
            localStorage.setItem('lastResendTime', Date.now().toString()); // Update last reset time
            reactivateButtonStyles(); // Reactivate button styles
            timerActive = false; // Set the timer as inactive
            localStorage.removeItem('lastResendTime');
            localStorage.removeItem('inputValue');
        } else {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            resendButton.innerHTML = `Resend OTP (${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds})`;
        }

        if (timerActive) {
            deactivateButtonStyles();
        }

        seconds--;
    }, 1000);
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
    var resendButton = document.getElementById('resend-otp');
    resendButton.classList.add('deactivated'); // Add a class to the button
}

// Add this function to reactivate the button styles
function reactivateButtonStyles() {
    var resendButton = document.getElementById('resend-otp');
    // resendButton.className = '';
    resendButton.classList.remove('deactivated');
    
    clearError('otpError');
}

function clearError(id) {
    // Construct the error message element ID
    const errorId = id;
    
    // Get the error message element
    const errorElement = document.getElementById(errorId);

    // Check if the error element exists before manipulating it
    if (errorElement) {
        errorElement.textContent = ''; // Clear the error message
        // errorElement.style.display = 'none'; // Hide the error message
    }
}
