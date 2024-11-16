// Declare the productId variable at the top of the script
var productId;
var ReviewCount;
var pageNumber = 1;
var categoryId = "";

// Initialize loader array with 8 elements (e.g., with null values)
const loader = Array.from({ length: 16 }, (_, i) => i);

document.addEventListener('DOMContentLoaded', async function () {
    // Get URL parameters
    const url = window.location.pathname;
    const parts = url.split('-');
    productId = parseInt(parts[parts.length - 1], 10);  // Convert to a number    
    // console.log("current url: ", url);
    // console.log("current url id: ", productId);

    // Update cart number and drawer
    updateCartNumber();
    updateCartDrawer();
    loading();
    // renderLoadingDetails();
    getProduct(productId);
  //   setTimeout(() => {
  //   // Check if productId exists
  //   if (productId) {
  //       // Find the product by ID
  //       const product = products.find(product => product.ID === 2);

  //       if (product) {
  //           renderLoadingDetails();
  //           renderProductDetails(product);
  //       } else {
  //           // If product not found, default to product with ID 1
  //           const product2 = products.find(product => product.ID === 1);
  //           productId = 1; // Update productId to default
  //           renderLoadingDetails();
  //           renderProductDetails(product2);
  //       }
  //   } else {
  //       // If no productId in URL, render the first product by default
  //       // If product not found, default to product with ID 1
  //       const product2 = products.find(product => product.ID === 1);
  //       productId = 1; // Update productId to default
  //         renderLoadingDetails();
  //         renderProductDetails(product2);
  //   }
  // }, 3000);
  // Other initializations...
});

function replaceURL(newURL) {
  // Replace the current URL without reloading the page
  window.history.replaceState({}, '', newURL);
}

function getCurrentUrl(title, description) {
  return "url="+window.location.href+"&text=Check%20"+encodeURIComponent(title)+"%20out!%20"+encodeURIComponent(description);
}

async function getProduct(productID) {
  const apiUrl = "https://api.payuee.com/product/" + productID;
  renderLoadingDetails();

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
              logUserOutIfTokenIsExpired();
          }else {
              // displayErrorMessage();
          }

          return;
      }

      const responseData = await response.json();
      renderProductDetails(responseData.success, responseData.related);
      categoryId = responseData.success.category;
     
} finally {

  }
}

async function getNextProduct(productID) {
  const apiUrl = "https://api.payuee.com/next-product/" + productID + "/" + categoryId;
  renderLoadingDetails();

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
              logUserOutIfTokenIsExpired();
          }else {
              // displayErrorMessage();
          }

          return;
      }

      const responseData = await response.json();
      renderProductDetails(responseData.success, responseData.related);;
      productId = responseData.success.ID;
      categoryId = responseData.success.category;
      replaceURL('/shop/' + responseData.success.product_url_id);
     
} finally {

  }
}

async function getPreviousProduct(productID) {
  const apiUrl = "https://api.payuee.com/previous-product/" + productID + "/" + categoryId;
  renderLoadingDetails();

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
              logUserOutIfTokenIsExpired();
          }else {
              // displayErrorMessage();
          }

          return;
      }

      const responseData = await response.json();
      renderProductDetails(responseData.success, responseData.related);
      productId = responseData.success.ID;
      categoryId = responseData.success.category;
      replaceURL('/shop/' + responseData.success.product_url_id);
     
} finally {

  }
}

function getCurrentUrlU(title, description) {
  return "u="+window.location.href+"&text=Check%20"+encodeURIComponent(title)+"%20out!%20"+encodeURIComponent(description);
}

function renderProductDetails(product, related) {
    // Assuming you have a reference to the container element
    const productBody = document.getElementById('products-details-grid');

    // Create a new product card element
    const rowElement = document.createElement('section');
    rowElement.classList.add('row');
    // rowElement.id = product.ID; // Set the ID of the row
    // Remove all child elements of the tbody
      productBody.innerHTML = "";
    // console.log(product);
    let percentage;
    let price;
   ReviewCount = product.product_review_count;
        
   if (!product.reposted) {
      if (product.selling_price < product.initial_cost) {
        price = `
        <span class="old-price">${formatNumberToNaira(product.initial_cost)}</span>
        <span class="special-price">${formatNumberToNaira(product.selling_price)}</span>
        `;
        let currentPercent = calculatePercentageOff(product.initial_cost, product.selling_price)
        percentage = `
        <div class="product-label sale-label">
        <span>-${currentPercent}%</span>
        </div>
        `
      } else {
          price = `
          <span class="current-price">${formatNumberToNaira(product.initial_cost)}</span>
          `
          percentage = ``
      }      
    } else {
      price = `
          <span class="current-price">${formatNumberToNaira(product.reposted_selling_price)}</span>
       `;
      percentage = `
      `
    }

  let cartButton;
  let commentRender;
  // if (product.product_review_count > 0) {
  //     commentRender = generateReviewsHTML(product.customer_review);
  // } else {
  //   commentRender = '';
  // }

  if (product.stock_remaining <= 0) {
    cartButton = `
    <button class="btn btn-primary btn-addtocart btn-outofstock">Out of Stock</button>
    `
  } else {
    cartButton = `
    <button id="addToCartButton" class="btn btn-primary btn-addtocart js-open-aside" data-aside="cartDrawer">Add to Cart</button>
    `
  }
  
  var showMore;

  if(product.product_review_count > 4) {
    showMore = `
    <h4 class="product-single__reviews-title">
      <span id="show-more-link" style="cursor: pointer; color: blue; text-decoration: underline;">Show More</span>
    </h4>`;
  } else {
    showMore = `
    `;
  }

    // Create the HTML string with dynamic data using template literals
    rowElement.innerHTML = `
            <div class="col-lg-7">
      <div class="product-single__media" data-media-type="vertical-thumbnail">
        <div class="product-single__image">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              ${renderProductImages(product.product_image, product.title)}
            </div>
            <div class="swiper-button-prev"><svg width="7" height="11" viewBox="0 0 7 11" xmlns="http://www.w3.org/2000/svg"><use href="#icon_prev_sm" /></svg></div>
            <div class="swiper-button-next"><svg width="7" height="11" viewBox="0 0 7 11" xmlns="http://www.w3.org/2000/svg"><use href="#icon_next_sm" /></svg></div>
          </div>
        </div>
        <div class="product-single__thumbnail">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide product-single__image-item"><img loading="lazy" class="h-auto" src="../images/products/product_0.jpg" width="104" height="104" alt=""></div>
              <div class="swiper-slide product-single__image-item"><img loading="lazy" class="h-auto" src="../images/products/product_0-1.jpg" width="104" height="104" alt=""></div>
              <div class="swiper-slide product-single__image-item"><img loading="lazy" class="h-auto" src="../images/products/product_0-2.jpg" width="104" height="104" alt=""></div>
              <div class="swiper-slide product-single__image-item"><img loading="lazy" class="h-auto" src="../images/products/product_0-3.jpg" width="104" height="104" alt=""></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-5">
      <div class="d-flex justify-content-between mb-4 pb-md-2">
        <div class="breadcrumb mb-0 d-none d-md-block flex-grow-1">
          <a href="#" class="menu-link menu-link_us-s text-uppercase fw-medium">Home</a>
          <span class="breadcrumb-separator menu-link fw-medium ps-1 pe-1">/</span>
          <a href="#" class="menu-link menu-link_us-s text-uppercase fw-medium">The Shop</a>
        </div><!-- /.breadcrumb -->

        <div class="product-single__prev-next d-flex align-items-center justify-content-between justify-content-md-end flex-grow-1">
          <a id="previousDetail" href="#" class="text-uppercase fw-medium"><svg width="10" height="10" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg"><use href="#icon_prev_md" /></svg><span class="menu-link menu-link_us-s">Prev</span></a>
          <a id="nextDetail" href="#" class="text-uppercase fw-medium"><span class="menu-link menu-link_us-s">Next</span><svg width="10" height="10" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg"><use href="#icon_next_md" /></svg></a>
        </div><!-- /.shop-acs -->
      </div>
      <h1 class="product-single__name">${product.title}</h1>
      <div class="product-single__rating">
        <div class="reviews-group d-flex">
          <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
          <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
          <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
          <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
          <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
        </div>
        <span class="reviews-note text-lowercase text-secondary ms-1">8k+ reviews</span>
      </div>
      <div class="product-single__price">
        ${price}
      </div>
      <div class="product-single__short-desc">
        <p>${product.description}</p>
      </div>
      <form name="addtocart-form" method="post">
        <div class="product-single__swatches">
          <div class="product-swatch text-swatches">
            <label>Sizes</label>
            <div class="swatch-list">
              <input type="radio" name="size" id="swatch-1">
              <label class="swatch js-swatch" for="swatch-1" aria-label="Extra Small" data-bs-toggle="tooltip" data-bs-placement="top" title="Extra Small">XS</label>
              <input type="radio" name="size" id="swatch-2" checked>
              <label class="swatch js-swatch" for="swatch-2" aria-label="Small" data-bs-toggle="tooltip" data-bs-placement="top" title="Small">S</label>
              <input type="radio" name="size" id="swatch-3">
              <label class="swatch js-swatch" for="swatch-3" aria-label="Middle" data-bs-toggle="tooltip" data-bs-placement="top" title="Middle">M</label>
              <input type="radio" name="size" id="swatch-4">
              <label class="swatch js-swatch" for="swatch-4" aria-label="Large" data-bs-toggle="tooltip" data-bs-placement="top" title="Large">L</label>
              <input type="radio" name="size" id="swatch-5">
              <label class="swatch js-swatch" for="swatch-5" aria-label="Extra Large" data-bs-toggle="tooltip" data-bs-placement="top" title="Extra Large">XL</label>
            </div>
            <a href="#" class="sizeguide-link" data-bs-toggle="modal" data-bs-target="#sizeGuide">Size Guide</a>
          </div>
          <div class="product-swatch color-swatches">
            <label>Color</label>
            <div class="swatch-list">
              <input type="radio" name="color" id="swatch-11">
              <label class="swatch swatch-color js-swatch" for="swatch-11" aria-label="Black" data-bs-toggle="tooltip" data-bs-placement="top" title="Black" style="color: #222"></label>
              <input type="radio" name="color" id="swatch-12" checked>
              <label class="swatch swatch-color js-swatch" for="swatch-12" aria-label="Red" data-bs-toggle="tooltip" data-bs-placement="top" title="Red" style="color: #C93A3E"></label>
              <input type="radio" name="color" id="swatch-13">
              <label class="swatch swatch-color js-swatch" for="swatch-13" aria-label="Grey" data-bs-toggle="tooltip" data-bs-placement="top" title="Grey" style="color: #E4E4E4"></label>
            </div>
          </div>
        </div>
        <div class="product-single__addtocart">
          <div class="qty-control position-relative">
            <input type="number" name="quantity" value="1" min="1" max="${product.stock_remaining}" class="qty-control__number text-center">
            <div class="qty-control__reduce">-</div>
            <div class="qty-control__increase">+</div>
          </div><!-- .qty-control -->
          ${cartButton}
        </div>
      </form>
      <div class="product-single__addtolinks">
        <a  id="collaborateButtonCheck" href="#" class="menu-link menu-link_us-s add-to-wishlist"><svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_retweet" /></svg><span>Re-post Product</span></a>
        <share-button class="share-button">
          <button class="menu-link menu-link_us-s to-share border-0 bg-transparent d-flex align-items-center">
            <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_sharing" /></svg>
            <span>Share</span>
          </button>
          <details id="Details-share-template__main" class="m-1 xl:m-1.5" hidden="">
            <summary class="btn-solid m-1 xl:m-1.5 pt-3.5 pb-3 px-5">+</summary>
            <div id="Article-share-template__main" class="share-button__fallback flex items-center absolute top-full left-0 w-full px-2 py-4 bg-container shadow-theme border-t z-10">
              <div class="field grow mr-4">
                <label class="field__label sr-only" for="url">Link</label>
                <input type="text" class="field__input w-full" id="url" value="https://payuee-crystal.myshopify.com/blogs/news/go-to-wellness-tips-for-mental-health" placeholder="Link" onclick="this.select();" readonly="">
              </div>
              <button class="share-button__copy no-js-hidden">
                <svg class="icon icon-clipboard inline-block mr-1" width="11" height="13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 11 13">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2 1a1 1 0 011-1h7a1 1 0 011 1v9a1 1 0 01-1 1V1H2zM1 2a1 1 0 00-1 1v9a1 1 0 001 1h7a1 1 0 001-1V3a1 1 0 00-1-1H1zm0 10V3h7v9H1z" fill="currentColor"></path>
                </svg>
                <span class="sr-only">Copy link</span>
              </button>
            </div>
          </details>
        </share-button>
        <script src="js/details-disclosure.js" defer="defer"></script>
        <script src="js/share.js" defer="defer"></script>
      </div>
      <div class="product-single__meta-info">
        <div class="meta-item">
          <label>Available Stock:</label>
          <span>${product.stock_remaining}</span>
          </div>
          <div class="meta-item">
            <label>Category:</label>
            <span>${product.category}</span>
          </div>
          <div class="meta-item">
            <label>Tags:</label>
            <span>${extractValues(product.tags)}</span>
          </div>
          <div class="meta-item">
            <label>Delivery Day(s):</label>
            <span>${product.estimated_delivery}</span>
          </div>
      </div>
    </div>
    `;

    // Append the new element to the container
    productBody.appendChild(rowElement);
    // renderUseGuide(product);

// Reinitialize the CartDrawer
if (typeof PayueeSections.CartDrawer !== 'undefined') {
  new PayueeSections.CartDrawer();
}

// Reinitialize the SwiperSlideshow
if (typeof PayueeSections.SwiperSlideshow !== 'undefined') {
  new PayueeSections.SwiperSlideshow()._initSliders();
}

// Reinitialize the ProductSingleMedia
if (typeof PayueeSections.ProductSingleMedia !== 'undefined') {
  new PayueeSections.ProductSingleMedia()._initProductMedia();
}

// Reinitialize the StarRating
if (typeof PayueeElements.StarRating !== 'undefined') {
  new PayueeElements.StarRating();
}

// Reinitialize Aside
if (typeof PayueeElements.Aside === 'function') {
  new PayueeElements.Aside();
}

// Add event listeners for quantity update buttons
const reduceButton = productBody.querySelector('.qty-control__reduce');
const increaseButton = productBody.querySelector('.qty-control__increase');
const quantityInput = productBody.querySelector('.qty-control__number');

let newQuantity1 = 1;

reduceButton.addEventListener('click', () => {
    let currentQuantity = parseInt(quantityInput.value);
    if (currentQuantity > 1) {
        quantityInput.value = currentQuantity - 1;
        newQuantity1-=1
    }
});

increaseButton.addEventListener('click', () => {
    let currentQuantity = parseInt(quantityInput.value);
    if (currentQuantity <= product.stock_remaining) {
      quantityInput.value = currentQuantity + 1;
      newQuantity1+=1
    }
});

quantityInput.addEventListener('change', () => {
  let newQuantity = parseInt(quantityInput.value);
    if (newQuantity < 1) {
        quantityInput.value = 1;
    }
});

  // Add event listener to the image wrapper
  const previousButton = document.getElementById('previousDetail');
  previousButton.addEventListener('click', function(event) {
      event.preventDefault();
        renderLoadingDetails();
        getPreviousProduct(productId);
  });

  // Add event listener to the image wrapper
  const nextButton = document.getElementById('nextDetail');
  nextButton.addEventListener('click', function(event) {
      event.preventDefault();
        renderLoadingDetails();
        getNextProduct(productId);
  });

  // Add event listener to the 'Add To Cart' button
  if (!product.product_stock < 1) {
    console.log("here1");
    const addToCartButton = document.getElementById('addToCartButton');
    if (addToCartButton) {
    console.log("here2");
    addToCartButton.addEventListener('click', function() {
        // event.preventDefault();
        addToCart(product, newQuantity1);
        updateCartNumber();
        updateCartDrawer();
      });
    }
  }

  function renderProductImages(imageUrls, title) {
    // Default image URL if imageUrls is empty or an image URL is missing
    const defaultImageUrl = 'https://payuee.com/e-shop/images/product_not_available.jpg';
  
    // If imageUrls is empty, use the default image URL
    if (!imageUrls || imageUrls.length === 0) {
      imageUrls = [{ url: defaultImageUrl }];
    }
  
    let imagesHtml = '';
    imageUrls.forEach((url) => {
      const imageUrl = url.url ? `https://payuee.com/image/${url.url}` : defaultImageUrl;
  
      imagesHtml += `
        <div class="swiper-slide product-single__image-item">
          <img loading="lazy" class="h-auto" src="${imageUrl}" width="674" height="674" alt="${title}">
          <a data-fancybox="gallery" href="${imageUrl}" data-bs-toggle="tooltip" data-bs-placement="left" title="Zoom">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_zoom" /></svg>
          </a>
        </div>`;
    });
    
    return imagesHtml; // Return the full HTML string
  }
  

  function extractValues(jsonString) {
    // Parse the JSON string into an array of objects
    const array = JSON.parse(jsonString);
  
    // Map each object to its 'value' and join them with a comma
    const valuesString = array.map(obj => obj.value).join(", ");
  
    return valuesString; // Return the final string
  }

  // Select the 'Show More' link element by its ID
  const showMoreLink = document.getElementById('show-more-link');
  if (showMoreLink) {
    // console.log("showing link if true");
        // Add a click event listener to the link
  showMoreLink.addEventListener('click', async function() {
    // console.log("adding click event to link if true");
    pageNumber += 1
    // Perform the action you want on click
    const apiUrl = `https://api.payuee.com/get-comment/${pageNumber}/${product.ID}`;

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
                
            }else {
                // displayErrorMessage();
            }

            return;
        }

        const responseData = await response.json();

        if (!responseData.success || responseData.success.length === 0) {
          // Perform actions when there are no more comments to view
          swal("No more comments to view.", {
            icon: "info",
            buttons: {
              confirm: true,
            },
          });
          pageNumber -= 1
          return;
        }
        responseData.success.forEach((comment) => {
          renderReviews(comment);
        });

    } finally {
    
        }
    // You can add any other actions here
  });
  }

  // Attach the 'Collaborate' button event listener to this specific product card
  const collaborateButton = rowElement.querySelector("#collaborateButtonCheck");
  if (collaborateButton) {
      collaborateButton.addEventListener("click", async function () {
          await checkCollaborationEligibility(product.ID);
      });
  }

  document.querySelector('form[name="customer-review-form"]').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission
  
    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());
  
    let isValid = true;
  
    // Validate rating
    const ratingInput = document.getElementById('form-input-rating');
    if (!ratingInput.value) {
      showError(ratingInput, 'Please provide a rating.');
      isValid = false;
    }
  
    // Validate review
    const reviewInput = document.getElementById('form-input-review');
    const reviewText = reviewInput.value.trim();

    if (!reviewText) {
      showError(reviewInput, 'Review cannot be empty.');
      isValid = false;
    } else if (reviewText.length > 1000) {
      showError(reviewInput, 'Review cannot exceed 1000 characters.');
      isValid = false;
    }
  
    // Validate name
    const nameInput = document.getElementById('form-input-name');
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Name is required.');
      isValid = false;
    }
  
    // Validate email
    const emailInput = document.getElementById('form-input-email');
    if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    }
  
    if (isValid) {
    // Get the checkbox element
      const mailingListCheckbox = document.getElementById('mailing_list_checkbox');
      
      // Check if the box is checked (true) or not (false)
      const isSubscribedToMailingList = mailingListCheckbox.checked;
      // Proceed with form submission
      // alert('Form submitted successfully!');
      const data = {
        productt_id: product.ID,
        rating: +ratingInput.value,
        review: reviewInput.value.trim(),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        add_email: isSubscribedToMailingList,
    };

      const apiUrl = "https://api.payuee.com/post-comment";
  
      const requestOptions = {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          credentials: 'include', // set credentials to include cookies
          body: JSON.stringify(data)
      };
  
      try {
          const response = await fetch(apiUrl, requestOptions);
  
          if (!response.ok) {
              const errorData = await response.json();
  
              if (errorData.error === 'failed to get user from request') {
                  // need to do a data of just null event 
                  // displayErrorMessage();
              } else if (errorData.error === 'user with email already exists') {
                  // need to do a data of just null event 
                  // Perform actions when confirmed
                  swal("You're already registered to our mail list! You're getting our best tips on how to make the most out of our services.", {
                    icon: "info",
                    buttons: {
                      confirm: true,
                    },
                  }).then(() => {
                    ratingInput.value = '';
                    reviewInput.value = '';
                    nameInput.value = '';
                    emailInput.value = '';
                  });
              } else {
                  // displayErrorMessage();
              }
  
              return;
          }
  
          const responseData = await response.json();
          addNewComment(responseData.success);
          // Perform actions when confirmed
          swal("Comment successfully added", {
              icon: "success",
              buttons: {
                  confirm: true,
              },
              }).then(() => {
                ratingInput.value = '';
                reviewInput.value = '';
                nameInput.value = '';
                emailInput.value = '';
              });
    } finally {
    
        }
  
      // Here you can send an AJAX request with form data.
    }
  });
  
  // Function to display error messages below inputs
  function showError(inputElement, errorMessage) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = 'red';
    errorElement.textContent = errorMessage;
    inputElement.parentNode.appendChild(errorElement); // Insert error message after the input field
  }
  
  // Email validation function
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }  

  renderRecommendedProduct(related);

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
      checkRepostEligibility(responseData.collaborate, null, `https://payuee.com/e-shop/vendor/product-collaboration?ProductID=${ID}`);
} finally {

  }
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

function renderUseGuide(product) {
  const useGuideElement = document.getElementById('useGuide');
  
  
  // Create a new use guide card element
  const rowElement = document.createElement('div');
  rowElement.classList.add('modal-dialog', 'size-guide');
  rowElement.id = product.ID+1; // Set the ID of the row

  rowElement.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Use Guide</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="size-guide__wrapper">
          <div class="size-guide__image">
            <img loading="lazy" src="${"https://payuee.com/image/"+product.Image1}" alt="Product Image">
          </div>
          <div class="size-guide__detail">
            <h5>Dosage</h5>
            <table>
              <thead>
                <tr>
                  <th>NET WEIGHT</th>
                  <th>50g</th>
                  <th>100g</th>
                  <th>250g</th>
                  <th>500g</th>
                  <th>1kg</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Morning</td>
                  <td>2</td>
                  <td>2</td>
                  <td>2</td>
                  <td>2</td>
                  <td>2</td>
                </tr>
                <tr>
                  <td>Afternoon</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>Night</td>
                  <td>2</td>
                  <td>2</td>
                  <td>2</td>
                  <td>2</td>
                  <td>2</td>
                </tr>
              </tbody>
            </table>
            <h5>${product.title}'s Indications</h5>
          </div>
        </div>
      </div>
    </div>
  `;

  // Append the new element to the container
  useGuideElement.appendChild(rowElement);
}

function renderProductDescription(product) {
  const useGuideElement = document.getElementById('product-description');

  useGuideElement.innerHTML = `
   <div class="tab-pane fade show active" id="tab-description" role="tabpanel" aria-labelledby="tab-description-tab">
          <div class="product-single__description">
            <h3 class="block-title mb-4">Sed do eiusmod tempor incididunt ut labore</h3>
            <p class="content">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            <div class="row">
              <div class="col-lg-6">
                <h3 class="block-title">Why choose product?</h3>
                <ul class="list text-list">
                  <li>Creat by cotton fibric with soft and smooth</li>
                  <li>Simple, Configurable (e.g. size, color, etc.), bundled</li>
                  <li>Downloadable/Digital Products, Virtual Products</li>
                </ul>
              </div>
              <div class="col-lg-6">
                <h3 class="block-title">Sample Number List</h3>
                <ol class="list text-list">
                  <li>Create Store-specific attrittbutes on the fly</li>
                  <li>Simple, Configurable (e.g. size, color, etc.), bundled</li>
                  <li>Downloadable/Digital Products, Virtual Products</li>
                </ol>
              </div>
            </div>
            <h3 class="block-title mb-0">Lining</h3>
            <p class="content">100% Polyester, Main: 100% Polyester.</p>
          </div>
        </div>
        <div class="tab-pane fade" id="tab-additional-info" role="tabpanel" aria-labelledby="tab-additional-info-tab">
          <div class="product-single__addtional-info">
            <div class="item">
              <label class="h6">Weight</label>
              <span>1.25 kg</span>
            </div>
            <div class="item">
              <label class="h6">Dimensions</label>
              <span>90 x 60 x 90 cm</span>
            </div>
            <div class="item">
              <label class="h6">Size</label>
              <span>XS, S, M, L, XL</span>
            </div>
            <div class="item">
              <label class="h6">Color</label>
              <span>Black, Orange, White</span>
            </div>
            <div class="item">
              <label class="h6">Storage</label>
              <span>Relaxed fit shirt-style dress with a rugged</span>
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="tab-reviews" role="tabpanel" aria-labelledby="tab-reviews-tab">
          <h2 class="product-single__reviews-title">Reviews</h2>
          <div class="product-single__reviews-list">
            <div class="product-single__reviews-item">
              <div class="customer-avatar">
                <img loading="lazy" src="../images/avatar.jpg" alt="">
              </div>
              <div class="customer-review">
                <div class="customer-name">
                  <h6>Janice Miller</h6>
                  <div class="reviews-group d-flex">
                    <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
                    <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
                    <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
                    <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
                    <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
                  </div>
                </div>
                <div class="review-date">April 06, 2023</div>
                <div class="review-text">
                  <p>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est…</p>
                </div>
              </div>
            </div>
            <div class="product-single__reviews-item">
              <div class="customer-avatar">
                <img loading="lazy" src="../images/avatar.jpg" alt="">
              </div>
              <div class="customer-review">
                <div class="customer-name">
                  <h6>Benjam Porter</h6>
                  <div class="reviews-group d-flex">
                    <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
                    <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
                    <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
                    <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
                    <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
                  </div>
                </div>
                <div class="review-date">April 06, 2023</div>
                <div class="review-text">
                  <p>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est…</p>
                </div>
              </div>
            </div>
          </div>
          <div class="product-single__review-form">
            <form name="customer-review-form">
              <h5>Be the first to review “Message Cotton T-Shirt”</h5>
              <p>Your email address will not be published. Required fields are marked *</p>
              <div class="select-star-rating">
                <label>Your rating *</label>
                <span class="star-rating">
                  <svg class="star-rating__star-icon" width="12" height="12" fill="#ccc" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.1429 5.04687C11.1429 4.84598 10.9286 4.76562 10.7679 4.73884L7.40625 4.25L5.89955 1.20312C5.83929 1.07589 5.72545 0.928571 5.57143 0.928571C5.41741 0.928571 5.30357 1.07589 5.2433 1.20312L3.73661 4.25L0.375 4.73884C0.207589 4.76562 0 4.84598 0 5.04687C0 5.16741 0.0870536 5.28125 0.167411 5.3683L2.60491 7.73884L2.02902 11.0871C2.02232 11.1339 2.01563 11.1741 2.01563 11.221C2.01563 11.3951 2.10268 11.5558 2.29688 11.5558C2.39063 11.5558 2.47768 11.5223 2.56473 11.4754L5.57143 9.89509L8.57813 11.4754C8.65848 11.5223 8.75223 11.5558 8.84598 11.5558C9.04018 11.5558 9.12054 11.3951 9.12054 11.221C9.12054 11.1741 9.12054 11.1339 9.11384 11.0871L8.53795 7.73884L10.9688 5.3683C11.0558 5.28125 11.1429 5.16741 11.1429 5.04687Z"/>
                  </svg>
                  <svg class="star-rating__star-icon" width="12" height="12" fill="#ccc" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.1429 5.04687C11.1429 4.84598 10.9286 4.76562 10.7679 4.73884L7.40625 4.25L5.89955 1.20312C5.83929 1.07589 5.72545 0.928571 5.57143 0.928571C5.41741 0.928571 5.30357 1.07589 5.2433 1.20312L3.73661 4.25L0.375 4.73884C0.207589 4.76562 0 4.84598 0 5.04687C0 5.16741 0.0870536 5.28125 0.167411 5.3683L2.60491 7.73884L2.02902 11.0871C2.02232 11.1339 2.01563 11.1741 2.01563 11.221C2.01563 11.3951 2.10268 11.5558 2.29688 11.5558C2.39063 11.5558 2.47768 11.5223 2.56473 11.4754L5.57143 9.89509L8.57813 11.4754C8.65848 11.5223 8.75223 11.5558 8.84598 11.5558C9.04018 11.5558 9.12054 11.3951 9.12054 11.221C9.12054 11.1741 9.12054 11.1339 9.11384 11.0871L8.53795 7.73884L10.9688 5.3683C11.0558 5.28125 11.1429 5.16741 11.1429 5.04687Z"/>
                  </svg>
                  <svg class="star-rating__star-icon" width="12" height="12" fill="#ccc" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.1429 5.04687C11.1429 4.84598 10.9286 4.76562 10.7679 4.73884L7.40625 4.25L5.89955 1.20312C5.83929 1.07589 5.72545 0.928571 5.57143 0.928571C5.41741 0.928571 5.30357 1.07589 5.2433 1.20312L3.73661 4.25L0.375 4.73884C0.207589 4.76562 0 4.84598 0 5.04687C0 5.16741 0.0870536 5.28125 0.167411 5.3683L2.60491 7.73884L2.02902 11.0871C2.02232 11.1339 2.01563 11.1741 2.01563 11.221C2.01563 11.3951 2.10268 11.5558 2.29688 11.5558C2.39063 11.5558 2.47768 11.5223 2.56473 11.4754L5.57143 9.89509L8.57813 11.4754C8.65848 11.5223 8.75223 11.5558 8.84598 11.5558C9.04018 11.5558 9.12054 11.3951 9.12054 11.221C9.12054 11.1741 9.12054 11.1339 9.11384 11.0871L8.53795 7.73884L10.9688 5.3683C11.0558 5.28125 11.1429 5.16741 11.1429 5.04687Z"/>
                  </svg>
                  <svg class="star-rating__star-icon" width="12" height="12" fill="#ccc" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.1429 5.04687C11.1429 4.84598 10.9286 4.76562 10.7679 4.73884L7.40625 4.25L5.89955 1.20312C5.83929 1.07589 5.72545 0.928571 5.57143 0.928571C5.41741 0.928571 5.30357 1.07589 5.2433 1.20312L3.73661 4.25L0.375 4.73884C0.207589 4.76562 0 4.84598 0 5.04687C0 5.16741 0.0870536 5.28125 0.167411 5.3683L2.60491 7.73884L2.02902 11.0871C2.02232 11.1339 2.01563 11.1741 2.01563 11.221C2.01563 11.3951 2.10268 11.5558 2.29688 11.5558C2.39063 11.5558 2.47768 11.5223 2.56473 11.4754L5.57143 9.89509L8.57813 11.4754C8.65848 11.5223 8.75223 11.5558 8.84598 11.5558C9.04018 11.5558 9.12054 11.3951 9.12054 11.221C9.12054 11.1741 9.12054 11.1339 9.11384 11.0871L8.53795 7.73884L10.9688 5.3683C11.0558 5.28125 11.1429 5.16741 11.1429 5.04687Z"/>
                  </svg>
                  <svg class="star-rating__star-icon" width="12" height="12" fill="#ccc" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.1429 5.04687C11.1429 4.84598 10.9286 4.76562 10.7679 4.73884L7.40625 4.25L5.89955 1.20312C5.83929 1.07589 5.72545 0.928571 5.57143 0.928571C5.41741 0.928571 5.30357 1.07589 5.2433 1.20312L3.73661 4.25L0.375 4.73884C0.207589 4.76562 0 4.84598 0 5.04687C0 5.16741 0.0870536 5.28125 0.167411 5.3683L2.60491 7.73884L2.02902 11.0871C2.02232 11.1339 2.01563 11.1741 2.01563 11.221C2.01563 11.3951 2.10268 11.5558 2.29688 11.5558C2.39063 11.5558 2.47768 11.5223 2.56473 11.4754L5.57143 9.89509L8.57813 11.4754C8.65848 11.5223 8.75223 11.5558 8.84598 11.5558C9.04018 11.5558 9.12054 11.3951 9.12054 11.221C9.12054 11.1741 9.12054 11.1339 9.11384 11.0871L8.53795 7.73884L10.9688 5.3683C11.0558 5.28125 11.1429 5.16741 11.1429 5.04687Z"/>
                  </svg>
                </span>
                <input type="hidden" id="form-input-rating" value="">
              </div>
              <div class="mb-4">
                <textarea id="form-input-review" class="form-control form-control_gray" placeholder="Your Review" cols="30" rows="8"></textarea>
              </div>
              <div class="form-label-fixed mb-4">
                <label for="form-input-name" class="form-label">Name *</label>
                <input id="form-input-name" class="form-control form-control-md form-control_gray">
              </div>
              <div class="form-label-fixed mb-4">
                <label for="form-input-email" class="form-label">Email address *</label>
                <input id="form-input-email" class="form-control form-control-md form-control_gray">
              </div>
              <div class="form-check mb-4">
                <input class="form-check-input form-check-input_fill" type="checkbox" value="" id="remember_checkbox">
                <label class="form-check-label" for="remember_checkbox">
                  Save my name, email, and website in this browser for the next time I comment.
                </label>
              </div>
              <div class="form-action">
                <button type="submit" class="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
  `;

  // renderRecommendedProduct(product);
      // Shuffle products array before rendering
      // const shuffledProducts = shuffleArray(products);

      // Render the shuffled products
      // shuffledProducts.forEach((product) => {
        // renderRecommendedProduct(product);
      // });
}

// Shuffle function using Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];  // Swap elements
  }
  return array;
}

function renderRecommendedProduct(products) {
  if (products.length < 1) {
    document.getElementById("related_products1").innerHTML = "";
    return;
  }

  // Shuffle products array before rendering
  // const shuffledProducts = shuffleArray(products);
  document.getElementById('related_products_container').innerHTML = '';

  // Render the shuffled products
  products.forEach((product) => {
    const recommendElement = document.getElementById('related_products_container');
    
    // Create a new product card element
    const rowElement = document.createElement('div');
    rowElement.classList.add('swiper-slide', 'product-card'); 
    // rowElement.id = product.ID;

    // Determine if the button should be disabled and what text to display
    const isOutOfStock = product.stock_remaining === 0;
    // const isOutOfStock = 7 === 0;
    const buttonText = isOutOfStock ? 'Out of Stock' : 'Add To Cart';
    const buttonDisabled = isOutOfStock ? 'disabled' : '';

    rowElement.innerHTML = `
    <div class="pc__img-wrapper">
        <a href="https://payuee.com/outfits/${product.product_url_id}">
          <img loading="lazy" src="https://payuee.com/image/${product.product_image[0].url}" width="330" height="400" alt="${product.title}" class="pc__img">
          <img loading="lazy" src="https://payuee.com/image/${product.product_image[0].url}" width="330" height="400" alt="${product.title}" class="pc__img pc__img-second">
        </a>
        <button class="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside" data-aside="cartDrawer" title="Add To Cart" ${buttonDisabled}>${buttonText}</button>
      </div>

      <div class="pc__info position-relative">
        <p class="pc__category">${product.category}</p>
        <h6 class="pc__title"><a href="https://payuee.com/outfits/${product.product_url_id}">${product.title}</a></h6>
        <div class="product-card__price d-flex">
          <span class="money price">${formatNumberToNaira(product.selling_price)}</span>
        </div>
      </div>
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
    `;

    // Append the new element to the container
    recommendElement.appendChild(rowElement);
        // Add event listener to the 'Add To Cart' button
        if (!isOutOfStock) {
          const addToCartButton = rowElement.querySelector('.pc__atc');
          addToCartButton.addEventListener('click', function() {
              addToCart(product);
              updateCartNumber();
              updateCartDrawer();
          });
      }
  });

    // Reinitialize Swiper
    reinitializeSwiper();
}

// Function to reinitialize Swiper
function reinitializeSwiper() {
  // Destroy the existing Swiper instance if it exists
  const existingSwiper = document.querySelector('.swiper-container.js-swiper-slider.swiper-initialized');
  if (existingSwiper && existingSwiper.swiper) {
    existingSwiper.swiper.destroy(true, true); // Destroy old instance
  }

  // Initialize Swiper for the new related products
  const swiper = new Swiper('.js-swiper-slider', {
    autoplay: false,
    slidesPerView: 4,
    slidesPerGroup: 4,
    effect: 'none',
    loop: true,
    pagination: {
      el: '.products-pagination',  // Updated selector
      type: 'bullets',
      clickable: true,
    },
    navigation: {
      nextEl: '.products-carousel__next',  // Correct selector
      prevEl: '.products-carousel__prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 14,
      },
      768: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 24,
      },
      992: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 30,
      },
    },
  });
}

function loading() {
  // Render loading skeletons for each element in the loader array
  document.getElementById('related_products_container').innerHTML = '';
  loader.forEach(() => {
      renderLoading();
  });
}

function renderLoading() {
  // Assuming you have a reference to the container element
  const productBody = document.getElementById('related_products_container');

  // Create a new element for the skeleton loader
  const rowElement = document.createElement('div');
  rowElement.classList.add('swiper-slide', 'product-card','product-card-wrapper');

  // Create the HTML string with dynamic data using template literals
  rowElement.innerHTML = `
      <div class="product-card mb-3 mb-md-4 mb-xxl-5">
          <!-- Skeleton Loader -->
          <div class="skeleton-wrapperr">
              <div class="skeletonn skeleton-imgg loading-cursorr"></div>
              <div class="skeletonn skeleton-titlee loading-cursorr"></div>
              <div class="skeletonn skeleton-categoryy loading-cursorr"></div>
              <div class="skeletonn skeleton-pricee loading-cursorr"></div>
              <div class="skeletonn skeleton-revieww loading-cursorr"></div>
              <div class="skeletonn skeleton-labell loading-cursorr"></div>
          </div>
      </div>
  `;

  // Append the new element to the container
  productBody.appendChild(rowElement);
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

function calculatePercentageOff(previousPrice, currentPrice) {
  if (previousPrice <= 0) {
      return 0; // Prevent division by zero or negative values
  }
  const discount = previousPrice - currentPrice;
  const percentageOff = (discount / previousPrice) * 100;
  return percentageOff.toFixed(0); // Return the result rounded to two decimal places
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

function renderLoadingDetails() {
  // Assuming you have a reference to the container element
  const productBody = document.getElementById('products-details-grid');

  // Create a new element for the skeleton loader
  const rowElement = document.createElement('div');
  rowElement.classList.add('skeleton-wrapper');

  // Create the HTML string with dynamic data using template literals
  rowElement.innerHTML = `
        <div class="skeleton-column">
          <div class="skeleton skeleton-img-small"></div>
          <div class="skeleton skeleton-img-small"></div>
          <div class="skeleton skeleton-img-small"></div>
          <div class="skeleton skeleton-img-small"></div>
        </div>
        
        <div class="skeleton skeleton-large"></div>
  `;

  // Append the new element to the container
  productBody.appendChild(rowElement);
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
                <img loading="lazy" class="cart-drawer-item__img" src="${"https://payuee.com/image/"+cartProduct.Image1}" alt="">
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

// Function to create star rating
function createStarRating(rating) {
  let stars = '';
  for (let i = 0; i < rating; i++) {
    stars += `<svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>`;
  }
  for (let i = rating; i < 5; i++) {
    stars += `<svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star_outline" /></svg>`;
  }
  return stars;
}

// Function to populate reviews and return the HTML
function generateReviewsHTML(reviews) {
  let reviewHTMLString = '';

  reviews.forEach(review => {
    const reviewHTML = `
      <div class="product-single__reviews-item">
        <div class="customer-avatar">
          <img loading="lazy" src="/images/avatar.jpg" alt="${review.name}">
        </div>
        <div class="customer-review">
          <div class="customer-name">
            <h6>${review.name}</h6>
            <div class="reviews-group d-flex">
              ${createStarRating(review.rating)}
            </div>
          </div>
          <div class="review-date">${convertToNormalDate(review.CreatedAt)}</div>
          <div class="review-text">
            <p>${review.review}</p>
          </div>
        </div>
      </div>
    `;
    reviewHTMLString += reviewHTML; // Append the HTML string for each review
  });

  return reviewHTMLString; // Return the full HTML string of all reviews
}

function convertToNormalDate(isoDateString) {
  const date = new Date(isoDateString);
  
  // Format the date as YYYY-MM-DD (or customize as needed)
  const formattedDate = date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long', // 'long' for full month name, or 'numeric'/'short' for different formats
    day: 'numeric'
  });

  return formattedDate;
}

function getCurrentDate() {
  const date = new Date();
  
  // Format the date as YYYY-MM-DD (or customize as needed)
  const formattedDate = date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long', // 'long' for full month name, or 'numeric'/'short' for different formats
    day: 'numeric'
  });

  return formattedDate;
}

function addNewComment(review) {
  // Assuming you have a reference to the container element
  const productBody = document.getElementById('comment_posts');

  // Create a new element for the skeleton loader
  const rowElement = document.createElement('div');
  rowElement.classList.add('product-single__reviews-item');

  // Create the HTML string with dynamic data using template literals
  rowElement.innerHTML = `
        <div class="customer-avatar">
          <img loading="lazy" src="/images/avatar.jpg" alt="${review.name}">
        </div>
        <div class="customer-review">
          <div class="customer-name">
            <h6>${review.name}</h6>
            <div class="reviews-group d-flex">
              ${createStarRating(review.rating)}
            </div>
          </div>
          <div class="review-date">${getCurrentDate()}</div>
          <div class="review-text">
            <p>${review.review}</p>
          </div>
        </div>
  `;

  // Append the new element to the container
  productBody.appendChild(rowElement);

    // Select the review button by ID or class
    const reviewButton = document.getElementById('review-button');
  
    // Update the inner HTML to reflect the new review count
    reviewButton.innerHTML = `Reviews (${ReviewCount+1})
      <svg class="accordion-button__icon" viewBox="0 0 14 14"><g aria-hidden="true" stroke="none" fill-rule="evenodd">
      <path class="svg-path-vertical" d="M14,6 L14,8 L0,8 L0,6 L14,6"></path>
      <path class="svg-path-horizontal" d="M14,6 L14,8 L0,8 L0,6 L14,6"></path></g></svg>`;

}

function renderReviews(review) {
  // Assuming you have a reference to the container element
  const productBody = document.getElementById('comment_posts');

  // Create a new element for the skeleton loader
  const rowElement = document.createElement('div');
  rowElement.classList.add('product-single__reviews-item');

  // Create the HTML string with dynamic data using template literals
  rowElement.innerHTML = `
        <div class="customer-avatar">
          <img loading="lazy" src="/images/avatar.jpg" alt="${review.name}">
        </div>
        <div class="customer-review">
          <div class="customer-name">
            <h6>${review.name}</h6>
            <div class="reviews-group d-flex">
              ${createStarRating(review.rating)}
            </div>
          </div>
          <div class="review-date">${convertToNormalDate(review.CreatedAt)}</div>
          <div class="review-text">
            <p>${review.review}</p>
          </div>
        </div>
  `;

  // Append the new element to the container
  productBody.appendChild(rowElement);

    // Select the review button by ID or class
    const reviewButton = document.getElementById('review-button');

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