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
    const apiUrl = "https://api.payuee.com/vendor/products/" + pageNumber;

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
            // If there are no products, show a message to encourage the user to post a product
        if (Array.isArray(responseData.success) && responseData.success.length === 0) {
            console.log("array empty");
            const productBody = document.getElementById('order-grid');
    
            // Clear the existing content
            productBody.innerHTML = '';
            const noProductsMessage = document.createElement('div');
            noProductsMessage.classList.add('no-products-message');
            noProductsMessage.innerHTML = `
                <img src="customize-store.png" alt="Welcome to Your Store" style="width: 100%; max-width: 300px; margin-bottom: 20px;">
                <h5>No products available yet.</h5>
                <p>It looks like you haven't listed any products in your store. To get started, let's post your first product!</p>
                <a href="add-product.html" class="btn btn-primary">Post Your First Product</a>
            `;
            productBody.appendChild(noProductsMessage);
        } else {
            console.log("array not empty");
            responseData.success.forEach((product) => {
                product.product_review_count = 6500;
                renderProducts(product,);
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
        nextPageButtonI.href = `https://payuee.com/e-shop/vendor/edit-products?page=${CurrentPageOnLoad+1}`;
        let previousPageButtonI = document.getElementById('previousPage');
        previousPageButtonI.href = `https://payuee.com/e-shop/vendor/edit-products?page=${CurrentPageOnLoad-1}`;

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

    let OrderCost;

    if (product.selling_price < product.initial_cost) {
        OrderCost = product.selling_price;
    } else {
        OrderCost = product.initial_cost;
    }

    let url = ""
    if (product.category == "outfits") {
        url = "https://payuee.com/outfits/" + product.product_url_id;
    } else if (product.category == "jewelry") {
        url = "https://payuee.com/jewelry/" + product.product_url_id;
    } else if (product.category == "kids-accessories") {
        url = "https://payuee.com/kids/" + product.product_url_id;
    } else if (product.category == "cars-car-parts") {
        url = "https://payuee.com/cars/" + product.product_url_id;
    } else if (product.category == "tools") {
        url = "https://payuee.com/tools/" + product.product_url_id;
    } else if (product.category == "gadgets") {
        url = "https://payuee.com/gadgets/" + product.product_url_id;
    } else if (product.category == "others") {
        url = "https://payuee.com/outfits/" + product.product_url_id;
    }

    // Create the HTML string with dynamic data using template literals
    rowElement.innerHTML = `
        <div class="prooduct-details-box">                                 
            <div class="d-flex"><img class="align-self-center img-fluid img-60" src="${"https://payuee.com/image/"+product.product_image[0].url}" alt="${product.title}">
            <div class="flex-grow-1 ms-3">
                <div class="product-name">
                <h6><a href="${url}">${product.title}</a></h6>
                </div>
                <div class="rating">${product.publish_status}</div>
                <div class="price d-flex"> 
                <div class="text-muted me-2">Price</div>: ${formatNumberToNaira(+OrderCost)}
                </div>
                <div class="avaiabilty">
                <div class="text-success text-success2">Edit</div>
                </div><a class="btn delete-button btn-danger btn-xs" href="">Delete</a><i class="close" data-feather="x"></i>
            </div>
            </div>
        </div>
    `;

    // Append the new element to the container
    productBody.appendChild(rowElement);

    // Add event listener to the "Edit" button
    const editButton = rowElement.querySelector('.text-success2');
    editButton.addEventListener('click', function() {
        // Your edit logic here
        // console.log('Edit button clicked for product ID:', product.ID);
        if (!product.reposted) {
            window.location.href = 'edit-product-details.html?ProductID=' + product.ID;
        } else {    
            window.location.href = `https://payuee.com/e-shop/vendor/product-collaboration?ProductID=${product.ID}&edit=true`;
        }
    });

    // Add event listener to the "Delete" button
    const deleteButton = rowElement.querySelector('.delete-button');
    deleteButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default action of the button
        // Your delete logic here
        // console.log('Delete button clicked for product ID:', product.ID);21
        swal({
            title: "Are you sure you want to delete "+"'"+product.title+"'",
            icon: "warning",
            buttons: {
                cancel: true,
                confirm: true,
            },
        }).then(async (result) => {
            if (result) {
                 // Let's make a product delete request
                 await deleteProduct(product.ID);
                // Perform actions when confirmed
                swal("'"+product.title+"'"+" Successfully Deleted", {
                    icon: "success",
                    buttons: {
                        confirm: true,
                    },
                  }).then(() => {
                   
                  });
                rowElement.remove(); // Remove the product card from the DOM
            } else {
                // Perform actions when canceled
            }
        });
    });
}

function updateLink(urlIdToUpdate, pageNumber) {
    urlIdToUpdate.href = `https://payuee.com/e-shop/vendor/edit-products?page=${pageNumber}`;
}

async function deleteProduct(productID) {
    const apiUrl = "https://api.payuee.com/vendor/delete-vendor-product/" + productID;
  
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
        
       
  } finally {
  
    }
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
                <div class="skeleton loading-cursor">Loading...</div>
                </div><a class="skeleton loading-cursor btn btn-success btn-xs">Loading...</a><i class="close" data-feather="x"></i>
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