var blogID;
var newBlogContent;
var ReviewCount = 0;
var pageNumber = 1;

document.addEventListener('DOMContentLoaded', async function(event) {
    event.preventDefault();
    renderLoadingBlogDetails();

    // Get the current URL
    const currentUrl = new URL(window.location.href);
    // Assuming you have a reference to the table body element

    // Extract parameters using URLSearchParams
    const params = new URLSearchParams(currentUrl.search);

    // Get individual parameter values
    let BlogID = params.get("BlogID");
    if (BlogID == null) {
        BlogID = "1";
    }

    await updateBlogContent(BlogID);
    addNewUserComment();
})

// Function to fetch blog data by BlogID and update fields
async function updateBlogContent(BlogID) {
  blogID = BlogID;
    try {
        // Make the API request to get blog data
        const response = await fetch(`https://api.payuee.com/get-faq/${BlogID}`); // Replace with your actual API endpoint

        if (!response.ok) {
            throw new Error(`Error fetching faq data: ${response.statusText}`);
        }

        // Parse the response data
        const blogData = await response.json();
        
        const blogDataRender = document.getElementById('blogDataRender');
        blogDataRender.innerHTML = '';
        updateShareUrls(blogData.success.title, 'https://app.payuee.com/image'+blogData.success.Image1);
        // Check if data was received
        if (!blogData) {
            console.error("No data received for the given BlogID");
            return;
        }
        
        // Update the text data with the fetched data

        const blogTitle = document.getElementById('blogTitle');
        const blogCreatedAt = document.getElementById('blogCreatedAt');
        const blogCategory = document.getElementById('blogCategory');
        const blogCreatedBy = document.getElementById('blogCreatedBy');

        blogTitle.textContent = blogData.success.title;
        blogCategory.textContent = blogData.success.blog_category;
        blogCreatedBy.textContent = "By Admin";
        //  Format the date as needed
        const createdAtDate = new Date(blogData.success.CreatedAt);
        blogCreatedAt.textContent = createdAtDate.toLocaleDateString() || 'Date not available';

        const productBody = document.getElementById('blogDataRender');

        // Create a new product card element
        const rowElement = document.createElement('div');
        // rowElement.classList.add('blogDataRender');
        rowElement.id = BlogID; // Set the ID of the row
        // rowElement.dataset.productId = product.ID; // Add a data attribute for easy access

         // Create the HTML string with dynamic data using template literals
        rowElement.innerHTML = `
        <p>
          <!-- first image rendering -->
          <img id="firstImage" loading="lazy" class="w-100 h-auto d-block" src="${"https://app.payuee.com/image/" + blogData.success.Image1}" width="1410" height="550" alt="${blogData.success.title}">
        </p>

        <div id="firstDescription" class="mw-930">
          <!-- first content rendering after first image rendering -->
          ${blogData.success.description1}
        </div>

        <div class="container mw-1170">
          <div class="row">
            <div class="col-md-6">
              <p><img  id="secondImage"  loading="lazy" class="w-100 h-auto d-block" src="${"https://app.payuee.com/image/" + blogData.success.Image2}" width="570" height="697" alt="${blogData.success.title}"></p>
            </div>
            <div class="col-md-6">
              <p><img  id="thirdImage" loading="lazy" class="w-100 h-auto d-block" src="${"https://app.payuee.com/image/" + blogData.success.Image3}" width="570" height="697" alt="${blogData.success.title}"></p>
            </div>
          </div>
        </div>
        <div id="firstDescription" class="mw-930">
          <!-- second content rendering after first image rendering -->
          ${blogData.success.description2}
        </div>
        `;

        // Append the new element to the container
        productBody.appendChild(rowElement);

         // testing data for comment
         ReviewCount = blogData.success.blog_reviews_count;

         if (ReviewCount > 0) {
           renderReviews(blogData.success.customer_review);
        }
         if(ReviewCount > 4) {
         console.log('started review count 4');
           let showMoreButton = document.getElementById('showMoreButton')
           showMoreButton.innerHTML  = `
             <span id="show-more-link" style="cursor: pointer; color: blue; text-decoration: underline;">Show More</span>
             `;
             showMore();
         } 
 

    } catch (error) {
        console.error("Failed to update blog content:", error);
    }
}

function renderLoadingBlogDetails() {
  // Assuming you have a reference to the container element
  const blogBody = document.getElementById('blogDataRender');

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

function updateShareUrls(text, image) {
  // Get the current page URL
  const currentUrl = window.location.href;
  
  // Update Facebook share link
  const facebookLink = document.getElementById('shareFacebook');
  facebookLink.href = `http://www.facebook.com/sharer.php?u=${encodeURIComponent(currentUrl)}`;

  // Update Twitter share link
  const twitterLink = document.getElementById('shareTwitter');
  // const twitterText = 'Check out this blog post!';
  twitterLink.href = `http://twitter.com/share?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`;

  // Update Pinterest share link
  const pinterestLink = document.getElementById('sharePinterest');
  // const pinterestMedia = 'URL_OF_IMAGE_TO_SHARE'; // You can dynamically add an image URL here
  pinterestLink.href = `http://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(image)}`;
}

function addNewUserComment() {
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
        blog_id: +blogID,
        rating: +ratingInput.value,
        review: reviewInput.value.trim(),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        add_email: isSubscribedToMailingList,
    };

      const apiUrl = "https://api.payuee.com/faq-comment";
  
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
                    addNewComment(data);
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
}

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

}

function renderReviews(review) {
  // Assuming you have a reference to the container element
  const productBody = document.getElementById('comment_posts');
  // Create the HTML string with dynamic data using template literals
  productBody.innerHTML += generateReviewsHTML(review);
}

function showMore() {
    // Select the 'Show More' link element by its ID
    const showMoreLink = document.getElementById('show-more-link');
    if (showMoreLink) {
      // console.log("showing link if true");
          // Add a click event listener to the link
    showMoreLink.addEventListener('click', async function() {
      // console.log("adding click event to link if true");
      pageNumber += 1
      // Perform the action you want on click
      const apiUrl = `https://api.payuee.com/get-faq-comment/${pageNumber}/${blogID}`;
  
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
            renderReviews(responseData.success);
  
      } finally {
      
          }
      // You can add any other actions here
    });
    }
}