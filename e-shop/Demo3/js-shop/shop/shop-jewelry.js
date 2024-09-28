var NextPageOnLoad;
var PreviousPageOnLoad;
var CurrentPageOnLoad;
var TotalPageOnLoad;
var TwoBeforePageOnLoad;
var TwoAfterPageOnLoad;
var ThreeAfterPageOnLoad;
var AllRecordsOnPageLoad;

// Initialize loader array with 8 elements (e.g., with null values)
const loader = Array.from({ length: 15 }, (_, i) => i);

document.addEventListener('DOMContentLoaded', async function () {
    // Call the loading function to render the skeleton loaders
    loading();
    updateCartNumber();
    updateCartDrawer();
    sortingAlgo();

    // Get the current URL
    const currentUrl = new URL(window.location.href);
    // Assuming you have a reference to the table body element

    setTimeout(() => {
        // console.log('m here')
        // updateProductsFromData(productts);
            // render the store products
            document.getElementById('products-grid').innerHTML = '';
    products.forEach((product) => {
        renderProducts(product);
    });
        // console.log('just finished here')
    }, 3000);

    // Extract parameters using URLSearchParams
    const params = new URLSearchParams(currentUrl.search);

    // Get individual parameter values
    let pageNumber = params.get("page");
    if (pageNumber == null) {
        pageNumber = "1";
    }

    // await getProducts(pageNumber);

});

async function getProducts(pageNumber) {
    const apiUrl = "https://api.payuee.com/products/" + pageNumber;

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
                
            } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!") {
                // let's log user out the users session has expired
                // logUserOutIfTokenIsExpired();
            }else {
                // displayErrorMessage();
            }

            return;
        }

        const responseData = await response.json();

        // updateProductsFromData(responseData.success);
        // Clear specific elements by class name before updating
        clearElementsByClass('product-card-wrapper');
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
        nextPageButtonI.href = `https://payuee.com/shop?page=${CurrentPageOnLoad+1}`;
        let previousPageButtonI = document.getElementById('previousPage');
        previousPageButtonI.href = `https://payuee.com/shop?page=${CurrentPageOnLoad-1}`;

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
        
        if (AllRecordsOnPageLoad > 8) {
            // let's remove the disable on the next page navigation button
            // Assuming some condition or event triggers the display change
            document.getElementById('paginationList').classList.remove('disabled');
            document.getElementById('paginationList').disabled = false;
        } 
} finally {

    }
}

function updateLink(urlIdToUpdate, pageNumber) {
        urlIdToUpdate.href = `https://payuee.com/jewelry?page=${pageNumber}`;
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

function renderProducts(product) {
    const productBody = document.getElementById('products-grid');

    // Create a new product card element
    const rowElement = document.createElement('div');
    rowElement.classList.add('product-card');
    rowElement.id = product.ID; // Set the ID of the row
    rowElement.dataset.productId = product.ID; // Add a data attribute for easy access

    let price;
    let percentage;

    if (product.selling_price < product.initial_cost) {
        price = `
        <div class="product-card__price d-flex">
            <span class="money price price-old">${formatNumberToNaira(product.initial_cost)}</span>
            <span class="money price price-sale">${formatNumberToNaira(product.selling_price)}</span>
        </div>`;
        let currentPercent = calculatePercentageOff(product.initial_cost, product.selling_price)
        percentage = `
        <div class="pc-labels position-absolute top-0 start-0 w-100 d-flex justify-content-between">
                <div class="pc-labels__right ms-auto">
                    <span class="pc-label pc-label_sale d-block text-white">-${currentPercent}%</span>
                </div>
            </div>
        `
    } else {
        price = `
        <div class="product-card__price d-flex">
            <span class="money price">${formatNumberToNaira(product.initial_cost)}</span>
        </div>`
        percentage = `
        `
    }

    // Determine if the button should be disabled and what text to display
    const isOutOfStock = product.product_stock === 0;
    const buttonText = isOutOfStock ? 'Out of Stock' : 'Add To Cart';
    const buttonDisabled = isOutOfStock ? 'disabled' : '';

    // Create the HTML string with dynamic data using template literals
    rowElement.innerHTML = `
        <div class="product-card mb-3 mb-md-4 mb-xxl-5">
            <div class="pc__img-wrapper">
                <div class="swiper-container background-img js-swiper-slider" data-settings='{"resizeObserver": true}'>
                    <div class="swiper-wrapper">
                        <div class="swiper-slide">
                            <a href="https://payuee.com/jewelry/${product.product_url_id}" class="product-link1">
                                <img loading="lazy" src="${product.Image1}" width="330" height="400" alt="${product.title}" class="pc__img product-img1">
                            </a>
                        </div>
                        <div class="swiper-slide">
                            <a href="https://payuee.com/jewelry/${product.product_url_id}" class="product-link2">
                                <img loading="lazy" src="${product.Image2}" width="330" height="400" alt="${product.title}" class="pc__img product-img2">
                            </a>
                        </div>
                    </div>
                    <span class="pc__img-prev"><svg width="7" height="11" viewBox="0 0 7 11" xmlns="http://www.w3.org/2000/svg"><use href="#icon_prev_sm" /></svg></span>
                    <span class="pc__img-next"><svg width="7" height="11" viewBox="0 0 7 11" xmlns="http://www.w3.org/2000/svg"><use href="#icon_next_sm" /></svg></span>
                </div>
                <button class="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside" data-aside="cartDrawer" title="Add To Cart" ${buttonDisabled}>${buttonText}</button>
            </div>
            <div class="pc__info position-relative">
                <p class="pc__category">${product.category}</p>
                <h6 class="pc__title"><a href="https://payuee.com/jewelry/${product.product_url_id}">${product.title}</a></h6>
                ${price}
                <div class="product-card__review d-flex align-items-center">
                    <div class="reviews-group d-flex">
                        <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
                        <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
                        <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
                        <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
                        <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
                    </div>
                    <span class="reviews-note text-lowercase text-secondary ms-1">${formatNumber(product.product_review_count)} reviews</span>
                </div>
                <a href="https://payuee.com/jewelry/${product.product_url_id}" class="pc__btn-wl-wrapper">
                    <button class="pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist" title="Add To Wishlist">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <use href="#icon_retweet" />
                        </svg>
                    </button>
                </a>
            </div>
            ${percentage}
            <div class="pc-labels position-absolute top-0 start-0 w-100 d-flex justify-content-between">
                <div class="pc-labels__left">
                    <span class="pc-label pc-label_new d-block bg-white">${product.net_weight}g</span>
                </div>
            </div>
        </div>
    `;

    // Append the new element to the container
    productBody.appendChild(rowElement);

    // Reinitialize the SwiperSlideshow after adding the product
    if (typeof PayueeSections.SwiperSlideshow !== 'undefined') {
        new PayueeSections.SwiperSlideshow()._initSliders();
    }

    // If there are more complex product media types, reinitialize them as well
    if (typeof PayueeSections.ProductSingleMedia !== 'undefined') {
        new PayueeSections.ProductSingleMedia()._initProductMedia();
    }

    // Reinitialize Aside
    if (typeof PayueeElements.Aside === 'function') {
        new PayueeElements.Aside();
    }

    // Add event listener to the image wrapper
    const imgWrapper = rowElement.querySelector('.swiper-wrapper');
    imgWrapper.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = `https://payuee.com/jewelry/${product.product_url_id}`;
    });

    // Add event listener to the 'Add To Cart' button
    if (!isOutOfStock) {
        const addToCartButton = rowElement.querySelector('.pc__atc');
        addToCartButton.addEventListener('click', function() {
            addToCart(product);
            updateCartNumber();
            updateCartDrawer();
        });
    }
}

function loading() {
    // Render loading skeletons for each element in the loader array
    document.getElementById('products-grid').innerHTML = '';
    loader.forEach(() => {
        renderLoading();
    });
}

function renderLoading() {
    // Assuming you have a reference to the container element
    const productBody = document.getElementById('products-grid');

    // Create a new element for the skeleton loader
    const rowElement = document.createElement('div');
    rowElement.classList.add('product-card-wrapper');

    // Create the HTML string with dynamic data using template literals
    rowElement.innerHTML = `
        <div class="product-card mb-3 mb-md-4 mb-xxl-5">
            <!-- Skeleton Loader -->
            <div class="skeleton-wrapper">
                <div class="skeleton skeleton-img loading-cursor"></div>
                <div class="skeleton skeleton-title loading-cursor"></div>
                <div class="skeleton skeleton-category loading-cursor"></div>
                <div class="skeleton skeleton-price loading-cursor"></div>
                <div class="skeleton skeleton-review loading-cursor"></div>
                <div class="skeleton skeleton-label loading-cursor"></div>
            </div>
        </div>
    `;

    // Append the new element to the container
    productBody.appendChild(rowElement);
}

function calculatePercentageOff(previousPrice, currentPrice) {
    if (previousPrice <= 0) {
        return 0; // Prevent division by zero or negative values
    }
    const discount = previousPrice - currentPrice;
    const percentageOff = (discount / previousPrice) * 100;
    return percentageOff.toFixed(0); // Return the result rounded to two decimal places
}

function formatNumber(value) {
    if (value >= 1_000_000_000) {
        // Handle billions
        return (value / 1_000_000_000).toFixed(1) + 'B';
    } else if (value >= 1_000_000) {
        // Handle millions
        return (value / 1_000_000).toFixed(1) + 'M';
    } else if (value >= 1_000) {
        // Handle thousands
        return (value / 1_000).toFixed(1) + 'k';
    } else {
        // Handle values less than a thousand
        return value.toString();
    }
}

function formatNumberToNaira(number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(number);
}

// Function to add a product to the cart
function addToCart(product) {
    // Get cart from local storage or initialize if not found
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if product is already in the cart
    const productIndex = cart.findIndex(item => item.ID === product.ID);
    if (productIndex !== -1) {
        // If product exists, increase quantity
        cart[productIndex].quantity += 1;
    } else {
        // If product does not exist, add new product to cart
        cart.push({ ...product, quantity: 1 });
    }

    // Save updated cart to local storage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDrawer();
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
        cartDrawer.appendChild(emptyMessage);
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
                  <img loading="lazy" class="cart-drawer-item__img" src="${"https://dorngwellness.com/image/"+cartProduct.Image1}" alt="">
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
                updateQuantity(cartProduct.ID, 'reduce', cartProduct.product_stock);
            });

            increaseButton.addEventListener('click', () => {
                updateQuantity(cartProduct.ID, 'increase', cartProduct.product_stock);
            });

            quantityInput.addEventListener('change', () => {
                updateQuantity(cartProduct.ID, 'set', cartProduct.product_stock, parseInt(quantityInput.value));
            });

            // Add event listener for remove button
            removeButton.addEventListener('click', (event) => {
                event.preventDefault();
                removeFromCart(cartProduct.ID);
            });
        });
    }
    calculateCartSubtotal();
}

function updateQuantity(productId, action, product_stock, value = 1) {
    // Get cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Find the product in the cart
    const productIndex = cart.findIndex(item => item.ID === productId);

    if (productIndex !== -1) {
        // Update the quantity based on action
        if (action === 'increase') {product_stock
            if (cart[productIndex].quantity == product_stock) {
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
            product.totalPrice = product.price * product.quantity;
        }

        // Save the updated cart to local storage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Re-render the cart drawer
        calculateCartSubtotal();
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
    calculateCartSubtotal();
}

function calculateCartSubtotal() {
    // Get cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Initialize subtotal
    let subtotal = 0;

    // Loop through each item in the cart and calculate the subtotal
    cart.forEach(item => {
        // Calculate the item's total price
        let itemTotal;
        if (item.selling_price < item.initial_cost) {
            itemTotal = item.selling_price * item.quantity;
        } else {
            itemTotal = item.initial_cost * item.quantity;
        }
        subtotal += itemTotal;
    });

    // Update the subtotal element in the UI
    document.getElementById('cart_sub_total_price').innerText = formatNumberToNaira(subtotal);
}

function sortingAlgo() {
// Add event listener to the select element
document.getElementById('sortingSelect').addEventListener('change', function() {
    const selectedValue = this.value;  // Get the selected option value
    console.log('Selected sorting option value:', selectedValue);
    loading();
    
    setTimeout(() => {
    // Clear current product grid
    document.getElementById('products-grid').innerHTML = '';

    // Shuffle products array before rendering
    const shuffledProducts = shuffleArray(products);

    // Render the shuffled products
    shuffledProducts.forEach((product) => {
        renderProducts(product);
    });

    }, 3000);
});

// Add event listeners to category links
document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default navigation
        const selectedCategory = this.textContent.trim();
        console.log('Selected Category:', selectedCategory);
        // Handle the category selection
        loading();
    
        setTimeout(() => {
        // Clear current product grid
        document.getElementById('products-grid').innerHTML = '';
    
        // Shuffle products array before rendering
        const shuffledProducts = shuffleArray(products);
    
        // Render the shuffled products
        shuffledProducts.forEach((product) => {
            renderProducts(product);
        });
    
        }, 3000);
    });
    });
    
    // Add event listeners to color swatches
    document.querySelectorAll('.swatch-color').forEach(swatch => {
    swatch.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default behavior
        const selectedColor = this.style.color;
        console.log('Selected Color:', selectedColor);
        // Handle the color selection
        loading();
    
        setTimeout(() => {
        // Clear current product grid
        document.getElementById('products-grid').innerHTML = '';
    
        // Shuffle products array before rendering
        const shuffledProducts = shuffleArray(products);
    
        // Render the shuffled products
        shuffledProducts.forEach((product) => {
            renderProducts(product);
        });
    
        }, 3000);
    });
    });
    
    // Add event listeners to size buttons
    document.querySelectorAll('.swatch-size').forEach(sizeButton => {
    sizeButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default behavior
        const selectedSize = this.textContent.trim();
        console.log('Selected Size:', selectedSize);
        // Handle the size selection
        loading();
    
        setTimeout(() => {
        // Clear current product grid
        document.getElementById('products-grid').innerHTML = '';
    
        // Shuffle products array before rendering
        const shuffledProducts = shuffleArray(products);
    
        // Render the shuffled products
        shuffledProducts.forEach((product) => {
            renderProducts(product);
        });
    
        }, 3000);
    });
    });
    
// Get the search input field by its ID
const searchInput = document.getElementById('searchField');
    
// Add an event listener to capture input changes
searchInput.addEventListener('input', function(event) {
    const searchQuery = event.target.value;  // Get the current input value
    
    // Perform actions with the search query
    console.log('Search query:', searchQuery);
    
    // You can call a function to handle the search here, e.g., make an API request or filter results
    performSearch(searchQuery);
});

// Example search function (you can replace it with your logic)
function performSearch(query) {
    if (query.length > 0) {
    console.log('Performing search for:', query);
    // Add your search logic here, such as making an API call or filtering displayed results
            // Handle the color selection
            loading();
    
            setTimeout(() => {
            // Clear current product grid
            document.getElementById('products-grid').innerHTML = '';
        
            // Shuffle products array before rendering
            const shuffledProducts = shuffleArray(products);
        
            // Render the shuffled products
            shuffledProducts.forEach((product) => {
                renderProducts(product);
            });
        
            }, 3000);
    } else {
    console.log('Search query is empty');
    // Clear or reset search results if the input is empty
    }
}

    const selectors = {
    elementClass: '.price-range-slider',
    minElement: '.price-range__min',
    maxElement: '.price-range__max'
    };

    // Iterate over each slider element
    document.querySelectorAll(selectors.elementClass).forEach($se => {
    const currency = $se.dataset.currency || '₦'; // Default currency if not provided

    if ($se) {
        // Initialize the slider using the Slider library
        const priceRange = new Slider($se, {
        tooltip_split: true,
        formatter: function(value) {
            return currency + value;
        },
        });

        // Event listener to get current min and max when slider stops moving
        priceRange.on('slideStop', (value) => {
        const currentMin = value[0];  // This is the current minimum value
        const currentMax = value[1];  // This is the current maximum value

        // Log or use the min and max values however you need
        console.log('Current Min:', currentMin);
        console.log('Current Max:', currentMax);

        // Update the UI with the min and max values
        const $minEl = $se.parentElement.querySelector(selectors.minElement);
        const $maxEl = $se.parentElement.querySelector(selectors.maxElement);
        $minEl.innerText = `${formatNumberToNaira(currentMin)}`;
        $maxEl.innerText = `${formatNumberToNaira(currentMax)}`;

        // Optionally trigger some action with these values (e.g., filter products)
        updateFilterBasedOnPrice(currentMin, currentMax);
        });
        // You can have a separate function that handles additional logic like filtering products
        function updateFilterBasedOnPrice(minPrice, maxPrice) {
            // Your logic to filter products or update UI based on the price range
            console.log(`Filter products within the price range: ${minPrice} to ${maxPrice}`);
                    // Handle the color selection
        loading();
    
        setTimeout(() => {
        // Clear current product grid
        document.getElementById('products-grid').innerHTML = '';
    
        // Shuffle products array before rendering
        const shuffledProducts = shuffleArray(products);
    
        // Render the shuffled products
        shuffledProducts.forEach((product) => {
            renderProducts(product);
        });
    
        }, 3000);
        }
    }
    });
}

// Shuffle function using Fisher-Yates algorithm
function shuffleArray(array) {
for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];  // Swap elements
}
return array;
}
  
var products = [
    {
        "ID": 1,
        "title": "Cropped Faux Leather Jacket",
        "category": "Outfit",
        "initial_cost": 5000,
        "selling_price": 0,
        "net_weight": 100,
        "product_stock": 5,
        "Image1": "../images/products/product_0-1.jpg",
        "Image2": "../images/products/product_0-2.jpg",
        "product_review_count": 200000,
        // "product_url_id": "cropped-faux-leather-jacket-1"
    },
    {
        "ID": 2,
        "title": "Calvin Shorts",
        "category": "Herbal Tea",
        "initial_cost": 5000,
        "selling_price": 0,
        "net_weight": 200,
        "product_stock": 5,
        "Image1": "../images/products/product_0-3.jpg",
        "Image2": "../images/products/product_0-9.jpg",
        "product_review_count": 3500,
        // "product_url_id": "calvin-shorts-2"
    },
    {
        "ID": 3,
        "title": "Kirby T-Shirt",
        "category": "Herbal Tea",
        "initial_cost": 6000,
        "selling_price": 6000,
        "net_weight": 50,
        "product_stock": 5,
        "Image1": "../images/products/product_0-5.jpg",
        "Image2": "../images/products/product_0-6.jpg",
        "product_review_count": 400,
        // "product_url_id": "hypertension-tea-3"
    },
    {
        "ID": 4,
        "title": "Cableknit Shawl",
        "category": "Herbal Tea",
        "initial_cost": 9000,
        "selling_price": 5000,
        "net_weight": 300,
        "product_stock": 200,
        "Image1": "../images/products/product_0-7.jpg",
        "Image2": "../images/products/product_0-8.jpg",
        "product_review_count": 500,
        // "product_url_id": "double-strength-tea-4"
    },
    {
        "ID": 5,
        "title": "Colorful Jacket",
        "category": "Herbal Tea",
        "initial_cost": 4000,
        "selling_price": 1500,
        "net_weight": 250,
        "product_stock": 200,
        "Image1": "../images/products/product_0-9.jpg",
        "Image2": "../images/products/product_0-10.jpg",
        "product_review_count": 50,
        // "product_url_id": "green-coffee-5"
    },
    {
        "ID": 6,
        "title": "Shirt In Botanical Cheetah Print",
        "category": "Herbal Tea",
        "initial_cost": 5000,
        "selling_price": 0,
        "net_weight": 500,
        "product_stock": 200,
        "Image1": "../images/products/product_0-11.jpg",
        "Image2": "../images/products/product_0-12.jpg",
        "product_review_count": 200,
        // "product_url_id": "english-breakfast-6"
    },
    {
        "ID": 7,
        "title": "Cotton Jersey T-Shirt",
        "category": "Herbal Tea",
        "initial_cost": 5000,
        "selling_price": 4000,
        "net_weight": 100,
        "product_stock": 5,
        "Image1": "../images/products/product_0-13.jpg",
        "Image2": "../images/products/product_0.jpg",
        "product_review_count": 2500,
        // "product_url_id": "cropped-faux-leather-jacket-7"
    },
    {
        "ID": 8,
        "title": "Zessi Dresses",
        "category": "Herbal Tea",
        "initial_cost": 5000,
        "selling_price": 0,
        "net_weight": 100,
        "product_stock": 200,
        "Image1": "../images/products/product_1-1.jpg",
        "Image2": "../images/products/product_1.jpg",
        "product_review_count": 25000000,
        // "product_url_id": "cropped-faux-leather-jacket-8"
    },
    {
        "ID": 9,
        "title": "Cropped Faux Leather Jacket",
        "category": "Herbal Tea",
        "initial_cost": 5000,
        "selling_price": 3000,
        "net_weight": 100,
        "product_stock": 200,
        "Image1": "../images/products/product_2-1.jpg",
        "Image2": "../images/products/product_2.jpg",
        "product_review_count": 4500000,
        // "product_url_id": "infection-cleanse-9"
    },
    {
        "ID": 10,
        "title": "Cotton Jersey T-Shirt",
        "category": "Herbal Tea",
        "initial_cost": 5000,
        "selling_price": 0,
        "net_weight": 100,
        "product_stock": 200,
        "Image1": "../images/products/product_3-1.jpg",
        "Image2": "../images/products/product_3.jpg",
        "product_review_count": 6700,
        // "product_url_id": "fibroid-fertility-tea-10"
    },
    {
        "ID": 11,
        "title": "Colorful Jacket",
        "category": "Herbal Tea",
        "initial_cost": 5000,
        "selling_price": 4500,
        "net_weight": 100,
        "product_stock": 200,
        "Image1": "../images/products/product_4-1.jpg",
        "Image2": "../images/products/product_4.jpg",
        "product_review_count": 2800,
        // "product_url_id": "hypertension-tea-11"
    },
    {
        "ID": 12,
        "title": "Kirby T-Shirt",
        "category": "Herbal Tea",
        "initial_cost": 5000,
        "selling_price": 0,
        "net_weight": 100,
        "product_stock": 200,
        "Image1": "../images/products/product_5-1.jpg",
        "Image2": "../images/products/product_5.jpg",
        "product_review_count": 2200,
        // "product_url_id": "double-strength-tea-12"
    },
];