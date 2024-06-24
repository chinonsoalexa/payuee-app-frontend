// this is an event listener that adds an error again if criteria does not meet
document.getElementById('submitPassword').addEventListener('click', async function(event) {
    event.preventDefault();

    var presentPassword = document.getElementById('present').value.trim();
    var newPassword = document.getElementById('new').value.trim();
    var confirmPassword = document.getElementById('confirm').value.trim();

    if (presentPassword === '') {
        showError("Please enter your present password!");
        return
    }

    // Define password criteria
    var hasNewUpperCase = /[A-Z]/.test(newPassword);
    var hasNewLowerCase = /[a-z]/.test(newPassword);
    var hasNewNumber = /\d/.test(newPassword);

    if (newPassword === '') {
        showError("Please enter a new password!");
        return
    }

    // Check if password meets the criteria
    if (!hasNewUpperCase || !hasNewLowerCase || !hasNewNumber || newPassword.length < 8) {
        showError("Your password must be at least 8 characters long and include a mix of uppercase and lowercase letters (e.g., 'Aa'), a number (e.g., '1'), and a special character (e.g., '@')");
        return
    }

    if (confirmPassword === '') {
        showError("Please confirm your password.");
        return
    }

    if (confirmPassword !== newPassword) {
        showError("Passwords do not match.");
        return
    }

    if (presentPassword === newPassword) {
        showError("New password cannot be the same as the old one.");
        return
    }

    // Define password criteria
    var hasUpperCase = /[A-Z]/.test(presentPassword);
    var hasLowerCase = /[a-z]/.test(presentPassword);
    var hasNumber = /\d/.test(presentPassword);

    // Check if password meets the criteria
    if (!hasUpperCase || !hasLowerCase || !hasNumber || presentPassword.length < 8) {
        showError("Incorrect Present Password");
        return
    }

    // since all condition check is false let's send a post request to change the user's password
        const details = {
            OldPassword: presentPassword,
            NewPassword: newPassword,
          };

          const apiUrl = "https://api.payuee.com/web/profile/update/password";

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
                if (errorData.error === 'failed to get user') {
                    // Perform actions specific to this error
                    showError('an error occurred');
                } else if  (errorData.error === 'failed to get user from request') {
                    // Handle other error cases
                    showError('an error occurred while updating your password');
                } else if  (errorData.error === 'password does not match') {
                    // redirect user to verify email ID
                    showError('password does not match');
                    // window.location.href = '/verify';
                } else if  (errorData.error === 'Invalid password') {
                    // redirect user to verify email ID
                    showError('Incorrect Present Password');
                    // window.location.href = '/verify';
                } else if  (errorData.error === "error updating user's password") {
                    // Handle other error cases
                    showError('an error occurred while updating your password');
                }  else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!") {
                    // let's log user out the users session has expired
                    logUserOutIfTokenIsExpired();
                } else {
                    showError('an error occurred. please try again.');
                }
                  reactivateButtonStyles2();
                return;
            }
            const data = await response.json();
            const presentPasswordInput = document.getElementById('present');
            const newPasswordInput = document.getElementById('new');
            const confirmPasswordInput = document.getElementById('confirm');
            presentPasswordInput.value = "";
            newPasswordInput.value = "";
            confirmPasswordInput.value = "";
            showSuccess(data.success);
        } finally{
           // do nothing cause error has been handled
        reactivateButtonStyles2();
    }
});

function showError(message) {
    const installPopup = document.getElementById('password-popup');
    const cancelButton = document.getElementById('cancel-btn');
    const passwordError = document.getElementById('passwordError');

    passwordError.textContent = message;

      installPopup.style.display = 'block';

    // Cancel button click event
    cancelButton.addEventListener('click', () => {
      installPopup.style.display = 'none';
    });
}

function showSuccess(message) {
    const installPopup = document.getElementById('password-popup2');
    const cancelButton = document.getElementById('close-btn');
    const passwordError = document.getElementById('passwordSuccess');

    passwordError.textContent = message;

      installPopup.style.display = 'block';

    // Cancel button click event
    cancelButton.addEventListener('click', () => {
      installPopup.style.display = 'none';
    });
}

// Add this function to remove onclick and on hover styles
function deactivateButtonStyles2() {
    var resendButton = document.getElementById('submitPassword');
    // resendButton.className = '';
    resendButton.classList.add('deactivated'); // Add a class to the button
}

// Add this function to reactivate the button styles
function reactivateButtonStyles2() {
    var resendButton = document.getElementById('submitPassword');
    // // Remove all existing classes
    // resendButton.className = '';
    resendButton.classList.remove('deactivated');
}

function logUserOutIfTokenIsExpired() {
    // also send a request to the logout api endpoint
    const apiUrl = "https://api.payuee.com/log-out";

    const requestOptions = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    credentials: 'include', // set credentials to include cookies
    };
    
try {
    const response = fetch(apiUrl, requestOptions);

        // const data = response.json();
        localStorage.removeItem('auth')
        window.location.href = '../index.html'
    } finally{
        // do nothing
    }
}
