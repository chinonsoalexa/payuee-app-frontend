// Initialize loader array with 8 elements (e.g., with null values)
const loader = Array.from({ length: 4 }, (_, i) => i);

document.addEventListener('DOMContentLoaded', async function () {
    // Call the loading function to render the skeleton loaders
    loading();

    // Get the current URL
    const currentUrl = new URL(window.location.href);
    // Assuming you have a reference to the table body element

    // Extract parameters using URLSearchParams
    const params = new URLSearchParams(currentUrl.search);

    // Get individual parameter values
    let OrderId = params.get("OrderId");
    if (OrderId == null) {
        OrderId = "1";
    }

    await getProducts(OrderId);

});

function clearElementsByClass(className) {
    // Get the parent container
    const container = document.getElementById('order-grid');
    
    // Select all child elements with the specified class
    const elementsToClear = container.querySelectorAll(`.${className}`);
    
    // Remove each element from the container
    elementsToClear.forEach(element => element.remove());
}

async function getProducts(OrderId) {
    const apiUrl = `https://api.payuee.com/vendor/get-vendors-order/${OrderId}`;

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

        // updateProductsFromData(responseData.success);
        // Clear specific elements by class name before updating
        clearElementsByClass("loading-class-remover");
        responseData.success.product_orders.forEach((product) => {
            product.product_review_count = 6500;
            renderProducts(product);
        });
        // Update the content of each element by its ID
        document.getElementById("order-id").textContent = responseData.success.ID;
        // Convert to a Date object
        
        const date = new Date(responseData.success.CreatedAt);

        // Extract the date components
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getUTCDate()).padStart(2, '0');

        // Extract the time components
        let hours = date.getUTCHours();
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');

        // Determine AM/PM
        const period = hours >= 12 ? 'PM' : 'AM';

        // Convert hours to 12-hour format
        hours = hours % 12 || 12; // Converts 0 (midnight) to 12

        // Combine into the desired format with AM/PM
        const formattedDate = `Date: ${day}-${month}-${year} Time: ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${period} UTC`;
        document.getElementById("order-date").textContent = formattedDate;
        document.getElementById("customer-name").textContent = responseData.success.customer_fname + " " + responseData.success.customer_user_sname;
        document.getElementById("company-name").textContent = responseData.success.customer_company_name;
        document.getElementById("customer-state").textContent = responseData.success.customer_state;
        document.getElementById("customer-city").textContent = responseData.success.customer_city;
        document.getElementById("street-address-1").textContent = responseData.success.customer_street_address_1;
        document.getElementById("street-address-2").textContent = responseData.success.customer_street_address_2;
        document.getElementById("postcode").textContent = responseData.success.customer_zip_code;
        document.getElementById("province").textContent = responseData.success.customer_province;
        document.getElementById("phone-number").textContent = responseData.success.customer_phone_number;
        document.getElementById("email-address").textContent = responseData.success.customer_email;
        document.getElementById("order-note").textContent = responseData.success.order_note;
        document.getElementById("order-cost").textContent = formatNumberToNaira(responseData.success.order_cost);
        if (!responseData.success.qr_code_image) {
            document.getElementById('qrCodeSection').style.display = 'none'; // Hides the <tr> element
        } else {
            document.getElementById('qrCodeSection').style.display = 'block'; // Hides the <tr> element
            document.getElementById('qr-code-image').src = "https://payuee.com/image/" +responseData.success.qr_code_image;
        }

        let orderStatusId = document.getElementById('orderStatusId');

        let content = '';
        
        switch(responseData.success.order_status) {
            case 'shipped':
                content = `
                    <td class="text-end" colspan="5"></td>
                    <td><a class="deactivated btn btn-success cart-btn-transform" href="#">Shipped</a></td>
                `;
                break;
            case 'cancelled':
                // content = `
                //     <td class="text-end" colspan="5"><a class="deactivated btn btn-secondary cart-btn-transform" href="#">Cancelled</a></td>
                //     <td><a class="btn btn-success cart-btn-transform" href="#">Ship</a></td>
                // `;
                content = `
                    <td class="text-end" colspan="5"><a class="deactivated btn btn-secondary cart-btn-transform" href="#">Cancelled</a></td>
                `;
                break;
            default:
                content = `
                    <td class="text-end" colspan="5"><a class="btn btn-secondary cart-btn-transform" href="#">Cancel</a></td>
                    <td><a class="btn btn-success cart-btn-transform" href="#">Assign Shipping</a></td>
                `;
                break;
        }
        
        orderStatusId.innerHTML = content;        

        // Attach event listeners to buttons without the 'deactivated' class
        let buttons = orderStatusId.querySelectorAll('a:not(.deactivated)');

        buttons.forEach(button => {
            button.addEventListener('click', async function(event) {
                event.preventDefault();
                
                if (this.textContent === "Assign Shipping") {
                    // Perform the action for 'Assign Shipping' button
                    // updateOrderStatus(responseData.success.ID, 'shipped');
                    console.log("testing shipping assignment");
                } else if (this.textContent === "Cancel") {
                    // Perform the action for 'Cancel' button
                    updateOrderStatus(responseData.success.ID, 'cancelled');
                }
            });
        });
} finally {

    }
}

// Add download functionality to the button
document.getElementById('download-qr-code').addEventListener('click', function() {
    const qrCodeUrl = document.getElementById('qr-code-image').src;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'payuee_qr_code.png';
    link.click();
  });

function renderProducts(product) {
    const productBody = document.getElementById('order-grid');

    // Create a new product card element
    const rowElement = document.createElement('tr');
    rowElement.id = product.ID; // Set the ID of the row

    let price = 0;
    if (!product.reposted) {
        price = product.order_cost;
    } else {
        price = product.reposted_selling_price;
    }
    let size = "";
    if (product.outfit_size) {
        document.getElementById('outfitSize').style.display = 'block'; // Hides the <tr> element
        size = `
        <td>${product.outfit_size}</td>
        `
    }
    // Create the HTML string with dynamic data using template literals
    rowElement.innerHTML = `
        <td><img class="img-fluid img-40" src="${"https://payuee.com/image/"+product.first_image_url}" alt="${product.title}"></td>
        <td>
        <div class="product-name"><a href="https://payuee.com/shop/${product.product_url_id}">${product.title}</a></div>
        </td>
        <td>${formatNumberToNaira(price)}</td>
        <td>
        ${product.quantity}
        </td>
        <td>${product.net_weight}g</td>
        ${size}
        <td>${formatNumberToNaira(price * product.quantity)}</td>
    `;
    // Append the new element to the container
    productBody.appendChild(rowElement);

}

async function updateOrderStatus(orderID, orderStatus) {
    const apiUrl = "https://api.payuee.com/update-vendor-status";

    // Construct the request body
    const requestBody = {
        orderID: orderID,
        status: orderStatus,
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
        let container = document.getElementById('order-grid');
        container.innerHTML = '';
        await getProducts(orderID);
} finally {

    }
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
    const rowElement = document.createElement('tr');
    rowElement.classList.add('loading-class-remover');

    // Create the HTML string with dynamic data using template literals
    rowElement.innerHTML = `
        <td><img class="skeleton loading-cursor img-fluid img-40" src="images/logo/logo.png" alt="Payuee e-Shop"></td>
        <td>
        <div class="skeleton loading-cursor product-name"><a href="#">Loading...</a></div>
        </td>
        <td class="skeleton loading-cursor">Loading...</td>
        <td class="skeleton loading-cursor">
        Loading...
        </td>
        <td>Loading...</td>
        <td class="skeleton loading-cursor">Loading...</td>
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


function logout() {
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
    const response = fetch(apiUrl, requestOptions);

        // const data = response.json();
        localStorage.removeItem('auth')
        window.location.href = 'indexs.html'
    } finally{
        // do nothing
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