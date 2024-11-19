// Initialize loader array with 8 elements (e.g., with null values)
const loader = Array.from({ length: 8 }, (_, i) => i);

document.addEventListener('DOMContentLoaded', async function () {
    // Call the loading function to render the skeleton loaders
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
    // loading();
    // await getProducts();

});

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
    rowElement.classList.add('col-6', 'col-md-4', 'col-lg-3');

    // Create the HTML string with dynamic data using template literals
    rowElement.innerHTML = `
        <div class="product-card product-card_style3 mb-3 mb-md-4 mb-xxl-5">
                <div class="pc__img-wrapper position-relative">
                    <!-- Skeleton loading overlay -->
                    <div class="skeleton skeleton-image position-absolute top-0 start-0 w-100 h-100"></div>
                </div>
        
                <div class="pc__info position-relative">
                    <!-- Skeleton text loader -->
                    <div class="skeleton skeleton-text mb-2"></div>
                    
                    <!-- Skeleton price loader -->
                    <div class="product-card__price d-flex align-items-center">
                        <span class="skeleton skeleton-price"></span>
                    </div>
                </div>
            </div>
    `;

    // Append the new element to the container
    productBody.appendChild(rowElement);
}

async function getProducts() {
    const apiUrl = "https://api.payuee.com/get-store-products";
    loading();

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include', // set credentials to include cookies
        body: JSON.stringify({
            page_number: +pageNumber,
            category: "outfits",
            max_distance: parseFloat(max_distance),
            min_price: parseFloat(min_price),
            max_price: parseFloat(max_price),
            min_weight: parseFloat(min_weight),
            max_weight: parseFloat(max_weight),
            sort_option: +sort_option
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

        // updateProductsFromData(responseData.success);
        // Clear specific elements by class name before updating
        document.getElementById('products-grid').innerHTML = '';
        responseData.success.forEach((product) => {
            renderProducts(product);
        });

        stores = responseData.stores;
        products = responseData.success;
        renderStores(responseData.stores, responseData.success);
        
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
        nextPageButtonI.href = `https://payuee.com/e-shop/Demo3/shop-outfits?page=${CurrentPageOnLoad+1}`;
        let previousPageButtonI = document.getElementById('previousPage');
        previousPageButtonI.href = `https://payuee.com/e-shop/Demo3/shop-outfits?page=${CurrentPageOnLoad-1}`;

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
        
            if (!cartProduct.reposted) {
                if (cartProduct.selling_price !== 0) {
                    price = `
                    <span class="cart-drawer-item__price money price">${formatNumberToNaira(cartProduct.selling_price * cartProduct.quantity)}</span>
                    `;
                } else {
                    price = `
                    <span class="cart-drawer-item__price money price">${formatNumberToNaira(cartProduct.initial_cost * cartProduct.quantity)}</span>
                    `;
                }
            } else {
                price = `
                    <span class="cart-drawer-item__price money price">${formatNumberToNaira(cartProduct.reposted_selling_price * cartProduct.quantity)}</span>
                `;
            }

            // Create a new cart item element
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-drawer-item', 'd-flex', 'position-relative');

            // Generate the HTML for the cart item
            cartItem.innerHTML = `
                <div class="position-relative">
                  <img loading="lazy" class="cart-drawer-item__img" 
     src="${(cartProduct.product_image && cartProduct.product_image[0]?.url) 
             ? "/image/" + cartProduct.product_image[0].url 
             : '../../e-shop/images/default_img.png'}" 
     alt="${cartProduct.title}" 
     onerror="this.onerror=null; this.src='../../e-shop/images/default_img.png';">


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
        if (!product.reposted) {
            if (product.selling_price !== 0) {
                product.totalPrice = product.selling_price * product.quantity;
            } else {
                product.totalPrice = product.initial_cost * product.quantity;
            }
        } else {
          product.totalPrice = product.reposted_selling_price * product.quantity;
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

        if (!item.reposted) {
            if (item.selling_price < item.initial_cost) {
                itemTotal = item.selling_price * item.quantity;
            } else {
                itemTotal = item.initial_cost * item.quantity;
            }
        } else {
            itemTotal = item.reposted_selling_price * item.quantity;
        }

        subtotal += itemTotal;
    });

    // Update the subtotal element in the UI
    document.getElementById('cart_sub_total_price').innerText = formatNumberToNaira(subtotal);
}

function renderProducts(product) {
    const productBody = document.getElementById('products-grid');

    // Create a new product card element
    const rowElement = document.createElement('div');
    rowElement.classList.add('col-6', 'col-md-4', 'col-lg-3');
    rowElement.id = product.ID; // Set the ID of the row
    // rowElement.dataset.productId = product.ID; // Add a data attribute for easy access

    let price;
    let percentage;

    if (!product.reposted) {
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
    } else {
        price = `
        <div class="product-card__price d-flex">
            <span class="money price">${formatNumberToNaira(product.reposted_selling_price)}</span>
        </div>`
        percentage = `
        `
    }

    var editProduct;
    if (!product.repost) {
        editProduct = `
        <a href="${url}" class="pc__btn-wl-wrapper">
            <button onclick="window.location.href=this.parentElement.href" class="pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist" title="Edit Item">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <use href="#icon_view" />
                </svg>
            </button>
        </a>
    `;
    } else {
        editProduct = `
            <div class="pc__btn-wl-wrapper">
                <button id="collaborateButtonCheck" class="pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist" title="Collaborate With Vendor">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <use href="#icon_retweet" />
                    </svg>
                </button>
            </div>
        `;
    }    

    let isOutOfStock;
    let buttonText;
    let buttonDisabled;
    // Determine if the button should be disabled and what text to display
    isOutOfStock = product.stock_remaining === 0;
    buttonText = isOutOfStock ? 'Out of Stock' : 'Add To Cart';
    buttonDisabled = isOutOfStock ? 'disabled' : '';

    // Create the HTML string with dynamic data using template literals
    rowElement.innerHTML = `
        <div class="col-6 col-md-4 col-lg-3">
            <div class="product-card product-card_style3 mb-3 mb-md-4 mb-xxl-5">
              <div class="pc__img-wrapper">
                <a href="product1_simple.html">
                  <img loading="lazy" src="../images/home/demo3/product-7.jpg" width="330" height="400" alt="Cropped Faux leather Jacket" class="pc__img">
                  ${renderProductImages(product.product_image, product.title)}
                </a>
                <div class="product-label bg-red text-white right-0 top-0 left-auto mt-2 mx-2">${percentage}</div>
              </div>

              <div class="pc__info position-relative">
                <h6 class="pc__title">${product.title}</h6>
                <div class="product-card__price d-flex align-items-center">
                  <span class="money price-old">₦129</span>
                  <span class="money price text-secondary">₦99</span>
                </div>

                <div class="anim_appear-bottom position-absolute bottom-0 start-0 d-none d-sm-flex align-items-center bg-body">
                  <button class="btn-link btn-link_lg me-4 text-uppercase fw-medium js-add-cart js-open-aside" data-aside="cartDrawer" title="Add To Cart">Add To Cart</button>
                  <button class="btn-link btn-link_lg me-4 text-uppercase fw-medium js-quick-view" data-bs-toggle="modal" data-bs-target="#quickView" title="Quick view">
                    <span class="d-none d-xxl-block">Quick View</span>
                    <span class="d-block d-xxl-none"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_view" /></svg></span>
                  </button>
                  <button class="pc__btn-wl bg-transparent border-0 js-add-wishlist" title="Collaborate With Vendor">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_heart" /></svg>
                  </button>
                </div>
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
        window.location.href = `https://payuee.com/outfits/${product.product_url_id}`;
    });

    // Attach the 'Collaborate' button event listener to this specific product card
    const collaborateButton = rowElement.querySelector("#collaborateButtonCheck");
    if (collaborateButton) {
        collaborateButton.addEventListener("click", async function () {
            await checkCollaborationEligibility(product.ID);
        });
    }

    function renderProductImages(imageUrls, title) {
        let imagesHtml = '';
    
        // Check if there are any image URLs; if not, use a default image
        if (!imageUrls || imageUrls.length === 0) {
            imagesHtml = `
                    <a href="#">
                    <img loading="lazy" src="../../e-shop/images/default_img.png" width="330" height="400" alt="${title}" class="pc__img">
                    </a>`;
        } else {
            imageUrls.forEach((url, num) => {
                imagesHtml += `
                    <div class="swiper-slide">
                        <a href="https://payuee.com/outfits/${url.url}" class="product-link${num + 1}">
                            <img loading="lazy" src="https://payuee.com/image/${url.url}" width="330" height="400" alt="${title}" class="pc__img product-img${num + 1}">
                        </a>
                    </div>`;
            });
        }
    
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