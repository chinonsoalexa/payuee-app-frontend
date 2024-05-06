document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('rocket_subscription_form').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent form submission

        var emailInput = document.getElementById('email_rocket_subscription');
        var emailValue = emailInput.value;

        // Validate email format using regex
        var emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(emailValue)) {
            showPopup("Please enter a valid email address.");
            return;
        }

        const user = {
            Email: emailValue,
        };

        const apiUrl = "https://server.payuee.com/email-subscriber";

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
                    showPopup("An error occurred while trying to add email");
                } else if (errorData.error === 'user with email already exists') {
                    showPopup("User with email already exists");
                } else {
                    showPopup("An error occurred while trying to add email");
                }

                return;
            }

            const responseData = await response.json();
            showPopup(responseData.success);
        } catch (error) {
            console.error("An error occurred:", error);
            showPopup("An error occurred while trying to add email");
        }
    });
    
    // Function to create and display the popup box
    function showPopup(message) {
        // Create elements for the popup box
        var popup = document.createElement("div");
        popup.id = "balance-popup";
        popup.classList.add("popup");
    
        var popupContent = document.createElement("div");
        popupContent.classList.add("popup-content");
    
        var messageParagraph = document.createElement("p");
        messageParagraph.id = "emailMessage";
        messageParagraph.textContent = message;
    
        var closeButton = document.createElement("button");
        closeButton.classList.add("cancel-button");
        closeButton.textContent = "Close";
    
        // Add event listener to close button
        closeButton.addEventListener("click", function() {
        // Hide the popup when close button is clicked
        popup.style.display = "none";
        });
    
        // Append elements to the popup content
        popupContent.appendChild(messageParagraph);
        popupContent.appendChild(closeButton);
    
        // Append popup content to the popup
        popup.appendChild(popupContent);
    
        // Append popup to the body
        document.body.appendChild(popup);
    }
});
