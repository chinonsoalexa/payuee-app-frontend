var NextPageOnLoad;
var PreviousPageOnLoad;
var CurrentPageOnLoad;
var TotalPageOnLoad;
var TwoBeforePageOnLoad;
var TwoAfterPageOnLoad;
var ThreeAfterPageOnLoad;
var AllRecordsOnPageLoad;

// Initialize loader array with 8 elements (e.g., with null values)
const loader = Array.from({ length: 4 }, (_, i) => i);

function loading() {
    // Render loading skeletons for each element in the loader array
    loader.forEach(() => {
        renderLoadingBlogDetails();
    });
}

document.addEventListener('DOMContentLoaded', async function () {
    // Call the loading function to render the skeleton loaders
    loading();

    // Get the current URL
    const currentUrl = new URL(window.location.href);
    // Assuming you have a reference to the table body element

    // Extract parameters using URLSearchParams
    const params = new URLSearchParams(currentUrl.search);

    // Get individual parameter values
    let pageNumber = params.get("BlogID");
    if (pageNumber == null) {
        pageNumber = "1";
    }

    updateCartNumber();
    updateCartDrawer();

    await getProducts(pageNumber);

});

function renderBlogs(blog) {
    const blogBody = document.getElementById('blog-grid');

    // Create a new product card element
    const rowElement = document.createElement('div');
    rowElement.classList.add('blog-list__item');
    // rowElement.id = product.ID; // Set the ID of the row
    // rowElement.dataset.productId = product.ID; // Add a data attribute for easy access
    const createdAtDate = new Date(blog.CreatedAt);

    // Create the HTML string with dynamic data using template literals
    rowElement.innerHTML = `
        <div class="blog-list__item-image">
            <img loading="lazy" class="h-auto" src="https://payuee.com/image/${blog.Image1}" width="680" height="493" alt="${blog.title}">
          </div>
          <div class="blog-list__item-detail">
            <div class="blog-list__item-meta">
              <span class="blog-list__item-meta__author">${blog.blog_category}</span>
              <span class="blog-list__item-meta__date">${createdAtDate.toLocaleDateString()}</span>
            </div>
            <div class="blog-list__item-title">
              <a href="https://payuee.com/blog_single?BlogID=${blog.ID}">${blog.title}</a>
            </div>
            <div class="blog-list__item-content">
              <p>${createBlogPreview(blog.description1)}</p>
              <a href="https://payuee.com/blog_single?BlogID=${blog.ID}" class="readmore-link">Continue Reading</a>
            </div>
          </div>
    `;

    // Append the new element to the container
    blogBody.appendChild(rowElement);

    // // Reinitialize the SwiperSlideshow after adding the product
    // if (typeof DorngSections.SwiperSlideshow !== 'undefined') {
    //     new DorngSections.SwiperSlideshow()._initSliders();
    // }

    // // If there are more complex product media types, reinitialize them as well
    // if (typeof DorngSections.ProductSingleMedia !== 'undefined') {
    //     new DorngSections.ProductSingleMedia()._initProductMedia();
    // }

    // // Reinitialize Aside
    // if (typeof DorngElements.Aside === 'function') {
    //     new DorngElements.Aside();
    // }

    // Add event listener to the image wrapper
    // const imgWrapper = rowElement.querySelector('.swiper-wrapper');
    // imgWrapper.addEventListener('click', function(event) {
    //     event.preventDefault();
    //     window.location.href = `https://payuee.com/shop/${product.product_url_id}`;
    // });

    // // Add event listener to the 'Add To Cart' button
    // if (!isOutOfStock) {
    //     const addToCartButton = rowElement.querySelector('.pc__atc');
    //     addToCartButton.addEventListener('click', function() {
    //         addToCart(product);
    //         updateCartNumber();
    //         updateCartDrawer();
    //     });
    // }
}

async function getProducts(pageNumber) {
    const apiUrl = "https://api.payuee.com/get-blog-posts/" + pageNumber;

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
                alert('an error ocurred')
            }

            return;
        }

        const responseData = await response.json();

        // updateProductsFromData(responseData.success);
        // Clear specific elements by class name before updating
        // clearElementsByClass('product-card-wrapper');
        const blogBody = document.getElementById('blog-grid');
        blogBody.innerHTML = '';

        responseData.success.forEach((blog) => {
            renderBlogs(blog);
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
        nextPageButtonI.href = `https://payuee.com/blog_single?BlogID=${CurrentPageOnLoad+1}`;
        let previousPageButtonI = document.getElementById('previousPage');
        previousPageButtonI.href = `https://payuee.com/blog_single?BlogID=${CurrentPageOnLoad-1}`;

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

function updateLink(urlIdToUpdate, pageNumber) {
        urlIdToUpdate.href = `https://payuee.com/blog_single?BlogID=${pageNumber}`;
}

// Function to extract plain text from HTML content
function extractTextFromHTML(htmlContent) {
    // Create a temporary element and set the HTML content
    let tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;

    // Extract and return the plain text from the element
    return tempElement.textContent || tempElement.innerText || "";
}

// Function to create a blog preview
function createBlogPreview(htmlContent) {
    // Extract plain text
    let plainText = extractTextFromHTML(htmlContent);

    // Truncate the content to the first 200 characters
    let previewText = plainText.length > 200 ? plainText.substring(0, 200) + "..." : plainText;

    // Return the truncated text and image URL
    return previewText;
}

function renderLoadingBlogDetails() {
    // Assuming you have a reference to the container element
    const blogBody = document.getElementById('blog-grid');
  
    // Create a new element for the skeleton loader
    const blogElement = document.createElement('div');
    blogElement.classList.add('skeleton-wrapper');
  
    // Create the HTML string with dynamic data using template literals
    blogElement.innerHTML = `
      <div class="skeleton-header">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-meta"></div>
      </div>
      <div class="skeleton-body">
        <div class="skeleton skeleton-large"></div>
      </div>
      <div class="skeleton-footer">
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    `;
  
    // Append the new element to the container
    blogBody.appendChild(blogElement);
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
          <img loading="lazy" class="cart-drawer-item__img" src="https://payuee.com/e-shop/images/product_not_available.jpg" alt="">
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
                  src="${cartProduct.Image1 ? "https://payuee.com/image/" + cartProduct.Image1 : '../../e-shop/images/default_img.png'}" 
                  alt="${cartProduct.title}" 
                  onerror="this.onerror=null; this.src='../../e-shop/images/default_img.png';">
  
                </div>
                <div class="cart-drawer-item__info flex-grow-1">
                  <h6 class="cart-drawer-item__title fw-normal">${cartProduct.title}</h6>
                  <p class="cart-drawer-item__option text-secondary">Category: ${cartProduct.category}</p>
                  <p class="cart-drawer-item__option text-secondary">Grams: ${cartProduct.net_weight}</p>
                  <div class="d-flex align-items-center justify-content-between mt-1">
                    <div class="qty-control position-relative">
                      <input type="number" name="quantity" value="${cartProduct.quantity}" min="1" max="${cartProduct.stock_remaining}" class="qty-control__number border-0 text-center">
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
            removeButton.addEventListener('click', () => {
                removeFromCart(cartProduct.ID);
            });
        });
    }
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
        if (item.selling_price !== 0) {
            itemTotal = item.selling_price * item.quantity;
        } else {
            itemTotal = item.initial_cost * item.quantity;
        }
        subtotal += itemTotal;
    });
  
    // Find the subtotal element in the UI
    const subtotalElement = document.getElementById('cart_sub_total_price');
  
    // Check if the element exists before updating its innerText
    if (subtotalElement) {
        subtotalElement.innerText = formatNumberToNaira(subtotal);
    } else {
        console.error('Element with ID cart_sub_total_price not found');
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
  
  function updateQuantity(productId, action, stock_remaining, value = 1) {
    // Get cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Find the product in the cart
    const productIndex = cart.findIndex(item => item.ID === productId);
  
    if (productIndex !== -1) {
        // Update the quantity based on action
        if (action === 'increase') {stock_remaining
          if (cart[productIndex].quantity >= stock_remaining) {
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