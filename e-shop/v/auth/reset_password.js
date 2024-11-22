document.addEventListener("DOMContentLoaded", function (){
    // Call the function to check the user from the URL
    checkUserFromURL();
})

function checkUserFromURL() {
    // Get the current page URL
    const currentURL = window.location.href;

    // Create a URL object to easily access query parameters
    const urlParams = new URL(currentURL).searchParams;

    // Get the 'user' and 'token' parameters from the URL
    const user = urlParams.get('user');
    const token = urlParams.get('token');

    // Check if the 'user' parameter exists
    if (user) {
        const reset_password = document.getElementById("reset_password");
        // Add a class
        reset_password.classList.remove("d-none");

    } else {
        // Select the element you want to modify
        const send_email = document.getElementById("send_email");
        // Remove a class
        send_email.classList.remove("d-none");
    }
}


document.getElementById('send_email_button').addEventListener('click', async function (event) {
    event.preventDefault(); // Prevent form submission
    
    await sendEmailOtp(document.getElementById('customerNameEmailInput').value);
});

async function sendEmailOtp(emailOTP) {

    // send a post request with the otp
    const otp = {
        Email: emailOTP,
    };

    const apiUrl = "https://api.payuee.com/app/forgotten-password-email";

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
            if (data.error == 'Failed to get previous email OTP') {
                showError('otpError', "Email not found, please re-enter your email address.");
            } else {
                showError('otpError', 'An error occurred. Please try again.');
            }
            return;
        } 
        const data = await response.json();
    } finally {
        // do nothing cause error has been handled
    }
}