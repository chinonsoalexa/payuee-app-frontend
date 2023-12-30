    var buttonClicks = 0
    
    // this event listener runs only when the sign up button is triggered
    document.getElementById('submitPassword').addEventListener('click', function() {
        submit_password() ;
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
        localStorage.getItem('first_name');
        localStorage.getItem('last_name');
        localStorage.getItem('email');
        localStorage.getItem('code');
        try {
            const response = await fetch("https://payuee.onrender.com");
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    window.location.href = 'signup-confirm-otp.html'
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
