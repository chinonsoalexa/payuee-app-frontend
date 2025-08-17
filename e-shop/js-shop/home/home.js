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
    await getProducts();

});

function loading() {
    // Render loading skeletons for each element in the loader array
    document.getElementById('products-grid').innerHTML = '';
    document.getElementById('products-grid2').innerHTML = '';
    loader.forEach(() => {
        renderLoading();
    });
    reinitializeSwiper('mySwiper');
}

function renderLoading() {
    const productBody = document.getElementById('products-grid');
    const productBodyDisc = document.getElementById('products-grid2');

    // Create a new element for the main product skeleton loader
    const rowElement = document.createElement('div');
    rowElement.classList.add('col-6', 'col-md-4', 'col-lg-3');
    rowElement.innerHTML = `
        <div class="product-card product-card_style3 mb-3 mb-md-4 mb-xxl-5">
            <div class="pc__img-wrapper position-relative">
                <!-- Skeleton loading overlay for image -->
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

    // Create a new element for the discount skeleton loader
    const rowElementDisc = document.createElement('div');
    rowElementDisc.classList.add('swiper-slide', 'product-card', 'product-card_style3');
    rowElementDisc.innerHTML = `
        <div class="pc__img-wrapper">
            <!-- Skeleton loading overlay for discount image -->
            <div class="skeleton skeleton-image position-absolute top-0 start-0 w-100 h-100 pc__img"></div>
        </div>
        <div class="pc__info position-relative">
            <!-- Skeleton text loader -->
            <div class="skeleton skeleton-text mb-2"></div>
            <!-- Skeleton price loader -->
            <div class="product-card__price d-flex align-items-center">
                <span class="skeleton skeleton-price"></span>
            </div>
        </div>
    `;

    // Append the new skeleton loaders to their respective containers
    productBody.appendChild(rowElement);
    productBodyDisc.appendChild(rowElementDisc);
}

async function getProducts() {
    const apiUrl = "https://api.payuee.com/get-featured-products";
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

            if (errorData.error === 'failed to get featured product') {
                
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
        
        // Clear specific elements by id name before updating
        document.getElementById('products-grid').innerHTML = '';
        if (responseData.featured != null) {
            responseData.featured.forEach((product) => {
                renderProducts(product);
            });
        }

        document.getElementById('products-grid2').innerHTML = '';
        if (responseData.outfits != null) {
            responseData.outfits.forEach((product) => {
                renderProductDiscounts(product);
            });
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
          <img loading="lazy" class="cart-drawer-item__img" src="https://app.payuee.com/e-shop/images/product_not_available.jpg" alt="">
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
    let urll = ""

    if (product.category == "outfits") {
        urll = "https://app.payuee.com/outfits/" + product.product_url_id;
    } else if (product.category == "jewelry") {
        urll = "https://app.payuee.com/jewelry/" + product.product_url_id;
    } else if (product.category == "kids-accessories") {
        urll = "https://app.payuee.com/kids/" + product.product_url_id;
    } else if (product.category == "cars-car-parts") {
        urll = "https://app.payuee.com/cars/" + product.product_url_id;
    } else if (product.category == "tools") {
        urll = "https://app.payuee.com/tools/" + product.product_url_id;
    } else if (product.category == "gadgets") {
        urll = "https://app.payuee.com/gadgets/" + product.product_url_id;
    } else if (product.category == "others") {
        urll = "https://app.payuee.com/outfits/" + product.product_url_id;
    }

    if (!product.reposted) {
        if (product.selling_price < product.initial_cost) {
            price = `
            <span class="money price-old">${formatNumberToNaira(product.initial_cost)}</span>
            <span class="money price text-secondary">${formatNumberToNaira(product.selling_price)}</span>
            `;
            percentage = `<div class="product-label bg-red text-white right-0 top-0 left-auto mt-2 mx-2">-${calculatePercentageOff(product.initial_cost, product.selling_price)+"%"}</div>`;
        } else {
            price = `
            <div class="product-card__price d-flex">
                <span class="money price text-secondary">${formatNumberToNaira(product.initial_cost)}</span>
            </div>`
            percentage = `
            `
        }
    } else {
        price = `
            <span class="money price text-secondary">${formatNumberToNaira(product.reposted_selling_price)}</span>
            `
        percentage = `
        `
    }

    var editProduct;
    if (!product.repost) {
        editProduct = `
        <a href="${urll}" class="pc__btn-wl-wrapper">
            <button onclick="window.location.href=this.parentElement.href" class="pc__btn-wl bg-transparent border-0 js-add-wishlist" title="Collaborate With Vendor">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_view" /></svg>
            </button>
        </a>
    `;
    } else {
        editProduct = `
            <button id="collaborateButtonCheck" class="pc__btn-wl bg-transparent border-0 js-add-wishlist" title="Collaborate With Vendor">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_retweet" /></svg>
            </button>
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
            <div class="product-card product-card_style3 mb-3 mb-md-4 mb-xxl-5">
              <div class="pc__img-wrapper">
                <a href="product1_simple.html">
                  ${renderProductImages(product.product_image, product.title)}
                </a>
                ${percentage}
              </div>

              <div class="pc__info position-relative">
                <h6 class="pc__title">${product.title}</h6>
                <div class="product-card__price d-flex align-items-center">
                  ${price}
                </div>

                <div class="anim_appear-bottom position-absolute bottom-0 start-0 d-none d-sm-flex align-items-center bg-body">
                  <button id="cartButtonT" class="btn-link btn-link_lg me-4 text-uppercase fw-medium js-add-cart js-open-aside" data-aside="cartDrawer" title="Add To Cart" ${buttonDisabled}>${buttonText}</button>
                  ${editProduct}
                </div>
              </div>
            </div>
    `;

    // Add click event listener to track product clicks
    rowElement.addEventListener("click", () => {
        fetch(`https://api.payuee.com/product-click/${encodeURIComponent(product.title)}/${encodeURIComponent(product.product_url_id)}/${encodeURIComponent(product.category)}/${encodeURIComponent(product.selling_price)}`, {
            method: "GET",
            credentials: 'include' // Ensures cookies and authentication are sent
        });
    });

    // Append the new element to the container
    productBody.appendChild(rowElement);

    // Attach the 'Collaborate' button event listener to this specific product card
    const collaborateButton = rowElement.querySelector("#collaborateButtonCheck");
    if (collaborateButton) {
        collaborateButton.addEventListener("click", async function () {
            await checkCollaborationEligibility(product.ID);
        });
    }

    function renderProductImages(imageUrls, title) {
        const defaultImageUrl = "../../e-shop/images/default_img.png";
        const productImageUrl = imageUrls && imageUrls.length > 0
            ? `https://app.payuee.com/image/${imageUrls[0].url}`
            : defaultImageUrl;
    
        return `
            <a href="${urll}">
                <img loading="lazy" src="${productImageUrl}" alt="${title}" class="pc__img" style="width: 330px; height: 400px;">
            </a>`;
    }    

    // Add event listener to the 'Add To Cart' button
    if (!isOutOfStock) {
        const addToCartButton = rowElement.querySelector('#cartButtonT');
        addToCartButton.addEventListener('click', function() {
            addToCart(product);
            updateCartNumber();
            updateCartDrawer();
        });
    }
}

function renderProductDiscounts(product) {
    const productBody = document.getElementById('products-grid2');
    const rowElement = document.createElement('div');
    rowElement.classList.add('swiper-slide', 'product-card', 'product-card_style3');
    rowElement.id = product.ID;

    let price, percentage, urll = "";

    if (product.category == "outfits") {
        urll = "https://app.payuee.com/outfits/" + product.product_url_id;
    } else if (product.category == "jewelry") {
        urll = "https://app.payuee.com/jewelry/" + product.product_url_id;
    } else if (product.category == "kids-accessories") {
        urll = "https://app.payuee.com/kids/" + product.product_url_id;
    } else if (product.category == "cars-car-parts") {
        urll = "https://app.payuee.com/cars/" + product.product_url_id;
    } else if (product.category == "tools") {
        urll = "https://app.payuee.com/tools/" + product.product_url_id;
    } else if (product.category == "gadgets") {
        urll = "https://app.payuee.com/gadgets/" + product.product_url_id;
    } else if (product.category == "others") {
        urll = "https://app.payuee.com/outfits/" + product.product_url_id;
    }

    if (!product.reposted) {
        if (product.selling_price < product.initial_cost) {
            price = `
                <span class="money price-old">${formatNumberToNaira(product.initial_cost)}</span>
                <span class="money price text-secondary">${formatNumberToNaira(product.selling_price)}</span>
            `;
            percentage = `<div class="product-label bg-red text-white right-0 top-0 left-auto mt-2 mx-2">-${calculatePercentageOff(product.initial_cost, product.selling_price)+"%"}</div>`;
        } else {
            price = `
                <div class="product-card__price d-flex">
                    <span class="money price text-secondary">${formatNumberToNaira(product.initial_cost)}</span>
                </div>`;
            percentage = '';
        }
    } else {
        price = `<span class="money price text-secondary">${formatNumberToNaira(product.reposted_selling_price)}</span>`;
        percentage = '';
    }

    let editProduct;
    if (!product.repost) {
        editProduct = `
            <a href="${urll}" class="pc__btn-wl-wrapper">
                <button onclick="window.location.href=this.parentElement.href" class="pc__btn-wl bg-transparent border-0 js-add-wishlist" title="Collaborate With Vendor">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_view" /></svg>
                </button>
            </a>`;
    } else {
        editProduct = `
            <button id="collaborateButtonCheck" class="pc__btn-wl bg-transparent border-0 js-add-wishlist" title="Collaborate With Vendor">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_retweet" /></svg>
            </button>`;
    }

    const isOutOfStock = product.stock_remaining === 0;
    const buttonText = isOutOfStock ? 'Out of Stock' : 'Add To Cart';
    const buttonDisabled = isOutOfStock ? 'disabled' : '';

    rowElement.innerHTML = `
        <div class="pc__img-wrapper">
            <a href="${urll}">
                ${renderProductImages2(product.product_image, product.title, urll)}
            </a>
            ${percentage}
        </div>

        <div class="pc__info position-relative">
            <h6 class="pc__title"><a href="${urll}">${product.title}</a></h6>
            <div class="product-card__price d-flex align-items-center">
                ${price}
            </div>

            <div class="anim_appear-bottom position-absolute bottom-0 start-0 d-none d-sm-flex align-items-center bg-body">
                <button id="cartButtonT" class="btn-link btn-link_lg me-4 text-uppercase fw-medium js-add-cart js-open-aside" data-aside="cartDrawer" title="Add To Cart" ${buttonDisabled}>${buttonText}</button>
                ${editProduct}
            </div>
        </div>
    `;

    // Add click event listener to track product clicks
    rowElement.addEventListener("click", () => {
        fetch(`https://api.payuee.com/product-click/${encodeURIComponent(product.title)}/${encodeURIComponent(product.product_url_id)}/${encodeURIComponent(product.category)}/${encodeURIComponent(product.selling_price)}`, {
            method: "GET",
            credentials: 'include' // Ensures cookies and authentication are sent
        });
    });

    productBody.appendChild(rowElement);

    const collaborateButton = rowElement.querySelector("#collaborateButtonCheck");
    if (collaborateButton) {
        collaborateButton.addEventListener("click", async function () {
            await checkCollaborationEligibility(product.ID);
        });
    }

    if (!isOutOfStock) {
        const addToCartButton = rowElement.querySelector('#cartButtonT');
        addToCartButton.addEventListener('click', function() {
            addToCart(product);
            updateCartNumber();
            updateCartDrawer();
        });
    }
    reinitializeSwiper('mySwiper');
}

function reinitializeSwiper(id) {
    // Destroy any existing Swiper instance attached to the element
    const swiperContainer = document.getElementById(id);
    
    if (swiperContainer.swiper) {
      swiperContainer.swiper.destroy(true, true);
    }
  
    // Parse settings from the data attribute, and set default options as a fallback
    const userSettings = JSON.parse(swiperContainer.getAttribute('data-settings') || '{}');
    
    // Merge user settings with defaults
    const defaultSettings = {
      preventClicks: true,
      preventClicksPropagation: true,
      preloadImages: true,
      updateOnImagesReady: true,
      loop: false,
      allowSlidePrev: true,
      allowSlideNext: true,
      direction: 'horizontal', // Ensures it moves from right to left
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      speed: 500, // Adjust speed as needed
    };
  
    const settings = { ...defaultSettings, ...userSettings };
    
    // Reinitialize Swiper with combined settings
    new Swiper(swiperContainer, settings);
  }  

function renderProductImages2(imageUrls, title, urll) {
    const defaultImageUrl = "../../e-shop/images/default_img.png";
    const productImageUrl = imageUrls && imageUrls.length > 0
        ? `https://app.payuee.com/image/${imageUrls[0].url}`
        : defaultImageUrl;

    const productImageUrl2 = imageUrls && imageUrls.length > 0
        ? `https://app.payuee.com/image/${imageUrls[0].url}`
        : defaultImageUrl;

    return `
        <a href="${urll}">
            <img loading="lazy" src="${productImageUrl}" alt="${title}" class="pc__img" style="width: 330px; height: 400px;">
            <img loading="lazy" src="${productImageUrl2}" alt="${title}" class="pc__img pc__img-second" style="width: 330px; height: 400px;">
        </a>`;
}


async function checkCollaborationEligibility(ID) {
    const apiUrl = "https://api.payuee.com/vendor/product-collaboration-info/" + ID;

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
                checkRepostEligibility(false, errorData.error, null);
            }

            return;
        }

        const responseData = await response.json();
        // Check eligibility, passing `true` for eligible, or `false` with an error message
        checkRepostEligibility(responseData.collaborate, null, `https://app.payuee.com/e-shop/vendor/product-collaboration?ProductID=${ID}`);
} finally {

    }
}

function calculatePercentageOff(previousPrice, currentPrice) {
    if (previousPrice <= 0) {
        return 0; // Prevent division by zero or negative values
    }
    const discount = previousPrice - currentPrice;
    const percentageOff = (discount / previousPrice) * 100;
    return percentageOff.toFixed(0); // Return the result rounded to two decimal places
  }

// Function to open modal with appropriate messages
function checkRepostEligibility(isEligible, errorMessage = null, collaborationUrl = null) {
    const eligibilityMessage = document.getElementById('eligibilityMessage');
    const errorAlert = document.getElementById('errorAlert');
    const errorMessageEl = document.getElementById('errorMessage');
    const successAlert = document.getElementById('successAlert');
    const collaborateButton = document.getElementById('collaborateButton');
  
    // Reset modal state
    errorAlert.classList.add('d-none');
    successAlert.classList.add('d-none');
    collaborateButton.classList.add('d-none');
    collaborateButton.removeAttribute('href'); // Clear previous URL if any
  
    // Display eligibility messages
    if (isEligible) {
      eligibilityMessage.textContent = "You are eligible to repost this product.";
      successAlert.classList.remove('d-none');
      collaborateButton.classList.remove('d-none');
  
      // Set the new collaboration URL if provided
      if (collaborationUrl) {
        collaborateButton.href = collaborationUrl;
      }
    } else {
      eligibilityMessage.textContent = "You are not eligible to repost this product.";
      if (errorMessage) {
        errorMessageEl.textContent = errorMessage;
        errorAlert.classList.remove('d-none');
      }
    }
  
    // Show the modal
    new bootstrap.Modal(document.getElementById('repostEligibilityModal')).show();
  }