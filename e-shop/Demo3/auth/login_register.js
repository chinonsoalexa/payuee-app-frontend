document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('loginButton'); // Target the login button
    const loginForm = document.forms['login-form'];

    // Handle login button click
    loginButton.addEventListener('click', function (event) {
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

        // Call the login API endpoint
        loginEshop(loginForm.login_email.value.trim(), loginForm.login_password.value.trim());
        
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

async function loginEshop(email, password) {
    const apiUrl = "https://api.payuee.com/sign-in";

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include', // set credentials to include cookies
        body: JSON.stringify({
            email: email,
            password: password,
        })
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            const errorData = await response.json();

            if (errorData.error === 'Your account has been suspended. Please contact support for more details.') {
                // need to do a data of just null event 
                showToastMessageE('Your account has been suspended. Please contact support for more details.');
                // displayErrorMessage();
            } else if (errorData.error === 'Invalid email or password') {
                // need to do a data of just null event 
                showToastMessageE('Invalid email or password');
            } else {
                // displayErrorMessage();
            }

            return;
        }

        const responseData = await response.json();
        showToastMessageS('Login successful');
            
        // Check if `redirectTo` exists in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirectTo');

        // Redirect to `redirectTo` if it exists, else go to a default page
        if (redirectTo) {
            window.location.href = redirectTo;
        } else {
            window.location.href = 'https://payuee.com/e-shop/Demo3/home'; // Replace with your default page
        }
} finally {

    }
}