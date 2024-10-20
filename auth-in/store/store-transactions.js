var NextPageOnLoad;
var PreviousPageOnLoad;
var CurrentPageOnLoad;
var TotalPageOnLoad;
var TwoBeforePageOnLoad;
var TwoAfterPageOnLoad;
var ThreeAfterPageOnLoad;
var AllRecordsOnPageLoad;

document.addEventListener('DOMContentLoaded', async function () {
    // Call the loading function to render the skeleton loaders
    loading();

    // Get the current URL
    const currentUrl = new URL(window.location.href);
    // Assuming you have a reference to the table body element

    // Extract parameters using URLSearchParams
    const params = new URLSearchParams(currentUrl.search);

    // Get individual parameter values
    let pageNumber = params.get("page");
    if (pageNumber == null) {
        pageNumber = "1";
    }

    await getProducts(pageNumber);

});

function clearElementsByClass() {
    // Get the parent container
    let container = document.getElementById('order-grid');
    container.innerHTML = '';
}

async function getProducts(pageNumber) {
    const apiUrl = "https://api.payuee.com/get-user-orders/" + pageNumber;

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
                logUserOutIfTokenIsExpired();
            }else {
                // displayErrorMessage();
            }

            return;
        }

        const responseData = await response.json();

        // updateProductsFromData(responseData.success);
        // Clear specific elements by class name before updating
        clearElementsByClass();
        responseData.success.forEach((product) => {
            // product.product_review_count = 6500;
            renderProducts(product);
        });
        
        NextPageOnLoad = responseData.pagination.NextPage;
        PreviousPageOnLoad = responseData.pagination.PreviousPage;
        CurrentPageOnLoad = responseData.pagination.CurrentPage;
        TotalPageOnLoad = responseData.pagination.TotalPages;
        TwoBeforePageOnLoad = responseData.pagination.TwoBefore;
        TwoAfterPageOnLoad = responseData.pagination.TwoAfter;
        ThreeAfterPageOnLoad = responseData.pagination.ThreeAfter;
        AllRecordsOnPageLoad = responseData.pagination.AllRecords;
        // console.log(responseData);
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('page', CurrentPageOnLoad);
        window.history.pushState({path: newUrl.href}, '', newUrl.href);
        
        if (TotalPageOnLoad > 1) {
            document.getElementById('paginationDiv').classList.remove('disabled');
            document.getElementById('paginationDiv').disabled = false;
        }

        if (CurrentPageOnLoad <= 1) {
            deactivatePreviousButton();
            deactivateBeforeButton();
        } else if (CurrentPageOnLoad >= TotalPageOnLoad) {
            deactivateNextButton();
        }

        let nextPageButtonI = document.getElementById('nextPage');
        nextPageButtonI.href = `https://payuee.com/store-transactions?page=${CurrentPageOnLoad+1}`;
        let previousPageButtonI = document.getElementById('previousPage');
        previousPageButtonI.href = `https://payuee.com/store-transactions?page=${CurrentPageOnLoad-1}`;

        if (CurrentPageOnLoad < 4) {
            // let's disable the next page navigation button
            document.getElementById('constantBeforePage').classList.add('disabled');
            document.getElementById('constantBeforePage').disabled = true;
        }

        if (CurrentPageOnLoad < 5) {
            // let's disable the next page navigation button
            document.getElementById('dotBeforePage').classList.add('disabled');
            document.getElementById('dotBeforePage').disabled = true;
        }

        if (CurrentPageOnLoad > 2) {
            // let's update the pagination with the next page
            var currentPageElement = document.getElementById("twoBeforePage");
            updateLink(currentPageElement, TwoBeforePageOnLoad);
            currentPageElement.textContent = TwoBeforePageOnLoad;
        } else {
            // let's disable the next page navigation button
            document.getElementById('twoBeforePage').classList.add('disabled');
            document.getElementById('twoBeforePage').disabled = true;
        }

        // let's update the pagination with the next page
        var currentPageElement = document.getElementById("beforePage");
        updateLink(currentPageElement, PreviousPageOnLoad);
        currentPageElement.textContent = PreviousPageOnLoad;

        // let's update the pagination with the current page
        var currentPageElement = document.getElementById("currentPage");
        updateLink(currentPageElement, CurrentPageOnLoad);
        currentPageElement.textContent = CurrentPageOnLoad;
        deactivateCurrentButton();

        if (CurrentPageOnLoad >= TotalPageOnLoad) {
            // let's disable the next page navigation button
            document.getElementById('afterPage').classList.add('disabled');
            document.getElementById('afterPage').disabled = true;
        } else {
            // let's update the pagination with the next page
            var currentPageElement = document.getElementById("afterPage");
            updateLink(currentPageElement, NextPageOnLoad);
            currentPageElement.textContent = NextPageOnLoad;
        }

        if (TwoAfterPageOnLoad < TotalPageOnLoad) {
            // let's update the pagination with the next page
            var currentPageElement = document.getElementById("twoAfterPage");
            updateLink(currentPageElement, TwoAfterPageOnLoad);
            currentPageElement.textContent = TwoAfterPageOnLoad;
        } else {
            // let's disable the next page navigation button
            document.getElementById('twoAfterPage').classList.add('disabled');
            document.getElementById('twoAfterPage').disabled = true;
        }

        if (TwoAfterPageOnLoad > TotalPageOnLoad) {
            // let's disable the next page navigation button
            document.getElementById('constantAfterPage').classList.add('disabled');
            document.getElementById('constantAfterPage').disabled = true;
        } else {
            // let's update the pagination with the next page
            var currentPageElement = document.getElementById("constantAfterPage");
            updateLink(currentPageElement, TotalPageOnLoad);
            currentPageElement.textContent = TotalPageOnLoad;
        }

        if (ThreeAfterPageOnLoad > TotalPageOnLoad) {
            // let's disable the next page navigation button
            document.getElementById('dotAfterPage').classList.add('disabled');
            document.getElementById('dotAfterPage').disabled = true;
        }
        
        // if (AllRecordsOnPageLoad > 8) {
        //     // let's remove the disable on the next page navigation button
        //     // Assuming some condition or event triggers the display change
        //     document.getElementById('paginationList').classList.remove('disabled');
        //     document.getElementById('paginationList').disabled = false;
        // } 
} finally {

    }
}

function renderProducts(product) {
    const productBody = document.getElementById('order-grid');

    // Create a new product card element
    const rowElement = document.createElement('div');
    rowElement.classList.add('col-xxl-4', 'col-md-6');
    rowElement.id = product.ID; // Set the ID of the row

    let productStatus;

    if (product.order_status === "cancelled") {
        productStatus = `
        <a class="btn btn-danger btn-xs" id="status${product.ID}">Cancelled</a><i class="close" data-feather="x"></i>
        `
    } else if (product.order_status === "shipped") {
        productStatus = `
        <a class="btn btn-success btn-xs" id="status${product.ID}">Shipped</a><i class="close" data-feather="x"></i>
        `
    } else {
        productStatus = `
        <a class="btn btn-primary btn-xs" id="status${product.ID}">Processing</a><i class="close" data-feather="x"></i>
        `
    }

    // Create the HTML string with dynamic data using template literals
    rowElement.innerHTML = `
        <div class="prooduct-details-box">                                 
            <div class="d-flex"><img id="image${product.ID}" class="align-self-center img-fluid img-60" src="${"https://payuee.com/image/"+product.product_orders[0].first_image_url}" alt="${product.title}">
                <div class="flex-grow-1 ms-3">
                    <div id="title${product.ID}" class="product-name">
                    <h6><a href="#" id="${product.ID}">${product.product_orders[0].title}</a></h6>
                    </div>
                    <div class="rating">${product.customer_fname+" "+product.customer_user_sname}</div>
                    <div class="price d-flex"> 
                    <div class="text-muted me-2">Price</div>: ${formatNumberToNaira(product.order_cost)}
                    </div>
                    <div class="avaiabilty">
                    <div id="text-danger${product.ID}"><a href="#" style="color: red;">Cancel</a></div>
                    </div>${productStatus}
                </div>
            </div>
        </div>
    `;

    // Append the new element to the container
    productBody.appendChild(rowElement);

    document.getElementById(`image${product.ID}`).addEventListener('click', function(event) {
        event.preventDefault();
        renderOrderedProducts(product);
        const paymentModalElement = document.getElementById('checkoutModal');
        // Create a new instance of the Bootstrap modal
        const paymentModal = new bootstrap.Modal(paymentModalElement);
        paymentModal.show();    // Show the modal programmatically
    });

    document.getElementById(`title${product.ID}`).addEventListener('click', function(event) {
        event.preventDefault();
        renderOrderedProducts(product);
        const paymentModalElement = document.getElementById('checkoutModal');
        // Create a new instance of the Bootstrap modal
        const paymentModal = new bootstrap.Modal(paymentModalElement);
        paymentModal.show();    // Show the modal programmatically
    });

    document.getElementById(`status${product.ID}`).addEventListener('click', function(event) {
        event.preventDefault();
        renderOrderedProducts(product);
        const paymentModalElement = document.getElementById('checkoutModal');
        // Create a new instance of the Bootstrap modal
        const paymentModal = new bootstrap.Modal(paymentModalElement);
        paymentModal.show();    // Show the modal programmatically
    });

    document.getElementById(`text-danger${product.ID}`).addEventListener('click', function(event) {
        event.preventDefault();
        // check if eligible to cancel transaction
        checkReturnEligibilityStatus(product);
        // renderOrderedProducts(product);
        const transactionModal = document.getElementById('transactionModal');
        // Create a new instance of the Bootstrap modal
        const transactionModal1 = new bootstrap.Modal(transactionModal);
        transactionModal1.show();    // Show the modal programmatically
    });

}

function checkReturnEligibilityStatus(product) {
    const orderCreatedAt = new Date(`${product.CreatedAt}`); // When the order was placed
    const expectedDeliveryAt = new Date(`${product.delivery_time}`); // Expected delivery date

    // Get elements
    const cancellationStatus = document.getElementById('cancellationStatus');
    const cancelButton = document.getElementById('cancelButton');
    const reportIssueButton = document.getElementById('reportIssueButton');
    const transactionPinToCancelTrn = document.getElementById('transactionPinToCancelTrn');

   // Calculate 30% cancellation threshold
    const totalTime = expectedDeliveryAt - orderCreatedAt;
    const thresholdTime = totalTime * 0.30; // 30% of the total time

    const currentTime = new Date(); // Current time
  
    if (currentTime - orderCreatedAt <= thresholdTime) {
      cancellationStatus.innerText = 'You are eligible to cancel this order.';
      cancellationStatus.style.color = 'green';

      cancelButton.classList.add('disabled');
      reportIssueButton.classList.remove('disabled');
      transactionPinToCancelTrn.classList.add('disabled');
    } else {
      cancellationStatus.innerText = 'You are no longer eligible to cancel this order.';
      cancellationStatus.style.color = 'red';

      cancelButton.classList.remove('disabled');
      reportIssueButton.classList.add('disabled');
      transactionPinToCancelTrn.classList.remove('disabled');
    }
}

// Function to render products into the table
function renderOrderedProducts(products) {
    const orderedProductsTable = document.getElementById('orderedProductsTable');
    orderedProductsTable.innerHTML = ''; // Clear any existing rows
  
    // let subTotal = 0; // Initialize subtotal
    
    products.product_orders.forEach(product => {
      // Create a new row for each product
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><img src="https://payuee.com/image/${product.first_image_url}" alt="${product.title}" class="custom-product-image"></td>
        <td>${product.title}</td>
        <td>${product.quantity}</td>
        <td>${product.net_weight}kg</td>
        <td>₦${product.order_cost.toLocaleString()}</td>
      `;
      orderedProductsTable.appendChild(row);
    });
  
    // Update the order summary totals
    document.getElementById('cartSubTotalPopUp').textContent = `₦${products.order_sub_total_cost.toLocaleString()}`;
  
    // Assuming you have a fixed shipping cost or can calculate it elsewhere
    document.getElementById('shippingSubTotalPopUp').textContent = `₦${products.shipping_cost.toLocaleString()}`;
    
    document.getElementById('cartShippingTotalPopUp').textContent = `₦${products.order_cost.toLocaleString()}`;

    document.getElementById('paymentButton').textContent = `Pay ₦${products.order_cost.toLocaleString()}`;
}
  
function updateLink(urlIdToUpdate, pageNumber) {
    urlIdToUpdate.href = `https://payuee.com/store-transactions?page=${pageNumber}`;
}

function deactivatePreviousButton() {
var resendButton = document.getElementById('previousPage');
resendButton.classList.add('deactivated'); // Add a class to the button
}

function deactivateBeforeButton() {
var resendButton = document.getElementById('beforePage');
resendButton.classList.add('deactivated'); // Add a class to the button
}

function deactivateNextButton() {
var resendButton = document.getElementById('nextPage');
resendButton.classList.add('deactivated'); // Add a class to the button
}

function deactivateCurrentButton() {
var dotButtonBefore = document.getElementById('dotBeforePage');
dotButtonBefore.classList.add('deactivated'); // Add a class to the button

var dotButtonAfter = document.getElementById('dotAfterPage');
dotButtonAfter.classList.add('deactivated'); // Add a class to the button

var resendButton = document.getElementById('currentPage');
resendButton.classList.add('deactivated'); // Add a class to the button
}

// Initialize loader array with 8 elements (e.g., with null values)
const loader = Array.from({ length: 12 }, (_, i) => i);

function loading() {
    // Render loading skeletons for each element in the loader array
    loader.forEach(() => {
        renderLoading();
    });
}

function renderLoading() {
    // Assuming you have a reference to the container element
    const productBody = document.getElementById('order-grid');

    // Create a new element for the skeleton loader
    const rowElement = document.createElement('div');
    rowElement.classList.add('col-xxl-4', 'col-md-6');

    // Create the HTML string with dynamic data using template literals
    rowElement.innerHTML = `
        <div class="prooduct-details-box">                                 
            <div class="skeleton loading-cursor d-flex"><img class="align-self-center img-fluid img-60" src="assets/img/logo/favicon.png" alt="Payuee e-Shop">
            <div class="loading-cursor flex-grow-1 ms-3">
                <div class="skeleton loading-cursor product-name">
                <h6><a href="#">Loading...</a></h6>
                </div>
                <div class="skeleton loading-cursor rating">Payuee e-Shop</div>
                <div class="skeleton loading-cursor price d-flex"> 
                <div class="skeleton loading-cursor text-muted me-2">Price</div>: Loading...
                </div>
                <div class="skeleton loading-cursor avaiabilty">
                <div class="skeleton loading-cursor text-success">Loading...</div>
                </div><a class="skeleton loading-cursor btn btn-primary btn-xs" href="#">Loading...</a><i class="close" data-feather="x"></i>
            </div>
            </div>
        </div>
    `;

    // Append the new element to the container
    productBody.appendChild(rowElement);
}

function formatNumberToNaira(number) {
    let formattedNumber;

    if (number > 999999999) {
        // Format for billions (e.g., 1,500,000,000 -> 1.5b)
        formattedNumber = (number % 1e9 === 0) ? (number / 1e9) + 'b' : (number / 1e9).toFixed(1) + 'b';
    } else if (number > 999999) {
        // Format for millions (e.g., 2,300,000 -> 2.3m)
        formattedNumber = (number % 1e6 === 0) ? (number / 1e6) + 'm' : (number / 1e6).toFixed(1) + 'm';
    } else if (number > 99999) {
        // Format for thousands (e.g., 150,000 -> 150k)
        formattedNumber = (number % 1e3 === 0) ? (number / 1e3) + 'k' : (number / 1e3).toFixed(1) + 'k';
    } else {
        // If it's 99,999 or less, display as is
        formattedNumber = new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(number);
    }

    return formattedNumber;
}
