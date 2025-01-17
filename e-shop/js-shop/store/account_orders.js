var NextPageOnLoad;
var PreviousPageOnLoad;
var CurrentPageOnLoad;
var TotalPageOnLoad;
var TwoBeforePageOnLoad;
var TwoAfterPageOnLoad;
var ThreeAfterPageOnLoad;
var AllRecordsOnPageLoad;
var ratingAmount = 0;

let productCode;

let pageNumber;

// Emoji
(function () {
    document.querySelectorAll(".feedback li").forEach((entry) =>
      entry.addEventListener("click", (e) => {
        e.preventDefault();
        
        // Remove the active class from the currently active element
        const activeElement = document.querySelector(".feedback li.active");
        if (activeElement) {
          activeElement.classList.remove("active");
        }
  
        // Add the active class to the clicked element
        entry.classList.add("active");
  
        // Get the rating value from the clicked element
        const rating = entry.getAttribute("data-rating");
        ratingAmount = +rating;
        // console.log("Selected rating:", ratingAmount); // Output the rating (1-5)
      })
    );
  })();  

  document.addEventListener('DOMContentLoaded', async function () {
    // Call the loading function to render the skeleton loaders
    loading();
    // showToast("hi i'm a skeleton loader");
    // showModal("transactionSuccessModal");
    // Get the current URL
    const currentUrl = new URL(window.location.href);
    // Assuming you have a reference to the table body element

    // Extract parameters using URLSearchParams
    const params = new URLSearchParams(currentUrl.search);

    // Get individual parameter values
    pageNumber = params.get("page");
    if (pageNumber == null) {
        pageNumber = "1";
    }

    await getProducts(pageNumber);

    // Add event listener to the link
    document.getElementById('forgotTransactionPinLink').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default link behavior

        // Store the current page URL in local storage
        const currentUrl = window.location.href;
        localStorage.setItem('redirectTo', currentUrl);

        // Redirect to the reset transaction PIN page
        window.location.href = 'https://payuee.com/e-shop/v/reset_trans_pin';
    });
});

function clearElementsByClass() {
    // Get the parent container
    let container = document.getElementById('order-gridd');
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
        nextPageButtonI.href = `https://payuee.com/e-shop/account_orders?page=${CurrentPageOnLoad+1}`;
        let previousPageButtonI = document.getElementById('previousPage');
        previousPageButtonI.href = `https://payuee.com/e-shop/account_orders?page=${CurrentPageOnLoad-1}`;

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
} finally {

    }
}

document.getElementById("closePaymentModal").addEventListener("click", function (event) {
    event.preventDefault();
    hideModal('checkoutModal');
    html5QrcodeScanner.clear();
});

function renderProducts(product) {
    const productBody = document.getElementById('order-gridd');

    // Create a new product card element
    const rowElement = document.createElement('tr');
    // rowElement.classList.add('col-xxl-4', 'col-md-6');
    rowElement.id = product.ID; // Set the ID of the row

    let productStatus;
    let productIssue;

    if (product.order_status === "cancelled") {
        productStatus = `
        <button class="btn btn-danger"  id="status${product.ID}">CANCELLED</button>
        `
    } else if (product.order_status === "shipped") {
        productStatus = `
        <button class="btn btn-success"  id="status${product.ID}">SHIPPED</button>
        `
    } else {
        productStatus = `
        <button class="btn btn-primary"  id="status${product.ID}">PROCESSING</button>
        `
    }

    if (product.order_status === "processing") {
        productIssue = `
        <button id="text-danger${product.ID}" class="btn btn-danger"><a href="#">CANCEL</a></button>
        `
    } else if (product.order_status === "shipped" || product.order_status === "cancelled") {
        productIssue = `
        <button id="report-danger${product.ID}" class="btn btn-danger"><a href="#">REPORT</a></button>
        `
    }

    // Create the HTML string with dynamic data using template literals
    rowElement.innerHTML = `
    <td>#${product.ID}</td>
    <td>
        <img 
        id="image${product.ID}" 
        class="align-self-center img-fluid img-60" 
        src="https://payuee.com/image/${product.product_orders[0].first_image_url}" 
        alt="${product.title}" 
        onerror="this.onerror=null; this.src='../../e-shop/images/default_img.png';">
    </td>
    <td id="title${product.ID}"><h6><a href="#" id="${product.ID}">${product.product_orders[0].title}</a></h6></td>
    <td>${formatNumberToNaira(product.order_cost)}</td>
    <td>${productIssue}</td>
    <td>${productStatus}</td>
`;


    // Append the new element to the container
    productBody.appendChild(rowElement);

    if (product.order_status === "processing") {
        // Adding event listeners for product actions
        ['image', 'title', 'status'].forEach(function (prefix) {
            document.getElementById(`${prefix}${product.ID}`).addEventListener('click', function(event) {
                event.preventDefault();
                if (product.scanned_qr_code) {
                    reader.classList.add('hidden');
                    verificationStatus.classList.remove('hidden');
                    verificationStatus.style.color = 'green';
                    verificationStatus.textContent = "successfully updated order scanned status";
                
                    // Show transaction and payment sections
                    document.getElementById('transactionCodeSection').classList.remove('hidden');
                    document.getElementById('paymentButtonDiv').classList.remove('hidden');
                    document.getElementById('qrCodeDiv').classList.add('hidden');
                }
                getProductId(product.ID);
                startProductScan(product.ID);
                const transactionCodeInput = document.getElementById('transactionPinInput');
                // Restrict input to numeric values only and show error if non-numeric characters are entered
                transactionCodeInput.addEventListener('input', function () {
                    const nonNumericChars = /\D/g;
                    if (nonNumericChars.test(this.value)) {
                        // Show error message if non-numeric characters are found
                        showToast("Only numbers are allowed");
                    }
                    // Remove any non-digit characters from the input value
                    this.value = this.value.replace(nonNumericChars, '');
                });
                handleModalShow(product, 'checkoutModal');
            });
        });
    }

    if (product.order_status === "processing") {
        // Special handling for cancel transaction button
        document.getElementById(`text-danger${product.ID}`).addEventListener('click', function(event) {
            event.preventDefault();

            // Logic for checking cancellation eligibility
            const orderCreatedAt = new Date(`${product.CreatedAt}`);
            const expectedDeliveryAt = new Date(`${product.delivery_time}`);
            const cancellationStatus = document.getElementById('cancellationStatus');
            const cancelButton = document.getElementById('cancelButton');
            const reportIssueButton = document.getElementById('reportIssueButton');
            const transactionPinToCancelTrn = document.getElementById('transactionPinToCancelTrn');

            const totalTime = expectedDeliveryAt - orderCreatedAt;
            const thresholdTime = totalTime * 0.30;
            const currentTime = new Date();
            document.getElementById('cancelationOrderId').textContent = `(${product.ID})`;

            if (currentTime - orderCreatedAt <= thresholdTime) {
                cancellationStatus.innerText = 'You are eligible to cancel this order.';
                cancellationStatus.style.color = 'green';
                cancelButton.classList.remove('disabled');
                reportIssueButton.classList.add('disabled');
                transactionPinToCancelTrn.classList.remove('disabled');
            } else {
                cancellationStatus.innerText = 'You are no longer eligible to cancel this order.';
                cancellationStatus.style.color = 'red';
                cancelButton.classList.add('disabled');
                reportIssueButton.classList.remove('disabled');
                transactionPinToCancelTrn.classList.add('disabled');
            }

            function handleReportIssue(event) {
                event.preventDefault();
                const issue = document.getElementById(`reportIssueInput3`);
                if (issue.value === undefined || issue.value === "") {
                    showToast("please enter an issue to report");
                    return;
                }
            
                const apiUrl = "https://api.payuee.com/report-vendor-order";
                const requestBody = {
                    order_id: +product.ID,
                    report_note: String(issue.value),
                };
            
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include',
                    body: JSON.stringify(requestBody),
                };
            
                fetch(apiUrl, requestOptions)
                    .then(async response => {
                        if (!response.ok) {
                            const errorData = await response.json();
                            showModal('disputeFailedModal');
            
                            if (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                                logout();
                            }
                            return;
                        }
                        const responseData = await response.json();
                        showModal('disputeSuccessfulSubmission');
                    })
                    .finally(() => {
                        // Remove the event listener after it's done
                        document.getElementById(`reportIssueButton`).removeEventListener('click', handleReportIssue);
                    });
            }
            
            function handleCancelOrder(event) {
                event.preventDefault();
                const pin = document.getElementById(`transactionPinInput2`);
                const issue = document.getElementById(`reportIssueInput3`);
            
                if (pin.value === undefined || pin.value === "") {
                    showToast("please enter your pin to continue");
                    return;
                }
                if (issue.value === undefined || issue.value === "") {
                    showToast("please enter order issue to continue");
                    return;
                }
            
                const apiUrl = "https://api.payuee.com/cancel-vendor-order";
                const requestBody = {
                    order_id: +product.ID,
                    trans_code: String(pin.value),
                    report_note: String(issue.value),
                };
            
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include',
                    body: JSON.stringify(requestBody),
                };
            
                fetch(apiUrl, requestOptions)
                    .then(async response => {
                        if (!response.ok) {
                            const errorData = await response.json();

                            if (errorData.error === 'wrong transaction code') {
                                // 
                                hideModal('transactionModal');
                                showModal('wrongPinModal');
                                return;
                            }
                            if (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                                logout();
                            }
                            hideModal('transactionModal');
                            showModal('disputeFailedModal');
                            return;
                        }
            
                        const responseData = await response.json();
                        loading();
                        hideModal('transactionModal');
                        showModal('orderdisputeSuccessfulCancellation');
                        getProducts(pageNumber);  // Fetch the products after successful submission
                    })
                    .finally(() => {
                        // Remove the event listener after it's done
                        document.getElementById(`cancelButton`).removeEventListener('click', handleCancelOrder);
                    });
            }

            // Attach event listeners
            document.getElementById(`reportIssueButton`).addEventListener('click', handleReportIssue);
            document.getElementById(`cancelButton`).addEventListener('click', handleCancelOrder);

            // Show the transaction modal
            showModal('transactionModal');
        });
    }

    if (product.order_status === "shipped" || product.order_status === "cancelled") {   
        // Special handling for cancel transaction button
        document.getElementById(`report-danger${product.ID}`).addEventListener('click', function(event) {
            event.preventDefault();

            // Show the transaction modal
            showModal('transactionDisputeModal');

            // Define a function for the report issue button
            function handleReportIssue(event) {
                event.preventDefault();
                const issue = document.getElementById(`reportIssueInput`);
                if (issue.value == undefined || issue.value == "") {
                    showToast("Please enter an issue to report");
                    return;
                }

                const apiUrl = "https://api.payuee.com/report-vendor-order";
                // Construct the request body
                const requestBody = {
                    order_id: +product.ID,  // Convert to number (if it's an integer)
                    report_note: String(issue.value),
                };

                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include', // set credentials to include cookies
                    body: JSON.stringify(requestBody)
                };

                // Fetch API for reporting the issue
                fetch(apiUrl, requestOptions)
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(errorData => {
                                hideModal('transactionDisputeModal');
                                showModal('disputeFailedModal');

                                if (errorData.error === 'failed to get user from request' || errorData.error === 'failed to get transaction history' || errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                                    logout();  // Log the user out if their session has expired
                                }

                                throw new Error('Error processing the report');
                            });
                        }
                        return response.json();
                    })
                    .then(responseData => {
                        loading();
                        hideModal('transactionDisputeModal');
                        showModal('disputeSuccessfulSubmission');
                        return getProducts(pageNumber);  // Fetch the products after successful submission
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    })
                    .finally(() => {
                        // Remove the event listener after the operation is complete
                        document.getElementById(`reportIssueButton2`).removeEventListener('click', handleReportIssue);
                    });
            }

            // Add event listener for the report issue button
            const reportIssueButton = document.getElementById(`reportIssueButton2`);
            reportIssueButton.addEventListener('click', handleReportIssue);
        });
    }

}

// Function to handle rendering products and showing modals
function handleModalShow(product, modalID) {

    // Render the ordered products
    renderOrderedProducts(product);

    // Show the specified modal programmatically
    const modalElement = document.getElementById(modalID);
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
}

// Function to handle rendering products and showing modals
function showModal(modalID) {

    // Show the specified modal programmatically
    const modalElement = document.getElementById(modalID);
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
}

// Function to hide the modal programmatically
function hideModal(modalID) {
    const modalElement = document.getElementById(modalID);
    const modalInstance = bootstrap.Modal.getInstance(modalElement); // Retrieve the existing modal instance
    if (modalInstance) {
        modalInstance.hide(); // Hide the modal
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

    document.getElementById('paymentOrderId').textContent = `(${products.ID})`;
  
    // Update the order summary totals
    document.getElementById('cartSubTotalPopUp').textContent = `₦${products.order_sub_total_cost.toLocaleString()}`;
  
    // Assuming you have a fixed shipping cost or can calculate it elsewhere
    document.getElementById('shippingSubTotalPopUp').textContent = `₦${products.shipping_cost.toLocaleString()}`;
    
    document.getElementById('cartShippingTotalPopUp').textContent = `₦${products.order_cost.toLocaleString()}`;

    document.getElementById('paymentButton').textContent = `Pay ₦${products.order_cost.toLocaleString()}`;

    document.getElementById(`paymentButton`).addEventListener('click', async function(event) {
        event.preventDefault();
        const transactionPinInput = document.getElementById('transactionPinInput').value;
        // const paymentButton = document.getElementById('paymentButton').value;

                // All fields are valid, proceed with posting the product
        const apiUrl = "https://api.payuee.com/verify-user-order";
        // Construct the request body
        const requestBody = {
            order_id: +products.ID,  // Convert to number (if it's an integer)
            trans_code: String(transactionPinInput),
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
                hideModal('checkoutModal')
                showModal('transactionFailedModal');

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
            loading();
            hideModal('checkoutModal');
            showModal('transactionSuccessModal');
            await getProducts(pageNumber);
            return;

            } finally {

            }

        
    })
}
  
function updateLink(urlIdToUpdate, pageNumber) {
    urlIdToUpdate.href = `https://payuee.com/e-shop/account_orders?page=${pageNumber}`;
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
const loader = Array.from({ length: 5 }, (_, i) => i);

function loading() {
    // Render loading skeletons for each element in the loader array
    const productBody = document.getElementById('order-gridd');
    productBody.innerHTML = '';
    loader.forEach(() => {
        renderLoading();
    });
}

function renderLoading() {
    // Assuming you have a reference to the container element
    const productBody = document.getElementById('order-gridd');

    // Create a new element for the skeleton loader
    const rowElement = document.createElement('tr');
    // rowElement.classList.add('col-xxl-4', 'col-md-6');

    // Create the HTML string with dynamic data using template literals
    rowElement.innerHTML = `
        <td>#000</td>
        <td><img id="image" class="align-self-center img-fluid img-60" src="images/favicon2.png" alt="Payuee e-Shop"></td>
        <td id="title"><h6><a href="#">Loading...</a></h6></td>
        <td>Loading...</td>
        <td>Loading...</td>
        <td>Loading...</td>
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

function showToast(message, duration = 5000) {
    // Get the toast elements
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const closeToastBtn = document.getElementById('close-toast');

    // Set the message
    toastMessage.textContent = message;

    // Show the toast
    toast.classList.add('show');

    // Add click event to close button
    closeToastBtn.removeEventListener('click', hideToast); // Remove existing listener
    closeToastBtn.addEventListener('click', hideToast);

    // Hide the toast after the duration
    setTimeout(() => {
        hideToast();
    }, duration);
}

// Hide toast function
function hideToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('show');
}

let isScanning = false; // Flag to prevent multiple scans

// Function called when a QR code is successfully scanned
async function onScanSuccess(decodedText, decodedResult) {
    // Prevent multiple scans if one is already in progress
    if (isScanning) return;
    isScanning = true; // Set flag to indicate scanning is in progress

    await scannedQrCodeVerification(decodedText);

    html5QrcodeScanner.clear().then(() => {
        isScanning = false; // Reset flag after stopping scanner
        // console.log("Scanner stopped.");
    }).catch((error) => {
        console.error("Error stopping scanner:", error);
        isScanning = false; // Reset flag in case of error
    });
}
  
  // Function called when there's a scanning error (e.g., QR code not found)
  function onScanFailure(error) {
    console.warn(`QR Code scan error: ${error}`);
  }
  
  // Initialize the QR Code scanner, but don't start immediately
  const html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", 
    {
      fps: 10,            // Frames per second for scanning
      qrbox: { width: 250, height: 250 } // Define scan area size
    }
  );
  
//   let productCode;

  function getProductId(id) {
    productCode = id;
    document.getElementById("startScan").addEventListener("click", () => {
        startProductScan(id);
    });
  }
  
  async function scannedQrCodeVerification(code) {
    const apiUrl = "https://api.payuee.com/scan-user-order";
    const requestBody = { order_id: +code };
  
    if (+code !== +productCode) {
        reader.classList.add('hidden');
        verificationStatus.classList.remove('hidden');
        verificationStatus.style.color = 'red';
        verificationStatus.textContent = "Wrong QR Code Scanned";
        return;
      }
      
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(requestBody)
    };
  
    try {
      const response = await fetch(apiUrl, requestOptions);
  
      const reader = document.getElementById('reader');
      const verificationStatus = document.getElementById('verificationStatus');
  
      if (!response.ok) {
        const errorData = await response.json();
        reader.classList.add('hidden');
        verificationStatus.classList.remove('hidden');
        verificationStatus.style.color = 'red';
        verificationStatus.textContent = errorData.error || "An unknown error occurred";
  
        if (errorData.error === 'failed to get user from request' || errorData.error === 'failed to get transaction history') {
          // handle specific error cases if needed
        } else if (["No Authentication cookie found", "Unauthorized attempt! JWT's not valid!", "No Refresh cookie found"].includes(errorData.error)) {
          logout(); // Assume logout() function exists
        }
        return;
      }
  
      const responseData = await response.json();
      reader.classList.add('hidden');
      verificationStatus.classList.remove('hidden');
      verificationStatus.style.color = 'green';
      verificationStatus.textContent = responseData.success;
  
      // Show transaction and payment sections
      document.getElementById('transactionCodeSection').classList.remove('hidden');
      document.getElementById('paymentButtonDiv').classList.remove('hidden');
      document.getElementById('qrCodeDiv').classList.add('hidden');
    } finally {
      productCode = ""; // Reset code after verification
    }
  }
  
  function startProductScan(id) {
    productCode = id;
    const verificationStatus = document.getElementById('verificationStatus');
      const reader = document.getElementById('reader');
      verificationStatus.classList.add('hidden');
      reader.classList.remove('hidden');
  
      // Start the QR scanner
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          html5QrcodeScanner.render(onScanSuccess, onScanFailure); // Make sure html5QrcodeScanner is initialized
        })
        .catch((error) => {
            showToast("Camera access denied or unavailable");
            // console.error("Camera access denied or unavailable:", error);
        });
  }
