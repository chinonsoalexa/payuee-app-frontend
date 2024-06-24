var buttonClicks = 0
    
// this event listener runs only when the sign up button is triggered
document.getElementById('submitPassword').addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent the form from submitting
    await submit_password() ;
}) ;

// this event listener clears an existing error
document.getElementById('password-field').addEventListener('input', function() {
    clearError('passwordError');
    clearError('confirmPasswordError');
});

document.getElementById('toggle-password2').addEventListener('input', function() {
    clearError('confirmPasswordError');
});

// this is an event listener that adds an error again if criteria does not meet
document.getElementById('password-field').addEventListener('input', function() {
    const password = this.value.trim(); // Trim to remove leading and trailing white spaces
    var confirmPassword = document.getElementById('toggle-password2').value;

       // Define password criteria
    var hasUpperCase = /[A-Z]/.test(password);
    var hasLowerCase = /[a-z]/.test(password);
    var hasNumber = /\d/.test(password);
    var hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Check if password meets the criteria
    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSymbol || password.length < 8) {
        showError('passwordError', "Password must have at least 8 characters, including uppercase, lowercase, number, and symbol.");
        return
    }

    if (confirmPassword === '') {
        showError('confirmPasswordError', "Please confirm your password.");
        return
    }

    if (confirmPassword !== password) {
        showError('confirmPasswordError', "Passwords do not match.");
        return
    }
});

document.getElementById('toggle-password2').addEventListener('input', function() {
    const confirmPassword = this.value.trim(); // Trim to remove leading and trailing white spaces
    var password = document.getElementById('password-field').value;

    if (confirmPassword === '') {
        showError('confirmPasswordError', "Please confirm your password.");
        return
    }

    if (confirmPassword !== password) {
        showError('confirmPasswordError', "Passwords do not match.");
        return
    }
});

async function submit_password() {
var auth_check = false
buttonClicks += 1
var password = document.getElementById('password-field').value;
var confirmPassword = document.getElementById('toggle-password2').value;

// Define password criteria
var hasUpperCase = /[A-Z]/.test(password);
var hasLowerCase = /[a-z]/.test(password);
var hasNumber = /\d/.test(password);
var hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

// Check if password meets the criteria
if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSymbol || password.length < 8) {
    auth_check = true
    showError('passwordError', "Password must have at least 8 characters, including uppercase, lowercase, number, and symbol.");
    return
}

if (confirmPassword === '') {
    auth_check = true
    showError('confirmPasswordError', "Please confirm your password.");
    return
}

if (confirmPassword !== password) {
    auth_check = true
    showError('confirmPasswordError', "Passwords do not match.");
    return
}

if (!auth_check) {
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
        Password: confirmPassword,
      };

      const apiUrl = "https://api.payuee.com/forgotten-password-verification";

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // set credentials to include cookies
        body: JSON.stringify(user),
      };
      
    try {
        deactivateButtonStyles()
        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) {
            // Parse the response JSON
            const errorData = await response.json();
            // Check the error message
            // Handle fetch-related errors
            console.log(errorData);
            console.log('error message: ', errorData.error);
            if (errorData.error === 'Wrong OTP') {
                // Perform actions specific to this error
                showError('passwordError', 'invalid password reset link.');
            } else if  (errorData.error === 'max try exceeded resend a new otp') {
                // Handle other error cases
                showError('passwordError', "This password reset link has exceeded it's max limit, please request for another reset link.");
            } else if  (errorData.error === 'OTP  Expired') {
                // redirect user to verify email ID
                showErrorUserExist('passwordError', 'This password reset link has expired please, try sending a new password reset link.');
            } else if  (errorData.error === 'email verification failed') {
                // Handle other error cases
                showError('passwordError', 'an error occurred while sending you an verification email, please try resending.');
            }else if  (errorData.error === 'Please login using your google account') {
                // Handle other error cases
                showError('passwordError', 'Please login using your google account.');
            }else if  (errorData.error === 'This email is invalid because it uses illegal characters. Please enter a valid email') {
                // Handle other error cases
                showError('passwordError', 'This is an invalid email address, please enter a valid email address.');
            } else {
                showError('passwordError', 'An error occurred. Please try again.');
            }
              reactivateButtonStyles();
            return;
        }
        // const data = await response.json();
        reactivateButtonStyles();
        window.location.href = 'signin-new.html'
    } finally{
       // do nothing cause error has been handled
    }
    reactivateButtonStyles();
}
}

function showError(id, message) {
    var errorElement = document.getElementById(id);
    errorElement.textContent = message;
    // Add styles to the error element
    errorElement.style.color = 'red';  // Set text color to red
}

function showErrorUserExist(id, message, duration = 5000) {
var errorElement = document.getElementById(id);
errorElement.textContent = message;
errorElement.style.display = 'block'; // Change display to 'block'
errorElement.style.color = 'red'; // Set text color to red

// Set a timeout to hide the error message after the specified duration
setTimeout(function () {
    errorElement.textContent = ''; // Clear the error message
    errorElement.style.display = 'none'; // Hide the error message
    // redirect user to verify his email address
    window.location.href = 'verify-email.html';
}, duration);
}

function showErrorAgain(id, message) {
// Show error message
if (buttonClicks > 0) {
var errorElement = document.getElementById(id);
errorElement.textContent = message;
errorElement.style.display = 'block'; // Change display to 'block'
}
}

function clearError(id) {
// Construct the error message element ID
const errorId = id;

var errorElement = document.getElementById(errorId);

if (errorElement) {
    errorElement.textContent = ''; // Clear the error message
    // errorElement.style.display = 'none'; // Hide the error message
}
}

// Add this function to remove onclick and on hover styles
function deactivateButtonStyles() {
var resendButton = document.getElementById('submitPassword');
resendButton.classList.add('deactivated'); // Add a class to the button
}

// Add this function to reactivate the button styles
function reactivateButtonStyles() {
var resendButton = document.getElementById('submitPassword');
// Remove all existing classes
resendButton.className = '';
// Add the original class 'cmn__btn'
resendButton.classList.add('cmn__btn');
}