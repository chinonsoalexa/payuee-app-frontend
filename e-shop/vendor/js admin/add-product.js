var productTitle = "";
var productDescription = "";
var imageArray = [];
let sharpnessArray = []; 
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
var repost= '';
var estimateDeliveryStat = 0;
var productLengthValue = 0.0;
var productWidthValue = 0.0;
var productHeightValue = 0.0;
var shippingClassSelectionValue = "";
var stockAvailabilityStatusValue = "";
var imageQuality = 0;
let model;
let isUnauthorized = true;
// const compress = new Compress();

const authorizedCategories = [
    "person", "bicycle", "car", "motorcycle", "airplane", "bus",
    "train", "truck", "boat", "traffic light", "fire hydrant", 
    "stop sign", "parking meter", "bench", "bird", "cat", 
    "dog", "horse", "sheep", "cow", "elephant", "bear", 
    "zebra", "giraffe", "backpack", "umbrella", "handbag", 
    "tie", "suitcase", "frisbee", "skis", "snowboard", 
    "sports ball", "kite", "baseball bat", "baseball glove", 
    "skateboard", "surfboard", "tennis racket", "bottle", 
    "wine glass", "cup", "fork", "knife", "spoon", 
    "bowl", "banana", "apple", "sandwich", "orange", 
    "broccoli", "carrot", "hot dog", "pizza", "donut", 
    "cake", "chair", "couch", "potted plant", "bed", 
    "dining table", "toilet", "TV", "laptop", "mouse", 
    "remote", "keyboard", "cell phone", "microwave", 
    "oven", "toaster", "sink", "refrigerator", "book", 
    "clock", "vase", "scissors", "teddy bear", "hair drier", 
    "toothbrush"
];

document.addEventListener('DOMContentLoaded', function () {
    checkFirstProduct();
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

    // loadModel();

// Assuming 'form' is the form element and 'submitButton' is the submit button
submitButton.addEventListener('click', async function (event) {
    event.preventDefault();

    // Disable the submit button
    document.getElementById('publishButton').classList.add('disabled');

    // Get the product description and title
    productDescription = editor.innerText.trim();
    productTitle = productTitleInput.value;

    // Gather and validate form data
    getFormData();
    extractFormData();

    // Validate fields before proceeding
    if (validateFields()) {
        // All fields are valid, proceed with posting the product
        await postProduct();
    } else {
        // If validation fails, you can display an error message or highlight invalid fields
        showToastMessageE("Please correct the highlighted errors")
    }

    // Re-enable the submit button after processing
    document.getElementById('publishButton').classList.remove('disabled');
    
});

});

function checkFirstProduct() {
    if (localStorage.getItem("firstProductAdded") != "true") {
        // Prompt the user to add their first product
        swal({
            title: "Let's add your first product!",
            text: "Get started by entering a descriptive title for your product.",
            icon: "success",
            buttons: {
                confirm: true,
            },
        }).then(() => {
            // Focus the cursor on the title input after closing the alert
            localStorage.setItem("firstProductAdded", "true");
            document.getElementById("productTitle1").focus();
        })        
    }
}

async function postProduct() {
    // Create a new FormData object
    const formData = new FormData();
    calculateOverallQuality();
    const maxExtraPriceInput2 = document.getElementById('maxExtraPrice');
    // Append text fields to the FormData object
    formData.append("productTitle", productTitle);
    formData.append("productDescription", productDescription);
    formData.append("initialCost", initialCost);
    formData.append("netWeight", netWeight);
    formData.append("imageQuality", imageQuality);
    formData.append("sellingPrice", sellingPrice);
    formData.append("currency", currency);
    formData.append("productStock", productStock);
    formData.append("discountType", discountType);
    formData.append("category", selectedCategory);
    formData.append("tags", tags);
    formData.append("publishStatus", publishStatus);
    formData.append("repost", repost);
    formData.append("RepostMaxPrice", maxExtraPriceInput2);
    formData.append("estimateDeliveryStat", estimateDeliveryStat);
    formData.append("productLengthValue", productLengthValue);
    formData.append("productWidthValue", productWidthValue);
    formData.append("productHeightValue", productHeightValue);
    formData.append("shippingClassSelectionValue", shippingClassSelectionValue);
    formData.append("stockAvailabilityStatusValue", stockAvailabilityStatusValue);

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
            showToastMessageE("an unexpected error occurred")
            return
        } else {
            
            const result = await response.json();
            showToastMessageS("Product posted successfully")
            if (localStorage.getItem("firstProductAdded") == "true") {
                swal({
                    title: "Congratulations!",
                    text: "Your first product is live on Payuee! You're all set to start selling. Good luck!",
                    icon: "success",
                    buttons: {
                        confirm: "Awesome!",
                    },
                }).then(() => {
                    // Remove an item by its key
                    localStorage.removeItem("firstProductAdded");         
                    // Optionally redirect them to their dashboard or another relevant page
                    window.location.href = "vendor-dashboard.html";
                });
                     
            }
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
        // autoProcessQueue: false,
        init: function () {
            this.on("addedfile", async function (file) {
                // Check if the number of uploaded images is already 4
                if (imageArray.length >= 4) {
                    showToastMessageE("Only four (4) images are allowed for a product")
                    // Remove the new file preview and don't add it to the array
                    // Remove the file from the array
                    const index = imageArray.indexOf(file);
                    if (index > -1) {
                        imageArray.splice(index, 1);
                    }
                    file.previewElement.remove();
                    return; // Exit the function
                }

                // Check if the file already exists in the array
                const fileExists = imageArray.some(existingFile => 
                    existingFile.name === file.name && existingFile.size === file.size
                );

                if (fileExists) {
                    // File already exists, remove the new file preview and don't add it to the array
                    // Remove the file from the array
                    const index = imageArray.indexOf(file);
                    if (index > -1) {
                        imageArray.splice(index, 1);
                    }
                    file.previewElement.remove();
                    return; // Exit the function
                }

                // Load the image and check clarity
                const reader = new FileReader();
                reader.onload = function(event) {
                    const base64Image = event.target.result;
                    checkImageClarity(base64Image, file);
                };
                reader.readAsDataURL(file);

                // Call detectObjects and await its return
                await detectObjects(file);

                // Add the file to the array if it doesn't already exist
                imageArray.push(file);
                // updateDropzoneUI();

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
                        // updateDropzoneUI();
                    });
                }
            });
        }
    };
}

// Initialize space to upload images
// function initializeDropzone() {
//     // Initialize Dropzone
//     Dropzone.options.multiFileUploadA = {
//         acceptedFiles: 'image/*',
//         maxFilesize: 5, // Max file size in MB
//         autoProcessQueue: false, // Disable automatic uploads
//         init: function () {
//             this.on("addedfile", function (file) {
//                 const dropzoneInstance = this;

//                 console.log("File added:", file.name); // Debugging log

//                 // Check if the number of uploaded images is already 4
//                 if (imageArray.length >= 4) {
                        // showToastMessageE("Only four (4) images are allowed for a product")

//                     // Remove the new file preview and don't add it to the array
//                     file.previewElement.remove();
//                     return; // Exit the function
//                 }

//                 // Check if the file already exists in the array
//                 const fileExists = imageArray.some(existingFile => 
//                     existingFile.name === file.name && existingFile.size === file.size
//                 );

//                 if (fileExists) {
//                     // File already exists, remove the new file preview and don't add it to the array
//                     file.previewElement.remove();
//                     return; // Exit the function
//                 }

//                 // Step 1: Optimize the image
//                 optimizeImage(file, (optimizedBlob, fileType) => {
//                     console.log("Image optimized:", file.name); // Debugging log

//                     // Step 2: Create a new optimized file
//                     const optimizedFile = new File([optimizedBlob], file.name.replace(/\.[^/.]+$/, "") + '.' + fileType, {
//                         type: optimizedBlob.type,
//                     });

//                     // Step 3: Clarity Check
//                     const reader = new FileReader();
//                     reader.onload = function(event) {
//                         const base64Image = event.target.result;

//                         // Perform image clarity check on the optimized image
//                         checkImageClarity(base64Image, optimizedFile, (clarityRating) => {
//                             console.log("Clarity Check Passed:", clarityRating); // Debugging log

//                             // Step 4: Emit optimized image after clarity check
//                             dropzoneInstance.emit("addedfile", optimizedFile);
//                             imageArray.push(optimizedFile); // Only add the optimized file to the array

//                             // Display clarity rating in the preview
//                             const clarityElement = document.createElement('div');
//                             clarityElement.innerHTML = `${clarityRating}`;
//                             clarityElement.style.color = clarityRating === 'High Quality' ? 'green' : (clarityRating === 'Medium Quality' ? 'orange' : 'red');
//                             optimizedFile.previewElement = file.previewElement; // Use the original file's preview element
//                             optimizedFile.previewElement.appendChild(clarityElement); // Attach clarity rating to the preview element

//                             // Handle remove icon for the optimized image
//                             const removeIcon = optimizedFile.previewElement.querySelector('.dz-error-mark');
//                             if (removeIcon) {
//                                 removeIcon.addEventListener("click", function (e) {
//                                     e.preventDefault();
//                                     e.stopPropagation();

//                                     // Remove the file from the array
//                                     const index = imageArray.indexOf(optimizedFile);
//                                     if (index > -1) {
//                                         imageArray.splice(index, 1);
//                                     }

//                                     // Remove the file preview
//                                     optimizedFile.previewElement.remove();
//                                 });
//                             }
//                         });
//                     };

//                     reader.readAsDataURL(optimizedFile); // Read the optimized file for clarity check
//                 });
//             });
//         }
//     };
// }

// Function to check image clarity using OpenCV

function checkImageClarity(base64Image, file) {
    const img = new Image();
    img.src = base64Image;
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const src = cv.imread(canvas);
        const gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY); // Convert to grayscale

        const laplacian = new cv.Mat();
        cv.Laplacian(gray, laplacian, cv.CV_64F);

        const mean = new cv.Mat();
        const stddev = new cv.Mat();
        cv.meanStdDev(laplacian, mean, stddev); // Get mean and standard deviation

        const sharpness = stddev.data64F[0];
        // console.log("image sharpness (stddev):", sharpness);

        sharpnessArray.push(sharpness); // Store sharpness value

        let clarityRating = '';
        let color = '';
        if (sharpness > 80) {
            clarityRating = 'High Quality';
            color = 'green';
        } else if (sharpness > 30) {
            clarityRating = 'Medium Quality';
            color = 'orange';
        } else {
            clarityRating = 'Low Quality';
            color = 'red';
        }

        const clarityElement = document.createElement('div');
        clarityElement.innerHTML = `${clarityRating}`;
        clarityElement.style.color = color;
        file.previewElement.appendChild(clarityElement);

        // Clean up
        src.delete();
        gray.delete();
        laplacian.delete();
        mean.delete();
        stddev.delete();

        // Once all images are uploaded, calculate overall rating
        if (sharpnessArray.length === imageArray.length) {
            calculateOverallQuality();
        }
    };
}

// Function to calculate overall quality of all uploaded images
function calculateOverallQuality() {
    const totalSharpness = sharpnessArray.reduce((sum, sharpness) => sum + sharpness, 0);
    const averageSharpness = totalSharpness / sharpnessArray.length;
    
    if (averageSharpness > 80) {
        imageQuality = 3;
    } else if (averageSharpness > 30) {
        imageQuality = 2;
    } else {
        imageQuality = 1;
    }
}

function optimizeImage(file, callback) {
    compress.compress([file], {
        size: 2, // Max size in MB
        quality: 0.75, // Quality from 0 to 1
        maxWidth: 1024, // Max width
        maxHeight: 1024, // Max height
        resize: true, // Resize if necessary
        convertTypes: ['webp'], // Convert to WebP for better compression
    }).then((results) => {
        const optimizedImage = results[0]; // Get the optimized image
        const base64Image = optimizedImage.data; // Base64-encoded image
        const fileType = optimizedImage.ext; // Get the file extension (webp)
        
        // Convert the base64 data to a Blob
        const byteString = atob(base64Image.split(',')[1]);
        const mimeString = base64Image.split(',')[0].split(':')[1].split(';')[0];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        
        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }
        
        const blob = new Blob([arrayBuffer], { type: mimeString });
        
        // Call the callback with the optimized image Blob and file type
        callback(blob, fileType);
    });
}

// Detect object
async function detectObjects(image) {
    // Check if the model is loaded
    if (!model) {
        // Remove the file from the array
        const index = imageArray.indexOf(file);
        if (index > -1) {
            imageArray.splice(index, 1);
        }
        image.previewElement.remove(); 
        // console.error("Model is not loaded yet.");
        return;
    }

    const img = document.createElement('img');
    img.src = URL.createObjectURL(image);

    // Set up the onload event for the image
    img.onload = async () => {
        try {
            const predictions = await model.detect(img);
            // Process predictions to filter authorized content
            if(processPredictions(predictions)) {
                // Remove the file from the array
                const index = imageArray.indexOf(file);
                if (index > -1) {
                    imageArray.splice(index, 1);
                }
                image.previewElement.remove(); 
            };
        } catch (error) {
            // console.error("Error during object detection:", error);
        }
    };

    img.onerror = () => {
        showToastMessageE("Failed to load image")
        // console.error("Failed to load image.");
    };
}

function processPredictions(predictions) {
    let isUnauthorized = true;
    predictions.forEach(prediction => {
        if (authorizedCategories.includes(prediction.class)) {
            // If any authorized class is detected, mark as authorized
            // console.log("authorized prediction: ", prediction.class);
            isUnauthorized = false; 
        }
    });

    if (isUnauthorized) {
        // Notify the user or take action
        showToastMessageE("Unauthorized content detected")
    } else {
        // Optionally notify the user that authorized content was detected
        // showToastMessageE("Authorized content detected")
    }
    return isUnauthorized; // Return whether the content is unauthorized
}

async function loadModel() {
    model = await cocoSsd.load();
    // console.log("Model loaded");
}

// Call loadModel to ensure the model is loaded at the start
loadModel();

// Call the function to initialize Dropzone for images
initializeDropzone();

// Function to update the Dropzone UI based on the state of imageArray
function updateDropzoneUI() {
    const imageContainer = document.getElementById("imageContainer");

    // Clear the container for uploaded images
    imageContainer.innerHTML = '';

    // Create a div to hold the images
    const uploadedImagesDiv = document.createElement("div");
    uploadedImagesDiv.classList.add("uploaded-images");

    // Check if there are any uploaded images
    if (imageArray.length > 0) {
        imageArray.forEach(image => {
            const imgElement = document.createElement("img");
            imgElement.src = URL.createObjectURL(image);
            imgElement.style.width = '100px'; // Adjust size as needed
            imgElement.style.height = 'auto';
            imgElement.alt = image.name;
            uploadedImagesDiv.appendChild(imgElement);
        });
    }

    // Append the upload icon and uploaded images to the container
    imageContainer.appendChild(uploadedImagesDiv);

    // Optionally, you can add a message if you want
    const uploadMessage = document.createElement("div");
    uploadMessage.classList.add("upload-message");
    uploadMessage.innerHTML = `
        <div class="dz-message needsclick">
            <svg>
                <use href="#file-upload"></use>
            </svg>
            <h6>Drag your image here, or <a class="txt-primary" href="#!">browse</a></h6>
            <span class="note needsclick">SVG, PNG, JPG, or GIF</span>
        </div>
    `;
    imageContainer.prepend(uploadMessage); // Show upload icon and message

    // Append the uploaded images below the icon
    imageContainer.appendChild(uploadedImagesDiv);
}
// max price check box
const repostCheck = document.getElementById('repostCheck');
// max price div box
const extraPriceBox = document.getElementById('extraPriceBox');
// max price input
const maxExtraPriceInput = document.getElementById('maxExtraPrice');
// selling price input
const sellingPriceInput = document.getElementById('sellingPrice');
// initial cost input
const initialCostInput = document.getElementById('initialCost');

// Show/hide extra price box based on checkbox state
repostCheck.addEventListener('change', function () {
    extraPriceBox.style.display = this.checked ? 'block' : 'none';
    
    // Clear max price if unchecked
    if (!this.checked) {
        maxExtraPriceInput.value = '';
        maxExtraPriceInput.removeEventListener('blur', validateCollabPricesCheck);
        return;
    } else {
        maxExtraPriceInput.addEventListener('blur', validateCollabPricesCheck);
    }
});

sellingPriceInput.addEventListener('blur', validatePrices);
initialCostInput.addEventListener('blur', validatePrices);
initialCostInput.addEventListener('blur', validateCollabPrices);

// Validate selling price
function validatePrices() {
    const initialCost = parseFloat(initialCostInput.value) || 0;
    const sellingPrice = parseFloat(sellingPriceInput.value) || 0;

    // Ensure selling price does not exceed initial cost
    if (sellingPrice > initialCost) {
        sellingPriceInput.value = initialCost;
        showToastMessageE("Selling price cannot be greater than the initial cost.");
    }

    // Ensure max price does not exceed the initial cost
    if (maxExtraPriceInput.value && parseFloat(maxExtraPriceInput.value) > initialCost) {
        maxExtraPriceInput.value = initialCost;
        showToastMessageE("Max price cannot be greater than the initial cost.");
    }
}

// Validate collaboration max price
function validateCollabPrices() {
    const initialCost = parseFloat(initialCostInput.value) || 0;
    const maxExtraPrice = parseFloat(maxExtraPriceInput.value) || 0;

    // Ensure max price does not exceed the initial cost
    if (maxExtraPrice > initialCost) {
        maxExtraPriceInput.value = initialCost;
        showToastMessageE("Max price cannot be greater than the initial cost.");
    }

    // Update max price if initial cost is greater than max price
    if (maxExtraPrice <= initialCost && maxExtraPrice !== parseFloat(maxExtraPriceInput.value)) {
        maxExtraPriceInput.value = initialCost;
    }
}

// Ensure max price does not exceed selling price
function validateCollabPricesCheck() {
    const initialCost = parseFloat(initialCostInput.value) || 0;
    const maxExtraPrice = parseFloat(maxExtraPriceInput.value) || 0;

    if (initialCost > 0) {
        // Ensure max extra price does not exceed selling price
        if (maxExtraPrice > initialCost) {
            maxExtraPriceInput.value = initialCost;
            showToastMessageE("Collaboration max price cannot exceed the initial cost.");
        }
    }
}

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

     // Get the checkbox element
    const repostCheckbox = document.getElementById('repostCheck');
    repost = repostCheckbox.checked;

    // Estimated Delivery
    const estimatedDelivery = document.getElementById('estimatedDelivery');
    estimateDeliveryStat = estimatedDelivery.value;

    // Validate Product Length
    const productLength = document.getElementById('productLength');
    productLengthValue = productLength.value;

    // Validate Product Width
    const productWidth = document.getElementById('productWidth');
    productWidthValue = productWidth.value;

    // Validate Product Height
    const productHeight = document.getElementById('productHeight');
    productHeightValue = productHeight.value;

    // Validate Shipping class
    const shippingClassSelection = document.getElementById('shippingClassSelection');
    shippingClassSelectionValue = shippingClassSelection.value;


    // Validate Stock Availability
    const stockAvailabilityStatus = document.getElementById('stockAvailabilityStatus');
    stockAvailabilityStatusValue = stockAvailabilityStatus.value;

    // Get the publish date and time

    // Create an object to store the form data
    const formData = {
        category: selectedCategory,
        tags: tags,
        publishStatus: publishStatus,
        featuredStatus: featuredStatus,
        netWeight: netWeight,
        repost: repost,
        estimateDeliveryStat: estimateDeliveryStat,
        productLengthValue: productLengthValue,
        productWidthValue: productWidthValue,
        productHeightValue: productHeightValue,
        shippingClassSelectionValue: shippingClassSelectionValue,
        stockAvailabilityStatusValue: stockAvailabilityStatusValue,
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
    console.log("Product Title:", productTitle);
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
    console.log("Product Description:", productDescription);
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
    console.log("Initial Cost:", initialCost);
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
    console.log("Selling Price:", sellingPrice);
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
    console.log("Product Stock:", productStock);
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
    console.log("Net Weight:", netWeightVal);
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
    console.log("Currency:", currency);
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
    console.log("Category:", category);
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
    console.log("Tags:", tags);
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
    // const publishStatus = publishStatusInput.value.trim();
    console.log("Publish Status:", publishStatus);
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
    console.log("Featured Status:", featuredStatus);
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

    // Estimated Delivery
    const estimatedDelivery = document.getElementById('estimatedDelivery');
    const estimatedDeliveryVal = parseInt(estimatedDelivery.value, 10);
    // console.log("Estimated Delivery:", estimatedDeliveryVal);
    if (isNaN(estimatedDeliveryVal) || estimatedDeliveryVal < 0 || estimatedDeliveryVal > 30) {
        estimatedDelivery.classList.add('is-invalid');
        estimatedDelivery.classList.remove('is-valid');
        isValid = false;
    } else {
        estimatedDelivery.classList.remove('is-invalid');
        estimatedDelivery.classList.add('is-valid');
    }

        // Validate Product Length
    const productLength = document.getElementById('productLength');
    // const productLengthVal = parseInt(productLength.value, 10);
    // console.log("productLength:", productLengthVal);
    if (productLength) {
        // productLength.classList.add('is-invalid');
        // productLength.classList.remove('is-valid');
        productLength.classList.remove('is-invalid');
        productLength.classList.add('is-valid');
        // isValid = false;
        // console.log("Net Weight is invalid.");
    }

    // Validate Net Weight
    const productWidth = document.getElementById('productWidth');
    // console.log("productWidth:", productWidth.value);
    if (productWidth) {
        // productWidth.classList.add('is-invalid');
        // productWidth.classList.remove('is-valid');
        productWidth.classList.remove('is-invalid');
        productWidth.classList.add('is-valid');
        // isValid = true;
        // console.log("Net Weight is invalid.");
    }

    // Validate Net Weight
    const productHeight = document.getElementById('productHeight');
    // const productHeightVal = parseInt(productHeight.value, 10);
    console.log("productHeightVal:", productHeight.value);
    if (productHeight){
        // productHeight.classList.add('is-invalid');
        // productHeight.classList.remove('is-valid');
        productHeight.classList.remove('is-invalid');
        productHeight.classList.add('is-valid');
        // isValid = true;
        // console.log("Net Weight is invalid.");
    }

    // Validate Shipping Class
    const shippingClassSelection = document.getElementById('shippingClassSelection');
    const shippingClassSelectionStatus = shippingClassSelection.value.trim();
    // console.log("shippingClassSelection:", shippingClassSelectionStatus);
    if (!shippingClassSelectionStatus) {
        // shippingClassSelection.classList.add('is-invalid');
        // shippingClassSelection.classList.remove('is-valid');
        shippingClassSelection.classList.remove('is-invalid');
        shippingClassSelection.classList.add('is-valid');
        // isValid = true;
        // console.log("Featured Status is invalid.");
    }

    // Validate Featured Status
    const stockAvailabilityStatus = document.getElementById('stockAvailabilityStatus');
    const stockAvailabilityStatus1 = stockAvailabilityStatus.value.trim();
    // console.log("stockAvailabilityStatus:", stockAvailabilityStatus1);
    if (!stockAvailabilityStatus1) {
        stockAvailabilityStatus.classList.add('is-invalid');
        stockAvailabilityStatus.classList.remove('is-valid');
        isValid = false;
        // console.log("Featured Status is invalid.");
    } else {
        stockAvailabilityStatus.classList.remove('is-invalid');
        stockAvailabilityStatus.classList.add('is-valid');
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

    // Estimated Delivery
    let estimatedDelivery = document.getElementById('estimatedDelivery');
    estimatedDelivery.value = "";

        // Validate Net Weight
    let productLength = document.getElementById('productLength');
    productLength.value = "";

    // Validate Net Weight
    let productWidth = document.getElementById('productWidth');
    productWidth.value = "";

    // Validate Net Weight
    const productHeight = document.getElementById('productHeight');
    productHeight.value = "";

    // Validate Shipping class
    const shippingClassSelection = document.getElementById('shippingClassSelection');
    shippingClassSelection.value = "";


    // Validate Stock Availability
    const stockAvailabilityStatus = document.getElementById('stockAvailabilityStatus');
    stockAvailabilityStatus.value = "";

}

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
                window.location.replace('https://payuee.com/e-shop/Demo3/login_register');
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
        productDescription = responseData.success;
        editor.innerText = responseData.success;

        validateFields();
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
                window.location.replace('https://payuee.com/e-shop/Demo3/login_register');
                // displayErrorMessage();
            } else if (errorData.error === 'AI Description Generation Timed Out') {
                // need to do a data of just null event 
                showToastMessageE('AI Description Generation Timed Out');
            } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                // let's log user out the users session has expired
                window.location.replace('https://payuee.com/e-shop/Demo3/login_register');
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

        validateFields();
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
            } else {
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
                    window.location.href = "https://payuee.com/e-shop/Demo3/pricing.html";  // Replace with your desired URL
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
            window.location.href = 'https://payuee.com/e-shop/Demo3/login_register';
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
            showToastMessageE("an error occurred. Please try again")
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
