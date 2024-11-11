var productTitle = "";
let eShopUserId = 0;
var productDescription = "";
var initialCost = 0.0;
var netWeight = 0;
var sellingPrice = 0.0;
var productStock = 0;
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

var productToUpdate;

document.addEventListener('DOMContentLoaded', async function () {
    // Get the current URL
    const currentUrl = new URL(window.location.href);
    // Assuming you have a reference to the table body element

    // Extract parameters using URLSearchParams
    const params = new URLSearchParams(currentUrl.search);

    // Get individual parameter values
    productToUpdate = params.get("ProductID");
    
    await getProduct(productToUpdate);

});

async function updateProduct() {
    setUpdatedJsonFields();
    // Disable the submit button
    document.getElementById('publishButton').classList.add('disabled');
    // Validate fields before proceeding
    if (validateFields()) {
        // All fields are valid, proceed with posting the product
    const apiUrl = "https://api.payuee.com/vendor/update-vendor-product";
    const requestBody = {
        product_id: parseInt(productToUpdate),  // Ensure this is an integer if it's supposed to be
        eshop_user_id: parseInt(eShopUserId),
        product_title: productTitle,
        product_description: productDescription,
        initial_cost: parseFloat(initialCost),  // Ensure this is a float
        selling_price: parseFloat(sellingPrice),  // Ensure this is a float
        product_stock: parseInt(productStock, 10),  // Convert to integer
        net_weight: parseFloat(netWeight),  // Ensure this is a float
        category: selectedCategory,
        tags: tags,
        publish_status: publishStatus,
        featured_status: featuredStatus,
        repost: Boolean(repost),  // Ensure it's a boolean
        estimateDeliveryStat: parseInt(estimateDeliveryStat, 10),  // Convert to integer
        productLengthValue: parseFloat(productLengthValue),  // Ensure this is a float
        productWidthValue: parseFloat(productWidthValue),  // Ensure this is a float
        productHeightValue: parseFloat(productHeightValue),  // Ensure this is a float
        shippingClassSelectionValue: shippingClassSelectionValue,
        stockAvailabilityStatusValue: stockAvailabilityStatusValue,
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
                
            } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                // let's log user out the users session has expired
                logout();
            }else {
                // displayErrorMessage();
            }

            return;
        }

        const responseData = await response.json();
        // Perform actions when confirmed
        swal("Product Successfully Updated", {
            icon: "success",
            buttons: {
                confirm: true,
            },
            }).then(() => {
            
            });
    } finally {
        document.getElementById('publishButton').classList.remove('disabled');
        }
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
}

document.getElementById('updateButton').addEventListener('click', async function(event) {
    event.preventDefault();
    await updateProduct();
})

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

    console.log('Form Data:', formData);
    return formData;
}

// function to get product discount status
function extractFormData() {
    const form = document.querySelector('.price-wrapper');

    initialCost = parseFloat(form.querySelector('#initialCost').value);
    sellingPrice = parseFloat(form.querySelector('#sellingPrice').value);
    currency = form.querySelector('select').value;
    productStock = parseInt(form.querySelector('#productStock1').value, 10);
    discountType = form.querySelector('input[name="radio5"]:checked').nextElementSibling.textContent.trim();

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
    if (!productTitle) {
        console.log("Product Title is invalid.");
        productTitleInput.classList.add('is-invalid');
        productTitleInput.classList.remove('is-valid');
        isValid = false;
    } else {
        productTitleInput.classList.remove('is-invalid');
        productTitleInput.classList.add('is-valid');
    }

    // Validate Description
    const editor = document.getElementById('editor2');
    const productDescription = editor.textContent.trim();
    if (!productDescription) {
        console.log("Product Description is invalid.");
        editor.classList.add('is-invalid');
        editor.classList.remove('is-valid');
        isValid = false;
    } else {
        editor.classList.remove('is-invalid');
        editor.classList.add('is-valid');
    }

    // Validate Initial Cost
    const initialCostInput = document.getElementById('initialCost');
    const initialCost = parseFloat(initialCostInput.value);
    if (isNaN(initialCost) || initialCost <= 0) {
        console.log("Initial Cost is invalid:", initialCostInput.value);
        initialCostInput.classList.add('is-invalid');
        initialCostInput.classList.remove('is-valid');
        isValid = false;
    } else {
        initialCostInput.classList.remove('is-invalid');
        initialCostInput.classList.add('is-valid');
    }

    // Validate Selling Price
    const sellingPriceInput = document.getElementById('sellingPrice');
    const sellingPrice = parseFloat(sellingPriceInput.value);
    if (isNaN(sellingPrice) || sellingPrice <= 0) {
        console.log("Selling Price is invalid:", sellingPriceInput.value);
        sellingPriceInput.classList.add('is-invalid');
        sellingPriceInput.classList.remove('is-valid');
        isValid = false;
    } else {
        sellingPriceInput.classList.remove('is-invalid');
        sellingPriceInput.classList.add('is-valid');
    }

    // Validate Product Stock
    const productStockInput = document.getElementById('productStock1');
    const productStock = parseInt(productStockInput.value, 10);
    if (isNaN(productStock) || productStock < 0) {
        console.log("Product Stock is invalid:", productStockInput.value);
        productStockInput.classList.add('is-invalid');
        productStockInput.classList.remove('is-valid');
        isValid = false;
    } else {
        productStockInput.classList.remove('is-invalid');
        productStockInput.classList.add('is-valid');
    }

    // Validate Net Weight
    const netWeightInput = document.getElementById('netWeight');
    const netWeightVal = parseInt(netWeightInput.value, 10);
    if (isNaN(netWeightVal) || netWeightVal < 0) {
        console.log("Net Weight is invalid:", netWeightInput.value);
        netWeightInput.classList.add('is-invalid');
        netWeightInput.classList.remove('is-valid');
        isValid = false;
    } else {
        netWeightInput.classList.remove('is-invalid');
        netWeightInput.classList.add('is-valid');
    }

    // Validate Currency
    const currencySelect = document.getElementById('currencySelect');
    const currency = currencySelect.value.trim();
    if (!currency) {
        console.log("Currency selection is invalid.");
        currencySelect.classList.add('is-invalid');
        currencySelect.classList.remove('is-valid');
        isValid = false;
    } else {
        currencySelect.classList.remove('is-invalid');
        currencySelect.classList.add('is-valid');
    }

    // Validate Discount Type
    const discountTypeRadio = document.querySelector('input[name="radio5"]:checked');
    if (!discountTypeRadio) {
        console.log("Discount Type is not selected.");
        document.querySelector('.radio-wrapper').classList.add('is-invalid');
        isValid = false;
    } else {
        document.querySelector('.radio-wrapper').classList.remove('is-invalid');
    }

    // Validate Category
    const categorySelect = document.getElementById('validationDefault04');
    const category = categorySelect.value.trim();
    if (!category) {
        console.log("Category selection is invalid.");
        categorySelect.classList.add('is-invalid');
        categorySelect.classList.remove('is-valid');
        isValid = false;
    } else {
        categorySelect.classList.remove('is-invalid');
        categorySelect.classList.add('is-valid');
    }

    // Validate Tags
    const tagsInput = document.getElementById('tags');
    const tags = tagsInput.value.trim();
    if (!tags) {
        console.log("Tags input is invalid.");
        tagsInput.classList.add('is-invalid');
        tagsInput.classList.remove('is-valid');
        isValid = false;
    } else {
        tagsInput.classList.remove('is-invalid');
        tagsInput.classList.add('is-valid');
    }

    // Validate Publish Status
    const publishStatusInput = document.getElementById('publishStatus');
    const publishStatus = publishStatusInput.value.trim();
    if (!publishStatus) {
        console.log("Publish Status is invalid.");
        publishStatusInput.classList.add('is-invalid');
        publishStatusInput.classList.remove('is-valid');
        isValid = false;
    } else {
        publishStatusInput.classList.remove('is-invalid');
        publishStatusInput.classList.add('is-valid');
    }

    // Validate Estimated Delivery
    const estimatedDelivery = document.getElementById('estimatedDelivery');
    const estimatedDeliveryVal = parseInt(estimatedDelivery.value, 10);
    if (isNaN(estimatedDeliveryVal) || estimatedDeliveryVal < 0 || estimatedDeliveryVal > 30) {
        console.log("Estimated Delivery is invalid:", estimatedDelivery.value);
        estimatedDelivery.classList.add('is-invalid');
        estimatedDelivery.classList.remove('is-valid');
        isValid = false;
    } else {
        estimatedDelivery.classList.remove('is-invalid');
        estimatedDelivery.classList.add('is-valid');
    }

    // Additional fields can be debugged similarly with console logs for each validation check

    return isValid;
}

function updateFields(product) {

    // Update Product Title
    let productTitleInput = document.getElementById('productTitle1');
    productTitleInput.value = product.title;

    // Assuming 'editor2' is the container element for your rich text editor
    const editorContainer = document.getElementById('editor2');

    // If using Quill, for example:
    const quillEditor = new Quill(editorContainer, {
        theme: 'snow'  // or 'bubble', depending on your setup
    });

    // Set the content of the rich text editor
    quillEditor.root.innerHTML = product.description;

    // Update Initial Cost
    let initialCostInput = document.getElementById('initialCost');
    initialCostInput.value = product.initial_cost;

    // Update Selling Price
    let sellingPriceInput = document.getElementById('sellingPrice');
    sellingPriceInput.value = product.selling_price;

    // Update Product Stock
    let productStockInput = document.getElementById('productStock1');
    productStockInput.value = product.product_stock;

    // Update Net Weight
    let netWeightInput = document.getElementById('netWeight');
    netWeightInput.value = product.net_weight;

    // Estimated Delivery
    const estimatedDelivery = document.getElementById('estimatedDelivery');
    estimatedDelivery.value = product.estimated_delivery;

    // Select the checked radio button from the group "radio5"
    // Update discount type
    const radioButton = document.querySelector(`input[name="radio5"][value="${product.discount_type}"]`);
    if (radioButton) {
        radioButton.checked = true;
    }

    // Update Category
    let categorySelect = document.getElementById('validationDefault04');
    categorySelect.value = product.category;

    // Update Tags
    let tagsInput = document.getElementById('tags');
    tagsInput.value = product.tags;

    // Update Publish Status
    let publishStatusInput = document.getElementById('publishStatus');
    publishStatusInput.value = product.publish_status;

    // Update Publish Status
    let featuredStatusInput = document.getElementById('featuredStatus');
    if (!product.publish_status) {
        featuredStatusInput.value = "none";
    } else {
        featuredStatusInput.value = "featured";
    }
    
    validateFields();
}

function setUpdatedJsonFields() {
    // Update Product Title
    let productTitleInput = document.getElementById('productTitle1');
    productTitle = productTitleInput.value;

    // Get the product description and title
    const editor = document.querySelector('.ql-editor');
    productDescription = editor.innerText.trim();

    // Update Initial Cost
    let initialCostInput = document.getElementById('initialCost');
    initialCost = initialCostInput.value;

    // Update Selling Price
    let sellingPriceInput = document.getElementById('sellingPrice');
    sellingPrice = sellingPriceInput.value;

    // Update Product Stock
    let productStockInput = document.getElementById('productStock1');
    productStock = productStockInput.value;

    // Update Net Weight
    let netWeightInput = document.getElementById('netWeight');
    netWeight = netWeightInput.value;

    // Update Category
    let categorySelect = document.getElementById('validationDefault04');
    selectedCategory = categorySelect.value;

    // Update Tags
    let tagsInput = document.getElementById('tags');
    tags = tagsInput.value;

    // Update Publish Status
    let publishStatusInput = document.getElementById('publishStatus');
    publishStatus = publishStatusInput.value;

    // Update Featured Status
    let featuredStatusInput = document.getElementById('featuredStatus');
    featuredStatus = featuredStatusInput.value;
    
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

    validateFields();
}

async function getProduct(productID) {
    const apiUrl = "https://api.payuee.com/vendor/product/" + productID;
  
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
  
            if (errorData.error === 'failed to get user from request') {
                // need to do a data of just null event 
                // displayErrorMessage();
            } else if (errorData.error === 'failed to get transaction history') {
                // need to do a data of just null event 
                
            } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                // let's log user out the users session has expired
                logout();
            }else {
                // displayErrorMessage();
            }
  
            return;
        }
  
        const responseData = await response.json();
        eShopUserId = responseData.success.eshop_user_id
        updateFields(responseData.success);
       
  } finally {
  
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