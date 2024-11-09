var imageArray = [];
var storeName = "";
var storeDescription = "";
var selectedCategories = [];

const input = document.querySelector('#tags');
const tagify = new Tagify(input, {
    maxTags: 9  // Setting maxTags property for Tagify
});

// Enforce the 9-tag limit by removing any excess tags
tagify.on('add', () => {
    if (tagify.value.length > 9) {
        // console.log("Too many tags:", tagify.value);
        
        // Delay to ensure Tagify has added the tag before removing
        setTimeout(() => {
            // Remove the most recent tag added
            tagify.removeTags(tagify.value[tagify.value.length - 1].value);
            
            // Optionally, alert the user
            showToastMessageE("You can only add up to 9 tags.");
        }, 100); // Adjust delay if necessary
    }
});


// Function to validate the form
function validateForm() {
    // Check if blog title is provided
    if (!storeName) {
        showToastMessageE("Blog title is required.");
        return false;
    }

    // Check if at least one description is provided
    if (!storeDescription) {
        showToastMessageE("At least one product description is required.");
        return false;
    }

    // Check if exactly three images are uploaded
    if (imageArray.length !== 3) {
        showToastMessageE("Exactly three images are required.");
        return false;
    }

    // Check if at least one category is selected
    if (selectedCategories.length === 0) {
        showToastMessageE("At least one category must be selected.");
        return false;
    }

    // If all checks pass, return true
    return true;
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('postButton');
    
    form.addEventListener('click', async function (event) {
        event.preventDefault();

        // // Access category
        // const categorySelect = document.querySelector('.js-example-placeholder-multiple');
        
        // // Function to get the selected categories
        // function getSelectedCategories() {
        //     const selectedCategories = [];
        //     // Loop through selected options
        //     for (let option of categorySelect.selectedOptions) {
        //         selectedCategories.push(option.value);
        //     }
        //     return selectedCategories;
        // }
        
        // Fetch editors dynamically on click
        const qlEditor = document.querySelectorAll('.ql-editor'); // Get all editors
        const descriptionEditor = qlEditor[0]; // First editor
        // const descriptionEditor2 = qlEditor[1]; // Second editor (if it exists)

        // Access the input element by its ID
        const storeNameInput = document.getElementById('validationCustom01');
        
        // Get the value entered by the user
        storeName = storeNameInput.value.trim();

        // Validate Descriptions
        storeDescription = descriptionEditor ? descriptionEditor.innerHTML.trim() : ''; // First editor content
        // storeDescription2 = descriptionEditor2 ? descriptionEditor2.innerHTML.trim() : ''; // Second editor content

        // Get the selected categories
        // selectedCategories = getSelectedCategories();
        
        // Log the results
        // console.log('Product Title:', storeName);
        // console.log('Product Description 1:', storeDescription);
        // console.log('Product Description 2:', storeDescription2);
        // console.log('Selected Categories:', selectedCategories);

        // Validate the form data
        if (validateForm()) {
            await postBlog();
            // Proceed with form submission or AJAX request here
        }
    });
});

async function postBlog() {
    // Create a new FormData object
    const formData = new FormData();

    // Append text fields to the FormData object
    formData.append("storeName", storeName);
    formData.append("blogDescription1", storeDescription);
    formData.append("blogDescription2", storeDescription2);
    formData.append("blogCategory", selectedCategories);

    // Append images to the FormData object
    imageArray.forEach((image, index) => {
        formData.append("imageArray", image, `image${index}.jpg`);
    });

    try {
        const response = await fetch('https://api.payuee.com/publish-blog', { // Replace with your actual endpoint URL
            method: 'POST',
            // headers: {
            //     'Content-Type': 'multipart/form-data'
            // },
            credentials: 'include', // Include credentials such as cookies or authorization headers
            body: formData,
        });
        // console.log("this is post data: ", formData);
        if (!response.ok) {
            if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                logout();
            }
        } else {
            const error = await response.json();
            console.error("Error posting product:", error);
        }
        const result = await response.json();
        showToastMessageE("Blog posted successfully");
        clearFields();
    } catch (error) {
        console.error("Network error:", error);
    }
}

// Initialize space to upload images
function initializeDropzone() {
    // Initialize Dropzone
    Dropzone.options.multiFileUploadA = {
        acceptedFiles: 'image/*',
        // acceptedFiles: 'image/*, video/mp4, video/x-msvideo, video/quicktime, video/x-matroska, video/webm',
        maxFilesize: 5, // Max file size in MB
        init: function () {
            this.on("addedfile", function (file) {
                // Check if the number of uploaded images is already 2
                if (imageArray.length >= 3) {
                    showToastMessageE("Only three images are allowed for a product");
                    // Remove the new file preview and don't add it to the array
                    file.previewElement.remove();
                    return; // Exit the function
                }

                // Check if the file already exists in the array
                const fileExists = imageArray.some(existingFile => 
                    existingFile.name === file.name && existingFile.size === file.size
                );

                if (fileExists) {
                    // File already exists, remove the new file preview and don't add it to the array
                    file.previewElement.remove();
                    return; // Exit the function
                }

                // Add the file to the array if it doesn't already exist
                imageArray.push(file);

                // Get the existing remove icon (dz-error-mark)
                const removeIcon = file.previewElement.querySelector('.dz-error-mark');

                if (removeIcon) {
                    // Add event listener to remove the image on click
                    removeIcon.addEventListener("click", function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        // Remove the file from the array
                        const index = imageArray.indexOf(file);
                        if (index > -1) {
                            imageArray.splice(index, 1);
                        }

                        // Remove the file preview
                        file.previewElement.remove();
                    });
                }
            });
            // Handle the maxfilesexceeded event
            dropzone.on("maxfilesexceeded", function (file) {
                showToastMessageE("Image sizes should be less than 5mb");
                dropzone.removeFile(file); // Remove the extra file
            });
        }
    };
}

// Call the function to initialize Dropzone for images
initializeDropzone();

// show toast error
function showToastMessageE(message) {
    document.getElementById('toastError').textContent = message;
    const toastElement = document.getElementById('liveToast1'); // Get the toast element
    const toast = new bootstrap.Toast(toastElement); // Initialize the toast
    toast.show(); // Show the toast
}

async function logout() {
    // also send a request to the logout api endpoint
    const apiUrl = "https://api.payuee.com/log-out";

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
            // showToastMessageE('an error occurred. Please try again');
                if (!response.ok) {
        showToastMessageE('an error occurred. Please try again');
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