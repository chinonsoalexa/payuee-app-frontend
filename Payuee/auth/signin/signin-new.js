// Focus on the first input field when the page loads
window.onload = function () {
    document.getElementById('email_id').focus();
};

// Get the button element by its ID
const googleSignupButton = document.getElementById('googleSigninButton');

// Add a click event listener to the button
googleSignupButton.addEventListener('click', function() {
    // Redirect to the specified URL when the button is clicked
    window.location.href = 'https://payuee.onrender.com/google/sign-in';
});

// this event listener runs only when the sign up button is triggered
document.getElementById('signin_button').addEventListener('click', async function() {
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
                    showErrorUserExist('emailError', 'User do not exist, please sign up.', 5000);
                    return;
                } else if (data.error == 'Invalid email or password') {
                    // redirect user to verify email ID
                    showErrorUserExist('emailError', 'Invalid email or password.', 5000);
                    return;
                } else {
                    showError('otpError', `an error occurred. Please try again.`);
                }
                return;
            } 
            const data = await response.json();
            localStorage.setItem('auth', 'true');
            window.location.href = '../../../index-in.html';
            localStorage.removeItem('code');
            localStorage.removeItem('last_name');
            localStorage.removeItem('first_name');
            localStorage.removeItem('email');
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