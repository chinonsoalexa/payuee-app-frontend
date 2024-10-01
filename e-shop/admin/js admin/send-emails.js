var emailSubject = "";
var emailContent = "";
var selectedCategories = "";

// Function to validate the form
function validateForm() {
    // Check if blog title is provided
    if (!emailSubject) {
        alert("Blog title is required.");
        return false;
    }

    // Check if at least one description is provided
    if (!emailContent) {
        alert("At least one product description is required.");
        return false;
    }

    // Check if at least one category is selected
    if (!selectedCategories) {
        alert("At least one category must be selected.");
        return false;
    }

    // If all checks pass, return true
    return true;
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('sendEmailButton');
    
    form.addEventListener('click', async function (event) {
        event.preventDefault();

        // Access category
        const categorySelect = document.querySelector('.js-example-placeholder-multiple');
        
        // Fetch editors dynamically on click
        const qlEditor = document.querySelectorAll('.ql-editor'); // Get all editors
        const descriptionEditor = qlEditor[0]; // First editor

        // Access the input element by its ID
        const emailTitleInput = document.getElementById('validationCustom01');
        
        // Get the value entered by the user
        emailSubject = emailTitleInput.value.trim();

        // Validate Descriptions
        emailContent = descriptionEditor ? descriptionEditor.innerHTML.trim() : ''; // First editor content

        // Get the selected categories
        selectedCategories = categorySelect.value;
        
        // Log the results
        // console.log('Product Title:', emailSubject);
        // console.log('Product Description 1:', emailContent);
        // console.log('Product Description 2:', productDescription2);
        // console.log('Selected Categories:', selectedCategories);

        // Validate the form data
        if (validateForm()) {
            await sendEmail();
            // Proceed with form submission or AJAX request here
        }
    });
});

async function sendEmail() {

    const apiUrl = "https://api.dorngwellness.com/send-dorng-email";

    // Construct the request body
    const requestBody = {
        subject: emailSubject,
        content: emailContent,
        send_to: selectedCategories,
    };

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include', // set credentials to include cookies
        body: JSON.stringify(requestBody)
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            const errorData = await response.json();

            if (errorData.error === 'failed to get user from request') {
                // need to do a data of just null event 
                // displayErrorMessage();
            } else if (errorData.error === 'failed to get transaction history') {
                // need to do a data of just null event 
                
            } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!") {
                // let's log user out the users session has expired
                logout();
            }else {
                // displayErrorMessage();
            }

            return;
        }

        const responseData = await response.json();
        // Perform actions when confirmed
        swal("Email Successfully Sent", {
            icon: "success",
            buttons: {
                confirm: true,
            },
            }).then(() => {
            
            });
} finally {

    }
}

async function logout() {
    // also send a request to the logout api endpoint
    const apiUrl = "https://api.dorngwellness.com/log-out";

    const requestOptions = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    credentials: 'include', // set credentials to include cookies
    };
    
try {
    const response = await fetch(apiUrl, requestOptions);
    
    if (!response.ok) {
            // alert('an error occurred. Please try again');
                if (!response.ok) {
        alert('an error occurred. Please try again');
        return;
    }
        return;
      }
        const data = await response.json();
        localStorage.removeItem('auth')
        window.location.href = '../shop.html'
    } finally{
        // do nothing
    }
}