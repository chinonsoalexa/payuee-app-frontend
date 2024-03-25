    var buttonClicks = 0;

    var nameError = document.getElementById("nameError");
    var lastNameError = document.getElementById("lastNameError");
    var emailError = document.getElementById("emailError");

    // sign up data
    var nameInput;
    var last_nameInput;
    var emailInput;
    var codeInput;
    var first_name;
    var last_name;
    var email;
    var code;

    // window.addEventListener('DOMContentLoaded', () => {
    //     // Get the current URL
    //     const currentUrl = new URL(window.location.href);

    //     // Extract parameters using URLSearchParams
    //     const params = new URLSearchParams(currentUrl.search);

    //     // Get individual parameter values
    //     const referralCode = params.get("referral-code");

    //     // Get the input element
    //     const inputBox = document.getElementById('referral-code');

    //     // Set the value of the input box
    //     inputBox.value = referralCode;
    // });
    
    // this event listener clears an existing error
    document.getElementById('fname').addEventListener('input', function() {
        clearError('nameError');
    });

    document.getElementById('lname').addEventListener('input', function() {
        clearError('lastNameError');
    });

    document.getElementById('email').addEventListener('input', function() {
        clearError('emailError');
    });

    // this is an event listener that adds an error again if criteria does not meet
    document.getElementById('fname').addEventListener('input', function() {
        const firstName = this.value.trim(); // Trim to remove leading and trailing whitespaces

        if (firstName === '') {
            showErrorAgain('nameError', "Please enter your first name.");
            return;
        } else if (!isValidUsername(firstName)) {
            showError('nameError', "Invalid username. It should contain letters, numbers, and underscores only.");
            return;
        } else if (firstName.length > 30) {
            showError('nameError', "Your first name should be less than 30 characters long.")
            return;
        }
    });
    
    document.getElementById('lname').addEventListener('input', function() {
        const lastName = this.value.trim(); // Trim to remove leading and trailing whitespaces

        if (lastName === '') {
            showErrorAgain('lastNameError', "Please enter your last name.");
            return;
        } else if (!isValidUsername(lastName)) {
            showError('lastNameError', "Invalid username. It should contain letters, numbers, and underscores only.");
            return;
        } else if (lastName.length > 30) {
            showError('lastNameError', "Your last name should be less than 30 characters long.")
            return;
        }
    });
    
    document.getElementById('email').addEventListener('input', function() {
        const email = this.value.trim(); // Trim to remove leading and trailing whitespaces

        if (email === "") {
            showError('emailError', "Please enter your email address.");
            return;
        } else if (!isValidEmail(email)) {
            showError('emailError', "Please enter a valid email address.");
            return;
        }
    });

    // this event listener runs only when the sign up button is triggered
    document.getElementById('signupButton').addEventListener('click', sign_up);

function sign_up() {
    buttonClicks += 1

    nameInput = document.getElementById("fname");
    last_nameInput = document.getElementById("lname");
    emailInput = document.getElementById("email");
    codeInput = document.getElementById("referrer-code");

    first_name = nameInput.value.trim();
    last_name = last_nameInput.value.trim();
    email = emailInput.value.trim();
    code = codeInput.value.trim();

    // Checking if any of the fields is empty
    if (first_name === "") {
        showError('nameError', "Please enter your first name.");
    } else if (!isValidUsername(first_name)) {
        showError('nameError', "Invalid username. It should contain letters, numbers, and underscores only.");
    } else if (last_name.length > 30) {
        showError('nameError', "Your first name should be less than 30 characters long.")
        return
    }

    if (last_name === "") {
        showError('lastNameError', "Please enter your last name.");
    } else if (!isValidUsername(last_name)) {
        showError('lastNameError', "Invalid username. It should contain letters, numbers, and underscores only.");
    } else if (last_name.length > 30) {
        showError('lastNameError', "Your last name should be less than 30 characters long.")
    }

    if (email === "") {
        showError('emailError', "Please enter your email address.");
    } else if (!isValidEmail(email)) {
        showError('emailError', "Please enter a valid email address.");
    }

    if (first_name !== "" && last_name !== "" && email !== "") {
       if (isValidUsername(first_name) && isValidUsername(last_name) && isValidEmail(email)) {

            disableSignUpDiv();
            validateSignUpPassword(first_name, last_name, email);
        }
    }
}

function showError(id, message) {
    // Show error message
    var errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.display = 'block'; // Change display to 'block'
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
    
    // Get the error message element
    const errorElement = document.getElementById(errorId);

    // Check if the error element exists before manipulating it
    if (errorElement) {
        errorElement.textContent = ''; // Clear the error message
        // errorElement.style.display = 'none'; // Hide the error message
        return;
    }
}

function isValidEmail(email) {
    // Simple email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to show the popup
function showErrorPopup(message) {
    // Create the popup element
    var popup = document.createElement('div');
    popup.className = 'popup';

    // Create the close button
    var closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;'; // HTML code for the "x" symbol
    closeBtn.onclick = function () {
        document.body.removeChild(popup);
    };

    // Create the message element
    var messageElement = document.createElement('p');
    messageElement.textContent = message;

    // Append elements to the popup
    popup.appendChild(closeBtn);
    popup.appendChild(messageElement);

    // Set display property to 'block'
    popup.style.display = 'block';

    // Append the popup to the body
    document.body.appendChild(popup);

    console.log('Popup created and appended to the body');
}

function isValidUsername(username) {
    // Regular expression to match letters, numbers, and underscores
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    // Test if the username matches the regular expression
    return usernameRegex.test(username);
}

// Function to disable the div and its content
function disableSignUpDiv() {
    document.getElementById('sign-up-form').classList.add('disabled');
    document.getElementById('sign-up-form').disabled = true;

    document.getElementById('sign-up-password').classList.remove('disabled');
    document.getElementById('sign-up-password').disabled = false;
}

// Function to enable the div and its content
function enableSignUpPasswordDiv() {
    document.getElementById('sign-up-form').classList.remove('disabled');
    document.getElementById('sign-up-form').disabled = false;

    document.getElementById('sign-up-password').classList.add('disabled');
    document.getElementById('sign-up-password').disabled = true;
}

function validateSignUpPassword(FirstName, LastName, Email) {
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
        showError('passwordError', "Your password must be at least 8 characters long and include a mix of uppercase and lowercase letters (e.g., 'Aa'), a number (e.g., '1'), and a special character (e.g., '@')");
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
    var auth_check = true
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
        auth_check = false
        showError('passwordError', "Your password must be at least 8 characters long and include a mix of uppercase and lowercase letters (e.g., 'Aa'), a number (e.g., '1'), and a special character (e.g., '@')");
        return
    }

    if (confirmPassword === '') {
        auth_check = false
        showError('confirmPasswordError', "Please confirm your password.");
        return
    }

    if (confirmPassword !== password) {
        auth_check = false
        showError('confirmPasswordError', "Passwords do not match.");
        return
    }

    if (auth_check) {
        // Get the current URL
        const currentUrl = new URL(window.location.href);

        // Extract parameters using URLSearchParams
        const params = new URLSearchParams(currentUrl.search);

        // Get individual parameter values
        var referralCode = params.get("referral-code");
        if (referralCode === null || referralCode === undefined) {
            console.log("in the referral code parameter is null or undefined");
            referralCode = code;
        } else {
            referralCode = 0;
         }

        const user = {
            FirstName: FirstName,
            LastName: LastName,
            password: confirmPassword,
            email: Email,
            RefereeCode: parseInt(referralCode),
          };

          const apiUrl = "https://payuee.onrender.com/sign-up";

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include', // set credentials to include cookies
            body: JSON.stringify(user),
          };
          console.log("body to send: ", JSON.stringify(user));
        try {
            deactivateButtonStyles()
            const response = await fetch(apiUrl, requestOptions);
            if (!response.ok) {
                // Parse the response JSON
                const errorData = await response.json();
                // Check the error message
                // Handle fetch-related errors
                if (errorData.error === 'User already exist, please login') {
                    // Perform actions specific to this error
                    showError('passwordError', 'User already exists. Please signin.');
                } else if  (errorData.error === 'User already exist, please verify your email ID') {
                    // redirect user to verify email ID
                    showErrorUserExist('passwordError', 'User already exist, please verify your email ID.');
                    // window.location.href = '/verify';
                } else if  (errorData.error === 'email verification failed') {
                    // Handle other error cases
                    showError('passwordError', 'an error occurred while sending you a verification email, please try resending.');
                }else if  (errorData.error === 'User already exist, please signin') {
                    // Handle other error cases
                    showError('passwordError', 'Please login you already have an existing account with us.');
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
            window.location.href = 'signup-confirm-otp-new.html'
        } finally{
           // do nothing cause error has been handled
        }
        reactivateButtonStyles();
    }
}

function showError(id, message) {
    var errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.display = 'block'; // Change display to 'block'
    errorElement.style.color = 'red'; // Set text color to red
}

function showErrorUserExist(id, message, duration = 6000) {
    var errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.display = 'block'; // Change display to 'block'
    errorElement.style.color = 'red'; // Set text color to red

    // Set a timeout to hide the error message after the specified duration
    setTimeout(function () {
        errorElement.textContent = ''; // Clear the error message
        errorElement.style.display = 'none'; // Hide the error message
        // redirect user to verify his email address
        window.location.href = 'signup-confirm-otp-new.html';
    }, duration);
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
}