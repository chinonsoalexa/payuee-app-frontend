document.addEventListener('DOMContentLoaded', async function () {
    // Call the loading function to render the skeleton loaders
    // loading();
    updateCartNumber();
    updateCartDrawer();
    updateMainCart();
});

function updateMainCart() {
    // Get cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Get reference to the cart drawer element
    const cartDrawer = document.getElementById('mainCartBody');
    
    // Clear the cart drawer
    cartDrawer.innerHTML = '';

    // Check if the cart is empty
    if (cart.length === 0) {
        // Create and append a "No products added yet" message
        const emptyMessage = document.createElement('tr');
        emptyMessage.innerHTML = `
        <tr>
                <td>
                  <div class="shopping-cart__product-item">
                    <img loading="lazy" src="images/product_not_available.jpg" width="120" height="120" alt="">
                  </div>
                </td>
                <td>
                  <div class="shopping-cart__product-item__detail">
                    <h4>No Product Added Yet</h4>
                    <ul class="shopping-cart__product-item__options">
                      <li>Select Product</li>
                      <li>"Add To Cart"</li>
                    </ul>
                  </div>
                </td>
                <td>
                </td>
                <td>
                  <div class="qty-control position-relative">
                    
                  </div>
                </td>
                <td>
                </td>
                <td>
                </td>
              </tr>
        `;
        cartDrawer.appendChild(emptyMessage);
        const checkoutButton = document.querySelector('.btn-checkout');
    
            checkoutButton.disabled = true;
    } else {
        // Loop through each item in the cart
        cart.forEach(cartProduct => {
            let subTotal;
            let singlePrice;
        
            if (cartProduct.selling_price !== 0) {
                subTotal = `
                  <span class="shopping-cart__subtotal">${formatNumberToNaira(cartProduct.selling_price * cartProduct.quantity)}</span>
                `;
            } else {
                subTotal = `
                  <span class="shopping-cart__subtotal">${formatNumberToNaira(cartProduct.initial_cost * cartProduct.quantity)}</span>
                `;
            }
            if (cartProduct.selling_price !== 0) {
                singlePrice = `
                  <span class="shopping-cart__product-price">${formatNumberToNaira(cartProduct.initial_cost)}</span>
                `;
            } else {
                singlePrice = `
                  <span class="shopping-cart__product-price">${formatNumberToNaira(cartProduct.initial_cost)}</span>
                `;
            }

            // Create a new cart item element
            const cartItem = document.createElement('tr');

            // Generate the HTML for the cart item
            cartItem.innerHTML = `
                <td>
                  <div class="shopping-cart__product-item">
                    <img loading="lazy" src="${"https://payuee.com/image/"+cartProduct.Image1}" width="120" height="120" alt="">
                  </div>
                </td>
                <td>
                  <div class="shopping-cart__product-item__detail">
                    <h4>${cartProduct.title}</h4>
                    <ul class="shopping-cart__product-item__options">
                      <li>Category: ${cartProduct.category}</li>
                      <li>Net Weigh: ${cartProduct.net_weight}</li>
                    </ul>
                  </div>
                </td>
                <td>
                ${singlePrice}
                </td>
                <td>
                  <div class="qty-control position-relative">
                    <input type="number" name="quantity" value="${cartProduct.quantity}" min="1" class="qty-control__number text-center">
                    <div class="qty-control__reduce">-</div>
                    <div class="qty-control__increase">+</div>
                  </div>
                </td>
                <td>
                ${subTotal}
                </td>
                <td>
                  <a href="#" class="remove-cart">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="#767676" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.259435 8.85506L9.11449 0L10 0.885506L1.14494 9.74056L0.259435 8.85506Z"/>
                      <path d="M0.885506 0.0889838L9.74057 8.94404L8.85506 9.82955L0 0.97449L0.885506 0.0889838Z"/>
                    </svg>                  
                  </a>
                </td>
            `;

            // Append the new cart item to the cart drawer
            cartDrawer.appendChild(cartItem);

            // Add event listeners for quantity update buttons
            const reduceButton = cartItem.querySelector('.qty-control__reduce');
            const increaseButton = cartItem.querySelector('.qty-control__increase');
            const quantityInput = cartItem.querySelector('.qty-control__number');
            const removeButton = cartItem.querySelector('.remove-cart');
            const checkoutButton = document.querySelector('.btn-checkout');

            reduceButton.addEventListener('click', () => {
                updateQuantity(cartProduct.ID, 'reduce', cartProduct.stock_remaining);
            });

            increaseButton.addEventListener('click', () => {
                updateQuantity(cartProduct.ID, 'increase', cartProduct.stock_remaining);
            });

            quantityInput.addEventListener('change', () => {
                updateQuantity(cartProduct.ID, 'set', cartProduct.stock_remaining, parseInt(quantityInput.value));
            });
    
            checkoutButton.addEventListener('click', () => {
              window.location.href = 'shop_checkout.html';
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

function formatNumberToNaira(number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(number);
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
                  <img loading="lazy" class="cart-drawer-item__img" src="${"https://payuee.com/image/"+cartProduct.Image1}" alt="">
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
        updateMainCart();
        updateCartDrawer();
        calculateCartSubtotal();
        updateMainCart();
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
    updateMainCart();
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
    document.getElementById('subtotalMain').innerText = formatNumberToNaira(subtotal);
}

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