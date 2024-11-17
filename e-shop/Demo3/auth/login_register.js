document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('loginButton'); // Target the login button
    const loginForm = document.forms['login-form'];

    // Handle login button click
    loginButton.addEventListener('click', function () {
        event.preventDefault();
        // Get the data from the login form
        const loginData = {
            email: loginForm.login_email.value.trim(),
            password: loginForm.login_password.value.trim(),
        };

        // Check if email or password fields are empty
        if (!loginData.email || !loginData.password) {
            showToastMessageE('Please fill in both email and password fields.');
            return;
        }

        console.log('Login Data:', loginData);
        
        // If needed, send loginData to the server or handle it as needed here

        // Show success message if everything is correct (optional)
        showToastMessageS('Logging in...');
    });
});

// Show success toast
function showToastMessageS(message) {
    document.getElementById('toastMessage2').textContent = message;
    const toastElement = document.getElementById('liveToast3');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

// Show error toast
function showToastMessageE(message) {
    document.getElementById('toastError').textContent = message;
    const toastElement = document.getElementById('liveToast1');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}
