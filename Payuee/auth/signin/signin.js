    // Focus on the first input field when the page loads
    window.onload = function () {
        document.getElementById('email_id').focus();
    };

    // this event listener runs only when the sign up button is triggered
    document.getElementById('signin_button').addEventListener('click', sign_in);

   async function sign_in() {
        var err = false
        let email = document.getElementById("email_id").value;
        let password = document.getElementById("password").value;

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
            // send post request
            deactivateInputStyles();
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
                    // throw new Error(`HTTP error! Status: ${response.status}`);
                    data = await response.json();
                    if (data.error == 'User already exist, please login') {
                        showError('otpError', "Please login user already exist.");
                        return;
                    } else {
                        showError('otpError', `an error occurred. Please try again.`);
                    }
                    return;
                } 
                const data = await response.json();
                reactivateInputStyles();
                localStorage.setItem('auth', 'true');
                window.location.href = '../../../index-in.html';
                localStorage.removeItem('code');
                localStorage.removeItem('last_name');
                localStorage.removeItem('first_name');
                localStorage.removeItem('email');
            } finally{
                
            }
            reactivateInputStyles();
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
    