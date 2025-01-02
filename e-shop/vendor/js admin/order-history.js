var NextPageOnLoad;
var PreviousPageOnLoad;
var CurrentPageOnLoad;
var TotalPageOnLoad;
var TwoBeforePageOnLoad;
var TwoAfterPageOnLoad;
var ThreeAfterPageOnLoad;
var AllRecordsOnPageLoad;

// Initialize loader array with 8 elements (e.g., with null values)
const loader = Array.from({ length: 12 }, (_, i) => i);

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
    const apiUrl = "https://api.payuee.com/vendor/get-orders/" + pageNumber;

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
            // Clear existing content if needed or check if empty
        if (Array.isArray(responseData.success) && responseData.success.length === 0) {
            console.log("array empty");
            renderEmptyOrderHistory();
            // return;
        } else {
            console.log("array not empty");
            responseData.success.forEach((product) => {
                // product.product_review_count = 6500;
                renderProducts(product);
            });
        }
        
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
        nextPageButtonI.href = `https://payuee.com/e-shop/vendor/order-history?page=${CurrentPageOnLoad+1}`;
        let previousPageButtonI = document.getElementById('previousPage');
        previousPageButtonI.href = `https://payuee.com/e-shop/vendor/order-history?page=${CurrentPageOnLoad-1}`;

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

// Function to generate product status HTML based on the order status
function getProductStatus(product) {
    let productStatus = "";
    
    if (product.order_status === "cancelled") {
        productStatus = `
        <a class="btn btn-danger btn-xs" href="order-history-details.html?OrderId=${product.ID}">Cancelled</a><i class="close" data-feather="x"></i>
        `;
    } else if (product.order_status === "shipped") {
        productStatus = `
        <a class="btn btn-success btn-xs" href="order-history-details.html?OrderId=${product.ID}">Shipped</a><i class="close" data-feather="x"></i>
        `;
    } else {
        productStatus = `
        <a class="btn btn-primary btn-xs" href="order-history-details.html?OrderId=${product.ID}">Processing</a><i class="close" data-feather="x"></i>
        `;
    }
    return productStatus;
}

function renderEmptyOrderHistory() {
    const productBody = document.getElementById('order-grid');
    
    // Clear the existing content
    productBody.innerHTML = '';

    // Create a message element for the empty state
    const emptyMessage = document.createElement('div');
    emptyMessage.classList.add('empty-order-message');
    emptyMessage.innerHTML = `
        <img src="shipping.png" alt="Welcome to Your Store" style="width: 100%; max-width: 300px; margin-bottom: 20px;">
        <h5>Your store is waiting for its first order!</h5>
        <p>Why not refer buyers to your store and let them discover your amazing products?</p>
        <p>Invite buyers to visit your store and place their first order today!</p>
        <button id="shareStoreButton" class="btn btn-primary">Share Your Store</button>
    `;

    // Append the message to the container
    productBody.appendChild(emptyMessage);

    // Add event listener for the share button
    const shareButton = document.getElementById('shareStoreButton');
    shareButton.addEventListener('click', function () {
        const userShopUrl = "https://payuee.com/e-shop/vendor/your-shop"; // Replace with dynamic URL for user's shop
        const shareContent = `
            Check out my Payuee shop! Discover amazing products and place your orders here: ${userShopUrl}
        `;

        if (navigator.share) {
            // Use Web Share API if available
            navigator.share({
                title: 'Check Out My Payuee Shop!',
                text: shareContent,
                url: userShopUrl,
            }).catch((error) => console.error('Error sharing:', error));
        } else {
            // Fallback for browsers without Web Share API
            alert(`Share this link with your friends: ${userShopUrl}`);
        }
    });
}

function renderProducts(product) {
    const productBody = document.getElementById('order-grid');

    // Create a new product card element
    const rowElement = document.createElement('div');
    rowElement.classList.add('col-xxl-4', 'col-md-6');
    rowElement.id = product.ID; // Set the ID of the row

    const productStatus = getProductStatus(product);

    // let redirectUrl = `order-history-details.html?OrderId=${product.ID}`;

    // if (product.reposted) {
    //     redirectUrl = `repost-order-history-details.html?OrderId=${product.original_eshop_user_id}`;
    // }

    let orderType = "";
    if (product.reposted) {
        orderType = `Reposted`;
    }else {
        orderType = `Original`;
    }

    // Create the HTML string with dynamic data using template literals
    rowElement.innerHTML = `
        <div class="prooduct-details-box">                                 
            <div class="d-flex"><img class="align-self-center img-fluid img-60" src="${"https://payuee.com/image/"+product.product_orders[0].first_image_url}" alt="${product.product_orders[0].title}" onerror="this.src='https://via.placeholder.com/60';">
            <div class="flex-grow-1 ms-3">
                <div class="product-name">
                <h6><a href="order-history-details.html?OrderId=${product.ID}">${product.product_orders[0].title}...</a></h6>
                </div>
                <div class="rating">${product.customer_fname+" "+product.customer_user_sname}</div>
                <div class="price d-flex"> 
                <div class="text-muted me-2">Price</div>: ${formatNumberToNaira(product.order_cost)}
                </div>
                <div class="avaiabilty">
                <div class="text-success">${orderType}</div>
                </div>${productStatus}
            </div>
            </div>
        </div>
    `;

    // Append the new element to the container
    productBody.appendChild(rowElement);

    // Add event listener to the image wrapper
    const imgWrapper = rowElement.querySelector('.align-self-center');
    imgWrapper.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = `https://payuee.com/e-shop/vendor/order-history/${product.product_url_id}`;
    });

    // Add event listener to the 'Add To Cart' button
    // if (!isOutOfStock) {
    //     const addToCartButton = rowElement.querySelector('.pc__atc');
    //     addToCartButton.addEventListener('click', function() {
    //         addToCart(product);
    //         updateCartNumber();
    //         updateCartDrawer();
    //     });
    // }
}

function updateLink(urlIdToUpdate, pageNumber) {
    urlIdToUpdate.href = `https://payuee.com/e-shop/vendor/order-history?page=${pageNumber}`;
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
            <div class="skeleton loading-cursor d-flex"><img class="align-self-center img-fluid img-60" src="images/logo/logo.png" alt="Payuee e-Shop">
            <div class="skeleton loading-cursor flex-grow-1 ms-3">
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
    if (number >= 1_000_000_000) {
        formattedNumber = `₦${(number / 1_000_000_000).toFixed(1).replace('.0', '')}B`;
    } else if (number >= 1_000_000) {
        formattedNumber = `₦${(number / 1_000_000).toFixed(1).replace('.0', '')}M`;
    } else if (number >= 1_000) {
        formattedNumber = `₦${(number / 1_000).toFixed(1).replace('.0', '')}K`;
    } else {
        formattedNumber = `₦${number.toFixed(0)}`;
    }
    return formattedNumber;
}

