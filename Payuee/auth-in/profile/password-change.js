// this is an event listener that adds an error again if criteria does not meet
document.getElementById('present').addEventListener('input', function() {
    const password = this.value.trim(); // Trim to remove leading and trailing white spaces
    var confirmPassword = document.getElementById('present').value;

        // Define password criteria
    var hasUpperCase = /[A-Z]/.test(password);
    var hasLowerCase = /[a-z]/.test(password);
    var hasNumber = /\d/.test(password);
    var hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Check if password meets the criteria
    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSymbol || password.length < 8) {
        showError('presentPassword', "Your password must be at least 8 characters long and include a mix of uppercase and lowercase letters (e.g., 'Aa'), a number (e.g., '1'), and a special character (e.g., '@')");
        return
    }

    if (confirmPassword === '') {
        showError('newPassword', "Please confirm your password.");
        return
    }

    if (confirmPassword !== password) {
        showError('confirmPassword', "Passwords do not match.");
        return
    }
});

document.getElementById('toggle-password2').addEventListener('input', function() {
    clearError('presentPassword');
});

function showError(id, message) {
    var errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.display = 'block'; // Change display to 'block'
    errorElement.style.color = 'red'; // Set text color to red
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