var productTitle = "";
var productDescription = "";
var imageArray = [];
var initialCost = 0.0;
var netWeight = "";
var sellingPrice = 0.0;
var currency = "";
var productStock = 0;
var discountType = "";
var selectedCategory = "";
var tags = "";
var publishStatus = "";
var featuredStatus = "";

document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('nextButton');
    const productTitleInput = document.getElementById('productTitle1');
    const editor = document.querySelector('.ql-editor'); // Assuming this is a rich text editor
    const ProductTitleForBodyEvent = document.getElementById('editor2');

    // Add input event listener for the Product Title input field
    ProductTitleForBodyEvent.addEventListener('input', function () {
        const productTitle = productTitleInput.value.trim();
        if (!productTitle) {
            productTitleInput.classList.add('is-invalid');
            productTitleInput.classList.remove('is-valid');
        } else {
            productTitleInput.classList.remove('is-invalid');
            productTitleInput.classList.add('is-valid');
        }
    });

// Assuming 'form' is the form element and 'submitButton' is the submit button
submitButton.addEventListener('click', async function (event) {
    event.preventDefault();

    // Disable the submit button
    document.getElementById('publishButton').classList.add('disabled');

    // Get the product description and title
    productDescription = editor.innerText.trim();
    productTitle = productTitleInput.value;

    // // console.log("Description:", productDescription);
    // // console.log("Title:", productTitle);

    // Gather and validate form data
    getFormData();
    extractFormData();

    // Validate fields before proceeding
    if (validateFields()) {
        // All fields are valid, proceed with posting the product
        await postProduct();
    } else {
        // If validation fails, you can display an error message or highlight invalid fields
        swal({
            title: "Please correct the highlighted errors",
            icon: "warning",
            buttons: {
                cancel: true,
                confirm: true,
            },
        })
    }

    // Re-enable the submit button after processing
    document.getElementById('publishButton').classList.remove('disabled');
    
});

});

async function postProduct() {
    // Create a new FormData object
    const formData = new FormData();

    // Append text fields to the FormData object
    formData.append("productTitle", productTitle);
    formData.append("productDescription", productDescription);
    formData.append("initialCost", initialCost);
    formData.append("netWeight", netWeight);
    formData.append("sellingPrice", sellingPrice);
    formData.append("currency", currency);
    formData.append("productStock", productStock);
    formData.append("discountType", discountType);
    formData.append("category", selectedCategory);
    formData.append("tags", tags);
    formData.append("publishStatus", publishStatus);
    formData.append("featuredStatus", featuredStatus);

    // Append images to the FormData object
    imageArray.forEach((image, index) => {
        formData.append("imageArray", image, `image${index}.jpg`);
    });

    try {
        const response = await fetch('https://api.payuee.com/vendor/publish-product', { // Replace with your actual endpoint URL
            method: 'POST',
            credentials: 'include', // Include credentials such as cookies or authorization headers
            body: formData,
        });
        if (!response.ok) {
            if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                logout();
            }
        } else {
            // const error = await response.json();
            // console.error("Error posting product:", error);
            const result = await response.json();
            swal({
                title: "Product posted successfully",
                icon: "success",
                buttons: {
                    confirm: true,
                },
            })
            clearFields();
        }

    } catch (error) {
        console.error("Network error:", error);
    }
}

// Initialize space to upload images
function initializeDropzone() {
    // Initialize Dropzone
    Dropzone.options.multiFileUploadA = {
        acceptedFiles: 'image/*',
        maxFilesize: 5, // Max file size in MB
        init: function () {
            this.on("addedfile", function (file) {
                // Check if the number of uploaded images is already 2
                if (imageArray.length >= 4) {
                    swal({
                        title: "Only four (4) images are allowed for a product",
                        icon: "warning",
                        buttons: {
                            confirm: true,
                        },
                    })
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
        }
    };
}

// Call the function to initialize Dropzone for images
initializeDropzone();

// Function to get product categories
function getFormData() {
    // Get the selected category
    const categorySelect = document.getElementById('validationDefault04');
    selectedCategory = categorySelect.value;

    // Get the tags
    const tagsInput = document.querySelector('input[name="basic-tags"]');
    tags = tagsInput.value;
    
    // Get the publish status
    const publishStatusSelect = document.getElementById('publishStatus');
    publishStatus = publishStatusSelect.value;

    // Get the publish status
    const featuredStatusSelect = document.getElementById('featuredStatus');
    featuredStatus = featuredStatusSelect.value;

    // Get the publish status
    const netWeightSelect = document.getElementById('netWeight');
    netWeight = netWeightSelect.value;

    // Get the publish date and time

    // Create an object to store the form data
    const formData = {
        category: selectedCategory,
        tags: tags,
        publishStatus: publishStatus,
        featuredStatus: featuredStatus,
        netWeight: netWeight,
    };

    // console.log('Form Data:', formData);
    return formData;
}

// function to get product discount status
function extractFormData() {
    const form = document.querySelector('.price-wrapper');

    initialCost = parseFloat(form.querySelector('#initialCost').value);
    sellingPrice = parseFloat(form.querySelector('#sellingPrice').value);
    currency = form.querySelector('select').value;
    productStock = parseInt(form.querySelector('#productStock1').value, 10);
    discountType = document.querySelector('input[name="productDiscountType"]:checked').value;

    return {
        initialCost,
        sellingPrice,
        currency,
        productStock,
        discountType
    };
}

function validateFields() {
    let isValid = true;

    // Validate Product Title
    const productTitleInput = document.getElementById('productTitle1');
    const productTitle = productTitleInput.value.trim();
    // console.log("Product Title:", productTitle);
    if (!productTitle) {
        productTitleInput.classList.add('is-invalid');
        productTitleInput.classList.remove('is-valid');
        isValid = false;
        // console.log("Product Title is invalid.");
    } else {
        productTitleInput.classList.remove('is-invalid');
        productTitleInput.classList.add('is-valid');
        // console.log("Product Title is valid.");
    }

    // Validate Description
    const editor = document.getElementById('editor2');
    const productDescription = editor.textContent.trim();
    // console.log("Product Description:", productDescription);
    if (!productDescription) {
        editor.classList.add('is-invalid');
        editor.classList.remove('is-valid');
        isValid = false;
        // console.log("Product Description is invalid.");
    } else {
        editor.classList.remove('is-invalid');
        editor.classList.add('is-valid');
        // console.log("Product Description is valid.");
    }

    // Validate Initial Cost
    const initialCostInput = document.getElementById('initialCost');
    const initialCost = parseFloat(initialCostInput.value);
    // console.log("Initial Cost:", initialCost);
    if (isNaN(initialCost) || initialCost <= 0) {
        initialCostInput.classList.add('is-invalid');
        initialCostInput.classList.remove('is-valid');
        isValid = false;
        // console.log("Initial Cost is invalid.");
    } else {
        initialCostInput.classList.remove('is-invalid');
        initialCostInput.classList.add('is-valid');
        // console.log("Initial Cost is valid.");
    }

    // Validate Selling Price
    const sellingPriceInput = document.getElementById('sellingPrice');
    const sellingPrice = parseFloat(sellingPriceInput.value);
    // console.log("Selling Price:", sellingPrice);
    if (isNaN(sellingPrice) || sellingPrice <= 0) {
        sellingPriceInput.classList.add('is-invalid');
        sellingPriceInput.classList.remove('is-valid');
        isValid = false;
        // console.log("Selling Price is invalid.");
    } else {
        sellingPriceInput.classList.remove('is-invalid');
        sellingPriceInput.classList.add('is-valid');
        // console.log("Selling Price is valid.");
    }

    // Validate Product Stock
    const productStockInput = document.getElementById('productStock1');
    const productStock = parseInt(productStockInput.value, 10);
    // console.log("Product Stock:", productStock);
    if (isNaN(productStock) || productStock < 0) {
        productStockInput.classList.add('is-invalid');
        productStockInput.classList.remove('is-valid');
        isValid = false;
        // console.log("Product Stock is invalid.");
    } else {
        productStockInput.classList.remove('is-invalid');
        productStockInput.classList.add('is-valid');
        // console.log("Product Stock is valid.");
    }

    // Validate Net Weight
    const netWeightInput = document.getElementById('netWeight');
    const netWeightVal = parseInt(netWeightInput.value, 10);
    // console.log("Net Weight:", netWeightVal);
    if (isNaN(netWeightVal) || netWeightVal < 0) {
        netWeightInput.classList.add('is-invalid');
        netWeightInput.classList.remove('is-valid');
        isValid = false;
        // console.log("Net Weight is invalid.");
    } else {
        netWeightInput.classList.remove('is-invalid');
        netWeightInput.classList.add('is-valid');
        // console.log("Net Weight is valid.");
    }

    // Validate Currency
    const currencySelect = document.getElementById('currencySelect');
    const currency = currencySelect.value.trim();
    // console.log("Currency:", currency);
    if (!currency) {
        currencySelect.classList.add('is-invalid');
        currencySelect.classList.remove('is-valid');
        isValid = false;
        // console.log("Currency is invalid.");
    } else {
        currencySelect.classList.remove('is-invalid');
        currencySelect.classList.add('is-valid');
        // console.log("Currency is valid.");
    }

    // Validate Category
    const categorySelect = document.getElementById('validationDefault04');
    const category = categorySelect.value.trim();
    // console.log("Category:", category);
    if (!category) {
        categorySelect.classList.add('is-invalid');
        categorySelect.classList.remove('is-valid');
        isValid = false;
        // console.log("Category is invalid.");
    } else {
        categorySelect.classList.remove('is-invalid');
        categorySelect.classList.add('is-valid');
        // console.log("Category is valid.");
    }

    // Validate Tags
    const tagsInput = document.getElementById('tags');
    const tags = tagsInput.value.trim();
    // console.log("Tags:", tags);
    if (!tags) {
        tagsInput.classList.add('is-invalid');
        tagsInput.classList.remove('is-valid');
        isValid = false;
        // console.log("Tags are invalid.");
    } else {
        tagsInput.classList.remove('is-invalid');
        tagsInput.classList.add('is-valid');
        // console.log("Tags are valid.");
    }

    // Validate Publish Status
    const publishStatusInput = document.getElementById('publishStatus');
    const publishStatus = publishStatusInput.value.trim();
    // console.log("Publish Status:", publishStatus);
    if (!publishStatus) {
        publishStatusInput.classList.add('is-invalid');
        publishStatusInput.classList.remove('is-valid');
        isValid = false;
        // console.log("Publish Status is invalid.");
    } else {
        publishStatusInput.classList.remove('is-invalid');
        publishStatusInput.classList.add('is-valid');
        // console.log("Publish Status is valid.");
    }

    // Validate Featured Status
    const featuredStatusInput = document.getElementById('featuredStatus');
    const featuredStatus = featuredStatusInput.value.trim();
    // console.log("Featured Status:", featuredStatus);
    if (!featuredStatus) {
        featuredStatusInput.classList.add('is-invalid');
        featuredStatusInput.classList.remove('is-valid');
        isValid = false;
        // console.log("Featured Status is invalid.");
    } else {
        featuredStatusInput.classList.remove('is-invalid');
        featuredStatusInput.classList.add('is-valid');
        // console.log("Featured Status is valid.");
    }

    return isValid;
}

function clearFields() {

    // Clear Product Title
    let productTitleInput = document.getElementById('productTitle1');
    productTitleInput.value = "";

    // Clear Description
    let editor = document.getElementById('editor2');
    editor.innerText = "";

    // Clear Initial Cost
    let initialCostInput = document.getElementById('initialCost');
    initialCostInput.value = "";

    // Clear Selling Price
    let sellingPriceInput = document.getElementById('sellingPrice');
    sellingPriceInput.value = "";

    // Clear Product Stock
    let productStockInput = document.getElementById('productStock1');
    productStockInput.value = "";

    // Clear Net Weight
    let netWeightInput = document.getElementById('netWeight');
    netWeightInput.value = "";

    // Clear Currency
    let currencySelect = document.getElementById('currencySelect');
    currencySelect.value = "";

    // Clear Category
    let categorySelect = document.getElementById('validationDefault04');
    categorySelect.value = "";

    // Clear Tags
    let tagsInput = document.getElementById('tags');
    tagsInput.value = "";
    
    // Clear Publish Status
    let publishStatusInput = document.getElementById('publishStatus');
    publishStatusInput.value = "";
    
    // Clear Publish Status
    let featuredStatusInput = document.getElementById('featuredStatus');
    featuredStatusInput.value = "";

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