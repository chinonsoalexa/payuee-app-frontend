let resendTimer;
let lastResendTime = 0;

// Focus on the first input field when the page loads
window.onload = function () {
    document.getElementById('input1').focus();
    // Retrieve the last reset time and continue if available
    continueResendTimer()
};

// event listener to resend otp
document.getElementById('resend-otp').addEventListener('click', function () {
    submitButtonOTP('input1');
});

// Add event listeners for each input
document.getElementById('input1').addEventListener('input', async function () {
    await submitInputOTP('input1');
});

async function submitInputOTP(currentInput) {
    currentInput = document.getElementById(currentInput);

    if (!currentInput) {
        return; // Return early if the input is not found
    }

    currentInput.value = currentInput.value.replace(/[^0-9]/g, ''); // Allow only numerical values
    const maxLength = currentInput.getAttribute('maxlength');
    const currentLength = currentInput.value.length;

    // check length of the input
    if (currentLength === parseInt(maxLength)) {
        deactivateInputStyles()
        // send a post request with the otp
        const otp = {
            SentOTP: currentInput.value,
          };

          const apiUrl = "https://payuee.onrender.com/email-verification";

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
                throw new Error(`HTTP error! Status: ${response.status}`);
            } 
            const data = await response.json();
            reactivateInputStyles()
            localStorage.setItem('auth', 'true')
            window.location.href = '../../index-in.html'
            console.log(data);
        } catch (error) {
            reactivateInputStyles()
            console.error('Error:', error);
            if (error.error == 'User already exist, please login') {
                showError('otpError', "Please login user already exist.");
                return;
            }
        }
    }
}

function submitButtonOTP(currentInput) {
    currentInput = document.getElementById(currentInput);

    if (!currentInput) {
        return; // Return early if the input is not found
    }

    currentInput.value = currentInput.value.replace(/[^0-9]/g, ''); // Allow only numerical values
    const maxLength = currentInput.getAttribute('maxlength');
    const currentLength = currentInput.value.length;

    // if (currentLength !== parseInt(maxLength)) {
    //     showError('otpError', "Please enter 6 digit otp values.", 5000);
    //     return;
    // }

    // check length of the input
    if (currentLength === parseInt(maxLength)) {
        startResendTimer()
        // send a post request with the otp

    }
}

function startResendTimer() {
    checkIfStillCounting = false
    // store the input the user added so that you can retrieve it back
    currentInput = document.getElementById('input1').value;

    if (checkIfStillCounting) {
        showError('otpError', "Please wait at least 1 minute before resending.");
        return;
    }

    const resendButton = document.getElementById('resend-otp');
    resendButton.disabled = true; // Disable the button

    let seconds = 60; // Set the countdown time to 5 minutes (300 seconds)

    let timerActive = true;

    resendTimer = setInterval(function () {
        seconds--;
    
        if (timerActive) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            resendButton.innerHTML = `Resend OTP (${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds})`;
            // Save the last reset time as a string 
            localStorage.setItem('lastResendTime', Date.now().toString());
            localStorage.setItem('inputValue', currentInput);
            checkIfStillCounting = true
        }
    
        if (seconds <= 0) {
            clearInterval(resendTimer);
            resendButton.innerHTML = 'Resend OTP';
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
    const usersLastInputValue = localStorage.getItem('inputValue');
    const storedLastResendTimeString = localStorage.getItem('lastResendTime');
    const storedLastResendTime = storedLastResendTimeString ? parseInt(storedLastResendTimeString) : 0;

    const now = Date.now();
    const timeDifference = now - storedLastResendTime;
    const minimumInterval = 60 * 1000; // 5 minutes in milliseconds

    document.getElementById('input1').value = usersLastInputValue;

    const resendButton = document.getElementById('resend-otp');
    resendButton.disabled = true; // Disable the button

    // Calculate the remaining time based on the difference
    let seconds = Math.max(0, Math.floor((minimumInterval - timeDifference) / 1000));

    let timerActive = true;

    resendTimer = setInterval(function () {
        seconds--;

        if (timerActive) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            resendButton.innerHTML = `Resend OTP (${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds})`;
        }

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
        }

        if (timerActive) {
            deactivateButtonStyles();
        }
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
    var currentInput = document.getElementById('input1');
    // Disable the input field
    currentInput.disabled = true;
    var resendButton = document.getElementById('resend-otp');
    resendButton.classList.add('deactivated'); // Add a class to the button
}

// Add this function to reactivate the button styles
function reactivateButtonStyles() {
    var currentInput = document.getElementById('input1');
    // Re-enable the input field
    currentInput.disabled = false;
    var resendButton = document.getElementById('resend-otp');
    // Remove all existing classes
    resendButton.className = '';
    
    // Add the original class 'cmn__btn'
    resendButton.classList.add('cmn__btn');
    
    clearError('otpError');
}

// Add this function to remove onclick and on hover styles
function deactivateInputStyles() {
    var currentInput = document.getElementById('input1');
    // Disable the input field
    currentInput.disabled = true;
}

// Add this function to reactivate the button styles
function reactivateInputStyles() {
    var currentInput = document.getElementById('input1');
    // Re-enable the input field
    currentInput.disabled = false;
    
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
