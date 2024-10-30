var transactionCodeStatus = false;
var chargeAmount = 0;
var vendorPlan = '';

document.getElementById('basicPlan').addEventListener('click', function(event) {
    event.preventDefault();
    chargeAmount = 1500;
    processPayment();
})

document.getElementById('businessPlan').addEventListener('click', function(event) {
    event.preventDefault();
    chargeAmount = 5500;
    processPayment();
})

document.getElementById('premiumPlan').addEventListener('click', function(event) {
    event.preventDefault();
    chargeAmount = 13500;
    processPayment();
})

function processPayment() {
    const transactionCodeSection = document.getElementById('transactionCodeSection');
    const createTransactionCodeSection = document.getElementById('createTransactionCodeSection');

    let cartSubTotalPopUp = document.getElementById('cartSubTotalPopUp');
    let cartShippingTotalPopUp = document.getElementById('cartShippingTotalPopUp');
    let paymentButton1 = document.getElementById('paymentButton');

    if (transactionCodeStatus) {
        // If the user have a transaction code
        transactionCodeSection.classList.remove('d-none');
        createTransactionCodeSection.classList.add('d-none');
    } else {
        // If the user does not have a transaction code
        createTransactionCodeSection.classList.remove('d-none');
        transactionCodeSection.classList.add('d-none');
    }

    cartSubTotalPopUp.textContent =  formatNumberToNaira(chargeAmount);
    cartShippingTotalPopUp.textContent =  formatNumberToNaira(chargeAmount);
    paymentButton1.textContent =  `Pay ${formatNumberToNaira(chargeAmount)}`;

    showModal('checkoutModal');

    const paymentButton = document.getElementById('paymentButton');

    paymentButton.addEventListener("click", async function(event) {
        event.preventDefault(); // Prevent the form from submitting traditionally
                // Simulate checking balance 
                const customerBalance = await getUsersBalance();

                if (customerBalance === null || customerBalance < totalCharge || customerBalance < 1) {
                // Hide checkout modal and show insufficient balance modal
                    paymentModal.hide();
                    let transactionCodeInput = document.getElementById('transactionCodeInput');
                    transactionCodeInput.value = "";
                    setTimeout(function () {
                        hideModal(insufficientBalanceModal);
                        // Fund Wallet button logic (you can customize this for your wallet integration)
                        const fundWalletButton = document.getElementById('fundWalletButton');
                        fundWalletButton.addEventListener('click', function () {
                            // Logic to fund the wallet goes here
                            window.location.href = 'https://payuee.com/fund-wallet';
                        });
                        return;
                    }, 300); // Delay for smooth transition
                } else {
                    try {
                        const result = await placeOrder();
                        if (result.success){
                            // Hide checkout modal and simulate a successful transaction
                            paymentModal.hide();
                            hideModal('checkoutModal');
                            document.getElementById('amountToCharge').textContent = formatNumberToNaira(chargeAmount);
                            // Show the transaction success modal
                            transactionSuccessModal.show();
                            showModal('transactionSuccessModal');
                            let transactionCodeInput = document.getElementById('transactionCodeInput');
                            transactionCodeInput.value = "";
                            return;
                        } else {
                            showToastMessageE(result.error)
                        }
                    } catch (error) {
                        // showToastMessageE(error.error)
                    }
                    let transactionCodeInput = document.getElementById('transactionCodeInput');
                    transactionCodeInput.value = "";
                }
    })
}

const transactionCodeInput = document.getElementById('transactionCodeInput');

// Restrict input to numeric values only and show error if non-numeric characters are entered
transactionCodeInput.addEventListener('input', function () {
    const nonNumericChars = /\D/g;
    if (nonNumericChars.test(this.value)) {
        // Show error message if non-numeric characters are found
        showToastMessageE("Only numbers are allowed");
    }
    // Remove any non-digit characters from the input value
    this.value = this.value.replace(nonNumericChars, '');
});

const createTransactionCodeInput = document.getElementById('createTransactionCodeInput');

// Restrict input to numeric values only and show error if non-numeric characters are entered
createTransactionCodeInput.addEventListener('input', function () {
    const nonNumericChars = /\D/g;
    if (nonNumericChars.test(this.value)) {
        // Show error message if non-numeric characters are found
        showToastMessageE("Only numbers are allowed");
    }
    // Remove any non-digit characters from the input value
    this.value = this.value.replace(nonNumericChars, '');
});

function showToastMessageE(message) {
    document.getElementById('toastError').textContent = message;
    const toastElement = document.getElementById('liveToast1'); // Get the toast element
    const toast = new bootstrap.Toast(toastElement); // Initialize the toast
    toast.show(); // Show the toast
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

// Helper function to format numbers into Naira currency
function formatNumberToNaira(amount) {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
}

async function getUsersBalance() {
    let userBalance = 0;
    // Endpoint URL
    const apiUrl = "https://api.payuee.com/check-balance";

    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',  // Include cookies with the request
    };
    
    try {
        const response = await fetch(apiUrl, requestOptions);
        
        if (!response.ok) {
            const data = await response.json();
            // showToastMessageE(`response: ${data}`);
            return;
        }else {
            // Process the response data
            const data = await response.json();
            userBalance = data.success;
        }

    } catch (error) {
        console.error('Error fetching shipping fees:', error);
    }
    return userBalance;
}

async function placeOrder() {
    let OrderCost = 0.0;

    const checkbox = document.getElementById('ship_different_address');
    const isChecked = checkbox.checked;

    // Construct the order history body
    const orderHistoryBody = {
        order_cost: parseFloat(OrderCost.toFixed(2)),
        order_sub_total_cost: parseFloat(orderSubTotalCost.toFixed(2)),
        shipping_cost: parseFloat(shippingCost.toFixed(2)),
        order_discount: parseFloat(orderDiscount.toFixed(2)),
        quantity: 0,
        customer_email: customerEmail,
        order_note: orderNotes,
        customer_fname: customerFName,
        customer_user_sname: customerSName,
        customer_company_name: customerCompanyName,
        customer_state: customerState,
        customer_city: customerCity,
        customer_street_address_1: customerStreetAddress1,
        customer_street_address_2: customerStreetAddress2,
        customer_zip_code: customerZipCode,
        customer_province: customerProvince,
        customer_phone_number: customerPhoneNumber,
        save_shipping_address: isChecked
    };

    // Get cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Iterate through each product in the cart
    cart.forEach((product) => {
        if (product.selling_price < product.initial_cost) {
            product.order_cost = parseFloat(product.selling_price.toFixed(2));
            OrderCost += product.selling_price;
        } else {
            product.order_cost = parseFloat(product.initial_cost.toFixed(2));
            OrderCost += product.initial_cost;
        }
    });

    // Update order_cost with the final value after the loop
    orderHistoryBody.order_cost = parseFloat(OrderCost.toFixed(2));

    // Fields you want to keep
    const desiredFields = [
        'ID',
        'category',
        'title',
        'description',
        'user_id',
        'eshop_user_id',
        'product_url_id',
        'currency',
        'featured',
        'order_cost',
        'net_weight',
        'quantity',
        'product_image',
        'initial_cost',
        'selling_price',
        'estimated_delivery'
    ];

    // Function to clean cart items
    const cleanCartItems = (items) => {
        return items.map(item => {
            return desiredFields.reduce((acc, field) => {
                acc[field] = item[field];
                return acc;
            }, {});
        });
    };

    // Clean the cart item
    const cleanedCartItem = cleanCartItems(cart);

    // Create new orders from the cart
    const newOrders = createNewOrders(cleanedCartItem, orderHistoryBody);

    const checkoutButton = document.getElementById('placeOrderButton');
    
    checkoutButton.disabled = true;

    // Construct the request body
    const requestBody = {
        Latitude: parseFloat(latitude.toFixed(2)),
        Longitude: parseFloat(longitude.toFixed(2)),
        ShippingDetails: shippingData,
        TransCode: String(TransactionCode),
        Orders: newOrders,
    };

    try {
        // Send POST request using Fetch API and wait for the response
        const response = await fetch('https://api.payuee.com/place-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',  // Include cookies with the request
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (!data.ok) {
            if (data.error == "sorry you cannot order your own product") {
                showToastMessageE("sorry you cannot order your own product");
            }
        }

        const checkoutButton = document.getElementById('placeOrderButton');
    
        checkoutButton.disabled = false;

        // Return the response data so the calling function can use it
        return data;
    } catch (error) {
        const checkoutButton = document.getElementById('placeOrderButton');
    
        checkoutButton.disabled = false;
        // Handle any errors that occur
        console.error('Error:', error);
        throw error; // Propagate the error so calling function can handle it
    }
}