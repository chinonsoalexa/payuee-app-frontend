    var buttonClicks = 0

    var nameError = document.getElementById("nameError");
    var lastNameError = document.getElementById("lastNameError");
    var emailError = document.getElementById("emailError");

     // Get the button element by its ID
    const googleSignupButton = document.getElementById('googleSignupButton');

    // Add a click event listener to the button
    googleSignupButton.addEventListener('click', function() {
        // Redirect to the specified URL when the button is clicked
        window.location.href = 'https://payuee-2769f5611775.herokuapp.com/google/sign-in';
    });

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

    let nameInput = document.getElementById("fname");
    let last_nameInput = document.getElementById("lname");
    let emailInput = document.getElementById("email");
    let codeInput = document.getElementById("code");

    let name = nameInput.value.trim();
    let last_name = last_nameInput.value.trim();
    let email = emailInput.value.trim();
    let code = codeInput.value.trim();

    // Checking if any of the fields is empty
    if (name === "") {
        showError('nameError', "Please enter your first name.");
    } else if (!isValidUsername(name)) {
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

    if (name !== "" && last_name !== "" && email !== "") {
       if (isValidUsername(name) && isValidUsername(last_name) && isValidEmail(email)) {
            // If the fields are not empty, save to localStorage
            localStorage.setItem('first_name', name);
            localStorage.setItem('last_name', last_name);
            localStorage.setItem('email', email);
            localStorage.setItem('code', code);
            window.location.replace('signup-password-new.html');
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