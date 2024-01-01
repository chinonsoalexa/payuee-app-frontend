    // Focus on the first input field when the page loads
    window.onload = function () {
        document.getElementById('email_id').focus();
    };

    // this event listener runs only when the sign up button is triggered
    document.getElementById('signin_button').addEventListener('click', sign_in);

    function sign_in() {
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

        if (!err) {
            // send post request
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
    