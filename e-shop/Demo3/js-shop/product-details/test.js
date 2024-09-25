document.addEventListener('DOMContentLoaded', function() {
    renderLoadingDetails();
    renderProductDetails();
})

function renderProductDetails() {
        // Assuming you have a reference to the container element
        var productBody = document.getElementById('products-details-grid');

        // Create a new product card element
        const rowElement = document.createElement('div');
        rowElement.classList.add('row');
        // rowElement.id = product.ID; // Set the ID of the row
        // Remove all child elements of the tbody
        productBody.innerHTML = ''
        
        // Create the HTML string with dynamic data using template literals
        rowElement.innerHTML = `
        <div class="col-lg-7">
          <div class="product-single__media" data-media-type="vertical-thumbnail">
            <div class="product-single__image">
              <div class="swiper-container">
                <div class="swiper-wrapper">
                  <div class="swiper-slide product-single__image-item">
                    <a data-fancybox="gallery" href="https://payuee-html.flexkitux.com/videos/video_2.mp4" data-bs-toggle="tooltip" data-bs-placement="left" title="Zoom">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_zoom" /></svg>
                    </a>
                    <a href="#" class="product-degree" data-bs-toggle="tooltip" data-bs-placement="right" title="360 Product View"><svg class="d-block" width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_degree" /></svg></a>
                    <button class="view-video btn-video-player" data-bs-toggle="tooltip" data-bs-placement="left" title="View Video" data-video="#video_product_1">
                      <svg class="btn-play" width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_play" /></svg>
                      <svg class="btn-pause" width="14" height="22" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_pause" /></svg>
                    </button>
                    <video id="video_product_1" class="product-video">
                      <source src="https://payuee-html.flexkitux.com/videos/video_2.mp4">
                    </video>
                  </div>
                  <div class="swiper-slide product-single__image-item">
                    <img loading="lazy" class="h-auto" src="../images/products/product_0-1.jpg" width="674" height="674" alt="">
                    <a data-fancybox="gallery" href="../images/products/product_0-1.jpg" data-bs-toggle="tooltip" data-bs-placement="left" title="Zoom">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_zoom" /></svg>
                    </a>
                  </div>
                  <div class="swiper-slide product-single__image-item">
                    <img loading="lazy" class="h-auto" src="../images/products/product_0-2.jpg" width="674" height="674" alt="">
                    <a data-fancybox="gallery" href="../images/products/product_0-2.jpg" data-bs-toggle="tooltip" data-bs-placement="left" title="Zoom">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_zoom" /></svg>
                    </a>
                  </div>
                  <div class="swiper-slide product-single__image-item">
                    <img loading="lazy" class="h-auto" src="../images/products/product_0-3.jpg" width="674" height="674" alt="">
                    <a data-fancybox="gallery" href="../images/products/product_0-3.jpg" data-bs-toggle="tooltip" data-bs-placement="left" title="Zoom">
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
                  <div class="swiper-slide product-single__image-item"><img class="h-auto" loading="lazy" src="../images/products/product_0.jpg" width="104" height="104" alt=""></div>
                  <div class="swiper-slide product-single__image-item"><img class="h-auto" loading="lazy" src="../images/products/product_0-1.jpg" width="104" height="104" alt=""></div>
                  <div class="swiper-slide product-single__image-item"><img class="h-auto" loading="lazy" src="../images/products/product_0-2.jpg" width="104" height="104" alt=""></div>
                  <div class="swiper-slide product-single__image-item"><img class="h-auto" loading="lazy" src="../images/products/product_0-3.jpg" width="104" height="104" alt=""></div>
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
              <a href="product13_v8.html" class="text-uppercase fw-medium"><svg class="mb-1px" width="10" height="10" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg"><use href="#icon_prev_md" /></svg><span class="menu-link menu-link_us-s">Prev</span></a>
              <a href="product15_v10.html" class="text-uppercase fw-medium"><span class="menu-link menu-link_us-s">Next</span><svg class="mb-1px" width="10" height="10" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg"><use href="#icon_next_md" /></svg></a>
            </div><!-- /.shop-acs -->
          </div>
          <h1 class="product-single__name">Lightweight Puffer Jacket With a Hood</h1>
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
            <span class="current-price">₦449</span>
          </div>
          <div class="product-single__short-desc">
            <p>Phasellus sed volutpat orci. Fusce eget lore mauris vehicula elementum gravida nec dui. Aenean aliquam varius ipsum, non ultricies tellus sodales eu. Donec dignissim viverra nunc, ut aliquet magna posuere eget.</p>
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
                <input type="number" name="quantity" value="1" min="1" class="qty-control__number text-center">
                <div class="qty-control__reduce">-</div>
                <div class="qty-control__increase">+</div>
              </div><!-- .qty-control -->
              <button type="submit" class="btn btn-primary btn-addtocart js-open-aside" data-aside="cartDrawer">Add to Cart</button>
            </div>
          </form>
          <div class="product-single__addtolinks">
            <a href="#" class="menu-link menu-link_us-s add-to-wishlist"><svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_retweet" /></svg><span>Re-post Product</span></a>
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
              <label>SKU:</label>
              <span>N/A</span>
            </div>
            <div class="meta-item">
              <label>Categories:</label>
              <span>Casual & Urban Wear, Jackets, Men</span>
            </div>
            <div class="meta-item">
              <label>Tags:</label>
              <span>biker, black, bomber, leather</span>
            </div>
          </div>
          <div class="product-single__details">
            <a href="#" class="js-open-aside" data-aside="productDescription">Description</a>
            <a href="#" class="js-open-aside" data-aside="productAdditionalInformation">Additional Information</a>
            <a href="#" class="js-open-aside" data-aside="productReviews">Reviews (3)</a>
          </div>
        </div>
        `;

        // Append the new element to the container
        productBody.appendChild(rowElement);
        // renderUseGuide(product);
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