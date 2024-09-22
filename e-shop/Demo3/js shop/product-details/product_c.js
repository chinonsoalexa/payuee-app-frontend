// Declare the productId variable at the top of the script
var productId;
var ReviewCount;
var pageNumber = 1;

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
    renderLoadingDetails();
    getProduct(productId);
  //   setTimeout(() => {
  //   // Check if productId exists
  //   if (productId) {
  //       // Find the product by ID
  //       const product = products.find(product => product.ID === productId);

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
  const apiUrl = "https://api.dorngwellness.com/product/" + productID;

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
              logUserOutIfTokenIsExpired();
          }else {
              // displayErrorMessage();
          }

          return;
      }

      const responseData = await response.json();
      renderProductDetails(responseData.success);
     
} finally {

  }
}

async function getNextProduct(productID) {
  const apiUrl = "https://api.dorngwellness.com/next-product/" + productID;

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
              logUserOutIfTokenIsExpired();
          }else {
              // displayErrorMessage();
          }

          return;
      }

      const responseData = await response.json();
      renderProductDetails(responseData.success);
      replaceURL('/shop/' + responseData.success.product_url_id);
      productId = responseData.success.ID;
     
} finally {

  }
}

async function getPreviousProduct(productID) {
  const apiUrl = "https://api.payuee.com/previous-product/" + productID;

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
              logUserOutIfTokenIsExpired();
          }else {
              // displayErrorMessage();
          }

          return;
      }

      const responseData = await response.json();
      renderProductDetails(responseData.success);
      replaceURL('/shop/' + responseData.success.product_url_id);
      productId = responseData.success.ID;
     
} finally {

  }
}

function getCurrentUrlU(title, description) {
  return "u="+window.location.href+"&text=Check%20"+encodeURIComponent(title)+"%20out!%20"+encodeURIComponent(description);
}

function renderProductDetails(product) {
    // Assuming you have a reference to the container element
    const productBody = document.getElementById('products-details-grid');

    // Create a new product card element
    const rowElement = document.createElement('section');
    rowElement.classList.add('product-single', 'container', 'product-single__type-9');
    rowElement.id = product.ID; // Set the ID of the row
    // Remove all child elements of the tbody
    while (productBody.firstChild) {
      productBody.removeChild(productBody.firstChild);
  }
    // console.log(product);
    let percentage;
   ReviewCount = product.product_review_count;
              
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

  let cartButton;
  let commentRender;
  if (product.product_review_count > 0) {
      commentRender = generateReviewsHTML(product.customer_review);
  } else {
    commentRender = '';
  }

  if (product.product_stock < 1) {
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
        <div class="row">
        <div class="col-lg-7">
          <div class="product-single__media" data-media-type="vertical-thumbnail">
            <div class="product-single__image">
              <div class="swiper-container">
                <div class="swiper-wrapper">
                  <div class="swiper-slide product-single__image-item">
                    <img loading="lazy" class="h-auto" src="${"https://dorngwellness.com/image/"+product.Image1}" width="674" height="674" alt="${product.title}">
                    <a data-fancybox="gallery" href="${"https://dorngwellness.com/image/"+product.Image1}" data-bs-toggle="tooltip" data-bs-placement="left" title="${product.title}">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_zoom" /></svg>
                    </a>
                  </div>
                  <div class="swiper-slide product-single__image-item">
                    <img loading="lazy" class="h-auto" src="${"https://dorngwellness.com/image/"+product.Image2}" width="674" height="674" alt="${product.title}">
                    <a data-fancybox="gallery" href="${"https://dorngwellness.com/image/"+product.Image2}" data-bs-toggle="tooltip" data-bs-placement="left" title="${product.title}">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_zoom" /></svg>
                    </a>
                  </div>
                  <div class="swiper-slide product-single__image-item">
                    <img loading="lazy" class="h-auto" src="${"https://dorngwellness.com/image/"+product.Image1}" width="674" height="674" alt="${product.title}">
                    <a data-fancybox="gallery" href="${"https://dorngwellness.com/image/"+product.Image1}" data-bs-toggle="tooltip" data-bs-placement="left" title="${product.title}">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_zoom" /></svg>
                    </a>
                  </div>
                  <div class="swiper-slide product-single__image-item">
                    <img loading="lazy" class="h-auto" src="${"https://dorngwellness.com/image/"+product.Image2}" width="674" height="674" alt="${product.title}">
                    <a data-fancybox="gallery" href="${"https://dorngwellness.com/image/"+product.Image2}" data-bs-toggle="tooltip" data-bs-placement="left" title="${product.title}">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_zoom" /></svg>
                    </a>
                  </div>
                </div>
                <div class="swiper-button-prev"><svg width="7" height="11" viewBox="0 0 7 11" xmlns="http://www.w3.org/2000/svg"><use href="#icon_prev_sm" /></svg></div>
                <div class="swiper-button-next"><svg width="7" height="11" viewBox="0 0 7 11" xmlns="http://www.w3.org/2000/svg"><use href="#icon_next_sm" /></svg></div>
              </div>
            </div>
            <div class="product-single__thumbnail">
              <div class="swiper-container">
                <div class="swiper-wrapper">
                  <div class="swiper-slide product-single__image-item"><img loading="lazy" class="h-auto" src="${"https://dorngwellness.com/image/"+product.Image1}" width="104" height="104" alt="${product.title}"></div>
                  <div class="swiper-slide product-single__image-item"><img loading="lazy" class="h-auto" src="${"https://dorngwellness.com/image/"+product.Image2}" width="104" height="104" alt="${product.title}"></div>
                  <div class="swiper-slide product-single__image-item"><img loading="lazy" class="h-auto" src="${"https://dorngwellness.com/image/"+product.Image1}" width="104" height="104" alt="${product.title}"></div>
                  <div class="swiper-slide product-single__image-item"><img loading="lazy" class="h-auto" src="${"https://dorngwellness.com/image/"+product.Image2}" width="104" height="104" alt="${product.title}"></div>
                </div>
              </div>
            </div>
              ${percentage}
          </div>
        </div>
        <div class="col-lg-5">
          <div class="d-flex justify-content-between mb-4 pb-md-2">
            <div class="breadcrumb mb-0 d-none d-md-block flex-grow-1">
              <a href="index.html" class="menu-link menu-link_us-s text-uppercase fw-medium">Home</a>
              <span class="breadcrumb-separator menu-link fw-medium ps-1 pe-1">/</span>
              <a href="shop.html" class="menu-link menu-link_us-s text-uppercase fw-medium">The Shop</a>
            </div>
    
            <div class="product-single__prev-next d-flex align-items-center justify-content-between justify-content-md-end flex-grow-1">
              <a id="previousDetail" href="#" class="text-uppercase fw-medium"><svg width="10" height="10" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg"><use href="#icon_prev_md" /></svg><span class="menu-link menu-link_us-s">Prev</span></a>
              <a id="nextDetail" href="#" class="text-uppercase fw-medium"><span class="menu-link menu-link_us-s">Next</span><svg width="10" height="10" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg"><use href="#icon_next_md" /></svg></a>
            </div>
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
            <span class="reviews-note text-lowercase text-secondary ms-1">${formatNumber(product.product_review_count)} reviews</span>
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
                <label>Net Weight</label>
                <div class="swatch-list">
                  <input type="radio" name="size" id="swatch-1">
                  <label class="swatch js-swatch" for="swatch-1" aria-label="Grams" data-bs-toggle="tooltip" data-bs-placement="top" title="Grams">${product.net_weight}g</label>
                  <input type="radio" name="size" id="swatch-2" checked>
                </div>
                <a href="#" class="sizeguide-link" data-bs-toggle="modal" data-bs-target="#useGuide">Administration</a>
              </div>
            </div>
            <div class="product-single__addtocart">
              <div class="qty-control position-relative">
                <input type="number" name="quantity" value="1" min="1" class="qty-control__number text-center">
                <div class="qty-control__reduce" data-id="${product.ID}">-</div>
                <div class="qty-control__increase" data-id="${product.ID}">+</div>
              </div>
              ${cartButton}
            </div>
          </form>
          <div class="product-single__addtolinks">
            <share-button class="share-button">
              <button class="menu-link menu-link_us-s to-share border-0 bg-transparent d-flex align-items-center">
                <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <use href="#icon_sharing" />
                </svg>
                <span>Share</span>
              </button>
              <details id="Details-share-template__main" class="m-1 xl:m-1.5" hidden>
                <div id="Article-share-template__main" class="share-button__fallback flex items-center absolute top-full left-0 w-full px-2 py-4 bg-container shadow-theme border-t z-10">
                  <div class="field grow mr-4">
                    <label class="field__label sr-only" for="url">Link</label>
                    <input type="text" class="field__input w-full" value="${getCurrentUrl(product.title, product.description)}" id="url" placeholder="Link" onclick="this.select();" readonly>
                    <button class="share-button__copy no-js-hidden">
                    <svg class="icon icon-clipboard inline-block mr-1" width="11" height="13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 11 13">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M2 1a1 1 0 011-1h7a1 1 0 011 1V1H2zM1 2a1 1 0 00-1 1v9a1 1 0 001 1h7a1 1 0 001-1V3a1 1 0 00-1-1H1zm0 10V3h7v9H1z" fill="currentColor"></path>
                    </svg>
                    <span class="sr-only">Copy link</span>
                  </button>
                  </div>
                </div>
                <div class="social-media-share-buttons">
                  <a href="https://www.facebook.com/sharer/sharer.php?${getCurrentUrlU(product.title, product.description)}" target="_blank">
                    <button class="btn btn-primary">Facebook</button>
                  </a>
                  <a href="https://twitter.com/intent/tweet?${getCurrentUrl(product.title, product.description)}" target="_blank">
                    <button class="btn btn-primary">Twitter</button>
                  </a>
                </div>
              </details>
              <div id="ShareMessage" class="hidden" aria-hidden="true" hidden>Link copied to clipboard!</div>
            </share-button>
            
            <script src="js/share.js" defer="defer"></script>
          </div>
          <div class="product-single__meta-info">
            <div class="meta-item">
              <label>SKU:</label>
              <span>N/A</span>
            </div>
            <div class="meta-item">
              <label>Categories:</label>
              <span>${product.category}</span>
            </div>
            <div class="meta-item">
              <label>Tags:</label>
              <span>${product.category}</span>
            </div>
          </div>
          <div id="product_single_details_accordion" class="product-single__details-accordion accordion">
            <div class="accordion-item">
              <h5 class="accordion-header" id="accordion-heading-11">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-collapse-1" aria-expanded="true" aria-controls="accordion-collapse-1">
                  Description
                  <svg class="accordion-button__icon" viewBox="0 0 14 14"><g aria-hidden="true" stroke="none" fill-rule="evenodd"><path class="svg-path-vertical" d="M14,6 L14,8 L0,8 L0,6 L14,6"></path><path class="svg-path-horizontal" d="M14,6 L14,8 L0,8 L0,6 L14,6"></path></g></svg>
                </button>
              </h5>
              <div id="accordion-collapse-1" class="accordion-collapse collapse show" aria-labelledby="accordion-heading-11" data-bs-parent="#product_single_details_accordion">
                <div class="accordion-body">
                  <div class="product-single__description">
                    <h3 class="block-title mb-4">${product.title}</h3>
                    <p class="content">${product.description}</p>
                    <div class="row">
                      <div class="col-lg-6">
                        <h3 class="block-title">Why choose ${product.title}?</h3>
                        <ul class="list text-list">
                          <li>${product.title}</li>
                          <li>${product.title}</li>
                          <li>${product.title}</li>
                        </ul>
                      </div>
                      <div class="col-lg-6">
                        <h3 class="block-title">Features</h3>
                        <ol class="list text-list">
                          <li>${product.title}</li>
                          <li>${product.title}</li>
                          <li>${product.title}</li>
                        </ol>
                      </div>
                    </div>
                    <h3 class="block-title mb-0">Lining</h3>
                    <p class="content">100% Polyester, Main: 100% Polyester.</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h5 class="accordion-header" id="accordion-heading-2">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-collapse-2" aria-expanded="false" aria-controls="accordion-collapse-2">
                  Additional Information
                  <svg class="accordion-button__icon" viewBox="0 0 14 14"><g aria-hidden="true" stroke="none" fill-rule="evenodd"><path class="svg-path-vertical" d="M14,6 L14,8 L0,8 L0,6 L14,6"></path><path class="svg-path-horizontal" d="M14,6 L14,8 L0,8 L0,6 L14,6"></path></g></svg>
                </button>
              </h5>
              <div id="accordion-collapse-2" class="accordion-collapse collapse" aria-labelledby="accordion-heading-2" data-bs-parent="#product_single_details_accordion">
                <div class="accordion-body">
                  <div class="product-single__addtional-info">
                    <div class="item">
                      <label class="h6">Weight</label>
                      <span>${product.net_weight}g</span>
                    </div>
                    <div class="item">
                      <label class="h6">Dimensions</label>
                      <span>90 x 60 x 90 cm</span>
                    </div>
                    <div class="item">
                      <label class="h6">Storage</label>
                      <span>Store in a cool dry place</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h5 class="accordion-header" id="accordion-heading-3">
                <button id='review-button' class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-collapse-3" aria-expanded="false" aria-controls="accordion-collapse-3">
                  Reviews (${product.product_review_count})
                  <svg class="accordion-button__icon" viewBox="0 0 14 14"><g aria-hidden="true" stroke="none" fill-rule="evenodd"><path class="svg-path-vertical" d="M14,6 L14,8 L0,8 L0,6 L14,6"></path><path class="svg-path-horizontal" d="M14,6 L14,8 L0,8 L0,6 L14,6"></path></g></svg>
                </button>
              </h5>
              <div id="accordion-collapse-3" class="accordion-collapse collapse" aria-labelledby="accordion-heading-3" data-bs-parent="#product_single_details_accordion">
                <div class="accordion-body">
                  <h2 class="product-single__reviews-title">Reviews</h2>

                  <div id="comment_posts" class="product-single__reviews-list">
                    ${commentRender}
                  </div>

                ${showMore}

                  <div class="product-single__review-form">
                    <form name="customer-review-form">
                      <h5>Help others by sharing your thoughts on “${product.title}”</h5>
                      <p>Your opinion adds value! Help others by sharing your experience and tips for using this product. Required fields are marked *</p>
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
                        <textarea id="form-input-review" class="form-control form-control_gray" placeholder="Your Review *" cols="30" rows="8"></textarea>
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
                        <input class="form-check-input form-check-input_fill" type="checkbox" value="" id="mailing_list_checkbox">
                        <label class="form-check-label" for="mailing_list_checkbox">
                          Would you like to be added to our mailing list for updates and special offers?
                        </label>
                      </div>
                      <div class="form-action">
                        <button type="submit" class="btn btn-primary">Submit</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Append the new element to the container
    productBody.appendChild(rowElement);
    renderUseGuide(product);

// Reinitialize the CartDrawer
if (typeof DorngSections.CartDrawer !== 'undefined') {
  new DorngSections.CartDrawer();
}

// Reinitialize the SwiperSlideshow
if (typeof DorngSections.SwiperSlideshow !== 'undefined') {
  new DorngSections.SwiperSlideshow()._initSliders();
}

// Reinitialize the ProductSingleMedia
if (typeof DorngSections.ProductSingleMedia !== 'undefined') {
  new DorngSections.ProductSingleMedia()._initProductMedia();
}

// Reinitialize the StarRating
if (typeof DorngElements.StarRating !== 'undefined') {
  new DorngElements.StarRating();
}

// Reinitialize Aside
if (typeof DorngElements.Aside === 'function') {
  new DorngElements.Aside();
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
    quantityInput.value = currentQuantity + 1;
    newQuantity1+=1
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
    const addToCartButton = document.getElementById('addToCartButton');
    if (addToCartButton) {
      addToCartButton.addEventListener('click', function() {
        // event.preventDefault();
        addToCart(product, newQuantity1);
        updateCartNumber();
        updateCartDrawer();
      });
    }
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
    const apiUrl = `https://api.dorngwellness.com/get-comment/${pageNumber}/${product.ID}`;

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

      const apiUrl = "https://api.dorngwellness.com/post-comment";
  
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
            <img loading="lazy" src="${"https://dorngwellness.com/image/"+product.Image1}" alt="Product Image">
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

  // Initialize and show the Bootstrap modal
  // const modal = new bootstrap.Modal(useGuideElement);
  // modal.show();
}

// function renderRecommendedProduct(product) {
//   const recommendElement = document.getElementById('recommendedProduct');
  
//   // Create a new product card element
//   const rowElement = document.createElement('div');
//   rowElement.classList.add('swiper-slide', 'product-card', 'hidden'); // Add 'hidden' class
//   rowElement.id = product.ID + 2; // Set the ID of the row

//   // Determine if the button should be disabled and what text to display
//   const isOutOfStock = product.stock_remaining === 0;
//   const buttonText = isOutOfStock ? 'Out of Stock' : 'Add To Cart';
//   const buttonDisabled = isOutOfStock ? 'disabled' : '';

//   rowElement.innerHTML = `
//    <div class="pc__img-wrapper">
//       <a href="#">
//         <img loading="lazy" src="${"https://dorngwellness.com/image/"+product.Image1}" width="330" height="400" alt="${product.title}" class="pc__img">
//         <img loading="lazy" src="${"https://dorngwellness.com/image/"+product.Image2}" width="330" height="400" alt="${product.title}" class="pc__img pc__img-second">
//       </a>
//       <button class="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside" data-aside="cartDrawer" title="Add To Cart" ${buttonDisabled}>${buttonText}</button>
//     </div>

//     <div class="pc__info position-relative">
//       <p class="pc__category">${product.category}</p>
//       <h6 class="pc__title"><a href="https://dorngwellness.com/shop/${product.product_url_id}">${product.title}</a></h6>
//       <div class="product-card__price d-flex">
//         <span class="money price">${formatNumberToNaira(product.initial_cost)}</span>
//       </div>
//     </div>
//     <div class="product-card__review d-flex align-items-center">
//       <div class="reviews-group d-flex">
//         <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
//         <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
//         <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
//         <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
//         <svg class="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><use href="#icon_star" /></svg>
//       </div>
//       <span class="reviews-note text-lowercase text-secondary ms-1">${formatNumber(product.reviews)} reviews</span>
//     </div>
//   `;

//   // Append the new element to the container
//   recommendElement.appendChild(rowElement);
// }

// function updateProductsFromData(products) {
//   const productBody = document.getElementById('recommendedProduct');

//   if (!productBody) {
//       console.error('Error: recommendedProduct element not found');
//       return;
//   }

//   // Initially hide all product elements
//   const productDivs = Array.from(productBody.children);
//   productDivs.forEach(productDiv => productDiv.classList.add('hidden'));

//   // Update product details
//   products.forEach((product, index) => {
//       const productDiv = productDivs[index]; // Get the product card by its position
      
//       if (productDiv) {
//           // Update product details
//           const imgElement = productDiv.querySelector('.pc__img');
//           const titleElement = productDiv.querySelector('.pc__title');
//           const priceElement = productDiv.querySelector('.pc__price');
//           const stockElement = productDiv.querySelector('.product-card__review');

//           if (imgElement) imgElement.src = "https://dorngwellness.com/image/"+product.Image1;
//           if (titleElement) titleElement.textContent = product.title;
//           if (priceElement) priceElement.innerHTML = product.selling_price < product.initial_cost 
//               ? `<span class="money price price-old">${formatNumberToNaira(product.initial_cost)}</span>
//                  <span class="money price price-sale">${formatNumberToNaira(product.selling_price)}</span>` 
//               : `<span class="money price">${formatNumberToNaira(product.initial_cost)}</span>`;
//           if (stockElement) {
//               const reviewStars = stockElement.querySelectorAll('.review-star');
//               reviewStars.forEach((star, i) => {
//                   if (i < product.rating) {
//                       star.classList.add('filled');
//                   } else {
//                       star.classList.remove('filled');
//                   }
//               });
//               const reviewsNote = stockElement.querySelector('.reviews-note');
//               if (reviewsNote) reviewsNote.textContent = `${formatNumber(product.reviews)} reviews`;
//           }

//           // Handle image wrapper update
//           const imgWrapper = productDiv.querySelector('.pc__img-wrapper');
//           if (imgWrapper) {
//               const newImgWrapper = imgWrapper.cloneNode(true);
//               imgWrapper.parentNode.replaceChild(newImgWrapper, imgWrapper);

//               // Add new event listener to the image wrapper
//               newImgWrapper.addEventListener('click', function(event) {
//                   event.preventDefault();
//                   window.location.href = `https://dorngwellness.com/shop/${product.product_url_id}`;
//               });
//           } else {
//               console.error('Error: .pc__img-wrapper not found in', productDiv);
//           }

//           // Handle 'Add To Cart' button
//           if (product.product_stock > 0) {
//               const addToCartButton = productDiv.querySelector('.pc__atc');
//               if (addToCartButton) {
//                   const newAddToCartButton = addToCartButton.cloneNode(true);
//                   addToCartButton.parentNode.replaceChild(newAddToCartButton, addToCartButton);

//                   newAddToCartButton.addEventListener('click', function() {
//                       addToCart(product);
//                       updateCartNumber();
//                       updateCartDrawer();
//                   });
//               } else {
//                   console.error('Error: .pc__atc button not found in', productDiv);
//               }
//           }

//           // Make the product visible
//           productDiv.classList.remove('hidden');
//       }
//   });

//   console.log('Finished updating products...');
// }

// function reinitComponents() {
//   if (typeof DorngElements.JsHoverContent !== 'undefined') {
//     new DorngElements.JsHoverContent();
//   }

//   if (typeof DorngElements.Search !== 'undefined') {
//     new DorngElements.Search();
//   }

//   if (typeof DorngElements.Aside === 'function') {
//     new DorngElements.Aside();
//   }

//   if (typeof DorngElements.ScrollToTop === 'function') {
//     new DorngElements.ScrollToTop();
//   }

//   if (typeof DorngElements.Countdown !== 'undefined') {
//     new DorngElements.Countdown();
//   }

//   if (typeof DorngElements.ShopViewChange !== 'undefined') {
//     new DorngElements.ShopViewChange();
//   }

//   if (typeof DorngElements.Filters !== 'undefined') {
//     new DorngElements.Filters();
//   }

//   if (typeof DorngElements.StickyElement !== 'undefined') {
//     new DorngElements.StickyElement();
//   }

//   if (typeof DorngElements.StarRating !== 'undefined') {
//     new DorngElements.StarRating();
//   }

//   if (typeof DorngSections.Header !== 'undefined') {
//     new DorngSections.Header();
//   }

//   if (typeof DorngSections.Footer !== 'undefined') {
//     new DorngSections.Footer();
//   }

//   if (typeof DorngSections.CustomerSideForm !== 'undefined') {
//     new DorngSections.CustomerSideForm();
//   }

//   if (typeof DorngSections.CartDrawer !== 'undefined') {
//     new DorngSections.CartDrawer();
//   }

//   if (typeof DorngSections.SwiperSlideshow !== 'undefined') {
//     new DorngSections.SwiperSlideshow()._initSliders();
//   }

//   if (typeof DorngSections.ProductSingleMedia !== 'undefined') {
//     new DorngSections.ProductSingleMedia()._initProductMedia();
//   }
// }

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
          product.totalPrice = product.price * product.quantity;
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
        <img loading="lazy" class="cart-drawer-item__img" src="/images/product_not_available.jpg" alt="">
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
                <p class="cart-drawer-item__option text-secondary">Grams: ${cartProduct.net_weight}</p>
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
          itemTotal = item.price * item.quantity;
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
