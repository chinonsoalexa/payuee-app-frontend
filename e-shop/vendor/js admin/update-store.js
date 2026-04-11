var imageArray = [];
var storeName = "";
var ShopAddress = "";
var ShopState = "";
var ShopCity = "";
var OpenDays = "";
var companyPhone = "";
var companyEmail = "";
var storeDescription = "";
var selectedCategories = "";

let originalStoreData = {};
var stateIsoCode;
var stateSelected;
var citySelected;
var latitude = 0.0;
var longitude = 0.0;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', async function () {
    // console.log('DOM fully loaded and parsed.');

    // Populate form fields on load
    await fetchDataAndFillForm();
    // console.log('Data fetched and form populated.');
    await loadStates();


    // Open state dropdown on click
    document.getElementById("statesInput").addEventListener("click", () => {
        toggleClassById("formeStateList", "js-content_visible");
    });

    // Open city dropdown on click
    document.getElementById("citiesInput").addEventListener("click", () => {
        toggleClassById("formeCityList", "js-content_visible");
    });

    const form = document.getElementById('postButton');
    
    form.addEventListener('click', async function (event) {
        // console.log('Post button clicked.');
        event.preventDefault();

        // Get the store name
        const storeNameInput = document.getElementById('storeName');
        storeName = storeNameInput.value.trim();
        // console.log('Store Name:', storeName);

        // Get the company phone
        const companyPhoneInput = document.getElementById('companyPhone');
        companyPhone = companyPhoneInput.value.trim();
        // console.log('Company Phone:', companyPhone);

        // Get the company email
        const companyEmailInput = document.getElementById('companyEmail');
        companyEmail = companyEmailInput.value.trim();
        // console.log('Company Email:', companyEmail);

        const openDaysSelect = document.getElementById("openDays");
        OpenDays = openDaysSelect.value;

        // Get the company email
        const storeAddress = document.getElementById('storeAddress');
        ShopAddress = storeAddress.value.trim();

        // Get the tags (categories)
        const selectedCategoriesInput = document.querySelector('input[name="basic-tags"]');
        selectedCategories = selectedCategoriesInput.value;
        // console.log('Company Category:', selectedCategories);

        // Get the store description
        const qlEditor = document.querySelectorAll('.ql-editor');
        const descriptionEditor = qlEditor[0];
        storeDescription = descriptionEditor ? descriptionEditor.innerHTML.trim() : '';
        // console.log('Store Description:', storeDescription);

        // Validate form before submitting
        if (validateForm()) {
            // console.log('Form is valid, proceeding to update store.');
            if (!hasChanges()) {
                // console.log("No changes detected. Skipping update request.");
                showToastMessageE("No changes were made.");
                return;
            }
            await updateStore();
        } else {
            console.log('Form validation failed.');
        }
    });
});

function startLoading(buttonId, loadingText = "Loading...") {
  const button = document.getElementById(buttonId);
  const text = button.querySelector(".btn-text");
  const spinner = button.querySelector(".spinner-border");

  // Save original text if not saved already
  if (!button.dataset.originalText) {
    button.dataset.originalText = text.innerText;
  }

  text.innerText = loadingText;
  spinner.classList.remove("d-none");
  button.disabled = true;
}

function stopLoading(buttonId) {
  const button = document.getElementById(buttonId);
  const text = button.querySelector(".btn-text");
  const spinner = button.querySelector(".spinner-border");

  // Restore original text
  text.innerText = button.dataset.originalText || "Update";
  spinner.classList.add("d-none");
  button.disabled = false;
}

const input = document.querySelector('#tags');
const tagify = new Tagify(input, {
    maxTags: 9  // Setting maxTags property for Tagify
});

// Enforce the 9-tag limit by removing any excess tags
tagify.on('add', () => {
    if (tagify.value.length > 9) {
        // console.log("Too many tags:", tagify.value);
        
        // Delay to ensure Tagify has added the tag before removing
        setTimeout(() => {
            // Remove the most recent tag added
            tagify.removeTags(tagify.value[tagify.value.length - 1].value);
            
            // Optionally, alert the user
            showToastMessageE("You can only add up to 9 tags.");
        }, 100); // Adjust delay if necessary
    }
});

const openDaysSelect = document.getElementById("openDays");

// Function to validate the form
function validateForm() {
    // Check if store name is provided
    if (!storeName) {
        showToastMessageE("Store name is required.");
        return false;
    }

    if (!companyPhone) {
        showToastMessageE("Company number is required.");
        return false;
    } else if (!validateCompanyPhone(companyPhone)) {
        return false;
    }

    if (!companyEmail) {
        showToastMessageE("Company email is required.");
        return false;
    }

    // Check if at least one description is provided
    if (!storeDescription) {
        showToastMessageE("Store description is required.");
        return false;
    }

    if (!OpenDays) {
        showToastMessageE("Open Days is required.");
        return false;
    }

    if (!ShopAddress) {
        showToastMessageE("Shop Address is required.");
        return false;
    }

    if (!stateSelected) {
        showToastMessageE("Shop State is required.");
        return false;
    }

    if (!citySelected) {
        showToastMessageE("Shop City is required.");
        return false;
    }

    // Check if at least one category is selected
    if (selectedCategories.length === 0) {
        showToastMessageE("At least one category must be selected.");
        return false;
    }

    // Check if exactly three images are uploaded
    // if (imageArray.length !== 1) {
    //     showToastMessageE("Store Image is required.");
    //     return false;
    // }

    // If all checks pass, return true
    return true;
}

function validateCompanyPhone(phone) {
    // Remove any non-numeric characters from the phone number
    const cleanedPhone = phone.replace(/[^0-9]/g, '');

    // Check if the cleaned phone number has exactly 10 or 11 digits
    if (cleanedPhone.length < 10 || cleanedPhone.length > 11) {
        showToastMessageE("Company number must be exactly 10 or 11 digits.");
        return false;
    }

    return true;
}

function getOnlyNumbers(text) {
    // Use a regular expression to remove all non-numeric characters
    return text.replace(/[^0-9]/g, '');
}

async function updateStore() {
    startLoading("postButton", "Updating...");
    // Create a new FormData object
    const formData = new FormData();

    // Append text fields to the FormData object
    formData.append("StoreName", storeName);
    formData.append("ShopAddress", ShopAddress);
    formData.append("ShopState", stateSelected);
    formData.append("ShopCity", citySelected);
    formData.append("Latitude", latitude);
    formData.append("Longitude", longitude);
    formData.append("OpenDays", OpenDays);
    formData.append("ShopEmail", companyEmail);
    formData.append("ShopPhone", getOnlyNumbers(companyPhone));
    formData.append("StoreDescription", storeDescription);
    formData.append("ShopCategories", selectedCategories);

    // Append images to the FormData object
    imageArray.forEach((image, index) => {
        formData.append("imageArray", image, `image${index}.jpg`);
    });

    try {
        const response = await fetch('https://api.payuee.com/vendor/update-store', { // Replace with your actual endpoint URL
            method: 'POST',
            // headers: {
            //     'Content-Type': 'multipart/form-data'
            // },
            credentials: 'include', // Include credentials such as cookies or authorization headers
            body: formData,
        });
        // console.log("this is post data: ", formData);
        if (!response.ok) {
            if  (response.error === 'No Authentication cookie found' || response.error === "Unauthorized attempt! JWT's not valid!" || response.error === "No Refresh cookie found") {
                logout();
            }
            stopLoading("postButton");
            showToastMessageE("An error occurred while updating the store.");
            return;
        }
        const result = await response.json();
        stopLoading("postButton");
        showToastMessageS("Store updated successfully");
        fillForm(result.success);
    } catch (error) {
        console.error("Network error:", error);
    }
}

// Function to fetch data and fill in form fields
async function fetchDataAndFillForm() {
    try {
        const response = await fetch('https://api.payuee.com/vendor/get-store-details', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data && data.success) {
            // Access the store details from the "success" object
            const storeData = data.success;
            fillForm(storeData)
        }
    } catch (error) {
        console.error('Error fetching store data:', error);
    }
}

function fillForm(storeData) {

    // Save the original data for later comparison
  originalStoreData = {
    shop_name: storeData.shop_name || '',
    shop_phone: storeData.shop_phone || '',
    shop_email: storeData.shop_email || '',
    shop_categories: storeData.shop_categories || '',
    shop_description: storeData.shop_description || '',
    open_days: storeData.open_days || '',
    shop_address: storeData.shop_address || '',
    shop_state: storeData.shop_state || '',
    shop_city: storeData.shop_city || ''
  };


  // Populate form fields with fetched data
  document.getElementById('storeName').value = storeData.shop_name || '';
  document.getElementById('companyPhone').value = storeData.shop_phone || '';
  document.getElementById('companyEmail').value = storeData.shop_email || '';

  // Update Tags
  let tagsInput = document.getElementById('tags');
  tagsInput.value = storeData.shop_categories;

  // Populate the shop description in the editor
  const qlEditor = document.querySelector('.ql-editor');
  if (qlEditor) {
      qlEditor.innerHTML = storeData.shop_description || '';
  }

  if (storeData.shop_image != "") {
        // Display the shop image in the imageContainer
        const imageContainer = document.getElementById('imageContainer');
        imageContainer.innerHTML = ''; // Clear any previous images
        const imgElement = document.createElement('img');
        imgElement.src = `https://payuee.com/image/${storeData.shop_image}`;
        imgElement.alt = storeData.shop_name;
        imgElement.style.maxWidth = "100%"; // Style as needed
        imageContainer.appendChild(imgElement);
        // Remove the class
        imageContainer.classList.remove("hidden");
  }
    // Select the button by its ID
    const visitStoreBtn = document.getElementById("visitStoreBtn");
    // Add an onclick event to redirect to the store URL
    visitStoreBtn.addEventListener("click", function() {
        window.location.href = "https://payuee.com/store/" + storeData.store_unique_url;
    });

    const shareStoreBtn = document.getElementById("shareStoreBtn");
    shareStoreBtn.addEventListener('click', function () {
        const userShopUrl = `https://payuee.com/store/v/${storeData.store_unique_url}`; // Replace with dynamic URL for user's shop
        const shareContent = `
            Check out ${storeData.shop_name} on Payuee e-Shop! Discover amazing products and place your orders here: ${userShopUrl}
        `;

        if (navigator.share) {
            // Use Web Share API if available
            navigator.share({
                title: `Check Out ${storeData.shop_name} On Payuee e-Shop!`,
                text: shareContent,
            }).catch((error) => console.error('Error sharing:', error));
        } else {
            // Fallback for browsers without Web Share API
            alert(`Share this link with your friends: ${userShopUrl}`);
        }
    });


    // ✅ Populate Open Days
    if (storeData.open_days) {
        document.getElementById("openDays").value = storeData.open_days;
    }

    // ✅ Populate Address
    if (storeData.shop_address) {
        document.getElementById("storeAddress").value = storeData.shop_address;
    }

    // ✅ Populate State
    if (storeData.shop_state) {
        stateSelected = storeData.shop_state; // ✅ update global
        document.getElementById("search-dropdown").value = storeData.shop_state;
    }

    // ✅ Populate City
    if (storeData.shop_city) {
        citySelected = storeData.shop_city; // ✅ update global
        document.getElementById("city-dropdown").value = storeData.shop_city;
    }
}

function getCurrentFormData() {
  const qlEditor = document.querySelector('.ql-editor');

  return {
    shop_name: document.getElementById('storeName').value.trim(),
    shop_phone: document.getElementById('companyPhone').value.trim(),
    shop_email: document.getElementById('companyEmail').value.trim(),
    shop_categories: document.getElementById('tags').value.trim(),
    shop_description: qlEditor ? qlEditor.innerHTML.trim() : '',
    open_days: document.getElementById("openDays").value,
    shop_address: document.getElementById("storeAddress").value.trim(),
    shop_state: document.getElementById("search-dropdown").value.trim(),
    shop_city: document.getElementById("city-dropdown").value.trim()
  };
}

function hasChanges() {
  const currentData = getCurrentFormData();

  return Object.keys(originalStoreData).some(
    key => originalStoreData[key] != currentData[key]
  );
}

const phoneInput = document.getElementById("companyPhone");

phoneInput.addEventListener("input", (event) => {
  // Remove any non-numeric characters
  let value = event.target.value.replace(/\D/g, "");

  // Limit to 11 characters
  value = value.substring(0, 11);

  // Format as 123-456-7890
  if (value.length > 6) {
    value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
  } else if (value.length > 3) {
    value = `${value.slice(0, 3)}-${value.slice(3)}`;
  }

  event.target.value = value;
});

// Enforce only numeric input (optional if maxlength is in use)
phoneInput.addEventListener("keypress", (event) => {
  if (!/[0-9]/.test(event.key)) {
    event.preventDefault();
  }
});

// Initialize space to upload images
function initializeDropzone() {
    // Initialize Dropzone
    Dropzone.options.multiFileUploadA = {
        acceptedFiles: 'image/*',
        maxFiles: 1, // Maximum files allowed
        maxFilesize: 5, // Max file size in MB
        init: function () {
            this.on("addedfile", function (file) {
                // Check if the number of uploaded images is already 3
                if (imageArray.length > 1) {
                    // Remove the oldest file preview
                    const oldestFile = imageArray.shift(); // Remove the first file from the array
                    oldestFile.previewElement.remove();
                }

                // Add the new file to the array
                imageArray.push(file);

                // Get the remove icon (dz-error-mark) in the file preview
                const removeIcon = file.previewElement.querySelector('.dz-error-mark');

                if (removeIcon) {
                    // Add event listener to remove the image on click
                    removeIcon.addEventListener("click", function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        // Remove the file from the array
                        const index = imageArray.indexOf(file);
                        if (index > -1) {
                            imageArray.splice(index, 1);
                        }

                        // Remove the file preview
                        file.previewElement.remove();
                    });
                }
            });

            // Handle the maxfilesexceeded event
            this.on("maxfilesexceeded", function (file) {
                showToastMessageE("only one image is allowed, and sizes should be less than 5MB.");
                this.removeFile(file); // Remove the extra file
            });
        }
    };
}

// Call the function to initialize Dropzone for images
initializeDropzone();

// show toast success
function showToastMessageS(message) {
    document.getElementById('toastMessage2').textContent = message;
    const toastElement = document.getElementById('liveToast3'); // Get the toast element
    const toast = new bootstrap.Toast(toastElement); // Initialize the toast
    toast.show(); // Show the toast
}

// show toast error
function showToastMessageE(message) {
    document.getElementById('toastError').textContent = message;
    const toastElement = document.getElementById('liveToast1'); // Get the toast element
    const toast = new bootstrap.Toast(toastElement); // Initialize the toast
    toast.show(); // Show the toast
}

async function logout() {
    // also send a request to the logout api endpoint
    const apiUrl = "https://api.payuee.com/log-out";

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
            // showToastMessageE('an error occurred. Please try again');
                if (!response.ok) {
        showToastMessageE('an error occurred. Please try again');
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

let nigeriaData = [];

// Load states from JSON
async function loadStates() {
    try {
        const response = await fetch("nigeria_state.json");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        nigeriaData = await response.json();
        renderStates(nigeriaData);

        // Hook state search input
        const searchInput = document.getElementById("stateSearchInput");
        searchInput.addEventListener("input", function () {
            const searchTerm = searchInput.value;
            filterStates(searchTerm, nigeriaData);
        });

    } catch (error) {
        console.error("Error loading states:", error);
    }
}

// Load cities (LGAs + wards) for a selected state
async function loadCities(stateName) {
    const stateData = nigeriaData.find(s => s.state === stateName);
    if (stateData && stateData.lgas) {
        renderCities(stateData.lgas, stateName);

        // Hook city search input
        const citySearchInput = document.getElementById("citySearchInput");
        citySearchInput.addEventListener("input", function () {
            const searchTerm = citySearchInput.value;
            filterCities(searchTerm, stateData.lgas, stateName);
        });

    } else {
        renderCities([], stateName);
    }
}

// Render states into the <ul id="state-list">
function renderStates(states) {
    const stateList = document.getElementById("state-list");
    stateList.innerHTML = "";

    if (states.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No states found";
        li.classList.add("search-suggestion__item");
        stateList.appendChild(li);
        return;
    }

    states.forEach(state => {
        const li = document.createElement("li");
        li.textContent = state.state;
        li.classList.add("search-suggestion__item", "js-search-select");
        li.dataset.state = state.state;
        stateList.appendChild(li);
    });

    // Add click event
    stateList.onclick = function (event) {
        if (event.target.classList.contains("js-search-select")) {
            stateSelected = event.target.dataset.state; // ✅ update correct global
            document.getElementById("search-dropdown").value = stateSelected;
            document.getElementById("city-dropdown").value = ""; // reset city
            toggleClassById("formeStateList", "js-content_visible");
            loadCities(stateSelected);
        }
    };

}

// Render cities into the <ul id="city-list">
function renderCities(cities, stateName) {
    const cityList = document.getElementById("city-list");
    cityList.innerHTML = "";

    if (cities.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No cities found";
        li.classList.add("search-suggestion__item");
        cityList.appendChild(li);
        return;
    }

    cities.forEach(city => {
        if (!city.wards) return;
        city.wards.forEach(ward => {
            const fullName = `${city.name} - ${ward.name}`; // ✅ combined text
            const li = document.createElement("li");
            li.textContent = fullName;
            li.classList.add("search-suggestion__item", "js-search-select");

            // Store both city + ward for later
            li.dataset.city = city.name;
            li.dataset.ward = ward.name;
            li.dataset.fullName = fullName; // ✅ use this for display/search
            li.dataset.latitude = ward.latitude;
            li.dataset.longitude = ward.longitude;
            cityList.appendChild(li);
        });
    });

    // Add click event
    cityList.onclick = function (event) {
        if (event.target.classList.contains("js-search-select")) {
            const fullName = event.target.dataset.fullName;

            citySelected = fullName; // ✅ save City - Ward format
            latitude = parseFloat(event.target.dataset.latitude);
            longitude = parseFloat(event.target.dataset.longitude);

            // Show "City - Ward" in the dropdown input
            document.getElementById("city-dropdown").value = fullName;

            toggleClassById("formeCityList", "js-content_visible");
        }
    };
}

function filterStates(term, states) {
    const filtered = states.filter(s =>
        s.state.toLowerCase().includes(term.toLowerCase())
    );
    renderStates(filtered);
}

function filterCities(term, cities, stateName) {
    const filtered = [];

    cities.forEach(city => {
        if (!city.wards) return;

        const matchedWards = city.wards.filter(ward => {
            const fullName = `${city.name} - ${ward.name}`.toLowerCase();
            return fullName.includes(term.toLowerCase()); // ✅ match "city - ward"
        });

        if (matchedWards.length > 0) {
            filtered.push({ ...city, wards: matchedWards });
        }
    });

    renderCities(filtered, stateName);
}

function toggleClassById(elementId, className) {
    const element = document.getElementById(elementId);
    if (element) {
        if (element.classList.contains(className)) {
            // If the class exists, remove it
            element.classList.remove(className);
        } else {
            // If the class does not exist, add it
            element.classList.add(className);
        }
    }
}