document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('rocket_subscription_form').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent form submission

        var emailInput = document.getElementById('email_rocket_subscription');
        var emailValue = emailInput.value;

        // Validate email format using regex
        var emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(emailValue)) {
            showPopupError("Please enter a valid email address.");
            return;
        }

        const user = {
            Email: emailValue,
        };

        const apiUrl = "https://api.payuee.com/web/email-subscriber";

        const requestEmailSub = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include', // set credentials to include cookies
            body: JSON.stringify(user),
        };

        try {
            const response = await fetch(apiUrl, requestEmailSub);

            if (!response.ok) {
                const errorData = await response.json();

                if (errorData.error === 'Failed to read body' || errorData.error === 'error adding new email subscriber') {
                    showPopupError("An error occurred while trying to add email");
                } else if (errorData.error === 'user with email already exists') {
                    showPopupError("User with email already exists");
                } else {
                    showPopupError("An error occurred while trying to add email");
                }

                return;
            }

            const responseData = await response.json();
            showPopup(responseData.success);
        } catch (error) {
            showPopupError("An error occurred while trying to add email");
        }
    });
    
    // Function to create and display the popup box
    function showPopup(message) {
        let emailInputFinal = document.getElementById('email_rocket_subscription');
        emailInputFinal.value = "";
        Swal.fire({
            position: "center-end",
            icon: "success",
            title: message,
            showConfirmButton: !1,
            timer: 2000
        })
    }
    // Function to create and display the popup box
    function showPopupError(message) {
        let emailInputFinal = document.getElementById('email_rocket_subscription');
        emailInputFinal.value = "";
        Swal.fire({
            position: "center-end",
            icon: "warning",
            title: message,
            showConfirmButton: false,
            timer: 2000
        })
    }
});
