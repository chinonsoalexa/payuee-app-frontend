let resendTimer;
let lastResendTime = 0;
let checkIfStillCounting = false;
var validated = true;

// Focus on the first input field when the page loads
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('email_id').focus();
    // Retrieve the last reset time and continue if available
    continueResendTimer()
});

var enabled = false;

// Get the button element by its ID
const signInWithEmail = document.getElementById('signInWithEmail');
const signInWithEmailBox = document.getElementById('email_id_magic');
const backToLogin = document.getElementById('backToLogin');

// Add a click event listener to the button
signInWithEmail.addEventListener('click', async function() {
    // Redirect to the specified URL when the button is clicked
    enableSignUpFieldDiv()
    if (!enabled) {
        enabled = true;
        return
    }
    if (enabled) {
        validated = true;
        if (signInWithEmailBox.value === "") {
            validated = false;
            showError('emailErrorMagic', "Please enter your email address.");
            return;
        } else if (!isValidEmail(signInWithEmailBox.value)) {
            validated = false;
            showError('emailErrorMagic', "Please enter a valid email address.");
            return;
        }
        if (validated) {
        enableFullSignUpFieldDiv()
        // let's show the sent email box
        const details = {
            Email: signInWithEmailBox.value,
          };

          const apiUrl = "https://payuee.onrender.com/magic-link";

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include', // set credentials to include cookies
            body: JSON.stringify(details),
          };
          
        try {
            deactivateButtonStyles2()
            const response = await fetch(apiUrl, requestOptions);
            if (!response.ok) {
                // Parse the response JSON
                const errorData = await response.json();
                // Check the error message
                // Handle fetch-related errors
                if (errorData.error === 'error retrieving user') {
                    // Perform actions specific to this error
                    showError('magicLinkError', 'User does not exist');
                } else if  (errorData.error === 'This email is invalid because it uses illegal characters. Please enter a valid email') {
                    // Handle other error cases
                    showError('magicLinkError', 'This email is invalid because it uses illegal characters. Please enter a valid email.');
                } else if  (errorData.error === 'User already exist, please verify your email ID') {
                    // redirect user to verify email ID
                    showErrorUserExist('magicLinkError', 'User already exist, please verify your email ID.');
                    // window.location.href = '/verify';
                } else {
                    showError('magicLinkError', 'An error occurred. Please try again.');
                }
                  reactivateButtonStyles2();
                return;
            }
            // const data = await response.json();
            reactivateButtonStyles2();
        } finally{
           // do nothing cause error has been handled
        reactivateButtonStyles2();
    }
    }
    }
});

// Add a click event listener to the back button
backToLogin.addEventListener('click', function() {
    enabled = false;
    // Redirect to the specified URL when the button is clicked
    disableSignUpFieldDiv()
});

document.getElementById('email_id_magic').addEventListener('input', function() {
    if (!validated) {
    const email = this.value.trim(); // Trim to remove leading and trailing white spaces

    if (email === "") {
        showError('emailErrorMagic', "Please enter your email address.");
        return;
    } else if (!isValidEmail(email)) {
        showError('emailErrorMagic', "Please enter a valid email address.");
        return;
    }
}
});

function isValidEmail(email) {
    // Simple email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to disable the div and its content
function disableSignUpFieldDiv() {
    document.getElementById('emailID').classList.remove('disabled');
    document.getElementById('emailID').disabled = false;
    document.getElementById('loginPassword').classList.remove('disabled');
    document.getElementById('loginPassword').disabled = false;
    document.getElementById('signin_button').classList.remove('disabled');
    document.getElementById('signin_button').disabled = false;
    document.getElementById('signin_option').classList.remove('disabled');
    document.getElementById('signin_option').disabled = false;

    document.getElementById('emailLogin').classList.add('disabled');
    document.getElementById('emailLogin').disabled = true;
    document.getElementById('backToLogin').classList.add('disabled');
    document.getElementById('backToLogin').disabled = true;
}

// Function to disable the div and its content
function disableFullSignUpFieldDiv() {
    document.getElementById('signupDiv').classList.remove('disabled');
    document.getElementById('signupDiv').disabled = false;

    document.getElementById('magicLinkDiv').classList.add('disabled');
    document.getElementById('magicLinkDiv').disabled = true;
}

// Function to enable the div and its content
function enableSignUpFieldDiv() {
    document.getElementById('emailLogin').classList.remove('disabled');
    document.getElementById('emailLogin').disabled = false;
    document.getElementById('backToLogin').classList.remove('disabled');
    document.getElementById('backToLogin').disabled = false;

    document.getElementById('emailID').classList.add('disabled');
    document.getElementById('emailID').disabled = true;
    document.getElementById('loginPassword').classList.add('disabled');
    document.getElementById('loginPassword').disabled = true;
    document.getElementById('signin_button').classList.add('disabled');
    document.getElementById('signin_button').disabled = true;
    document.getElementById('signin_option').classList.add('disabled');
    document.getElementById('signin_option').disabled = true;
}

// Function to enable the div and its content
function enableFullSignUpFieldDiv() {
    document.getElementById('magicLinkDiv').classList.remove('disabled');
    document.getElementById('magicLinkDiv').disabled = false;

    document.getElementById('signupDiv').classList.add('disabled');
    document.getElementById('signupDiv').disabled = true;
}

// this event listener runs only when the sign up button is triggered
document.getElementById('signin_button').addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent the form from submitting
    await sign_in() ;
}) ;

async function sign_in() {
    var err = false
    let email = document.getElementById("email_id").value;
    let password = document.getElementById("password-field").value;

    if (email === '') {
        err = true
        showError('emailError', 'Please enter your email address', 5000)
    }

    if (!isValidEmail(email)) {
        err = true
        showError('emailError', 'Please enter a valid email address', 5000)
    }

    if (password === '') {
        err = true
        showError('passwordError', 'Please enter your password', 5000)
    }

    // Define password criteria
    var hasUpperCase = /[A-Z]/.test(password);
    var hasLowerCase = /[a-z]/.test(password);
    var hasNumber = /\d/.test(password);
    var hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Check if password meets the criteria
    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSymbol || password.length < 8) {
        err = true
        showError('passwordError', "Invalid password.", 5000);
        return
}


    if (!err) {
        // send a post request with the email and password
        const otp = {
            Email: email,
            Password: password,
            };

            const apiUrl = "https://payuee.onrender.com/sign-in";

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
                if (data.error == 'Please login using your google account') {
                    showError('otpError', "Please login using your google account.");
                    return;
                } else if (data.error == 'User already exist, please verify your email ID') {
                    // redirect user to verify email ID
                    showErrorUserExist('emailError', 'User already exist, please verify your email ID.', 5000);
                    return;
                } else if (data.error == 'User do not exist, please sign up') {
                    // redirect user to verify email ID
                    showErrorUserDontExist('emailError', 'User do not exist, please sign up.', 5000);
                    return;
                } else if (data.error == 'Invalid email or password') {
                    // redirect user to verify email ID
                    showError('emailError', 'Invalid email or password.', 5000);
                    return;
                } else {
                    showError('otpError', `an error occurred. Please try again.`);
                }
                return;
            } 
            localStorage.setItem('auth', 'true');
            window.location.replace('../index-in.html');
        } finally{
            
        }
    }

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

function showErrorUserDontExist(id, message, duration = 5000) {
    var errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.display = 'block'; // Change display to 'block'
    errorElement.style.color = 'red'; // Set text color to red

    // Set a timeout to hide the error message after the specified duration
    setTimeout(function () {
        errorElement.textContent = ''; // Clear the error message
        errorElement.style.display = 'none'; // Hide the error message
        // redirect user to verify his email address
        window.location.href = 'signup-new.html';
    }, duration);
}

// event listener to resend otp
document.getElementById('editMagicEmail').addEventListener('click', async function () {
    let magicLinkHeader = document.getElementById('magicLinkHeader');
    magicLinkHeader.textContent = 'Please wait a minute verifying your login link';
    magicLinkHeader.style.color = 'black'; // Set text color to red

    document.getElementById('loading-icon').classList.add('disabled');
    document.getElementById('loading-icon').disabled = true;
    document.getElementById('magicLinkText').classList.remove('disabled');
    document.getElementById('magicLinkText').disabled = false;
    disableFullSignUpFieldDiv();
    enableSignUpFieldDiv();
});

// event listener to resend otp
document.getElementById('resend-otp').addEventListener('click', async function () {
    await resendButtonOTP();
});

async function resendButtonOTP() {
    startResendTimer()
    let magicLinkHeader = document.getElementById('magicLinkHeader');
    magicLinkHeader.textContent = 'Please wait a minute verifying your login link';
    magicLinkHeader.style.color = 'black'; // Set text color to red

    const details = {
        Email: signInWithEmailBox.value,
      };

      const apiUrl = "https://payuee.onrender.com/magic-link";

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // set credentials to include cookies
        body: JSON.stringify(details),
      };
      
    try {
        deactivateButtonStyles2()
        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) {
            // Parse the response JSON
            const errorData = await response.json();
            // Check the error message
            // Handle fetch-related errors
            if (errorData.error === 'error retrieving user') {
                // Perform actions specific to this error
                showError('magicLinkError', 'User does not exist');
            } else if  (errorData.error === 'This email is invalid because it uses illegal characters. Please enter a valid email') {
                // Handle other error cases
                showError('magicLinkError', 'This email is invalid because it uses illegal characters. Please enter a valid email.');
            } else if  (errorData.error === 'User already exist, please verify your email ID') {
                // redirect user to verify email ID
                showErrorUserExist('magicLinkError', 'User already exist, please verify your email ID.');
                // window.location.href = '/verify';
            } else {
                showError('magicLinkError', 'An error occurred. Please try again.');
            }
              reactivateButtonStyles2();
            return;
        }
        // const data = await response.json();
        reactivateButtonStyles2();
    } finally{
       // do nothing cause error has been handled
    reactivateButtonStyles2();
}
}

function startResendTimer() {
    if (checkIfStillCounting) {
        showError('otpError', "Please wait at least 1 minute before resending.");
        return;
    }

    const resendButton = document.getElementById('resend-otp');
    resendButton.disabled = true; // Disable the button

    let seconds = 60; // Set the countdown time to 1 minute (60 seconds)
    let timerActive = true;

    resendTimer = setInterval(function () {
        seconds--;

        if (timerActive) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            resendButton.innerHTML = `Resend Email (${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds})`;
            localStorage.setItem('lastResendTime', Date.now().toString());
            checkIfStillCounting = true;
        }

        if (seconds <= 0) {
            clearInterval(resendTimer);
            resendButton.innerHTML = 'Resend Email';
            resendButton.disabled = false; // Enable the button
            localStorage.removeItem('lastResendTime');
            reactivateButtonStyles(); // Reactivate button styles
            timerActive = false;
        }

        if (timerActive) {
            deactivateButtonStyles();
        }
    }, 1000);
}

async function continueResendTimer() {
    const storedLastResendTimeString = localStorage.getItem('lastResendTime');
    // Get the current URL
    const currentUrl = new URL(window.location.href);

    // Extract parameters using URLSearchParams
    const params = new URLSearchParams(currentUrl.search);

    // Get individual parameter values
    const magicCode = params.get("magic-code");
    const user = params.get("user");

    if (magicCode !== null) {
        enableFullSignUpFieldDiv()
        let magicLinkHeader = document.getElementById('magicLinkHeader');
        magicLinkHeader.textContent = 'Please wait a minute verifying your login link';
        document.getElementById('magicLinkText').classList.add('disabled');
        document.getElementById('magicLinkText').disabled = true;

        // Append the magic login email template into the loading icon div
        document.getElementById('loading-icon').classList.remove('disabled');
        document.getElementById('loading-icon').disabled = false;
        const details = {
            Email: user,
            SentOTP: magicCode,
          };

          const apiUrl = "https://payuee.onrender.com/verify/magic-link";

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include', // set credentials to include cookies
            body: JSON.stringify(details),
          };
          
        try {
            deactivateButtonStyles()
            const response = await fetch(apiUrl, requestOptions);
            if (!response.ok) {
                // Parse the response JSON
                const errorData = await response.json();
                // Check the error message
                // Handle fetch-related errors
                if (errorData.error === 'Failed to read body') {
                    // Perform actions specific to this error
                    showError('magicLinkError', 'An error occurred. Please try again.');
                } else if  (errorData.error === 'This email is invalid because it uses illegal characters. Please enter a valid email') {
                    // Handle other error cases
                    showError('magicLinkError', 'This email is invalid because it uses illegal characters. Please enter a valid email.');
                } else if  (errorData.error === 'email limit check exceeded') {
                    // redirect user to verify email ID
                    showErrorUserExist('magicLinkError', 'Email limit check exceeded.');
                    // window.location.href = '/verify';
                } else if  (errorData.error === 'OTP not found') {
                    // Handle other error cases
                    magicLinkHeader.textContent = 'Magic link not recognized...';
                    magicLinkHeader.style.color = 'red'; // Set text color to red
                    document.getElementById('loading-icon').classList.add('disabled');
                    document.getElementById('loading-icon').disabled = true;
                    showError('magicLinkError', 'Magic link not recognized...');
                }else if  (errorData.error === 'Wrong OTP') {
                    // Handle other error cases
                    magicLinkHeader.textContent = 'Incorrect magic link...';
                    magicLinkHeader.style.color = 'red'; // Set text color to red
                    document.getElementById('loading-icon').classList.add('disabled');
                    document.getElementById('loading-icon').disabled = true;
                    showError('magicLinkError', 'Incorrect magic link...');
                }else if  (errorData.error === 'Magic Link Expired') {
                    // Handle other error cases
                    magicLinkHeader.textContent = 'Magic link expired...';
                    magicLinkHeader.style.color = 'red'; // Set text color to red
                    document.getElementById('loading-icon').classList.add('disabled');
                    document.getElementById('loading-icon').disabled = true;
                    showError('magicLinkError', 'Magic link expired...');
                } else {
                    magicLinkHeader.textContent = 'An error occurred. Please try again.';
                    magicLinkHeader.style.color = 'red'; // Set text color to red
                    document.getElementById('loading-icon').classList.add('disabled');
                    document.getElementById('loading-icon').disabled = true;
                    showError('magicLinkError', 'An error occurred. Please try again.');
                }
                  reactivateButtonStyles();
                return;
            }
            // const data = await response.json();
            reactivateButtonStyles();
            localStorage.setItem('auth', 'true');
            window.location.href = '../../index-in.html';
        } finally{
           // do nothing cause error has been handled
        }
        reactivateButtonStyles();
    }

    if (storedLastResendTimeString) {
        enableFullSignUpFieldDiv()
        checkIfStillCounting = true; // Set the flag to prevent immediate resending
        const storedLastResendTime = parseInt(storedLastResendTimeString);
        const now = Date.now();
        const timeDifference = now - storedLastResendTime;
        const minimumInterval = 60 * 1000; // 1 minute in milliseconds

        const resendButton = document.getElementById('resend-otp');
        resendButton.disabled = true; // Disable the button

        let seconds = Math.max(0, Math.floor((minimumInterval - timeDifference) / 1000));
        let timerActive = true;

        resendTimer = setInterval(function () {
            seconds--;

            if (timerActive) {
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                resendButton.innerHTML = `Resend Email (${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds})`;
            }

            if (seconds <= 0) {
                clearInterval(resendTimer);
                resendButton.innerHTML = 'Resend Email';
                resendButton.disabled = false; // Enable the button
                localStorage.removeItem('lastResendTime');
                reactivateButtonStyles(); // Reactivate button styles
                timerActive = false;
            }

            if (timerActive) {
                deactivateButtonStyles();
            }
        }, 1000);
    }
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
    // resendButton.className = '';
    resendButton.classList.add('deactivated'); // Add a class to the button
}

// Add this function to reactivate the button styles
function reactivateButtonStyles() {
    var resendButton = document.getElementById('resend-otp');
    // // Remove all existing classes
    // resendButton.className = '';
    resendButton.classList.remove('deactivated');
    
    clearError('otpError');
}

// Add this function to remove onclick and on hover styles
function deactivateButtonStyles2() {
    var resendButton = document.getElementById('signInWithEmail');
    // resendButton.className = '';
    resendButton.classList.add('deactivated'); // Add a class to the button
}

// Add this function to reactivate the button styles
function reactivateButtonStyles2() {
    var resendButton = document.getElementById('signInWithEmail');
    // // Remove all existing classes
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