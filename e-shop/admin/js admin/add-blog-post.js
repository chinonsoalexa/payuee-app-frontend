var imageArray = [];
var blogTitle = "";
var productDescription = "";
var productDescription2 = "";
var selectedCategories = [];

// Function to validate the form
function validateForm() {
    // Check if blog title is provided
    if (!blogTitle) {
        alert("Blog title is required.");
        return false;
    }

    // Check if at least one description is provided
    if (!productDescription && !productDescription2) {
        alert("At least one product description is required.");
        return false;
    }

    // Check if exactly three images are uploaded
    if (imageArray.length !== 3) {
        alert("Exactly three images are required.");
        return false;
    }

    // Check if at least one category is selected
    if (selectedCategories.length === 0) {
        alert("At least one category must be selected.");
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

        // Access category
        const categorySelect = document.querySelector('.js-example-placeholder-multiple');
        
        // Function to get the selected categories
        function getSelectedCategories() {
            const selectedCategories = [];
            // Loop through selected options
            for (let option of categorySelect.selectedOptions) {
                selectedCategories.push(option.value);
            }
            return selectedCategories;
        }
        
        // Fetch editors dynamically on click
        const qlEditor = document.querySelectorAll('.ql-editor'); // Get all editors
        const descriptionEditor = qlEditor[0]; // First editor
        const descriptionEditor2 = qlEditor[1]; // Second editor (if it exists)

        // Access the input element by its ID
        const blogTitleInput = document.getElementById('validationCustom01');
        
        // Get the value entered by the user
        blogTitle = blogTitleInput.value.trim();

        // Validate Descriptions
        productDescription = descriptionEditor ? descriptionEditor.innerHTML.trim() : ''; // First editor content
        productDescription2 = descriptionEditor2 ? descriptionEditor2.innerHTML.trim() : ''; // Second editor content

        // Get the selected categories
        selectedCategories = getSelectedCategories();
        
        // Log the results
        // console.log('Product Title:', blogTitle);
        // console.log('Product Description 1:', productDescription);
        // console.log('Product Description 2:', productDescription2);
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
    formData.append("blogTitle", blogTitle);
    formData.append("blogDescription1", productDescription);
    formData.append("blogDescription2", productDescription2);
    formData.append("blogCategory", selectedCategories);

    // Append images to the FormData object
    imageArray.forEach((image, index) => {
        formData.append("imageArray", image, `image${index}.jpg`);
    });

    try {
        const response = await fetch('https://api.dorngwellness.com/publish-blog', { // Replace with your actual endpoint URL
            method: 'POST',
            // headers: {
            //     'Content-Type': 'multipart/form-data'
            // },
            credentials: 'include', // Include credentials such as cookies or authorization headers
            body: formData,
        });
        // console.log("this is post data: ", formData);
        if (!response.ok) {
            if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!") {
                logout();
            }
        } else {
            const error = await response.json();
            console.error("Error posting product:", error);
        }
        const result = await response.json();
        alert("Blog posted successfully");
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
                    alert("Only three images are allowed for a product");
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
                alert("Image sizes should be less than 5mb");
                dropzone.removeFile(file); // Remove the extra file
            });
        }
    };
}

// Call the function to initialize Dropzone for images
initializeDropzone();

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