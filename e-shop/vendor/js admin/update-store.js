var imageArray = [];
var storeName = "";
var companyPhone = "";
var companyEmail = "";
var storeDescription = "";
var selectedCategories = "";

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOM fully loaded and parsed.');

    // Populate form fields on load
    await fetchDataAndFillForm();
    console.log('Data fetched and form populated.');

    const form = document.getElementById('postButton');
    
    form.addEventListener('click', async function (event) {
        console.log('Post button clicked.');
        event.preventDefault();

        // Get the store name
        const storeNameInput = document.getElementById('storeName');
        storeName = storeNameInput.value.trim();
        console.log('Store Name:', storeName);

        // Get the company phone
        const companyPhoneInput = document.getElementById('companyPhone');
        companyPhone = companyPhoneInput.value.trim();
        console.log('Company Phone:', companyPhone);

        // Get the company email
        const companyEmailInput = document.getElementById('companyEmail');
        companyEmail = companyEmailInput.value.trim();
        console.log('Company Email:', companyEmail);

        // Get the tags (categories)
        const selectedCategoriesInput = document.querySelector('input[name="basic-tags"]');
        selectedCategories = selectedCategoriesInput.value;
        console.log('Company Category:', selectedCategories);

        // Get the store description
        const qlEditor = document.querySelectorAll('.ql-editor');
        const descriptionEditor = qlEditor[0];
        storeDescription = descriptionEditor ? descriptionEditor.innerHTML.trim() : '';
        console.log('Store Description:', storeDescription);

        // Validate form before submitting
        if (validateForm()) {
            console.log('Form is valid, proceeding to update store.');
            await updateStore();
        } else {
            console.log('Form validation failed.');
        }
    });

});

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
    // Check if store name is provided
    if (!storeName) {
        showToastMessageE("Store name is required.");
        return false;
    }

    if (!companyPhone) {
        showToastMessageE("Company number is required.");
        return false;
    } else if (!validateCompanyPhone(companyPhone)) {
        return false;
    }

    if (!companyEmail) {
        showToastMessageE("Company email is required.");
        return false;
    }

    // Check if at least one description is provided
    if (!storeDescription) {
        showToastMessageE("Store description is required.");
        return false;
    }

    // Check if at least one category is selected
    if (selectedCategories.length === 0) {
        showToastMessageE("At least one category must be selected.");
        return false;
    }

    // Check if exactly three images are uploaded
    // if (imageArray.length !== 1) {
    //     showToastMessageE("Store Image is required.");
    //     return false;
    // }

    // If all checks pass, return true
    return true;
}

function validateCompanyPhone(phone) {
    // Remove any non-numeric characters from the phone number
    const cleanedPhone = phone.replace(/[^0-9]/g, '');

    // Check if the cleaned phone number has exactly 10 or 11 digits
    if (cleanedPhone.length < 10 || cleanedPhone.length > 11) {
        showToastMessageE("Company number must be exactly 10 or 11 digits.");
        return false;
    }

    return true;
}

function getOnlyNumbers(text) {
    // Use a regular expression to remove all non-numeric characters
    return text.replace(/[^0-9]/g, '');
}

async function updateStore() {
    // Create a new FormData object
    const formData = new FormData();

    // Append text fields to the FormData object
    formData.append("StoreName", storeName);
    formData.append("ShopEmail", companyEmail);
    formData.append("ShopPhone", getOnlyNumbers(companyPhone));
    formData.append("StoreDescription", storeDescription);
    formData.append("ShopCategories", selectedCategories);

    // Append images to the FormData object
    imageArray.forEach((image, index) => {
        formData.append("imageArray", image, `image${index}.jpg`);
    });

    try {
        const response = await fetch('https://api.payuee.com/update-store', { // Replace with your actual endpoint URL
            method: 'POST',
            // headers: {
            //     'Content-Type': 'multipart/form-data'
            // },
            credentials: 'include', // Include credentials such as cookies or authorization headers
            body: formData,
        });
        // console.log("this is post data: ", formData);
        if (!response.ok) {
            if  (response.error === 'No Authentication cookie found' || response.error === "Unauthorized attempt! JWT's not valid!" || response.error === "No Refresh cookie found") {
                logout();
            }
            showToastMessageE("An error occurred while updating the store.");
            return;
        }
        const result = await response.json();
        showToastMessageS("Store updated successfully");
        fillForm(result.success);
    } catch (error) {
        console.error("Network error:", error);
    }
}

// Function to fetch data and fill in form fields
async function fetchDataAndFillForm() {
    try {
        const response = await fetch('https://api.payuee.com/get-store-details', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data && data.success) {
            // Access the store details from the "success" object
            const storeData = data.success;
            fillForm(storeData)
        }
    } catch (error) {
        console.error('Error fetching store data:', error);
    }
}

function fillForm(storeData) {

  // Populate form fields with fetched data
  document.getElementById('storeName').value = storeData.shop_name || '';
  document.getElementById('companyPhone').value = storeData.shop_phone || '';
  document.getElementById('companyEmail').value = storeData.shop_email || '';

  // Update Tags
  let tagsInput = document.getElementById('tags');
  tagsInput.value = storeData.shop_categories;

  // Populate the shop description in the editor
  const qlEditor = document.querySelector('.ql-editor');
  if (qlEditor) {
      qlEditor.innerHTML = storeData.shop_description || '';
  }

  if (storeData.shop_image != "") {
        // Display the shop image in the imageContainer
        const imageContainer = document.getElementById('imageContainer');
        imageContainer.innerHTML = ''; // Clear any previous images
        // Remove the class
        imageContainer.classList.remove("hidden");
        const imgElement = document.createElement('img');
        imgElement.src = `https://payuee.com/image/${storeData.shop_image}`;
        imgElement.alt = storeData.shop_name;
        imgElement.style.maxWidth = "100%"; // Style as needed
        imageContainer.appendChild(imgElement);
  } else {
    
  }

}

const phoneInput = document.getElementById("companyPhone");

phoneInput.addEventListener("input", (event) => {
  // Remove any non-numeric characters
  let value = event.target.value.replace(/\D/g, "");

  // Limit to 11 characters
  value = value.substring(0, 11);

  // Format as 123-456-7890
  if (value.length > 6) {
    value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
  } else if (value.length > 3) {
    value = `${value.slice(0, 3)}-${value.slice(3)}`;
  }

  event.target.value = value;
});

// Enforce only numeric input (optional if maxlength is in use)
phoneInput.addEventListener("keypress", (event) => {
  if (!/[0-9]/.test(event.key)) {
    event.preventDefault();
  }
});

// Initialize space to upload images
function initializeDropzone() {
    // Initialize Dropzone
    Dropzone.options.multiFileUploadA = {
        acceptedFiles: 'image/*',
        maxFiles: 1, // Maximum files allowed
        maxFilesize: 5, // Max file size in MB
        init: function () {
            this.on("addedfile", function (file) {
                // Check if the number of uploaded images is already 3
                if (imageArray.length > 1) {
                    // Remove the oldest file preview
                    const oldestFile = imageArray.shift(); // Remove the first file from the array
                    oldestFile.previewElement.remove();
                }

                // Add the new file to the array
                imageArray.push(file);

                // Get the remove icon (dz-error-mark) in the file preview
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
            this.on("maxfilesexceeded", function (file) {
                showToastMessageE("only one image is allowed, and sizes should be less than 5MB.");
                this.removeFile(file); // Remove the extra file
            });
        }
    };
}

// Call the function to initialize Dropzone for images
initializeDropzone();

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