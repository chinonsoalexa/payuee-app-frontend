    var buttonClicks = 0
    
    // this event listener runs only when the sign up button is triggered
    document.getElementById('submitPassword').addEventListener('click', async function() {
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

    if (confirmPassword !== "" && password !== "") {
        // If the fields are not empty, get from localStorage
        const fname = localStorage.getItem('first_name');
        const lname = localStorage.getItem('last_name');
        const email = localStorage.getItem('email');
        // localStorage.getItem('code');
        const user = {
            FirstName: fname,
            LastName: lname,
            password: confirmPassword,
            email: email,
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
          
        try {
            deactivateButtonStyles()
            const response = await fetch(apiUrl, requestOptions);
            
            if (!response.ok) {
                // Parse the response JSON
                const errorData = await response.json();
                // Check the error message
                if (errorData.error === 'User already exist, please login') {
                    // Perform actions specific to this error
                    showError('passwordError', 'User already exists. Please login.');
                } else if  (errorData.error === 'Please login using your google account') {
                    // Handle other error cases
                    showError('passwordError', 'Please login using your google account.');
                } else if  (errorData === 'User already exist, please verify your email ID') {
                    // redirect user to verify email ID
                    // window.location.href = '/verify';
                } else if  (errorData.error === 'email verification failed') {
                    // Handle other error cases
                    showError('passwordError', 'an error occurred while sending you an otp, please try resending an otp.');
                }
                return;
            }
            // const data = await response.json();
            reactivateButtonStyles();
            window.location.href = '../../../Payuee/page/signup-confirm-otp-new.html'
        } catch (error) {
            // Handle fetch-related errors
            console.log(errorData);
            console.log('error message: ', errorData.error);
            showError('passwordError', 'An error occurred. Please try again.');
        }
        reactivateButtonStyles();
    }
}

function showError(id, message) {
    var errorElement = document.getElementById(id);
    errorElement.textContent = message;
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