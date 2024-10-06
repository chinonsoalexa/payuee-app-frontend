var stateIsoCode;
var stateSelected;
var citySelected;

var cityLat;
var cityLon;
var vendorCityLat = 0.0;
var vendorCityLon = 0.0;
var storeCity;
var storeState;
var pricePerKM = 0;

document.addEventListener('DOMContentLoaded', async function () {
    // Initialize and load states when the page is loaded
    getShippingFees();
    await loadStates1();
    await loadStates();
});

document.getElementById('validationCustom01').addEventListener('input', function(event) {
    const shippingFeePerKm = event.target.value
    pricePerKM = +shippingFeePerKm;

    // Coordinates of the store/warehouse (assumed to be in Lagos for this example)
    const storeLat = 4.8156; 
    const storeLon = 7.0498; 

    if (cityLat == "") {
        swal("Please Select State and City", {
            icon: "warning",
            buttons: {
                confirm: true,
            },
          }).then(() => {
           
          });
        return;
    }

    // Calculate distance between store and selected city in kilometers
    const distance = calculateDistance(storeLat, storeLon, cityLat, cityLon);
    const shippingFees = document.getElementById('validationCustom02');
    const shippingDistance = document.getElementById('validationCustom03');
    
    const shippingFee = distance * shippingFeePerKm;

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
        const filteredCities = cities.filter(city => city.state_iso2 === stateIso2);
        filteredCities.sort((a, b) => a.name.localeCompare(b.name));
        renderCities1(filteredCities);
    } catch (error) {
        console.error('Error fetching city data:', error);
    }
}

// vendor store long and lat
// Function to render states into the Select State dropdown
function renderStates1(states) {
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
        option.dataset.state = state.name; // Store State location in data attribute
        stateSelect.appendChild(option);
    });

    // Initialize Select2 for better dropdown handling
    $('#state-select1').select2();

    // Attach Select2 event listener
    $('#state-select1').on('change', function () {
        const selectedStateIso = $(this).val();
        if (selectedStateIso !== '0') {
            stateSelected = $('#state-select1 option:selected').text();
            // Extract latitude and longitude from the selected state's data attributes
            storeState = selectedCity.dataset.state
            loadCities(selectedStateIso);  // Load cities when a state is selected
        } else {
            resetCitiesDropdown1();
        }
    });
}

// Function to render cities into the Select City dropdown
function renderCities1(cities) {
    const citySelect = document.getElementById('city-select1');
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
        option.dataset.city = city.name; // Store city location in data attribute
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
            // Extract latitude and longitude from the selected city's data attributes
            vendorCityLat = parseFloat(selectedCity.dataset.latitude);
            vendorCityLon = parseFloat(selectedCity.dataset.longitude);

            // Extract latitude and longitude from the selected city's data attributes
            storeCity = selectedCity.dataset.city
            
        } else {
            
        }
    });
}

// Function to reset city dropdown
function resetCitiesDropdown1() {
    const citySelect = document.getElementById('city-select1');
    citySelect.innerHTML = '<option selected="" value="0">Choose City</option>'; // Reset city options
    // document.getElementById('city-latitude').textContent = ''; // Clear latitude
    // document.getElementById('city-longitude').textContent = ''; // Clear longitude
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
                swal("Please select a valid store location", {
                    icon: "warning",
                    buttons: {
                        confirm: true,
                    },
                }).then(() => {
                
                });
                return;
            }

            // Calculate distance between store and selected city in kilometers
            const distance = calculateDistance(vendorCityLat, vendorCityLon, cityLat, cityLon);


            // Calculate shipping fee based on distance
            const pricePerKMm = document.getElementById('validationCustom01');
            pricePerKM = +pricePerKMm.value;
            const shippingFees = document.getElementById('validationCustom02');
            const shippingDistance = document.getElementById('validationCustom03');
            if (+pricePerKM == 0) {
                swal("Please enter a valid price per kilometer", {
                    icon: "warning",
                    buttons: {
                        confirm: true,
                    },
                }).then(() => {
                
                });
                return;
            }
            const shippingFee = distance * pricePerKM;

            // console.log(`Distance to selected city: ${'₦'+distance.toFixed(2)} km`);
            shippingFees.value = `Shipping Fee: ${'₦'+shippingFee.toFixed(2)}`;
            shippingDistance.value = `Distance to selected city: ${distance.toFixed(2)} km`;
            // console.log(`Shipping Fee: ${'₦'+shippingFee.toFixed(2)}`);

            
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
    if (pricePerKM === "" || isNaN(+pricePerKM)) {
        // Check if pricePerKM is empty or not a number
        await swal({
            title: "Invalid Input",
            text: "Please enter a valid price for shipping fee per km.",
            icon: "warning",
            buttons: {
                confirm: {
                    text: "OK",
                    value: true,
                    closeModal: true
                }
            }
        });
        return; // Exit early if input is invalid
    }

    // Ask for confirmation before updating shipping fees
    const willUpdate = await swal({
        title: "Are you sure?",
        text: `Do you want to update the shipping price to ₦${+pricePerKM} Per KM?`,
        icon: "warning",
        buttons: {
            cancel: {
                text: "Cancel",
                value: false,
                visible: true,
                closeModal: true
            },
            confirm: {
                text: "Confirm",
                value: true,
                closeModal: true
            }
        },
        dangerMode: true
    });

    // Proceed based on user's choice
    if (willUpdate) {
        try {
            await setShippingFees(); // Call the function to update the shipping fees
            await swal("Success", "Shipping fees have been updated.", "success");
        } catch (error) {
            console.error("Error updating shipping fees:", error);
            await swal("Error", "Failed to update shipping fees. Please try again.", "error");
        }
    } else {
        await swal("Cancelled", "Shipping fee update was cancelled.", "info");
    }
});

async function setShippingFees() {
    const shippingGreaterThan = document.getElementById("validationCustom021").value
    const shippingLessThan = document.getElementById("validationCustom031").value
    // Construct the request body
    const requestBody = {
        shipping_fee_per_km: +pricePerKM,
        shipping_fee_greater: shippingGreaterThan,
        shipping_fee_less: shippingLessThan,
        store_latitude: vendorCityLat,
        store_longitude: vendorCityLon,
        store_state: storeState,
        store_city: storeCity,
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
       if (!response.ok) {
            if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                logout();
            }
        } else {
            const error = response.json();
            console.error("Error posting product:", error);
        }
        // localStorage.removeItem('cart');
        swal("Successfully updated shipping fees to " + '₦'+ +pricePerKM, {
            icon: "success",
            buttons: {
                confirm: true,
            },
          })
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
            alert('an error occurred. Please try again');
            return;
        }
        return;
      }
        const data = await response.json();
            const pricePerKMm = document.getElementById('validationCustom01');
            pricePerKMm.value = data.success;
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
