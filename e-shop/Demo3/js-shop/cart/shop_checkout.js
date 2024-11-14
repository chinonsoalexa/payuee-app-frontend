var stateIsoCode;
var stateSelected;
var citySelected;
var totalCharge;
var htmlContent;

var returnedOrderID;

var customerName;
var customerAddress1;
var customerAddress2;

var shippingCostPerKilo = 0;

// Declare variables for order details
var orderCost = 0.00;
var orderSubTotalCost = 0.00;
var shippingCost = 0.0;
var orderDiscount = 0.00;
var customerEmail = "john.doe@example.com";
var orderNotes = "";
var customerFName = "John";
var customerSName = "Doe";
var customerCompanyName = "Doe Inc.";
var customerState = "Illinois";
var customerCity = "Springfield";
var customerStreetAddress1 = "123 Main St";
var customerStreetAddress2 = "Apt 4B";
var customerZipCode = "62701";
var customerProvince = "Sangamon";
var customerPhoneNumber = "+1234567890";

// shipping fees calculation
var latitude = 0.0;
var longitude = 0.0;
var shippingFee = 0;
var shippingData;
var subtotal = 0;

// saved address
var usersSavedAddress;
var transactionCodeStatus = false;
var TransactionCode = "";

document.addEventListener('DOMContentLoaded', async function () {
    // Call the loading function to render the skeleton loaders
    updateCartNumber();
    updateCartDrawer();
    renderCheckoutProducts();
    
    // Retrieve the cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the cart has items (greater than or equal to 1)
    if (cart.length > 0) {
        // Make request to get current shipping fees by Kilometer
        await loadStates();
        await getShippingFees();
    }
});

// Function to fetch and populate state data
async function loadStates() {
    try {
        // Update the URL to the correct path of your JSON file
        const response = await fetch('nigeria_states.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const states = await response.json();
        
        renderStates(states);
        const searchInput = document.getElementById('stateSearchInput');
        searchInput.addEventListener('input', function () {
            const searchTerm = searchInput.value;
            filterStates(searchTerm, states);
        });

    } catch (error) {
        console.error('Error fetching state data:', error);
    }
}

// Function to fetch and populate city data based on state_iso2
async function loadCities(stateIso2) {
    try {
        const response = await fetch('nigeria_cities.json'); // Update with your actual cities JSON URL
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const cities = await response.json();
        
        // Filter cities by state_iso2
        const filteredCities = cities.filter(city => city.state_iso2 === stateIso2);

        // Sort cities alphabetically by name
        filteredCities.sort((a, b) => a.name.localeCompare(b.name));

        renderCities(filteredCities);

        const searchInput = document.getElementById('citySearchInput');
        searchInput.addEventListener('input', function () {
            const searchTerm = searchInput.value;
            filterCities(searchTerm, filteredCities);
        });

    } catch (error) {
        console.error('Error fetching city data:', error);
    }
}

function renderStates(states) {
    const stateList = document.getElementById('state-list');
    stateList.innerHTML = ''; // Clear existing items

    if (states.length === 0) {
        // No states found
        const noResultsItem = document.createElement('li');
        noResultsItem.textContent = 'No states found';
        noResultsItem.classList.add('search-suggestion__item');
        stateList.appendChild(noResultsItem);
    } else {
        // Render the states
        states.forEach(state => {
            const listItem = document.createElement('li');
            listItem.textContent = state.name;
            listItem.id = state.id;
            listItem.classList.add('search-suggestion__item', 'js-search-select');
            listItem.dataset.iso2 = state.iso2; // Store ISO2 code in data attribute
            listItem.dataset.state = state.name; // Store State in data attribute
            stateList.appendChild(listItem); // Append list item to the list
        });
    }

    // Add click event listener to each list item
    stateList.addEventListener('click', async function (event) {
        if (event.target.classList.contains('js-search-select')) {
            const selectedState = event.target.textContent;
            const isoCode = event.target.dataset.iso2;
            customerState = event.target.dataset.state;
            document.getElementById('search-dropdown').value = selectedState; // Set the value of the input
            document.getElementById('city-dropdown').value = ''; // Reset the city input value
            CalculateCartSubtotal() 
            // console.log(`Selected State: ${selectedState}, ISO Code: ${isoCode}`);
            stateSelected = selectedState;
            citySelected = '';
            toggleClassById("formeStateList", "js-content_visible");
            await loadCities(isoCode);
        }
    });
}

// Function to render cities to the DOM
function renderCities(cities) {
    const cityList = document.getElementById('city-list');
    cityList.innerHTML = ''; // Clear existing items

    if (cities.length === 0) {
        const noResultsItem = document.createElement('li');
        noResultsItem.textContent = 'No cities found';
        noResultsItem.classList.add('search-suggestion__item');
        cityList.appendChild(noResultsItem);
    } else {
        cities.forEach(city => {
            const listItem = document.createElement('li');
            listItem.textContent = city.name;
            listItem.classList.add('search-suggestion__item', 'js-search-select');
            listItem.dataset.cityName = city.name; // Store city name in data attribute
            listItem.dataset.latitude = city.latitude; // Store latitude in data attribute
            listItem.dataset.longitude = city.longitude; // Store longitude in data attribute
            cityList.appendChild(listItem);
        });
    }

    // Add click event listener to each city list item
    cityList.addEventListener('click', function (event) {
        if (event.target.classList.contains('js-search-select')) {
            const selectedCity = event.target.dataset.cityName;
            latitude = parseFloat(event.target.dataset.latitude);
            longitude = parseFloat(event.target.dataset.longitude);
            updateShippingPrices(shippingData);

            // Update the input value and other elements
            document.getElementById('city-dropdown').value = selectedCity;

            CalculateCartSubtotal();
            // Perform additional actions if needed, such as toggling visibility
            toggleClassById("formeCityList", "js-content_visible");
        }
    });
}

function filterStates(term, states) {
    const filtered = states.filter(state => 
        state.name.toLowerCase().includes(term.toLowerCase())
    );
    renderStates(filtered);
}

function filterCities(term, cities) {
    const filtered = cities.filter(state => 
        state.name.toLowerCase().includes(term.toLowerCase())
    );
    renderCities(filtered);
}

function toggleClassById(elementId, className) {
    const element = document.getElementById(elementId);
    if (element) {
        if (element.classList.contains(className)) {
            // If the class exists, remove it
            element.classList.remove(className);
        } else {
            // If the class does not exist, add it
            element.classList.add(className);
        }
    }
}

function formatNumberToNaira(number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(number);
}

// Function to update the cart number displayed on the page
function updateCartNumber() {
    // Get cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Calculate the number of distinct products in the cart
    let numberOfProducts = cart.length;
    
    // Update the cart number element
    document.getElementById('cartNumber').innerHTML = numberOfProducts;
    document.getElementById('cartNumber2').innerHTML = numberOfProducts;
    document.getElementById('cartNumber3').innerHTML = numberOfProducts;
    document.getElementById('cartNumber4').innerHTML = numberOfProducts;
}

function renderCheckoutProducts() {
    // Get cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Get reference to the cart drawer element
    const detailsCheckoutProducts = document.getElementById('detailsCheckoutProducts');
    
    // Clear the cart drawer
    detailsCheckoutProducts.innerHTML = '';

    // Check if the cart is empty
    if (cart.length === 0) {
        // Create and append a "No products added yet" message
        const emptyMessage = document.createElement('div');
        emptyMessage.classList.add('cart-drawer-item', 'd-flex', 'position-relative');
        emptyMessage.innerHTML = `
        <div class="position-relative">
          <img loading="lazy" class="cart-drawer-item__img" src="../images/product_not_available.jpg" alt="">
        </div>
        <div class="cart-drawer-item__info flex-grow-1">
          <h6 class="cart-drawer-item__title fw-normal">No Product Added Yet</h6>
          <p class="cart-drawer-item__option text-secondary">Select Product</p>
          <p class="cart-drawer-item__option text-secondary">"Add To Cart"</p>
          <div class="d-flex align-items-center justify-content-between mt-1">
            <div class="qty-control position-relative"></div>
            <span class="cart-drawer-item__price money price"></span>
          </div>
        </div>
        `;
        detailsCheckoutProducts.appendChild(emptyMessage);
    } else {
        // Loop through each item in the cart
        cart.forEach(cartProduct => {
            let price;
            if (cartProduct.reposted != true) {
                if (cartProduct.selling_price < cartProduct.initial_cost) {
                    price = `
                    <td>${formatNumberToNaira(cartProduct.selling_price * cartProduct.quantity)}</td>
                    `;
                } else {
                    price = `
                    <td>${formatNumberToNaira(cartProduct.initial_cost * cartProduct.quantity)}</td>
                    `;
                }
            } else {
                price = `
                <td>${formatNumberToNaira(cartProduct.reposted_selling_price * cartProduct.quantity)}</td>
                `;
            }

            // Create a new cart item element
            const cartItem = document.createElement('tr');

            // Generate the HTML for the cart item
            cartItem.innerHTML = `
                <td>
                ${cartProduct.title}
                      </td>
                      ${price}
            `;

            // Append the new cart item to the cart drawer
            detailsCheckoutProducts.appendChild(cartItem);

        });
    }
    CalculateCartSubtotal();
}

function updateCartDrawer() {
    // Get cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Get reference to the cart drawer element
    const cartDrawer = document.getElementById('cartDrawer1');
    
    // Clear the cart drawer
    cartDrawer.innerHTML = '';

    // Check if the cart is empty
    if (cart.length === 0) {
        // Create and append a "No products added yet" message
        const emptyMessage = document.createElement('div');
        emptyMessage.classList.add('cart-drawer-item', 'd-flex', 'position-relative');
        emptyMessage.innerHTML = `
        <div class="position-relative">
          <img loading="lazy" class="cart-drawer-item__img" src="images/product_not_available.jpg" alt="">
        </div>
        <div class="cart-drawer-item__info flex-grow-1">
          <h6 class="cart-drawer-item__title fw-normal">No Product Added Yet</h6>
          <p class="cart-drawer-item__option text-secondary">Select Product</p>
          <p class="cart-drawer-item__option text-secondary">"Add To Cart"</p>
          <div class="d-flex align-items-center justify-content-between mt-1">
            <div class="qty-control position-relative"></div>
            <span class="cart-drawer-item__price money price"></span>
          </div>
        </div>
        `;
        cartDrawer.appendChild(emptyMessage);
        const checkoutButton = document.getElementById('placeOrderButton');
    
        checkoutButton.disabled = true;
    } else {
        // Loop through each item in the cart
        cart.forEach(cartProduct => {
            let price;
        
            if (cartProduct.selling_price !== 0) {
                price = `
                <span class="cart-drawer-item__price money price">${formatNumberToNaira(cartProduct.selling_price * cartProduct.quantity)}</span>
                `;
            } else {
                price = `
                 <span class="cart-drawer-item__price money price">${formatNumberToNaira(cartProduct.initial_cost * cartProduct.quantity)}</span>
                `;
            }

            // Create a new cart item element
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-drawer-item', 'd-flex', 'position-relative');

            // Generate the HTML for the cart item
            cartItem.innerHTML = `
                <div class="position-relative">
                  <img loading="lazy" class="cart-drawer-item__img" src="${"https://payuee.com/image/"+cartProduct.product_image[0].url}" alt="">
                </div>
                <div class="cart-drawer-item__info flex-grow-1">
                  <h6 class="cart-drawer-item__title fw-normal">${cartProduct.title}</h6>
                  <p class="cart-drawer-item__option text-secondary">Category: ${cartProduct.category}</p>
                  <p class="cart-drawer-item__option text-secondary">Net Weight: ${cartProduct.net_weight}</p>
                  <div class="d-flex align-items-center justify-content-between mt-1">
                    <div class="qty-control position-relative">
                      <input type="number" name="quantity" value="${cartProduct.quantity}" min="1" class="qty-control__number border-0 text-center">
                      <div class="qty-control__reduce text-start" data-id="${cartProduct.ID}">-</div>
                      <div class="qty-control__increase text-end" data-id="${cartProduct.ID}">+</div>
                    </div>
                    ${price}
                  </div>
                </div>
                <button class="btn-close-xs position-absolute top-0 end-0 js-cart-item-remove"></button>
            `;

            // Append the new cart item to the cart drawer
            cartDrawer.appendChild(cartItem);

            // Create and append the divider element
            const divider = document.createElement('hr');
            divider.classList.add('cart-drawer-divider');
            cartDrawer.appendChild(divider);

            // Add event listeners for quantity update buttons
            const reduceButton = cartItem.querySelector('.qty-control__reduce');
            const increaseButton = cartItem.querySelector('.qty-control__increase');
            const quantityInput = cartItem.querySelector('.qty-control__number');
            const removeButton = cartItem.querySelector('.js-cart-item-remove');

            reduceButton.addEventListener('click', () => {
                updateQuantity(cartProduct.ID, 'reduce', cartProduct.stock_remaining);
            });

            increaseButton.addEventListener('click', () => {
                updateQuantity(cartProduct.ID, 'increase', cartProduct.stock_remaining);
            });

            quantityInput.addEventListener('change', () => {
                updateQuantity(cartProduct.ID, 'set', cartProduct.stock_remaining, parseInt(quantityInput.value));
            });

            // Add event listener for remove button
            removeButton.addEventListener('click', (event) => {
                event.preventDefault();
                removeFromCart(cartProduct.ID);
            });
        });
    }
    CalculateCartSubtotal();
    renderCheckoutProducts();
}

function updateQuantity(productId, action, stock_remaining, value = 1) {
    // Get cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Find the product in the cart
    const productIndex = cart.findIndex(item => item.ID === productId);

    if (productIndex !== -1) {
        // Update the quantity based on action
        if (action === 'increase') {stock_remaining
            if (cart[productIndex].quantity == stock_remaining) {
                // do nothing
            } else {
                cart[productIndex].quantity++;
            }
        } else if (action === 'reduce') {
            cart[productIndex].quantity = cart[productIndex].quantity > 1 ? cart[productIndex].quantity - 1 : 1;
        } else if (action === 'set') {
            cart[productIndex].quantity = value > 0 ? value : 1;
        }

        // Re-calculate the product price based on the quantity
        const product = cart[productIndex];
        if (product.selling_price !== 0) {
            product.totalPrice = product.selling_price * product.quantity;
        } else {
            product.totalPrice = product.initial_cost * product.quantity;
        }

        // Save the updated cart to local storage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Re-render the cart drawer
        CalculateCartSubtotal();
        updateCartDrawer();
    }
}

// Function to remove a product from the cart
function removeFromCart(productId) {
    // Get cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Filter out the product to be removed
    cart = cart.filter(item => item.ID !== productId);

    // Save the updated cart to local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Re-render the cart drawer
    updateCartDrawer();
    updateCartNumber();
    CalculateCartSubtotal();
}

async function CalculateCartSubtotal() {
    // Get cart from local storage
    // console.log("Started calculating cart subtotal.krk");
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    subtotal = 0;
    // console.log("Initial subtotal 1:");
    // Initialize subtotal
    // console.log("Initial subtotal:", subtotal);

    // Loop through each item in the cart and calculate the subtotal
    cart.forEach(item => {
        // console.log("Processing item:", item);

        // Ensure item properties are present and valid
        if (item.reposted != true) {
            if (item.selling_price !== undefined && item.initial_cost !== undefined && item.quantity !== undefined) {
                // Calculate the item's total price
                let itemTotal;
                if (item.selling_price < item.initial_cost) {
                    itemTotal = item.selling_price * item.quantity;
                } else {
                    itemTotal = item.initial_cost * item.quantity;
                }
                subtotal += itemTotal;
            } else {
                // console.warn("Item missing properties:", item);
            }
        } else {
            subtotal += item.reposted_selling_price;
        }
    });

    // console.log("Subtotal after calculation:", subtotal);

    // Update the subtotal and total elements in the UI
    document.getElementById('cart_sub_total_price').innerText = formatNumberToNaira(subtotal);
    document.getElementById('subtotalMain2').innerText = formatNumberToNaira(subtotal);
    document.getElementById('shippingFee').innerText = formatNumberToNaira(shippingCost);
    document.getElementById('totalMain').innerText = formatNumberToNaira(subtotal + shippingCost);
    
    totalCharge = subtotal + shippingCost;
    // console.log("Total charge after including shipping:", totalCharge);
}

const placeOrderButton = document.getElementById('placeOrderButton');

// Function to add event listeners to input fields for real-time validation
function addInputEventListeners() {
    const fields = document.querySelectorAll(".form-control");
    fields.forEach(function(field) {
        field.addEventListener("input", function() {
            validateField(field);
        });
    });
}

// Function to validate individual fields
function validateField(field) {
    const fieldId = field.id;
    let isValid = true;

    switch(fieldId) {
        case "checkout_first_name":
            if (!field.value.trim()) {
                isValid = false;
                showError(fieldId, "First Name is required.");
            }
            break;
        case "checkout_last_name":
            if (!field.value.trim()) {
                isValid = false;
                showError(fieldId, "Last Name is required.");
            }
            break;
        case "search-dropdown":
            if (!field.value.trim()) {
                isValid = false;
                showError(fieldId, "State/Region is required.");
            }
            break;
        case "city-dropdown":
            if (!field.value.trim()) {
                isValid = false;
                showError(fieldId, "City is required.");
            }
            break;
        case "checkout_street_address":
            if (!field.value.trim()) {
                isValid = false;
                showError(fieldId, "Street Address 1 is required.");
            }
            break;
        case "checkout_zipcode":
            if (!field.value.trim()) {
                isValid = false;
                showError(fieldId, "Postcode/ZIP is required.");
            }
            break;
        case "checkout_province":
            if (!field.value.trim()) {
                isValid = false;
                showError(fieldId, "Province is required.");
            }
            break;
        case "checkout_phone":
            if (!field.value.trim()) {
                isValid = false;
                showError(fieldId, "Phone number is required.");
            } else if (field.value.trim().length !== 11) {
                isValid = false;
                showError(fieldId, "Invalid phone number.");
            }
            break;
        case "checkout_email":
            if (!field.value.trim()) {
                isValid = false;
                showError(fieldId, "Email is required.");
            } else if (!isValidEmail(field.value.trim())) {
                isValid = false;
                showError(fieldId, "Invalid Email Address.");
            }
            break;
        default:
            break;
    }

    if (isValid) {
        resetErrors(fieldId);
    }
}

// Add event listeners to all input fields when the page loads
addInputEventListeners();

const insufficientBalanceModalElement = document.getElementById('insufficientBalanceModal');

placeOrderButton.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the form from submitting traditionally
  // Resetting previous errors
    resetErrors();

    // Collecting form data
    const formData = {
        firstName: document.getElementById("checkout_first_name").value.trim(),
        lastName: document.getElementById("checkout_last_name").value.trim(),
        companyName: document.getElementById("checkout_company_name").value.trim() || "",
        state: document.getElementById("search-dropdown").value.trim(),
        city: document.getElementById("city-dropdown").value.trim(),
        streetAddress1: document.getElementById("checkout_street_address").value.trim(),
        streetAddress2: document.getElementById("checkout_city").value.trim() || "",
        zipcode: document.getElementById("checkout_zipcode").value.trim(),
        province: document.getElementById("checkout_province").value.trim(),
        phone: document.getElementById("checkout_phone").value.trim(),
        email: document.getElementById("checkout_email").value.trim(),
        shipDifferent: document.getElementById("ship_different_address").checked,
        orderNotes: document.querySelector("textarea").value.trim() || "",
        paymentMethod: document.querySelector('input[name="checkout_payment_method"]:checked').id,
    };

    // Validate required fields
    let isValid = true;

    if (!formData.firstName) {
        isValid = false;
        showError("checkout_first_name", "First Name is required.");
    }
    if (!formData.lastName) {
        isValid = false;
        showError("checkout_last_name", "Last Name is required.");
    }
    if (!formData.state) {
        isValid = false;
        showError("search-dropdown", "State/Region is required.");
    }
    if (!formData.city) {
        isValid = false;
        showError("city-dropdown", "City is required.");
    }
    if (!formData.streetAddress1) {
        isValid = false;
        showError("checkout_street_address", "Street Address 1 is required.");
    }
    if (!formData.zipcode) {
        isValid = false;
        showError("checkout_zipcode", "Postcode/ZIP is required.");
    }
    if (!formData.province) {
        isValid = false;
        showError("checkout_province", "Province is required.");
    }
    if (!formData.phone) {
        isValid = false;
        showError("checkout_phone", "Phone number is required.");
    }
    if (formData.phone.length !== 11) {
        isValid = false;
        showError("checkout_phone", "Invalid phone number.");
    }
    if (!formData.email) {
        isValid = false;
        showError("checkout_email", "Email is required.");
    }
    if (!isValidEmail(formData.email)) {
        isValid = false;
        showError("checkout_email", "Invalid Email Address.");
    }

    // If form is not valid, prevent submission
    if (!isValid) {
        return;
    }

    // Get the modal element
    const paymentModalElement = document.getElementById('checkoutModal');
    const insufficientBalanceModalElement = document.getElementById('insufficientBalanceModal')
    const transactionSuccessModalElement = document.getElementById('transactionSuccessModal');


    let cartSubTotalPopUp = document.getElementById('cartSubTotalPopUp');
    let shippingSubTotalPopUp = document.getElementById('shippingSubTotalPopUp')
    let cartShippingTotalPopUp = document.getElementById('cartShippingTotalPopUp');
    let paymentButton1 = document.getElementById('paymentButton');

    // Create a new instance of the Bootstrap modal
    const paymentModal = new bootstrap.Modal(paymentModalElement);
    const insufficientBalanceModal = new bootstrap.Modal(insufficientBalanceModalElement);
    const transactionSuccessModal = new bootstrap.Modal(transactionSuccessModalElement);
    const transactionCodeSection = document.getElementById('transactionCodeSection');
    const createTransactionCodeSection = document.getElementById('createTransactionCodeSection');
    const forgotTransactionCodeLink = document.getElementById('forgotTransactionCodeLink');
    
    if (transactionCodeStatus) {
        // If the user have a transaction code
        transactionCodeSection.classList.remove('d-none');
        createTransactionCodeSection.classList.add('d-none');
    } else {
        // If the user does not have a transaction code
        createTransactionCodeSection.classList.remove('d-none');
        transactionCodeSection.classList.add('d-none');
    }

    cartSubTotalPopUp.textContent =  formatNumberToNaira(subtotal);
    shippingSubTotalPopUp.textContent =  formatNumberToNaira(shippingCost);
    cartShippingTotalPopUp.textContent =  formatNumberToNaira(subtotal + shippingCost);
    paymentButton1.textContent =  `Pay ${formatNumberToNaira(subtotal + shippingCost)}`;

    paymentModal.show();    // Show the modal programmatically

    const paymentButton = document.getElementById('paymentButton');

    paymentButton.addEventListener("click", async function(event) {
        event.preventDefault(); // Prevent the form from submitting traditionally
        
        if (transactionCodeStatus) {
            // If the user have a transaction code
            const transactionCode = document.getElementById('transactionCodeInput');
            TransactionCode = transactionCode.value.trim();
        } else {
            // If the user does not have a transaction code
            const newTransactionCode = document.getElementById('createTransactionCodeInput');
            TransactionCode = newTransactionCode.value.trim();
        }

        if (TransactionCode == "") {
            // display error to enter transaction code
            showToastMessageE("please fill in the transaction code field");
            return
        }
        if (TransactionCode.length != 6) {
            // display error to enter transaction code
            showToastMessageE("transaction code should be 6 digits");
            return
        }

        const checkoutButton = document.getElementById('placeOrderButton');
    
        checkoutButton.disabled = true;
        // Simulate checking balance 
        const customerBalance = await getUsersBalance();
        if (customerBalance === null || customerBalance < totalCharge || customerBalance < 1) {
        // Hide checkout modal and show insufficient balance modal
            paymentModal.hide();
            let transactionCodeInput = document.getElementById('transactionCodeInput');
            transactionCodeInput.value = "";
            setTimeout(function () {
                insufficientBalanceModal.show();
                // Fund Wallet button logic (you can customize this for your wallet integration)
                const fundWalletButton = document.getElementById('fundWalletButton');
                fundWalletButton.addEventListener('click', function () {
                    // Logic to fund the wallet goes here
                    window.location.href = 'https://payuee.com/fund-wallet';
                });
            checkoutButton.disabled = false;
            return;
            }, 300); // Delay for smooth transition
        } else {

            // Dynamically assign variables using form data
            orderCost = totalCharge;  
            orderSubTotalCost = totalCharge - shippingCost;  
            shippingCost = shippingCost;  
            orderDiscount = calculateDiscount();
            customerEmail = formData.email;
            orderNotes = formData.orderNotes;
            customerFName = formData.firstName;
            customerSName = formData.lastName;
            customerCompanyName = formData.companyName;
            customerState = formData.state;
            customerCity = formData.city;
            customerStreetAddress1 = formData.streetAddress1;
            customerStreetAddress2 = formData.streetAddress2;
            customerZipCode = formData.zipcode;
            customerProvince = formData.province;
            customerPhoneNumber = formData.phone;
            try {
                const result = await placeOrder();
                if (result.success){
                    // Hide checkout modal and simulate a successful transaction
                    paymentModal.hide();
                    document.getElementById('amountToCharge').textContent = formatNumberToNaira(orderCost);
                    // Show the transaction success modal
                    transactionSuccessModal.show();
                    let transactionCodeInput = document.getElementById('transactionCodeInput');
                    transactionCodeInput.value = "";
                    // clear the products in the local storage
                    localStorage.removeItem("cart");
                    return;
                } else {
                    showToastMessageE(result.error)
                }
            } catch (error) {
                // showToastMessageE(error.error)
            }
        
        }

        let transactionCodeInput = document.getElementById('transactionCodeInput');
        transactionCodeInput.value = "";
        placeOrderButton.removeEventListener('click', paymentButton);
    });
    return;
});

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

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.style.borderColor = "red"; // Change the border color to red

    // Create an error message element
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.style.color = "red";
    errorElement.style.marginTop = "5px";
    errorElement.innerText = message;

    // Insert the error message after the input field
    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
}

function resetErrors() {
    const fields = document.querySelectorAll(".form-control");
    fields.forEach(function(field) {
        field.style.borderColor = ""; // Reset border color
        const nextElement = field.nextElementSibling;
        if (nextElement && nextElement.classList.contains('error-message')) {
            nextElement.remove(); // Remove the error message
        }
    });
}

function isValidEmail(email) {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function calculateDistance(VenLat1, VenLon1, CusLat2, CusLon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (CusLat2 - VenLat1) * (Math.PI / 180);
    const dLon = (CusLon2 - VenLon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(VenLat1 * (Math.PI / 180)) * Math.cos(CusLat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}

function calculateDiscount() {
    // Get cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Initialize subtotal
    let discount = 0.00;
    // Loop through each item in the cart and calculate the subtotal
    cart.forEach(item => {
        // Calculate the item's total price
        if (item.initial_cost <= 0) {
            return 0; // Prevent division by zero or negative values
        };
        if (item.selling_price < item.initial_cost) {
            discount += item.selling_price - item.initial_cost;
        };
    });
    
    return discount; // Return the result rounded to two decimal places
}

// Function to create new orders
function createNewOrders(cartItems, orderHistoryBody) {
    const ordersMap = {};
    // console.log("Starting createNewOrders function...");

    // Group products by eshop_user_id or original_eshop_user_id if reposted
    cartItems.forEach((item, index) => {
        // console.log(`Processing item ${index + 1}/${cartItems.length}:`, item);

        const { eshop_user_id, original_eshop_user_id, order_cost, quantity } = item;
        const vendorID = item.reposted ? original_eshop_user_id : eshop_user_id;
        // console.log("Determined vendorID:", vendorID);

        // Initialize a new order if not yet in ordersMap
        if (!ordersMap[eshop_user_id]) {
            // console.log(`Initializing new order for vendorID: ${vendorID}`);
            ordersMap[eshop_user_id] = {
                order_history_body: {
                    ...orderHistoryBody, // Spread the order history body
                    eshop_user_id: item.eshop_user_id,
                    original_eshop_user_id: item.original_eshop_user_id,
                    reposted: item.reposted,
                    order_cost: 0.0,
                    order_sub_total_cost: 0.0,
                    shipping_cost: 0.0,
                    order_discount: 0.0,
                    quantity: 0
                },
                product_order_body: []
            };
        }

        // Update the order totals in order history
        const order = ordersMap[eshop_user_id].order_history_body;
        try {
            const productCost = parseFloat(getAndCalculateProductsPerVendor(eshop_user_id).toFixed(2));
            const shippingCost = parseFloat(calculateShippingFeePerVendor(vendorID).toFixed(2));
            const discount = parseFloat(getAndCalculateProductsDiscountsPerVendor(eshop_user_id).toFixed(2));
            const historyQuantity = getAndCalculateProductsQuantityPerVendor(eshop_user_id);

            // console.log("Product cost:", productCost);
            // console.log("Shipping cost:", shippingCost);
            // console.log("Discount:", discount);
            // console.log("Quantity:", historyQuantity);

            order.order_cost = productCost + shippingCost;
            order.order_sub_total_cost = productCost;
            order.shipping_cost = shippingCost;
            order.order_discount = discount;
            order.quantity = historyQuantity;
        } catch (error) {
            // console.error("Error calculating order totals for vendorID:", vendorID, error);
        }

        // Add product order details, keeping only desired fields
        // const { product_image, ...productOrderData } = item; // Exclude product_image
        const productOrderBody = {
            ID: item.ID,
            ...productOrderData
        };

        // Add the product to the product_order_body array
        // console.log("Adding product to product_order_body for vendorID:", vendorID);
        ordersMap[eshop_user_id].product_order_body.push(productOrderBody);
    });

    // Convert ordersMap to an array
    const orders = Object.values(ordersMap);
    console.log("Finished processing orders:", orders);
    return orders;
}

function getAndCalculateProductsPerVendor(vendorId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let pricePerProductOrder = 0.00;

    cart.forEach(item => {
        if (!item.reposted) {
            if (item.eshop_user_id === vendorId) {
                pricePerProductOrder += item.selling_price < item.initial_cost ? item.selling_price : item.initial_cost;
            }
        } else {
            if (item.eshop_user_id === vendorId) {
                pricePerProductOrder += item.reposted_selling_price;
            }
        }

    });

    return pricePerProductOrder;
}

function getAndCalculateProductsDiscountsPerVendor(vendorId) {
    // Retrieve the cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    let discount = 0.00;

    // Loop through each item in the cart
    cart.forEach(item => {
        if (!item.reposted) {
            // Ensure the eshop_user_id exists
            if (item.eshop_user_id === vendorId) {
            // Calculate the item's total price
                if (item.initial_cost <= 0) {
                    return 0; // Prevent division by zero or negative values
                };
                if (item.selling_price < item.initial_cost) {
                    discount += item.initial_cost - item.selling_price; 
                };
            }
        } else {
            // Ensure the eshop_user_id exists
            if (item.original_eshop_user_id === vendorId) {
                return 0; // Prevent division by zero or negative values
            }
        }
    });

    return discount;
}

function getAndCalculateProductsQuantityPerVendor(vendorId) {
    // Retrieve the cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    let quantity = 0;

    // Loop through each item in the cart
    cart.forEach(item => {
        if (!item.reposted) {
            // Ensure the eshop_user_id exists
            if (item.eshop_user_id === vendorId) {
                quantity += item.quantity;
            }
        } else {
            if (item.eshop_user_id === vendorId) {
                quantity += item.quantity;
            }
        }
    });

    return quantity;
}

function calculateShippingFeePerVendor(vendorId) {
    let shippingFees = 0.00;
    let totalWeight = 0.00;
    let distance;

    // Check if there are any shipping fees data available
    if (!shippingData || shippingData.length === 0) {
        // return 0 when no shipping fees are available
        return shippingFees;
    }

    // Loop through the vendors and calculate their shipping fees
    shippingData.forEach(fee => {
        if (fee.eshop_user_id === vendorId) {

            // Calculate the distance between the store and selected city in kilometers only once
            distance = calculateDistance(fee.store_latitude, fee.store_longitude, latitude, longitude);

            // If shipping is not based on weight, calculate the fee using distance alone
            if (!fee.calculate_using_kg) {
                shippingFees += distance * fee.shipping_fee_per_km;
            } else {
                // If shipping is based on weight, calculate total weight and fee accordingly
                totalWeight = calculateTotalWeightForVendor(vendorId);
                shippingFees += distance * fee.shipping_fee_per_km * totalWeight;
            }

            // Ensure the shipping fee is not lower or higher than the defined limits
            if (shippingFees < fee.shipping_fee_less) {
                shippingFees = fee.shipping_fee_less;
            } else if (shippingFees > fee.shipping_fee_greater) {
                shippingFees = fee.shipping_fee_greater;
            }
        }
    });

    return shippingFees;
}

async function placeOrder() {
    console.log("started placing order");
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
    console.log("started placing order 2");

    // Iterate through each product in the cart
    cart.forEach((product) => {
        if (!product.reposted) {
            if (product.selling_price < product.initial_cost) {
                product.order_cost = parseFloat(product.selling_price.toFixed(2));
                OrderCost += product.selling_price;
            } else {
                product.order_cost = parseFloat(product.initial_cost.toFixed(2));
                OrderCost += product.initial_cost;
            }
        } else {
            product.order_cost = parseFloat(product.reposted_selling_price.toFixed(2));
        }
    });

    // Update order_cost with the final value after the loop
    orderHistoryBody.order_cost = parseFloat(OrderCost.toFixed(2));
    console.log("started placing order 3");

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
        'estimated_delivery',
        'reposted',
        'repost_max_price',
        'original_eshop_user_id',
        'reposted_selling_price',
    ];
    console.log("started placing order 4");

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
    console.log("started placing order 32");
    const cleanedCartItem = cleanCartItems(cart);
    console.log("started placing order 43");

    // Create new orders from the cart
    const newOrders = createNewOrders(cleanedCartItem, orderHistoryBody);

    console.log("started placing order 5");

    // Construct the request body
    const requestBody = {
        Latitude: parseFloat(latitude.toFixed(2)),
        Longitude: parseFloat(longitude.toFixed(2)),
        ShippingDetails: shippingData,
        TransCode: String(TransactionCode),
        Orders: newOrders,
    };
    console.log("started placing order 6");

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
        console.log("started placing order 7");

        const data = await response.json();

        if (!data.ok) {
            if (data.error == "sorry you cannot order your own product") {
                showToastMessageE("sorry you cannot order your own product");
            }
            showToastMessageE("an error occurred while placing order");
            return;
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

function getUniqueVendorIds() {
    // Retrieve the cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Create a Set to store unique vendor IDs
    let vendorIds = new Set();

    // Loop through each item in the cart
    cart.forEach(item => {
        // Ensure the eshop_user_id exists
        if(!item.reposted) {
            if (item.eshop_user_id !== undefined) {
                // Add the vendor ID to the Set (duplicates will be ignored automatically)
                vendorIds.add(item.eshop_user_id);
            }
        } else {
            if (item.original_eshop_user_id !== undefined) {
                // Add the vendor ID to the Set (duplicates will be ignored automatically)
                vendorIds.add(item.original_eshop_user_id);
            }
        }
    });

    // Convert the Set back to an array and return
    return Array.from(vendorIds);
}

function calculateTotalWeightForVendor(eshop_user_id) {
    // Retrieve cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Filter the products in the cart by the specific eshop_user_id
    const vendorProducts = cart.filter(product => 
        product.reposted 
            ? product.original_eshop_user_id === eshop_user_id 
            : product.eshop_user_id === eshop_user_id
    );    

    // Initialize total weight
    let totalWeightKg = 0;

    // Loop through the filtered vendor products and calculate the total weight
    vendorProducts.forEach(product => {
        // Ensure net_weight and quantity are available and valid
        if (product.net_weight && product.quantity) {
            // Add the product's weight multiplied by its quantity
            totalWeightKg += product.net_weight * product.quantity;
        } else {
            console.warn(`Product with ID ${product.ID} is missing net_weight or quantity`);
        }
    });

    // Return the final total weight in kg
    return totalWeightKg;
}

function updateShippingPrices(vendorsShippingFees) {
    // Get reference to the tbody element where shipping fees will be displayed
    const shippingFeesTableBody = document.getElementById('vendors_shipping_fees');
    shippingCost = 0;
    // Clear the current table body content
    shippingFeesTableBody.innerHTML = '';

    // Check if there are any shipping fees data available
    if (!vendorsShippingFees || vendorsShippingFees.length === 0) {
        // Display a message when no shipping fees are available
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="2" style="background-color: yellow; color: black; font-weight: bold;">
                No shipping fees available for vendor
            </td>
        `;
        shippingFeesTableBody.appendChild(emptyRow);
    } else {
        // Loop through the vendors and append their shipping fees
        vendorsShippingFees.forEach(fee => {
            // Create a new table row element
            const shippingFeeRow = document.createElement('tr');

            // Calculate distance between store and selected city in kilometers
            const distance = calculateDistance(fee.store_latitude, fee.store_longitude, latitude, longitude);
            
            if (!fee.calculate_using_kg) {
                shippingFee = distance * fee.shipping_fee_per_km;
            } else {
                // console.log("calculating from here: ", fee, "this is the product net weight", calculateTotalWeightForVendor(fee.eshop_user_id));
                let totalWeight = calculateTotalWeightForVendor(fee.eshop_user_id);
                shippingFee = distance * fee.shipping_fee_per_km * totalWeight;
            }

            // Ensure the shipping fee is not lower or higher than the defined limits
            if (shippingFee < fee.shipping_fee_less) {
                shippingFee = fee.shipping_fee_less;
            } else if (shippingFee > fee.shipping_fee_greater) {
                shippingFee = fee.shipping_fee_greater;
            }

            shippingCost += shippingFee;
            // Add the vendor name and shipping fee
            shippingFeeRow.innerHTML = `
              <td>${fee.store_name}</td>
              <td>${formatNumberToNaira(shippingFee)}</td>
            `;

            // Append the new row to the table body
            shippingFeesTableBody.appendChild(shippingFeeRow);
        });
    }
    CalculateCartSubtotal();
}

// Helper function to format numbers into Naira currency
function formatNumberToNaira(amount) {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
}

function updateFormFields(formData) {
    // Update input fields with formData values
    document.getElementById("checkout_first_name").value = formData.customer_fname || "";
    document.getElementById("checkout_last_name").value = formData.customer_user_sname || "";
    document.getElementById("checkout_company_name").value = formData.customer_company_name || "";
    document.getElementById("search-dropdown").value = formData.customer_state || "";
    document.getElementById("city-dropdown").value = formData.customer_city || "";
    document.getElementById("checkout_street_address").value = formData.customer_street_address_1 || "";
    document.getElementById("checkout_city").value = formData.customer_street_address_2 || "";
    document.getElementById("checkout_zipcode").value = formData.customer_zip_code || "";
    document.getElementById("checkout_province").value = formData.customer_province || "";
    document.getElementById("checkout_phone").value = formData.customer_phone_number || "";
    document.getElementById("checkout_email").value = formData.customer_email || "";
    document.querySelector("textarea").value = formData.order_note || "";
}

async function getShippingFees() {
    // Endpoint URL
    const apiUrl = "https://api.payuee.com/get-vendors-shipping-fee";

    // Request body is just the array of IDs
    const requestBody = getUniqueVendorIds();  // Directly send the array, not as an object
    const checkoutButton = document.getElementById('placeOrderButton');
    
    checkoutButton.disabled = true;
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',  // Include cookies with the request
        body: JSON.stringify(requestBody)  // Send array as JSON
    };
    
    try {
        const response = await fetch(apiUrl, requestOptions);
        
        if (!response.ok) {
            const data = await response.json();
            // showToastMessageE(`response: ${data}`);
            updateShippingPrices() ;
            return;
        }else {
            // Process the response data
            const data = await response.json();
            shippingData = data.success;
            usersSavedAddress = data.address;
            if(usersSavedAddress.save_shipping_address) {
                updateFormFields(usersSavedAddress);
            }
            latitude = data.address.latitude;
            longitude = data.address.longitude;
            updateShippingPrices(data.success);
            transactionCodeStatus = data.status;
            const checkoutButton = document.getElementById('placeOrderButton');
    
            checkoutButton.disabled = false;
        }

    } catch (error) {
        const checkoutButton = document.getElementById('placeOrderButton');
    
        checkoutButton.disabled = true;
        console.error('Error fetching shipping fees:', error);
    }
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
