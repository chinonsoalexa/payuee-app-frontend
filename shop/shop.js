document.addEventListener('DOMContentLoaded', async function () {
    // Call the loading function to render the skeleton loaders
    loading();
    // Assuming you have a reference to the table body element
    // const productBody = document.getElementById('products-grid');

    // // Remove all child elements of the tbody
    // while (productBody.firstChild) {
    //     productBody.removeChild(productBody.firstChild);
    // }
    // products.forEach((product) => {
    //     renderProducts(product);
    // });
});

function renderProducts(product) {

    // Assuming you have a reference to the table body element
    const productBody = document.getElementById('products-grid');

    // Create a new table row element
    const rowElement = document.createElement('div');
    // Add the 'product-card-wrapper' class to the div
    rowElement.classList.add('product-card-wrapper');
    rowElement.id = product.ID; // Set the ID of the row

    // Create the HTML string with dynamic data using template literals
    rowElement.innerHTML = `
    <div class="product-card mb-3 mb-md-4 mb-xxl-5">
            <div class="pc__img-wrapper">
              <div class="swiper-container background-img js-swiper-slider" data-settings='{"resizeObserver": true}'>
                <div class="swiper-wrapper">
                  <div class="swiper-slide">
                    <a href="product15_v10.html"><img loading="lazy" src="${product.image1}" width="330" height="400" alt="${product.title}" class="pc__img"></a>
                  </div><!-- /.pc__img-wrapper -->
                  <div class="swiper-slide">
                    <a href="product15_v10.html"><img loading="lazy" src="${product.image2}" width="330" height="400" alt="${product.title}" class="pc__img"></a>
                  </div><!-- /.pc__img-wrapper -->
                </div>
                <span class="pc__img-prev"><svg width="7" height="11" viewBox="0 0 7 11" xmlns="http://www.w3.org/2000/svg"><use href="#icon_prev_sm" /></svg></span>
                <span class="pc__img-next"><svg width="7" height="11" viewBox="0 0 7 11" xmlns="http://www.w3.org/2000/svg"><use href="#icon_next_sm" /></svg></span>
              </div>
              <button class="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside" data-aside="cartDrawer" title="Add To Cart">Add To Cart</button>
            </div>

            <div class="pc__info position-relative">
              <p class="pc__category">${product.category}</p>
              <h6 class="pc__title"><a href="product15_v10.html">${product.title}</a></h6>
              <div class="product-card__price d-flex">
                <span class="money price">${formatNumberToNaira(product.price)}</span>
              </div>
              <div class="product-card__price d-flex">
                <span class="money price price-old">${formatNumberToNaira(product.previous_price)}</span>
                <span class="money price price-sale">${formatNumberToNaira(product.current_price)}</span>
              </div>
              <div class="product-card__review d-flex align-items-center">
                <div class="reviews-group d-flex">
                  <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
                  <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
                  <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
                  <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
                  <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
                </div>
                <span class="reviews-note text-lowercase text-secondary ms-1">${product.reviews}k+ reviews</span>
              </div>

              <button class="pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist" title="Add To Wishlist">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_heart" /></svg>
              </button>
            </div>
             <div class="pc-labels position-absolute top-0 start-0 w-100 d-flex justify-content-between">
              <div class="pc-labels__right ms-auto">
                <span class="pc-label pc-label_sale d-block text-white">-67%</span>
              </div>
            </div>
            <div class="pc-labels position-absolute top-0 start-0 w-100 d-flex justify-content-between">
              <div class="pc-labels__left">
                <span class="pc-label pc-label_new d-block bg-white">100g</span>
              </div>
            </div>
          </div>
            `;

    // Append the row to the table body
    productBody.appendChild(rowElement);


    // Add event listener to the row element
    rowElement.addEventListener('click', function(event) {
        event.preventDefault();
        // Retrieve the ID of the clicked row
        const rowId = event.target.closest('div').id;
        // Use the ID as needed
        window.location.href = 'success-trans-id.html?id=' + rowId + '&page=';
    });
}

function formatNumberToNaira(number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(number);
}

// Initialize loader array with 8 elements (e.g., with null values)
const loader = Array.from({ length: 8 }, (_, i) => i);

function loading() {
    // Assuming you have a reference to the container element
    const productBody = document.getElementById('products-grid');

    // Remove all child elements of the container
    while (productBody.firstChild) {
        productBody.removeChild(productBody.firstChild);
    }

    // Render loading skeletons for each element in the loader array
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

products = [
    {
        "ID": 1,
        "title": "Infection Cleanse",
        "category": "Herbal Tea",
        "price": 5000,
        "previous_price": 5000,
        "current_price": 3000,
        "grams": 100,
        "stock_remaining": 200,
        "image1": "images/products/product_0.jpg",
        "image2": "images/products/product_0-1.jpg",
        "reviews": 200,
    },
    {
        "ID": 2,
        "title": "Fibroid & Fertility Tea",
        "category": "Herbal Tea",
        "price": 5000,
        "previous_price": 5000,
        "current_price": 3000,
        "grams": 100,
        "stock_remaining": 200,
        "image1": "images/home/demo9/product-2-1.jpg",
        "image2": "images/products/product_0-1.jpg",
        "reviews": 200,
    },
    {
        "ID": 3,
        "title": "Hypertension Tea",
        "category": "Herbal Tea",
        "price": 5000,
        "previous_price": 5000,
        "current_price": 3000,
        "grams": 100,
        "stock_remaining": 200,
        "image1": "images/home/demo9/product-3-1.jpg",
        "image2": "images/products/product_0-1.jpg",
        "reviews": 200,
    },
    {
        "ID": 4,
        "title": "Double Strength Tea",
        "category": "Herbal Tea",
        "price": 5000,
        "previous_price": 5000,
        "current_price": 3000,
        "grams": 100,
        "stock_remaining": 200,
        "image1": "images/home/demo9/product-4-1.jpg",
        "image2": "images/products/product_0-1.jpg",
        "reviews": 200,
    },
    {
        "ID": 5,
        "title": "Green Coffe",
        "category": "Herbal Tea",
        "price": 5000,
        "previous_price": 5000,
        "current_price": 3000,
        "grams": 100,
        "stock_remaining": 200,
        "image1": "images/home/demo9/product-5-1.jpg",
        "image2": "images/products/product_0-1.jpg",
        "reviews": 200,
    },
    {
        "ID": 6,
        "title": "English Breakfast",
        "category": "Herbal Tea",
        "price": 5000,
        "previous_price": 5000,
        "current_price": 3000,
        "grams": 100,
        "stock_remaining": 200,
        "image1": "images/home/demo9/product-6-1.jpg",
        "image2": "images/products/product_0-1.jpg",
        "reviews": 200,
    },
    {
        "ID": 7,
        "title": "Cropped Faux Leather Jacket",
        "category": "Herbal Tea",
        "price": 5000,
        "previous_price": 5000,
        "current_price": 3000,
        "grams": 100,
        "stock_remaining": 200,
        "image1": "images/home/demo9/product-7-1.jpg",
        "image2": "images/products/product_0-1.jpg",
        "reviews": 200,
    },
    {
        "ID": 8,
        "title": "Cropped Faux Leather Jacket",
        "category": "Herbal Tea",
        "price": 5000,
        "previous_price": 5000,
        "current_price": 3000,
        "grams": 100,
        "stock_remaining": 200,
        "image1": "images/home/demo9/product-8-1.jpg",
        "image2": "images/products/product_0-1.jpg",
        "reviews": 200,
    },
    {
        "ID": 9,
        "title": "Infection Cleanse",
        "category": "Herbal Tea",
        "price": 5000,
        "previous_price": 5000,
        "current_price": 3000,
        "grams": 100,
        "stock_remaining": 200,
        "image1": "images/products/product_0.jpg",
        "image2": "images/products/product_0-1.jpg",
        "reviews": 200,
    },
    {
        "ID": 10,
        "title": "Fibroid & Fertility Tea",
        "category": "Herbal Tea",
        "price": 5000,
        "previous_price": 5000,
        "current_price": 3000,
        "grams": 100,
        "stock_remaining": 200,
        "image1": "images/home/demo9/product-2-1.jpg",
        "image2": "images/products/product_0-1.jpg",
        "reviews": 200,
    },
    {
        "ID": 11,
        "title": "Hypertension Tea",
        "category": "Herbal Tea",
        "price": 5000,
        "previous_price": 5000,
        "current_price": 3000,
        "grams": 100,
        "stock_remaining": 200,
        "image1": "images/home/demo9/product-3-1.jpg",
        "image2": "images/products/product_0-1.jpg",
        "reviews": 200,
    },
    {
        "ID": 12,
        "title": "Double Strength Tea",
        "category": "Herbal Tea",
        "price": 5000,
        "previous_price": 5000,
        "current_price": 3000,
        "grams": 100,
        "stock_remaining": 200,
        "image1": "images/home/demo9/product-4-1.jpg",
        "image2": "images/products/product_0-1.jpg",
        "reviews": 200,
    },
]