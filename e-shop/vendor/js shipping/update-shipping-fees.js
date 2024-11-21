var stateIsoCode;
var stateSelected;
var citySelected;

var cityLat;
var cityLon;
// Coordinates of the store/warehouse
var vendorCityLat = 0.0;
var vendorCityLon = 0.0;
var storeCity;
var storeState;
var stateISO
var cityISO
var pricePerKM = 0;
var isNew = "";


document.addEventListener('DOMContentLoaded', async function () {
    // Initialize and load states when the page is loaded
    // Get the URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Get the value of the 'new' parameter
    isNew = urlParams.get('new');

    // Check the value and run conditions
    if (isNew === 'true') {
        // Do something if the 'new' parameter is set to true
        // After redirecting to the shipping page
        swal({
            title: "You're almost there!",
            text: "Set up your shipping fees to ensure a smooth experience for your customers.",
            icon: "info",
            buttons: {
                confirm: {
                    text: "Got it!",
                    value: true,
                },
            },
        }).then((result) => {
            if (result) {
                // Optional: Additional action if needed after confirmation
            }
        });
        // Add any specific code you want to execute here
    }

    getShippingFees();
    await loadStates1();
    await loadStates();
});

document.getElementById('validationCustom01').addEventListener('input', function(event) { 
    const shippingFeePerKm = event.target.value
    pricePerKM = +shippingFeePerKm;

    if (cityLat == "") {
        showToastMessageE("Please Select State and City");
        return;
    }

    // Calculate distance between store and selected city in kilometers
    const distance = calculateDistance(vendorCityLat, vendorCityLon, cityLat, cityLon);
    const shippingFees = document.getElementById('validationCustom02');
    const shippingDistance = document.getElementById('validationCustom03');
    
    let shippingFee = distance * shippingFeePerKm;

    // Ensure the shipping fee is not lower or higher than the defined limits
    if (shippingFee < shippingLessThan) {
        shippingFee = shippingLessThan;
    } else if (shippingFee > shippingGreaterThan) {
        shippingFee = shippingGreaterThan;
    }

    // console.log(`Distance to selected city: ${'₦'+distance.toFixed(2)} km`);
    shippingFees.value = `Shipping Fee: ${'₦'+shippingFee.toFixed(2)}`;
    shippingDistance.value = `Distance to selected city: ${distance.toFixed(2)} km`;
    // console.log(`Shipping Fee: ${'₦'+shippingFee.toFixed(2)}`);
});

// Function to fetch and populate state data
async function loadStates1() {
    try {
        const response = await fetch('nigeria_states.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const states = await response.json();
        renderStates1(states);
    } catch (error) {
        console.error('Error fetching state data:', error);
    }
}

// Function to fetch and populate city data based on state_iso2
async function loadCities1(stateIso2) {
    try {
        const response = await fetch('nigeria_cities.json'); // Update with your actual cities JSON URL
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const cities = await response.json();
        stateISO = stateIso2;
        const filteredCities = cities.filter(city => city.state_iso2 === stateIso2);
        filteredCities.sort((a, b) => a.name.localeCompare(b.name));
        renderCities1(filteredCities);
    } catch (error) {
        console.error('Error fetching city data:', error);
    }
}

// vendor store long and lat
// Function to render states into the Select State dropdown
function renderStates1(states, selectedStateName = null) {  // Optional parameter for default selection
    const stateSelect = document.getElementById('state-select1');
    if (!stateSelect) {
        console.error('State select element not found');
        return;
    }

    stateSelect.innerHTML = '<option selected="" value="0">Choose State</option>'; // Clear existing options

    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.iso2; // Use the ISO code as the value
        option.textContent = state.name; // Display state name
        stateSelect.appendChild(option);

        // Automatically select the option if it matches the selectedStateName
        if (selectedStateName && state.name === selectedStateName) {
            option.selected = true;
        }
    });

    // Initialize Select2 for better dropdown handling
    $('#state-select1').select2();

    // Attach Select2 event listener
    $('#state-select1').on('change', function () {
        const selectedStateIso = $(this).val();
        if (selectedStateIso !== '0') {
            storeState = $('#state-select1 option:selected').text();
            loadCities1(selectedStateIso);  // Load cities when a state is selected
        } else {
            resetCitiesDropdown1();
        }
    });
}

// Function to render cities into the Select City dropdown
function renderCities1(cities, selectedCityName = null) {  // Optional parameter for default selection
    const citySelect = document.getElementById('city-select1');
    
    if (!citySelect) {
        console.error('City select element not found');
        return;
    }

    citySelect.innerHTML = '<option selected="" value="0">Choose City</option>'; // Clear existing options

    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.name; // Use the city name as the value
        option.textContent = city.name; // Display city name
        option.dataset.city = city.name; // Store city location in data attribute
        option.dataset.iso = city.state_iso2; // Store city iso code in data attribute
        option.dataset.latitude = city.latitude; // Store latitude in data attribute
        option.dataset.longitude = city.longitude; // Store longitude in data attribute
        citySelect.appendChild(option);

        // Automatically select the option if it matches the selectedCityName
        if (selectedCityName && city.name === selectedCityName) {
            option.selected = true;
        }
    });

    // Initialize Select2 on the citySelect element
    $(citySelect).select2();

    // Use the Select2 change event listener for city selection
    $(citySelect).on('select2:select', function (e) {
        const selectedCity = e.params.data.element; // Get selected option element

        if (selectedCity.value !== '0') {
            // Extract latitude and longitude from the selected city's data attributes
            vendorCityLat = parseFloat(selectedCity.dataset.latitude);
            vendorCityLon = parseFloat(selectedCity.dataset.longitude);
            cityISO = selectedCity.dataset.iso;

            // Extract latitude and longitude from the selected city's data attributes
            storeCity = selectedCity.dataset.city;
        }
    });
}

// Function to reset city dropdown
function resetCitiesDropdown1() {
    const citySelect = document.getElementById('city-select1');
    citySelect.innerHTML = '<option selected="" value="0">Choose City</option>'; // Reset city options
}

// LOAD AND GET ESTIMATED SHIPPING FEES
// Function to fetch and populate state data
async function loadStates() {
    try {
        const response = await fetch('nigeria_states.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const states = await response.json();
        renderStates(states);
    } catch (error) {
        console.error('Error fetching state data:', error);
    }
}

// Function to fetch and populate city data based on state_iso2
async function loadCities(stateIso2) {
    try {
        const response = await fetch('nigeria_cities.json'); // Update with your actual cities JSON URL
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const cities = await response.json();
        const filteredCities = cities.filter(city => city.state_iso2 === stateIso2);
        filteredCities.sort((a, b) => a.name.localeCompare(b.name));
        renderCities(filteredCities);
    } catch (error) {
        console.error('Error fetching city data:', error);
    }
}

// Function to render states into the Select State dropdown
function renderStates(states) {
    const stateSelect = document.getElementById('state-select');
    if (!stateSelect) {
        console.error('State select element not found');
        return;
    }

    stateSelect.innerHTML = '<option selected="" value="0">Choose State</option>'; // Clear existing options
    
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.iso2; // Use the ISO code as the value
        option.textContent = state.name; // Display state name
        stateSelect.appendChild(option);
    });

    // Initialize Select2 for better dropdown handling
    $('#state-select').select2();

    // Attach Select2 event listener
    $('#state-select').on('change', function () {
        const selectedStateIso = $(this).val();
        if (selectedStateIso !== '0') {
            stateSelected = $('#state-select option:selected').text();
            if (+pricePerKM < 1 || isNaN(+pricePerKM)) {
                // Check if pricePerKM is empty or not a number
                showToastMessage("Please enter a valid price for shipping fee per km.");
                return; // Exit early if input is invalid
            }
            loadCities(selectedStateIso);  // Load cities when a state is selected
        } else {
            resetCitiesDropdown();
        }
    });
}

// Function to render cities into the Select City dropdown
function renderCities(cities) {
    const citySelect = document.getElementById('city-select');
    // const latitudeDisplay = document.getElementById('city-latitude');  // Assume you have elements to display lat/lon
    // const longitudeDisplay = document.getElementById('city-longitude'); 

    if (!citySelect) {
        console.error('City select element not found');
        return;
    }
    
    citySelect.innerHTML = '<option selected="" value="0">Choose City</option>'; // Clear existing options

    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.name; // Use the city name as the value
        option.textContent = city.name; // Display city name
        option.dataset.latitude = city.latitude; // Store latitude in data attribute
        option.dataset.longitude = city.longitude; // Store longitude in data attribute
        citySelect.appendChild(option);
    });

    // Initialize Select2 on the citySelect element
    $(citySelect).select2();

    // Use the Select2 change event listener for city selection
    $(citySelect).on('select2:select', function (e) {
        const selectedCity = e.params.data.element; // Get selected option element

        if (selectedCity.value !== '0') {

            cityLat = parseFloat(selectedCity.dataset.latitude);
            cityLon = parseFloat(selectedCity.dataset.longitude);
            
            // Coordinates of the store/warehouse 
            if (vendorCityLat == 0.0 || vendorCityLon == 0.0) {
                showToastMessageE("Please select a valid store location");
                return;
            }

            // Calculate distance between store and selected city in kilometers
            const distance = calculateDistance(vendorCityLat, vendorCityLon, cityLat, cityLon);


            // Calculate shipping fee based on distance
            const pricePerKMm = document.getElementById('validationCustom01');
            const pricePerKM = +pricePerKMm.value;
            const shippingFees = document.getElementById('validationCustom02');
            const shippingDistance = document.getElementById('validationCustom03');
            const shippingGreaterThan = +document.getElementById("validationCustom021").value; // Max shipping fee
            const shippingLessThan = +document.getElementById("validationCustom031").value;   // Min shipping fee

            // Check for valid price per kilometer
            if (pricePerKM === 0) {
                showToastMessageE("Please enter a valid price per kilometer");
                return;
            }

            // Calculate the shipping fee based on distance
            let shippingFee = distance * pricePerKM;

            // Ensure the shipping fee is not lower or higher than the defined limits
            if (shippingFee < shippingLessThan) {
                shippingFee = shippingLessThan;
            } else if (shippingFee > shippingGreaterThan) {
                shippingFee = shippingGreaterThan;
            }

            // Display the adjusted shipping fee and distance
            shippingFees.value = `Shipping Fee: ₦${shippingFee.toFixed(2)}`;
            shippingDistance.value = `Distance to selected city: ${distance.toFixed(2)} km`;


            
        } else {
            // Reset city selection and clear displayed latitude/longitude if "Choose City" is selected
            // latitudeDisplay.textContent = '';
            // longitudeDisplay.textContent = '';
        }
    });
}

// Function to reset city dropdown
function resetCitiesDropdown() {
    const citySelect = document.getElementById('city-select');
    citySelect.innerHTML = '<option selected="" value="0">Choose City</option>'; // Reset city options
    document.getElementById('city-latitude').textContent = ''; // Clear latitude
    document.getElementById('city-longitude').textContent = ''; // Clear longitude
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}

document.getElementById('updateShippingFeesButton').addEventListener('click', async function() {
    
    if (+pricePerKM < 1 || isNaN(+pricePerKM)) {
        // Check if pricePerKM is empty or not a number
        showToastMessage("Please enter a valid price for shipping fee per km.");
        return; // Exit early if input is invalid
    }

    showToastMessageS(`Do you want to update the shipping price to ₦${pricePerKM} Per KM?`);

    // Define a handler function for the confirmation
    const handleConfirmation = async function() {
        await setShippingFees(); // Call the function to update the shipping fees

        // Remove this event listener after it runs once
        document.getElementById('toastConfirmation').removeEventListener('click', handleConfirmation);
    };

    // Add the event listener to the confirmation button
    document.getElementById('toastConfirmation').addEventListener('click', handleConfirmation);
});

function convertToFloatIfInteger(num) {
    // Check if the number is an integer
    if (Number.isInteger(num)) {
        // Convert to float by adding a decimal place
        return parseFloat(num.toFixed(2));
    }
    // If it's already a float, return the number as-is
    return num;
}

function selectStateByText(text) {
    const stateSelect = document.getElementById('state-select1');
    const options = stateSelect.options;

    // Check if there are no options available
    if (options.length <= 1) { // Assuming the first option is "Choose State"
        loadStates1().then(() => {
            renderStates1(states, text);  
        });
        return; // Exit the function
    }

    // Loop through options to find the matching text
    for (let i = 0; i < options.length; i++) {
        if (options[i].textContent === text) {
            options[i].selected = true;
            break;
        }
    }

    // Trigger the Select2 update if you're using Select2
    $('#state-select1').trigger('change');
}

function selectCityByText(text) {
    const citySelect = document.getElementById('city-select1');
    const options = citySelect.options;

    // Check if there are no options available
    if (options.length <= 1) { // Assuming the first option is "Choose City"
        // console.log('No cities available'); // Or perform any secondary action
        // Example: Display a message or disable the dropdown
        // alert("No cities available. Please try again later.");
        return; // Exit the function
    }

    // Loop through options to find the matching text
    for (let i = 0; i < options.length; i++) {
        if (options[i].textContent === text) {
            options[i].selected = true;
            break;
        }
    }

    // Trigger the Select2 update if you're using Select2
    $('#city-select1').trigger('change');
}

function stringToBool(str) {
    return str === 'true'; // Returns true if the string is 'true', otherwise false
}

// Function to show the toast when the event occurs
function showToastMessage(message) {
    document.getElementById('toastMessage').textContent = message;
    const toastElement = document.getElementById('liveToast'); // Get the toast element
    const toast = new bootstrap.Toast(toastElement); // Initialize the toast
    toast.show(); // Show the toast
}

function showToastMessageS(message) {
    document.getElementById('toastMessage2').textContent = message;
    const toastElement = document.getElementById('liveToast3'); // Get the toast element
    const toast = new bootstrap.Toast(toastElement); // Initialize the toast
    toast.show(); // Show the toast
}

function showToastMessageE(message) {
    document.getElementById('toastError').textContent = message;
    const toastElement = document.getElementById('liveToast1'); // Get the toast element
    const toast = new bootstrap.Toast(toastElement); // Initialize the toast
    toast.show(); // Show the toast
}

async function setShippingFees() {
    const shippingGreaterThan = document.getElementById("validationCustom021").value
    const shippingLessThan = document.getElementById("validationCustom031").value
    // Get the selected radio button using querySelector
    const selectedRadio = document.querySelector('input[name="shipping"]:checked').value;
    // Construct the request body
    const requestBody = {
        shipping_fee_per_km: +pricePerKM,
        shipping_fee_greater: +shippingGreaterThan,
        shipping_fee_less: +shippingLessThan,
        store_latitude: convertToFloatIfInteger(vendorCityLat),
        store_longitude: convertToFloatIfInteger(vendorCityLon),
        store_state: storeState,
        store_city: storeCity,
        state_iso: stateISO,
        calculate_using_kg: stringToBool(selectedRadio),
    };

    // Send POST request using Fetch API
    fetch('https://api.payuee.com/vendor/set-shipping-fee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include', // set credentials to include cookies
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(response => {
        if (response.ok) {  // Check for a successful response
            showToastMessage("Shipping fees updated successfully.");
            if (isNew === 'true') {
                // Do something if the 'new' parameter is set to true
                // After the user successfully updates shipping fees
                swal({
                    title: "Shipping fees saved!",
                    text: "Let's add your first product!",
                    icon: "success",
                    buttons: {
                        confirm: {
                            text: "Add First Product",
                            closeModal: true,
                        },
                    },
                }).then((result) => {
                    if (result) {
                        // Redirect to the Add Product page
                        localStorage.setItem("firstProductAdded", "second");
                        window.location.href = "add-products.html";
                    }
                });
                // Add any specific code you want to execute here
            }
        } else {
            const errorData = response; // Handle error if response is not ok
            if (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                logout();
            }
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

async function getShippingFees() {
    // also send a request to the logout api endpoint
    const apiUrl = "https://api.payuee.com/vendor/get-shipping-fee";

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
            if (response.error == "no shipping fee found for this vendor") {
                return;
            }
            
            return;
        }
        return;
      }
        const data = await response.json();
        const pricePerKMm = document.getElementById('validationCustom01');
        const shippingGreaterThan = document.getElementById("validationCustom021")
        const shippingLessThan = document.getElementById("validationCustom031")
        pricePerKMm.value = data.success.shipping_fee_per_km;
        shippingGreaterThan.value = data.success.shipping_fee_greater;
        shippingLessThan.value = data.success.shipping_fee_less;

        // Get the selected radio button for shipping
        const selectedOption = document.querySelector('input[name="shipping"]:checked').value;
        
        // Convert the value to boolean (true or false)
        selectedOption === data.success.calculate_using_kg;

        // Select state
        selectStateByText(data.success.store_state);
        // Select city
        selectCityByText(data.success.store_city);

    } finally{
        // do nothing
    }
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
