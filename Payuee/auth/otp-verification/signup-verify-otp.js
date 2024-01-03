// Get references to loading icon
const loadingIcon = document.getElementById('loading-icon');

document.addEventListener('DOMContentLoaded', async function () {
        // Get the current URL
        const currentUrl = new URL(window.location.href);

        // Extract parameters using URLSearchParams
        const params = new URLSearchParams(currentUrl.search);

        // Get individual parameter values
        const userID = params.get("user");
        const token = params.get("token");

        // localStorage.getItem('code');
        const user = {
            Email: userID,
            SentOTP: token,
          };

          const apiUrl = "https://payuee.onrender.comemail-verification";

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include', // set credentials to include cookies
            body: JSON.stringify(user),
          };
          
        try {
            showLoadingIcon()
            const response = await fetch(apiUrl, requestOptions);
            if (!response.ok) {
                // Parse the response JSON
                const errorData = await response.json();
                // Check the error message
                // Handle fetch-related errors
                console.log(errorData);
                console.log('error message: ', errorData.error);
                if (errorData.error === 'User already exist, please login') {
                    // Perform actions specific to this error
                    showError('passwordError', 'User already exists. Please login.');
                } else if  (errorData.error === 'Please login using your google account') {
                    // Handle other error cases
                    showError('passwordError', 'Please login using your google account.');
                } else if  (errorData.error === 'User already exist, please verify your email ID') {
                    // redirect user to verify email ID
                    showErrorUserExist('passwordError', 'User already exist, please verify your email ID.');
                    // window.location.href = '/verify';
                } else if  (errorData.error === 'email verification failed') {
                    // Handle other error cases
                    showError('passwordError', 'an error occurred while sending you an verification email, please try resending.');
                }else if  (errorData.error === 'User already exist, please login') {
                    // Handle other error cases
                    showError('passwordError', 'Please login you already have an existing account with us.');
                }else if  (errorData.error === 'This email is invalid because it uses illegal characters. Please enter a valid email') {
                    // Handle other error cases
                    showError('passwordError', 'This is an invalid email address, please enter a valid email address.');
                } else {
                    showError('passwordError', 'An error occurred. Please try again.');
                }
                hideLoadingIcon();
                return;
            }
            // const data = await response.json();
            hideLoadingIcon();
            window.location.href = '../../../Payuee/page/signup-confirm-otp-new.html'
        } finally{
           // do nothing cause error has been handled
            hideLoadingIcon();
        }
        // Hide loading icon after request completes
        hideLoadingIcon();
});

// Function to show loading icon
function showLoadingIcon() {
    loadingIcon.style.display = 'inline';
}

// Function to hide loading icon
function hideLoadingIcon() {
    loadingIcon.style.display = 'none';
}