var NextPageOnLoad;
var PreviousPageOnLoad;
var CurrentPageOnLoad;
var TotalPageOnLoad;
var TwoBeforePageOnLoad;
var TwoAfterPageOnLoad;
var ThreeAfterPageOnLoad;
var AllRecordsOnPageLoad;

var pageNumber;
var vendorId;

var sort_option = 7;
var min_price = 2500;
var max_price = 35000;
var max_distance = 10;
var min_weight = 1;
var max_weight = 10;

// Initialize loader array with 8 elements (e.g., with null values)
const loader = Array.from({ length: 15 }, (_, i) => i);

document.addEventListener('DOMContentLoaded', async function () {
    // Get URL parameters
    const url = window.location.pathname;
    const parts = url.split('-');
    vendorId = parseInt(parts[parts.length - 1], 10);  // Convert to a number    
    updateCartNumber();
    updateCartDrawer();

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

    await getProducts();

});

async function getProducts() {
    const apiUrl = "https://api.payuee.com/vendor/products/" + pageNumber + "/" + vendorId;
    loading();

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
                // logUserOutIfTokenIsExpired();
            }else {
                // displayErrorMessage();
            }

            return;
        }

        const responseData = await response.json();

        // updateProductsFromData(responseData.success);
        // Clear specific elements by class name before updating
        document.getElementById('products-grid').innerHTML = '';
        document.getElementById('storeName').textContent = responseData.vendor.shop_name;
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
        nextPageButtonI.href = updateLinkPro(CurrentPageOnLoad+1);
        let previousPageButtonI = document.getElementById('previousPage');
        previousPageButtonI.href = updateLinkPro(CurrentPageOnLoad-1);

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
    // Get the current URL
    const currentUrl = window.location.href;
    
    // Match the store name and page number in the URL
    const urlParts = currentUrl.match(/\/store\/([^?]+)\?page=(\d+)/);
    
    
    const storeName = urlParts[1]; // Extracts the dynamic store name (e.g., "cointails-1")
    // const currentPage = parseInt(urlParts[2], 10); // Extracts current page number as an integer
    
    // Generate the new URL
    urlIdToUpdate.href = `https://payuee.com/store/${storeName}?page=${pageNumber}`;
  }

  function updateLinkPro(pageNumber) {
    // Get the current URL
    const currentUrl = window.location.href;
    
    // Match the store name and page number in the URL
    const urlParts = currentUrl.match(/\/store\/([^?]+)\?page=(\d+)/);
    
    
    const storeName = urlParts[1]; // Extracts the dynamic store name (e.g., "cointails-1")
    // const currentPage = parseInt(urlParts[2], 10); // Extracts current page number as an integer
    
    // Generate the new URL
    return `https://payuee.com/store/${storeName}?page=${pageNumber}`;
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

    // Determine if the button should be disabled and what text to display
    const isOutOfStock = product.stock_remaining === 0;
    const buttonText = isOutOfStock ? 'Out of Stock' : 'Add To Cart';
    const buttonDisabled = isOutOfStock ? 'disabled' : '';

    // Create the HTML string with dynamic data using template literals
    rowElement.innerHTML = `
        <div class="product-card mb-3 mb-md-4 mb-xxl-5">
            <div class="pc__img-wrapper">
                <div class="swiper-container background-img js-swiper-slider" data-settings='{"resizeObserver": true}'>
                    <div class="swiper-wrapper">
                        ${renderProductImages(product.product_image, product.title)}
                    </div>
                    <span class="pc__img-prev"><svg width="7" height="11" viewBox="0 0 7 11" xmlns="http://www.w3.org/2000/svg"><use href="#icon_prev_sm" /></svg></span>
                    <span class="pc__img-next"><svg width="7" height="11" viewBox="0 0 7 11" xmlns="http://www.w3.org/2000/svg"><use href="#icon_next_sm" /></svg></span>
                </div>
                <button class="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside" data-aside="cartDrawer" title="Add To Cart" ${buttonDisabled}>${buttonText}</button>
            </div>
            <div class="pc__info position-relative">
                <p class="pc__category">${product.category}</p>
                <h6 class="pc__title"><a href="${url}">${product.title}</a></h6>
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
                <a href="${url}" class="pc__btn-wl-wrapper">
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
                    <span class="pc-label pc-label_new d-block bg-white">${product.net_weight}kg</span>
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
        window.location.href = `${url}`;
    });


  function renderProductImages(imageUrls, title) {
    let imagesHtml = '';
    imageUrls.forEach((url, num) => {
      imagesHtml += `
        <div class="swiper-slide">
            <a href="https://payuee.com/image/${url.url}" class="product-link${num+1}">
                <img loading="lazy" src="https://payuee.com/image/${url.url}" width="330" height="400" alt="${title}" class="pc__img product-img${num+1}">
            </a>
        </div>`;
    });
    return imagesHtml; // Return the full HTML string
  }

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
          <img loading="lazy" class="cart-drawer-item__img" src="/e-shop/Demo3/../images/product_not_available.jpg" alt="">
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
                  <img loading="lazy" class="cart-drawer-item__img" src="${"/image/" + cartProduct.product_image[0].url}" alt="">
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
        sort_option = selectedValue;
        getProducts();
    });
    
    // const searchInput = document.getElementById('searchField');
      
    // // Add an event listener to capture input changes
    // searchInput.addEventListener('input', function(event) {
    //   const searchQuery = event.target.value;  // Get the current input value
      
    //   // Perform actions with the search query
    //   console.log('Search query:', searchQuery);
      
    //   // You can call a function to handle the search here, e.g., make an API request or filter results
    //   performSearch(searchQuery);
    // });
    
    // FILTER BY SHOP SEARCH
    // Example search function (you can replace it with your logic)
    function performSearch(query) {
      if (query.length > 0) {
        console.log('Performing search for:', query);
        // Add your search logic here, such as making an API call or filtering displayed results
              // Handle the color selection
            //   loading();
        
              setTimeout(() => {
              // Clear current product grid
              document.getElementById('products-grid').innerHTML = '';
          
              // Shuffle products array before rendering
            //   const shuffledProducts = shuffleArray(products);
          
              // Render the shuffled products
            //   shuffledProducts.forEach((product) => {
            //       renderProducts(product);
            //   });
          
              }, 3000);
      } else {
        console.log('Search query is empty');
        // Clear or reset search results if the input is empty
      }
    }
    
    // FILTER BY WEIGHT (KG) AND BY PRICE
    const selectors = {
        elementClass: '.price-range-slider',
        minElement: '.price-range__min',
        maxElement: '.price-range__max'
      };
      
      // Iterate over each slider element
      document.querySelectorAll(selectors.elementClass).forEach($se => {
        const currency = $se.dataset.currency || '₦'; // Default currency is Naira
      
        if ($se) {
          // Initialize the slider using the Slider library
          const priceRange = new Slider($se, {
            tooltip_split: true,
            formatter: function(value) {
                if (currency == "kg") {
                    return value + currency;
                } else if (currency == 'km') {
                    return value + currency;
                }
              return currency + value;
            },
          });
      
          // Event listener to get current min and max when slider stops moving
          priceRange.on('slideStop', (value) => {
            const currentMin = value[0];  // Current minimum value
            const currentMax = value[1];  // Current maximum value
            
            // Log or use the min and max values however needed
            console.log('Current Min:', currentMin);
            console.log('Current Max:', currentMax);
            if (currency == "kg") {
                // Update the UI with the min and max values
                const $minEl = $se.parentElement.querySelector(selectors.minElement);
                const $maxEl = $se.parentElement.querySelector(selectors.maxElement);
                $minEl.innerText = `${currentMin}kg`;
                $maxEl.innerText = `${currentMax}kg`;
                min_weight = currentMin;
                max_weight = currentMax;
            } else if (currency == 'km') {
                // Update the UI with the min and max values
                const $minEl = $se.parentElement.querySelector(selectors.minElement);
                const $maxEl = $se.parentElement.querySelector(selectors.maxElement);
                $minEl.innerText = `${currentMin}km`;
                $maxEl.innerText = `${currentMax}km`;
                max_distance = currentMax;
            } else {
                // Update the UI with the min and max values
                const $minEl = $se.parentElement.querySelector(selectors.minElement);
                const $maxEl = $se.parentElement.querySelector(selectors.maxElement);
                $minEl.innerText = `${formatNumberToNaira(currentMin)}`;
                $maxEl.innerText = `${formatNumberToNaira(currentMax)}`;
                min_price = currentMin;
                max_price = currentMax;
            }
      
            // Optionally trigger some action with these values (e.g., filter products)
            getProducts();
          });
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

  // Function to render products in the list
function renderProducts(products) {
    const productResults = document.getElementById("productResults");
    productResults.innerHTML = ""; // Clear previous results

    products.forEach(product => {
      const productItem = document.createElement("li");
      productItem.classList.add("search-suggestion__item", "multi-select__item", "text-primary", "js-search-select", "js-multi-select");

      productItem.innerHTML = `
        <div class="d-flex align-items-center">
          <img src="https://payuee.com/image/${product.product_image[0].url}" alt="${product.title}" class="me-3" width="50" height="50">
          <div>
            <span class="me-auto">${product.stock_remaining}</span><br>
            <span class="text-secondary">${product.title}</span>
          </div>
        </div>
      `;
      productResults.appendChild(productItem);
    });
  }

  // Attach event listener to search input
  document.getElementById("searchField").addEventListener("input", async (event) => {
    const searchQuery = event.target.value;
    if (searchQuery.length > 1) {
        await fetchProducts(searchQuery);
    } else {
      document.getElementById("productResults").innerHTML = ""; // Clear results when search query is too short
    }
  });

  async function fetchProducts(searchTerm) {
    const apiUrl = "https://api.payuee.com/vendor-product-search";

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include', // set credentials to include cookies
        body: JSON.stringify({
            search_term: searchTerm,
            vendor_id: +vendorId,
        })
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
                // logUserOutIfTokenIsExpired();
            }else {
                // displayErrorMessage();
            }

            return;
        }

        const responseData = await response.json();
        renderProducts(responseData.success);
} finally {

    }
}
