
// show toast success
function showToastMessageS(message) {
    document.getElementById('toastMessage2').textContent = message;
    const toastElement = document.getElementById('liveToast3'); // Get the toast element
    const toast = new bootstrap.Toast(toastElement); // Initialize the toast
    toast.show(); // Show the toast
}

// show toast error
function showToastMessageE(message) {
    document.getElementById('toastError').textContent = message;
    const toastElement = document.getElementById('liveToast1'); // Get the toast element
    const toast = new bootstrap.Toast(toastElement); // Initialize the toast
    toast.show(); // Show the toast
}

const generateDescriptionButton = document.getElementById('generateDescriptionAI');
const productTitleInput = document.getElementById('productTitle1'); // assuming the title input has this id

// ai tag generation button
const generateTagButton = document.getElementById("generateTagAI");

// Function to toggle the disabled state and visibility of the button
function toggleButtonState() {
    if (generateDescriptionButton.disabled) {
        generateDescriptionButton.disabled = false; // Enable the button
        generateDescriptionButton.style.display = 'inline-block'; // Show the button
    } else {
        generateDescriptionButton.disabled = true; // Disable the button
        generateDescriptionButton.style.display = 'none'; // Hide the button
    }
}

if (generateDescriptionButton) {
    generateDescriptionButton.addEventListener('click', function (event) {
        event.preventDefault();
        // Check if the product title field is empty
        if (!productTitleInput.value.trim()) {
            showToastMessageE('Please enter a product title before generating a description.');
        } else {
            // Proceed with the AI description generation
            showToastMessageS('Generating AI description...');
            toggleButtonState();
            // Add your AI description generation logic here
            generateAiDescription(productTitleInput.value.trim());
        }
    });
}

async function generateAiDescription(TitleData) {

    const apiUrl = "https://api.payuee.com/vendor/ai-description";

    // Construct the request body
    const requestBody = {
        Title: TitleData,
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

            if (errorData.error === 'wrong plan detected') {
                // need to do a data of just null event 
                window.location.replace('https://payuee.com/e-shop/login_register');
                // displayErrorMessage();
            } else if (errorData.error === 'AI Description Generation Timed Out') {
                // need to do a data of just null event 
                showToastMessageE('AI Description Generation Timed Out');
            } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                // let's log user out the users session has expired
                logout();
            }else {
                // displayErrorMessage();
            }

            return;
        }

        const responseData = await response.json();

        responseData.success
        // Get the product description and title
        const editor = document.querySelector('.ql-editor'); // Assuming this is a rich text editor
        let productDescription = editor.textContent.trim();
        productDescription = responseData.success;
        editor.innerText = responseData.success;

        // Validate Description
        // const editor = document.getElementById('editor2');
        // console.log("Product Description:", productDescription);
        if (!productDescription) {
            editor.classList.add('is-invalid');
            editor.classList.remove('is-valid');
            // isValid = false;
            // console.log("Product Description is invalid.");
        } else {
            editor.classList.remove('is-invalid');
            editor.classList.add('is-valid');
            // console.log("Product Description is valid.");
        }

        // Validate Product Title
        const productTitleInput = document.getElementById('productTitle1');
        const productTitle = productTitleInput.value.trim();
        // console.log("Product Title:", productTitle);
        if (!productTitle) {
            productTitleInput.classList.add('is-invalid');
            productTitleInput.classList.remove('is-valid');
            // isValid = false;
            // console.log("Product Title is invalid.");
        } else {
            productTitleInput.classList.remove('is-invalid');
            productTitleInput.classList.add('is-valid');
            // console.log("Product Title is valid.");
        }

        showToastMessageS('Done Generating AI description');

    } finally {
        toggleButtonState();
    }
}
// Function to toggle the disabled state and visibility of the button
function toggleTagButtonState() {
    if (generateTagButton.disabled) {
        generateTagButton.disabled = false; // Enable the button
        generateTagButton.style.display = 'inline-block'; // Show the button
    } else {
        generateTagButton.disabled = true; // Disable the button
        generateTagButton.style.display = 'none'; // Hide the button
    }
}

if (generateTagButton) {
    generateTagButton.addEventListener('click', function (event) {
        event.preventDefault();
        // Check if the product title field is empty
        if (!productTitleInput.value.trim()) {
            showToastMessageE('Please enter a product title before generating tags.');
        } else {
            const editor = document.querySelector('.ql-editor'); // Assuming this is a rich text editor
            productDescription = editor.innerText.trim();
            showToastMessageS('Generating AI tags...');
            generateAiTag(this.value, productDescription);  // Your AI function for generating tags
        }
    });
}

async function generateAiTag(TitleData, productDescription) {

    const apiUrl = "https://api.payuee.com/vendor/ai-tag";

    // Construct the request body
    const requestBody = {
        Title: TitleData,
        Description: productDescription,
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

            if (errorData.error === 'wrong plan detected') {
                // need to do a data of just null event 
                window.location.replace('https://payuee.com/e-shop/login_register');
                // displayErrorMessage();
            } else if (errorData.error === 'AI Description Generation Timed Out') {
                // need to do a data of just null event 
                showToastMessageE('AI Description Generation Timed Out');
            } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                // let's log user out the users session has expired
                window.location.replace('https://payuee.com/e-shop/login_register');
                logout();
            }else {
                // displayErrorMessage();
            }

            return;
        }

        const responseData = await response.json();
        // Update Tags
        let tagsInput = document.getElementById('tags');
        tagsInput.value = "";
        tagsInput.value = responseData.success;

        // Validate Tags
        // const tagsInput = document.getElementById('tags');
        const tags = tagsInput.value.trim();
        // console.log("Tags:", tags);
        if (!tags) {
            tagsInput.classList.add('is-invalid');
            tagsInput.classList.remove('is-valid');
            // isValid = false;
            // console.log("Tags are invalid.");
        } else {
            tagsInput.classList.remove('is-invalid');
            tagsInput.classList.add('is-valid');
            // console.log("Tags are valid.");
        }
        showToastMessageS('Done Generating AI tags');
    } finally {
        toggleButtonState();
    }
}

async function check_posting_status() {
    const apiUrl = "https://api.payuee.com/vendor/auth-status";

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
            const errorData = await response.json();

            if (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                logout();
            } else if (errorData.error === 'No files uploaded') {
                showToastMessageE("Please upload an image ");
                return;
            }else {
                logout();
            }
            return;
        }

        const responseData = await response.json(); // Parse response JSON
        // Only update if we already have the vendor name from the API response
        if (responseData.store_details.subscription_type == "premium" && responseData.store_details.active) {
            // Display the buttons
            document.getElementById("generateDescriptionAI").style.display = "block";
            document.getElementById("generateTagAI").style.display = "block";
        }
        if (localStorage.getItem("firstProductAdded") == "second") {

        } else  {
            if (responseData.total_products < 1) {
                swal({
                    title: "Welcome to Payuee e-Shop, " + responseData.store_name + "!",
                    text: "Let's set up your shipping fees to get your shop ready for orders.",
                    icon: "success",
                    buttons: {
                        confirm: "Start Setup",
                    },
                }).then(async (result) => {
                    if (result) {
                        window.location.href = "update-shipping-fees.html?new=true";
                    }
                });
            }
        }

        // Update the vendor name immediately if DOM is already loaded
        updateVendorName(responseData.store_name);

        // Get references to the buttons
        const publishButton = document.getElementById('publishButton');
        if (publishButton) {
            const upgradeButton = document.getElementById('upgradeButton');

            // Check the subscription status and display the appropriate button
            if (!responseData.store_details.active) {
                // Subscription has expired, show Upgrade button
                publishButton.style.display = 'none'; // Hide the "Publish" button
                upgradeButton.style.display = 'block'; // Show the "Upgrade" button
                // Add an event listener for the click event
                upgradeButton.addEventListener("click", function() {
                    // Redirect to a different page (change the URL as needed)
                    window.location.href = "https://payuee.com/e-shop/pricing.html";  // Replace with your desired URL
                });
            } else {
                // Subscription is still active, show Update button
                publishButton.style.display = 'block'; // Show the "Publish" button
                upgradeButton.style.display = 'none'; // Hide the "Upgrade" button
            }
        }
        localStorage.setItem('auth', 'true');
    } finally {
        if (localStorage.getItem('auth') !== 'true') {
            window.location.href = 'https://payuee.com/e-shop/login_register';
        }
    }
}

function updateVendorName(newName) {
    const vendorName1Element = document.getElementById("vendorName1");
    const vendorNameElement = document.getElementById("vendorName");
    if (vendorNameElement) {
        vendorNameElement.textContent = newName;
    }
    if (vendorName1Element) {
        vendorName1Element.textContent = newName;
    }
}