var blogTitle = "";
var blogDescription = "";
var blogDescription2 = "";
var selectedCategories = "";

var blogIdToUpdate = 0;

// Function to validate the form
function validateForm() {
    // Check if blog title is provided
    if (!blogTitle) {
        alert("Blog title is required.");
        return false;
    }

    // Check if at least one description is provided
    if (!blogDescription && !blogDescription2) {
        alert("At least one product description is required.");
        return false;
    }

    // Check if at least one category is selected
    if (!selectedCategories) {
        alert("At least one category must be selected.");
        return false;
    }

    // If all checks pass, return true
    return true;
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', async function () {
    // Get the current URL
    const currentUrl = new URL(window.location.href);
    // Assuming you have a reference to the table body element

    // Extract parameters using URLSearchParams
    const params = new URLSearchParams(currentUrl.search);

    // Get individual parameter values
    productToUpdate = params.get("BlogID");
    
    await getProduct(productToUpdate);

    const form = document.getElementById('updateBlogButton');
    
    form.addEventListener('click', async function (event) {
        event.preventDefault();

        // Access category
        const categorySelect = document.querySelector('.js-example-placeholder-multiple');
        
        // Fetch editors dynamically on click
        const qlEditor = document.querySelectorAll('.ql-editor'); // Get all editors
        const descriptionEditor = qlEditor[0]; // First editor
        const descriptionEditor2 = qlEditor[1]; // Second editor (if it exists)

        // Access the input element by its ID
        const blogTitleInput = document.getElementById('validationCustom01');
        
        // Get the value entered by the user
        blogTitle = blogTitleInput.value.trim();

        // Validate Descriptions
        blogDescription = descriptionEditor ? descriptionEditor.innerHTML.trim() : ''; // First editor content
        blogDescription2 = descriptionEditor2 ? descriptionEditor2.innerHTML.trim() : ''; // Second editor content

        // Get the selected categories
        selectedCategories = categorySelect.value;
        
        // Log the results
        // console.log('Product Title:', blogTitle);
        // console.log('Product Description 1:', blogDescription);
        // console.log('Product Description 2:', blogDescription2);
        // console.log('Selected Categories:', selectedCategories);

        // Validate the form data
        if (validateForm()) {
            await updateBlog();
            // Proceed with form submission or AJAX request here
        }
    });
});

async function updateBlog() {

    const apiUrl = "https://api.dorngwellness.com/update-dorng-blog";

    // Construct the request body
    const requestBody = {
        blog_id: +blogIdToUpdate,
        blog_title: blogTitle,
        blog_description1: blogDescription,
        blog_description2: blogDescription2,
        blog_category: selectedCategories,
    };

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include', // set credentials to include cookies
        body: JSON.stringify(requestBody)
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
                logout();
            }else {
                // displayErrorMessage();
            }

            return;
        }

        const responseData = await response.json();
        // Perform actions when confirmed
        swal("Product Successfully Updated", {
            icon: "success",
            buttons: {
                confirm: true,
            },
            }).then(() => {
            
            });
} finally {

    }
}

document.getElementById('previewBlogPost').addEventListener('click', function(event) {
    event.preventDefault();
    window.open('https://dorngwellness.com/blog_single?BlogID=' + blogIdToUpdate, '_blank');
})

async function getProduct(productID) {
    const apiUrl = "https://api.dorngwellness.com/get-blog/" + productID;
  
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
                logout();
            }else {
                // displayErrorMessage();
            }
  
            return;
        }
  
        const responseData = await response.json();
        blogIdToUpdate = responseData.success.ID
        updateFields(responseData.success);
       
  } finally {
  
    }
}

function updateFields(product) {
    // Fetch editors dynamically
    const qlEditor = document.querySelectorAll('.ql-editor'); // Get all editors
    const descriptionEditor = qlEditor[0]; // First editor
    const descriptionEditor2 = qlEditor[1]; // Second editor (if it exists)

    // Set the content of the rich text editor using raw HTML
    if (descriptionEditor) {
        descriptionEditor.innerHTML = product.description1 || ''; // First description
    }

    if (descriptionEditor2) {
        descriptionEditor2.innerHTML = product.description2 || ''; // Second description (if exists)
    }

    // Access the input element by its ID
    const blogTitleInput = document.getElementById('validationCustom01');
    
    // Set the blog title input value
    if (blogTitleInput) {
        blogTitleInput.value = product.title || ''; // Set blog title
    }

    // Update categories (assuming categories are stored in an array in product.blog_category)
    const categorySelect = document.querySelector('.js-example-placeholder-multiple'); // Select the multiple category dropdown
    
    if (categorySelect && product.blog_category) {
        const categories = Array.isArray(product.blog_category) ? product.blog_category : [product.blog_category];
        
        // Clear any existing selection
        for (let option of categorySelect.options) {
            option.selected = false;
        }

        // Select the categories
        for (let category of categories) {
            for (let option of categorySelect.options) {
                if (option.value === category) {
                    option.selected = true;
                }
            }
        }
        
        // Trigger change event to update select2 UI if using it
        $(categorySelect).trigger('change');
    }

    // Perform any additional validation
    // validateForm();
}

  async function logout() {
    // also send a request to the logout api endpoint
    const apiUrl = "https://api.dorngwellness.com/log-out";

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
            // alert('an error occurred. Please try again');
                if (!response.ok) {
        alert('an error occurred. Please try again');
        return;
    }
        return;
      }
        const data = await response.json();
        localStorage.removeItem('auth')
        window.location.href = '../shop.html'
    } finally{
        // do nothing
    }
}