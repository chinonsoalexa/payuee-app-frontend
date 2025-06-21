document.addEventListener('DOMContentLoaded', () => {
    // Call the update cart functionality
    updateCartNumber();
    updateCartDrawer();

    // Add event listeners for logout links if they exist
    const loginLink1 = document.getElementById('logoutLink1');
    if (loginLink1) {
        loginLink1.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    }

    const loginLink2 = document.getElementById('logoutLink2');
    if (loginLink2) {
        loginLink2.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    }
});

// Function to check if the user is authenticated and redirect if not
function get_auth_status() {
    if (localStorage.getItem('auth') !== 'true') {
        // Redirect to login if auth status is not valid
        logout();
    } else {
        // Verify auth status with the server
        check_auth_status();
    }
}

// Function to verify the user's authentication status with the server
async function check_auth_status() {
    const apiUrl = "https://api.payuee.com/user-auth-status";
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include', // Include cookies with the request
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            // If authentication fails, log out the user
            logout();
            return;
        }

        // Update auth status on success
        const responseData = await response.json();
        localStorage.setItem('auth', 'true');

    } catch (error) {
        console.error("Error checking auth status:", error);
        logout(); // Log out on error
    }
}

// Function to log out the user and redirect to the login page
async function logout() {
    const apiUrl = "https://api.payuee.com/log-out";
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include', // Include cookies with the request
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            showToastMessageE('An error occurred while logging out.');
            return;
        }

        // Clear auth data and redirect to login page
        localStorage.removeItem('auth');
        // Get the full URL of the current page
        const fullUrl = window.location.href;

        let fullUrl2 = window.location.href; // Get the current full URL
        let baseUrl = fullUrl2.split('?')[0].split('#')[0]; // Remove query and fragment parts
        
        // Adjust to get the base part, which includes the protocol, domain, and '/store/'
        baseUrl = baseUrl.split('/').slice(0, 4).join('/') + '/'; 
        
        // console.log(baseUrl); // Outputs: "https://payuee.com/store/"


        if (baseUrl == "https://payuee.com/store/") {
            // Replace '/store/' with '/store/v/' to update the URL
            let newUrl = fullUrl.replace('/store/', '/store/v/');
            location.replace(newUrl);
            return;
        } else {
            // Redirect to the login/register page with the current URL as the redirectTo parameter
            location.replace(`https://payuee.com/e-shop/v/login_register?redirectTo=${encodeURIComponent(fullUrl)}`);
        }

    } catch (error) {
        console.error("Error during logout:", error);
        showToastMessageE("Failed to log out. Please try again.");
    }
}

// Function to show an error message in a toast
function showToastMessageE(message) {
    const toastErrorElement = document.getElementById('toastError');
    const toastElement = document.getElementById('liveToast1');

    if (toastErrorElement && toastElement) {
        toastErrorElement.textContent = message;
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    } else {
        console.warn("Toast elements not found.");
    }
}

// Check auth status on page load
get_auth_status();


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

// document.addEventListener('DOMContentLoaded', async function() {

// (function () {
//     const bar = document.createElement('div');
//     bar.id = 'payueeCountdownBar';
//     bar.style.cssText = 'background:#fef3c7;color:#92400e;text-align:center;padding:12px 20px;font-family:\'Segoe UI\',sans-serif;border-bottom:2px solid #fbbf24;z-index:9999;';
    
//     bar.innerHTML = `
//       <div style="font-size:18px;font-weight:bold;margin-bottom:6px;">🎉 Treasure Hunt Begins In:</div>
//       <div id="payueeCountdownTimer" style="font-size:24px;font-weight:bold;letter-spacing:1px;">Loading...</div>
//     `;

//     const targetDate = new Date("June 8, 2025 00:00:00").getTime();

//     function updateCountdown() {
//       const now = new Date().getTime();
//       const distance = targetDate - now;
//       const timer = bar.querySelector("#payueeCountdownTimer");

//       if (distance <= 0) {
//         timer.innerHTML = "🎯 It’s time!";
//         return;
//       }

//       const days = Math.floor(distance / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((distance % (1000 * 60)) / 1000);

//       timer.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
//     }

//     updateCountdown();
//     setInterval(updateCountdown, 1000);

//     // Inject the countdown bar after <header>
//     const header = document.querySelector('header');
//     if (header && header.parentNode) {
//       header.parentNode.insertBefore(bar, header.nextSibling);
//     }
//   })();
// });

(function () {
  const originalSetItem = localStorage.setItem;

  // Load the last snapshot of cart from 'cart_copy'
  let previousCart = getCartFromStorage('cart_copy');

  localStorage.setItem = function (key, value) {
    if (key === 'cart') {
      try {
        const newCart = JSON.parse(value);
        syncChanges(previousCart, newCart);
        localStorage.setItem('cart_copy', JSON.stringify(newCart)); // Save snapshot
        previousCart = newCart;
        handleCartUpdate(newCart);
      } catch (e) {
        console.warn('Failed to parse cart in setItem:', e);
      }
    }

    return originalSetItem.apply(this, arguments);
  };

  window.addEventListener('storage', function (event) {
    if (event.key === 'cart') {
      try {
        const newCart = JSON.parse(event.newValue);
        syncChanges(previousCart, newCart);
        localStorage.setItem('cart_copy', JSON.stringify(newCart));
        previousCart = newCart;
        handleCartUpdate(newCart);
      } catch (e) {
        console.warn('Error parsing cart from storage event:', e);
      }
    }
  });

  function getCartFromStorage(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  }

  function syncChanges(oldCart, newCart) {
    const added = newCart.filter(newItem =>
      !oldCart.some(oldItem => oldItem.product_id === newItem.product_id)
    );

    const removed = oldCart.filter(oldItem =>
      !newCart.some(newItem => newItem.product_id === oldItem.product_id)
    );

    const updated = newCart.filter(newItem => {
      const match = oldCart.find(oldItem => oldItem.product_id === newItem.product_id);
      return match && match.quantity !== newItem.quantity;
    });

    // 🔼 Add
    added.forEach(item => syncAdd(item));

    // 🔽 Remove
    removed.forEach(item => syncRemove(item.ID));

    // 🔄 Update
    updated.forEach(item => syncUpdate(item.ID, item.quantity, item.eshop_user_id));
  }

  function syncAdd(item) {
    // console.log('Add to server:', item);
    const body = {
        product_id: item.ID,
        eshop_user_id: item.eshop_user_id,
        quantity: item.quantity,
    };

    fetch('https://api.payuee.com/creat-and-add-cart-item', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  function syncRemove(productId) {
    // console.log('Remove from server:', productId);
    fetch(`https://api.payuee.com/delete-cart-item/${productId}`, {
      method: 'GET',
      credentials: 'include',
    });
  }

  function syncUpdate(productId, quantity, eshop_user_id) {
    const body = {
        product_id: productId,
        eshop_user_id: eshop_user_id,
        quantity: quantity,
    };

    // console.log('Update quantity on server:', productId, quantity);
    fetch(`https://api.payuee.com/creat-and-add-cart-item`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  function handleCartUpdate(cart) {
    // console.log('Cart synced:', cart);
    // Optional UI update
  }
})();
