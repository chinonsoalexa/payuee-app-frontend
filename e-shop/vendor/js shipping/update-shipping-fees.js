var stateIsoCode;
var stateSelected;
var citySelected;

var buyersLat;
var buyersLon;
// Coordinates of the store/warehouse
var vendorCityLat = 0.0;
var vendorCityLon = 0.0;
var storeCity;
var storeState;
var buyerState2;
var stateISO
var cityISO
var pricePerKM = 0;

let nigeriaData = {};

let initialShippingRules = null; // store server data after getAvailableLogisticsCompany()
let backendData = {}; // store server data after getAvailableLogisticsCompany()

// Track selected companies
let selectedCompanies = [];

// ✅ Build statesByCompany dynamically from backendData
const statesByCompany = {};

var apibackendData;

// Toggle main sections (logistics vs custom)
const modeSelect = document.getElementById('shippingSetupMode');
const logisticsFields = document.getElementById('logisticsFields');
const customSetupFields = document.getElementById('customSetupFields');

modeSelect.addEventListener('change', () => {
  if (modeSelect.value === 'logistics') {
    logisticsFields.classList.remove('d-none');
    customSetupFields.classList.add('d-none');
  } else {
    logisticsFields.classList.add('d-none');
    customSetupFields.classList.remove('d-none');
    // Optionally trigger first shipping type view
    shippingType.dispatchEvent(new Event('change'));
  }
});

// Toggle sub-fields inside customSetupFields
const shippingType = document.getElementById('shippingType');
const customSubFields = customSetupFields.querySelectorAll('.custom-fields'); // **only inner fields**

shippingType.addEventListener('change', () => {
  customSubFields.forEach(div => div.classList.add('d-none'));

  const selected = shippingType.value + 'Fields';
  const activeDiv = document.getElementById(selected);
  if (activeDiv) activeDiv.classList.remove('d-none');
});

// Optional: on page load, show default
if (modeSelect.value === 'custom') {
  customSetupFields.classList.remove('d-none');
  shippingType.dispatchEvent(new Event('change'));
}

// --- Weight Tier Handling ---
function addWeightTier() {
  const container = document.getElementById('weightContainer');
  const limitMsg = document.getElementById('weightLimitMsg');

  // limit check
  if (container.querySelectorAll('.tier-row').length >= 200) {
    limitMsg.classList.remove("d-none");
    return;
  } else {
    limitMsg.classList.add("d-none");
  }

  const div = document.createElement('div');
  div.className = "tier-row input-group mb-2";

  div.innerHTML = `
    <input class="form-control" type="number" placeholder="Min (kg)">
    <span class="input-group-text">–</span>
    <input class="form-control" type="number" placeholder="Max (kg)">
    <input class="form-control" type="number" placeholder="Fee (₦)">
    <button type="button" class="btn btn-danger btn-sm remove-btn">&minus;</button>
  `;

  // Remove button handler
div.querySelector('.remove-btn').onclick = () => {
  div.remove();
  limitMsg.classList.add("d-none"); // hide warning if back under limit
};

  container.appendChild(div);
}

// --- Advanced Rule Handling ---
function updateUnitLabel(row) {
  const condition = row.querySelector(".condition-select").value;
  const unitLabel = row.querySelector(".unit-label");

  switch (condition) {
    case "distance": unitLabel.textContent = "Km"; break;
    case "weight": unitLabel.textContent = "Kg"; break;
    case "price": unitLabel.textContent = "₦"; break;
    case "quantity": unitLabel.textContent = "Qty"; break;
    default: unitLabel.textContent = "";
  }
}

document.addEventListener("change", function (e) {
  if (e.target.classList.contains("condition-select")) {
    const row = e.target.closest(".rule-row");
    updateUnitLabel(row);
  }
});

document.getElementById("addRuleBtn").addEventListener("click", function () {
  const container = document.getElementById("rulesContainer");
  const limitMsg = document.getElementById('rulesLimitMsg');

  // limit check
  if (container.querySelectorAll('.rule-row').length >= 200) {
    limitMsg.classList.remove("d-none");
    return;
  } else {
    limitMsg.classList.add("d-none");
  }

  const newRule = container.querySelector(".rule-row").cloneNode(true);

  newRule.querySelectorAll("input").forEach(input => input.value = "");
  newRule.querySelector(".condition-select").value = "distance";
  updateUnitLabel(newRule);

  // add remove button if missing
  let removeBtn = newRule.querySelector(".remove-btn");
  if (!removeBtn) {
    removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn btn-danger btn-sm remove-btn";
    removeBtn.innerHTML = "&minus;";
    newRule.appendChild(removeBtn);
  }

  removeBtn.onclick = () => {
    newRule.remove();
    limitMsg.classList.add("d-none");
  };

  container.appendChild(newRule);
});

// Attach remove handlers to hardcoded rows on load
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.onclick = () => {
      const row = btn.closest('.tier-row, .rule-row');
      if (row) row.remove();
    };
  });
});

// Initialize first row labels
document.querySelectorAll(".rule-row").forEach(updateUnitLabel);


//   this is for the states render
const states = [
  { state: "Abia", lat: 5.5320, lon: 7.4860 },
  { state: "Adamawa", lat: 10.2703, lon: 13.2700 },
  { state: "Akwa Ibom", lat: 5.0080, lon: 7.8500 },
  { state: "Anambra", lat: 6.2104, lon: 7.0700 },
  { state: "Bauchi", lat: 11.6804, lon: 10.1900 },
  { state: "Bayelsa", lat: 4.7500, lon: 6.0500 },
  { state: "Benue", lat: 7.1904, lon: 8.1300 },
  { state: "Borno", lat: 10.6204, lon: 12.1900 },
  { state: "Cross River", lat: 4.9604, lon: 8.3300 },
  { state: "Delta", lat: 5.8904, lon: 5.6800 },
  { state: "Ebonyi", lat: 6.3249, lon: 8.1137 }, // ✅ added
  { state: "Edo", lat: 6.3405, lon: 5.6200 },
  { state: "Ekiti", lat: 7.6304, lon: 5.2200 },
  { state: "Enugu", lat: 6.8670, lon: 7.3834 },
  { state: "Federal Capital Territory", lat: 9.0833, lon: 7.5333 },
  { state: "Gombe", lat: 10.2904, lon: 11.1700 },
  { state: "Imo", lat: 5.4930, lon: 7.0260 },
  { state: "Jigawa", lat: 11.7992, lon: 9.3503 },
  { state: "Kaduna", lat: 11.0800, lon: 7.7100 },
  { state: "Kano", lat: 12.0000, lon: 8.5200 },
  { state: "Katsina", lat: 11.5204, lon: 7.3200 },
  { state: "Kebbi", lat: 12.4504, lon: 4.1999 },
  { state: "Kogi", lat: 7.8004, lon: 6.7399 },
  { state: "Kwara", lat: 8.4900, lon: 4.5500 },
  { state: "Lagos", lat: 6.4433, lon: 3.3915 },
  { state: "Nasarawa", lat: 8.4904, lon: 8.5200 },
  { state: "Niger", lat: 10.4004, lon: 5.4699 },
  { state: "Ogun", lat: 7.1604, lon: 3.3500 },
  { state: "Ondo", lat: 7.2504, lon: 5.2000 },
  { state: "Osun", lat: 7.6299, lon: 4.1800 },
  { state: "Oyo", lat: 7.9700, lon: 3.5900 },
  { state: "Plateau", lat: 9.9300, lon: 8.8900 },
  { state: "Rivers", lat: 4.8100, lon: 7.0100 },
  { state: "Sokoto", lat: 13.0600, lon: 5.2400 },
  { state: "Taraba", lat: 7.8704, lon: 9.7800 },
  { state: "Yobe", lat: 11.7490, lon: 11.9660 },
  { state: "Zamfara", lat: 12.1704, lon: 6.6600 }
];

function populateStateSelect(selectId, btnId) {
  const select = document.getElementById(selectId);

  // Clear old options
  select.innerHTML = "";

  // Add new options
  states.forEach(s => {
    const option = document.createElement("option");
    option.value = s.state; // ✅ use the state name
    option.textContent = s.state;
    select.appendChild(option);
  });

  // Update tick marks when selecting/deselecting
  select.addEventListener("change", () => {
    for (let i = 0; i < select.options.length; i++) {
      const option = select.options[i];
      option.textContent = option.selected ? `${states[i].state}` : states[i].state;
    }
  });

  // Select All States button
  document.getElementById(btnId).addEventListener("click", () => {
    for (let i = 0; i < select.options.length; i++) {
      select.options[i].selected = true;
      select.options[i].textContent = `${states[i].state}`;
    }

    // 🔥 Manually trigger change so UI updates
    select.dispatchEvent(new Event("change"));
  });
}

// Call for both dropdowns
populateStateSelect("state-selectMain", "selectAllStatesBtn");
populateStateSelect("state-selectMain2", "selectAllStatesBtn2");
populateStateSelect("state-selectMain3", "selectAllStatesBtn3");
populateStateSelect("state-selectMain4", "selectAllStatesBtn4");
populateStateSelect("state-selectMain5", "selectAllStatesBtn5");

document.addEventListener('DOMContentLoaded', async function () {
    // Initialize and load states when the page is loaded
    // Get the URL parameters
    // const urlParams = new URLSearchParams(window.location.search);

    if (localStorage.getItem("product") == "one") {
        // Update popup content by ID
        document.getElementById("popupTitle").innerText = "Get Started with Shipping Fees";
        document.getElementById("popupDescription").innerText = "Set the foundation for smooth and hassle-free deliveries. Accurate shipping fees help ensure a great experience for your customers.";
        document.getElementById("popupImage").src = "shipping.png";
        document.getElementById("startSetup").textContent = "Continue";

        // Show the popup
        document.getElementById("welcomePopup").classList.remove("hidden");

        // Reference the button
        const startSetupButton = document.getElementById('startSetup');

        // Add and Remove event listener for the setup button
        // startSetupButton.removeEventListener('click', setupShippingFees1);
        startSetupButton.addEventListener('click', setupShippingFees1);
    };

    getAvailableLogisticsCompany();
    getShippingFees();
    await loadStates1();
    await loadStates();
});

function setupShippingFees1(e) {
    e.preventDefault();
    document.getElementById("welcomePopup").classList.add("hidden");
    document.getElementById('validationCustom01').focus();
}

document.getElementById('validationCustom01').addEventListener('input', function (event) {
    const shippingFeePerKm = event.target.value
    pricePerKM = +shippingFeePerKm;

    if (buyersLat == "") {
        showToastMessageE("Please Select State and City");
        return;
    }

    // Calculate distance between store and selected city in kilometers
    const distance = calculateDistance(vendorCityLat, vendorCityLon, buyersLat, buyersLon);
    const shippingFees = document.getElementById('validationCustom02');
    const shippingDistance = document.getElementById('validationCustom03');
    const shippingLessThan = document.getElementById("validationCustom031")
    const shippingGreaterThan = document.getElementById("validationCustom021")

    let shippingFee = distance * shippingFeePerKm;

    // Ensure the shipping fee is not lower or higher than the defined limits
    if (shippingFee < shippingLessThan) {
        shippingFee = shippingLessThan;
    } else if (shippingFee > shippingGreaterThan) {
        shippingFee = shippingGreaterThan;
    }

    // // // console.log(`Distance to selected city: ${'₦'+distance.toFixed(2)} km`);
    shippingFees.value = `Shipping Fee: ${'₦' + shippingFee.toFixed(2)}`;
    shippingDistance.value = `Distance to selected city: ${distance.toFixed(2)} km`;
    // // // console.log(`Shipping Fee: ${'₦'+shippingFee.toFixed(2)}`);
});

// Function to fetch and populate state data
async function loadStates1() {
    // Load the JSON file
    fetch("nigeria_state.json")
        .then(response => response.json())
        .then(data => {
            nigeriaData = data;
            renderStates1(nigeriaData);
        })
        .catch(err => console.error("Error loading JSON:", err));
}

// Function to fetch and populate city data based on state_iso2
async function loadCities1(stateName) {
    const stateData = nigeriaData.find(s => s.state === stateName);

    if (stateData && stateData.lgas) {
        renderCities1(stateData.lgas, stateName);
    }
}

// vendor store long and lat
// Function to render states into the Select State dropdown
function renderStates1(states, selectedStateName = null) {  // Optional parameter for default selection
    const stateSelect = document.getElementById('state-select1');
    if (!stateSelect) {
        // console.error('State select element not found');
        return;
    }

    stateSelect.innerHTML = '<option selected="" value="0">Choose State</option>'; // Clear existing options

    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.state; // Use the ISO code as the value
        option.textContent = state.state; // Display state name

        stateSelect.appendChild(option);

        // Automatically select the option if it matches the selectedStateName
        if (selectedStateName && state.state === selectedStateName) {
            option.selected = true;
        }
    });

    // Initialize Select2 for better dropdown handling
    $('#state-select1').select2();

    // Attach Select2 event listener
    $('#state-select1').on('change', function () {
        const selectedStateIso = $(this).val();
        storeState = selectedStateIso;
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
        // console.error('City select element not found');
        return;
    }

    citySelect.innerHTML = '<option selected="" value="0">Choose City</option>'; // Clear existing options

    // Loop through all LGAs
    cities.forEach(city => {
        if (!city.wards) return; // Skip if no wards
        city.wards.forEach(ward => {
            const option = document.createElement("option");
            option.value = JSON.stringify({
                state: selectedCityName,
                lga: city.name,
                ward: ward.name,
                lat: ward.latitude,
                lng: ward.longitude
            });

            option.value = city.name; // Use the city name as the value
            option.textContent = `${city.name} - ${ward.name}`; // Display city name
            option.dataset.city = city.name; // Store city location in data attribute
            // option.dataset.iso = city.state_iso2; // Store city iso code in data attribute
            option.dataset.latitude = ward.latitude; // Store latitude in data attribute
            option.dataset.longitude = ward.longitude; // Store longitude in data attribute
            citySelect.appendChild(option);

            // Automatically select the option if it matches the selectedCityName
            if (selectedCityName && city.name === selectedCityName) {
                option.selected = true;
            }
        });
    });

    $(citySelect).select2();

    // Use the Select2 change event listener for city selection
    $(citySelect).on('select2:select', function (e) {
        const selectedCity = e.params.data.element; // Get selected option element

        if (selectedCity.value !== '0') {
            // Extract latitude and longitude from the selected city's data attributes
            vendorCityLat = parseFloat(selectedCity.dataset.latitude);
            vendorCityLon = parseFloat(selectedCity.dataset.longitude);
            // cityISO = selectedCity.dataset.iso;

            // Extract latitude and longitude from the selected city's data attributes
            storeCity = selectedCity.dataset.city;

        runShippingSimulation();

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
    // Load the JSON file
    fetch("nigeria_state.json")
        .then(response => response.json())
        .then(data => {
            nigeriaData = data;
            renderStates(nigeriaData);
        })
        .catch(err => console.error("Error loading JSON:", err));
}

// Function to fetch and populate city data based on state_iso2
async function loadCities(stateIso2) {
    const stateData = nigeriaData.find(s => s.state === stateIso2);

    if (stateData && stateData.lgas) {
        renderCities(stateData.lgas, stateIso2);
    }
}

// Function to render states into the Select State dropdown
function renderStates(states) {
    const stateSelect = document.getElementById('state-select');
    if (!stateSelect) {
        // console.error('State select element not found');
        return;
    }

    stateSelect.innerHTML = '<option selected="" value="0">Choose State</option>'; // Clear existing options

    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.state; // Use the ISO code as the value
        option.textContent = state.state; // Display state name
        stateSelect.appendChild(option);

        let selectedStateName = "Select a State"; // <-- demo selected state

        // Automatically select the option if it matches the selectedStateName
        if (selectedStateName && state.state === selectedStateName) {
            option.selected = true;
        }
    });

    // Initialize Select2 for better dropdown handling
    $('#state-select').select2();

    // Attach Select2 event listener
    $('#state-select').on('change', function () {
        const selectedStateIso = $(this).val();
        buyerState2 = selectedStateIso;
        if (selectedStateIso !== '0') {
            buyerState2 = $('#state-select\ option:selected').text();
            loadCities(selectedStateIso);  // Load cities when a state is selected
        } else {
            resetCitiesDropdown();
        }
    });
}

// Function to render cities into the Select City dropdown
function renderCities(cities, selectedCityName = null) {
    const citySelect = document.getElementById('city-select');

    if (!citySelect) {
        // console.error('City select element not found');
        return;
    }

    citySelect.innerHTML = '<option selected="" value="0">Choose City</option>'; // Clear existing options

    // Loop through all LGAs
    cities.forEach(city => {
        if (!city.wards) return; // Skip if no wards
        city.wards.forEach(ward => {
            const option = document.createElement("option");
            option.value = JSON.stringify({
                state: selectedCityName,
                lga: city.name,
                ward: ward.name,
                lat: ward.latitude,
                lng: ward.longitude
            });

            option.value = city.name; // Use the city name as the value
            option.textContent = `${city.name} - ${ward.name}`; // Display city name
            option.dataset.city = city.name; // Store city location in data attribute
            // option.dataset.iso = city.state_iso2; // Store city iso code in data attribute
            option.dataset.latitude = ward.latitude; // Store latitude in data attribute
            option.dataset.longitude = ward.longitude; // Store longitude in data attribute
            citySelect.appendChild(option);

            // Automatically select the option if it matches the selectedCityName
            if (selectedCityName && city.name === selectedCityName) {
                option.selected = true;
            }
        });
    });

    $(citySelect).select2();

    // Use the Select2 change event listener for city selection
    $(citySelect).on('select2:select', function (e) {
        const selectedCity = e.params.data.element; // Get selected option element

        // if (selectedCity.value !== '0') {
        // Extract latitude and longitude from the selected city's data attributes
        buyersLat = parseFloat(selectedCity.dataset.latitude);
        buyersLon = parseFloat(selectedCity.dataset.longitude);
        // cityISO = selectedCity.dataset.iso;

        // Coordinates of the store/warehouse 
        if (vendorCityLat == 0.0 || vendorCityLon == 0.0) {
            showToastMessageE("Please select a valid store location");
            return;
        }

        runShippingSimulation();
        
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

const confirmBtn = document.getElementById('toastConfirmation');

async function handleConfirmation() {
    await setShippingFees();
}

['updateShippingFeesButton'].forEach(id => {
  const btn = document.getElementById(id);
  if (!btn) return;

  btn.addEventListener('click', function () {
    let pricePerKMm2 = document.getElementById('validationCustom01').value;

    if (+pricePerKMm2 < 1 || isNaN(+pricePerKMm2)) {
      showToastMessage("Please enter a valid price for shipping fee per km.");
      return;
    }

    showToastMessageS(`Do you want to update the shipping price to ₦${pricePerKMm2} Per KM?`);

    confirmBtn.removeEventListener('click', handleConfirmation);
    confirmBtn.addEventListener('click', handleConfirmation);
  });
});

['updateShippingFeesButton2'].forEach(id => {
  const btn = document.getElementById(id);
  if (!btn) return;

  btn.addEventListener('click', async function () {
    // Get the toggle element
    const toggle = document.getElementById("activeSetupToggle");

    // Check its state
    if (toggle.checked) {
      await updateLogisticsMode(true);
      showToastMessage("✅ Payuee Logistics is active");
    } else {
      if (!selectedCompanies || selectedCompanies.length === 0) {
          showToastMessage("⚠️ Switched to custom logistics");

          if (!selectedCompanies || selectedCompanies.length === 0) {
            showToastMessage("❌ Please select at least one logistics company");
            toggle.checked = true; // revert toggle
            return;
          }

          // 🔥 CALL API (deactivate payuee, use selected companies)
          await updateLogisticsMode(false);
      }
      return;
    }

    showToastMessageS(`Do you want to use the selected shipping logistics companies?`);

    confirmBtn.removeEventListener('click', handleConfirmation);
    confirmBtn.addEventListener('click', handleConfirmation);
  });
});

function updateToggleState() {
  const toggle = document.getElementById("activeSetupToggle");

  if (!selectedCompanies || selectedCompanies.length === 0) {
    toggle.disabled = true;
  } else {
    toggle.disabled = false;
  }
}

const toggle = document.getElementById("activeSetupToggle");

toggle.addEventListener("change", async function () {
  const isActive = toggle.checked;

  // console.log("Toggle changed:", isActive);

  try {
    if (isActive) {
      // ✅ Turning ON → MUST have at least 1 company
      if (!selectedCompanies || selectedCompanies.length === 0) {
        showToastMessage("❌ Please select at least one logistics company");

        toggle.checked = false; // 🔥 revert back OFF
        return;
      }

      // 🔥 CALL API (activate)
      await updateLogisticsMode(true);
      showToastMessage("✅ Payuee Logistics activated");

    } else {
      // ✅ Turning OFF → always allowed
      await updateLogisticsMode(false);
      showToastMessage("⚠️ Switched to custom logistics");
    }

  } catch (err) {
    console.error(err);
    showToastMessage("❌ Failed to update logistics mode");

    // 🔥 revert UI if API fails
    toggle.checked = !isActive;
  }
});

async function updateLogisticsMode(isPayueeActive) {
  const apiUrl = "https://api.payuee.com/vendor/update-vendor-logistics-choice";

  const selected_logistics = selectedCompanies.map((company, index) => ({
    elogistic_company_id: parseInt(company.elogistic_company_id), // assuming dataset.company holds the ID
    priority_order: index + 1,               // order of selection
    active: true
  }));

  const body = {
    use_payuee_logistics: isPayueeActive,
    selected_logistics: selected_logistics || []
  };

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error("API failed");
  }

  return res.json();
}

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
        // // // console.log('No cities available'); // Or perform any secondary action
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
    let shippingDetails = collectShippingData();
    const requestBody = shippingDetails;
    const updateButton = document.getElementById("updateShippingFeesButton");
    const updateButton2 = document.getElementById("updateShippingFeesButton2");

    // 🔥 Compare current collected rules with initial rules
    if (initialShippingRules && deepEqual(initialShippingRules, requestBody.shipping_rules)) {
        showToastMessage("Nothing changed yet.");
        return; // ❌ Don’t send request
    }

     // Disable button and show loading text
    updateButton.value = "Updating...";
    updateButton2.value = "Updating...";

    updateButton.disabled = true;
    updateButton2.disabled = true;

    // ✅ Proceed only if changed
    fetch('https://api.payuee.com/vendor/set-vendor-fee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(response => {
        if (response.success) {
            showToastMessage("Shipping fees updated successfully.");
            // Re-enable button and restore text
            updateButton.value = "Update";
            updateButton2.value = "Update";

            updateButton.disabled = false;
            updateButton2.disabled = false;

            // refresh stored rules
            initialShippingRules = requestBody.shipping_rules;

            const button = document.getElementById("updateShippingFeesButton");
            if (!button.classList.contains("animate")) {
                button.classList.add("animate");
                setTimeout(() => {
                    button.classList.remove("animate");
                }, 10000);
            }

            if (localStorage.getItem("product") == "one") {
                document.getElementById("popupTitle").innerText = "Add Your First Product";
                document.getElementById("popupDescription").innerText = 
                  "Great job setting up your shipping fees! Now, let's showcase your first product to millions of customers on Payuee e-Shop.";
                document.getElementById("popupImage").src = "shipping.png";
                document.getElementById("welcomePopup").classList.remove("hidden");

                const startSetupButton = document.getElementById('startSetup');
                startSetupButton.removeEventListener('click', setupShippingFees1);
                startSetupButton.addEventListener('click', setupShippingFees2);
            }
        } else {
            // Re-enable button and restore text
            updateButton.value = "Update";
            updateButton2.value = "Update";

            updateButton.disabled = false;
            updateButton2.disabled = false;
            if (["No Authentication cookie found", "Unauthorized attempt! JWT's not valid!", "No Refresh cookie found"].includes(response.error)) {
                logout();
            }
        }
    })
    .catch((error) => {
        // console.error("Error:", error);
    });
}

function setupShippingFees2(e) {
    e.preventDefault();
    localStorage.setItem('product', "two");
    window.location.href = "add-products";
}

function setLogisticsToggle(usingLogistics) {
  const toggle = document.getElementById("activeSetupToggle");
  if (!toggle) return;

  toggle.checked = !!usingLogistics; // ensures boolean
}

async function getShippingFees() {
    // also send a request to the logout api endpoint
    const apiUrl = "https://api.payuee.com/vendor/get-vendor-fee";

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

      if (data && data.data) {
          // assuming it's inside your shipping config
          const usingLogistics = data.data?.use_payuee_logistics;
          setLogisticsToggle(usingLogistics);
          // updateToggleState();
          selectedCompanies = config.selected_logistics;
          populateShippingData(data.data);

          // 🔥 Keep original rules for comparison
          initialShippingRules = data.data 
                                  ? data.data
                                  : data.data;
      }
    } finally {
        // do nothing
    }
}

async function getAvailableLogisticsCompany() {
    showCompanySkeletonLoader();
    // also send a request to the logout api endpoint
    const apiUrl = "https://api.payuee.com/vendor/get-available-logistics";

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
              const err = await response.json();

              // if (err.error == "failed to get shipping configuration") {
              //     let pricingList = document.getElementById('pricingList')

              //     // ✅ STEP 3: show empty state if nothing valid
              //       pricingList.innerHTML = `
              //         <div class="text-center p-4">
              //           <div class="mb-3">
              //             <i class="fa-solid fa-truck-fast fa-2x text-muted"></i>
              //           </div>
              //           <h5 class="fw-bold">No Logistics Companies Available</h5>
              //           <p class="text-muted mb-3">
              //             We couldn't find any logistics providers for your current setup.
              //           </p>
              //           <button class="btn btn-primary" onclick="goToCreateLogistics()">
              //             Continue To Create Logistics Configuration
              //           </button>
              //         </div>
              //       `;
              //       return;
              // }

              return;
          }
          return;
      }

      const data = await response.json();
      // // console.log(data);
      if (data && data.data) {
        // // console.log("✅ Raw backend data:", data.data);
        // 🔄 Transform backend data to match your dummy format
        const transformed = transformBackendData(data.data);
        // // console.log("✅ Transformed data:", transformed);

        // Now you can use the same logic as before:
        // renderCompanies(transformed.logistics_providers);
        backendData = transformed;

        // backendData = {
        //   ...backendData,
        //   logistics_providers: [
        //     ...(backendData?.logistics_providers || []),
        //     ...(transformed?.logistics_providers || [])
        //   ]
        // };

        // console.log("✅ Updated backendData:", backendData);

        backendData.logistics_providers.forEach(provider => {
          const allStates = [];

          // loop through each shipping rule type (weight_based, flat_rate, etc.)
          Object.entries(provider.shipping_rules).forEach(([ruleName, rule]) => {
            if (rule?.states) {
              allStates.push(...rule.states);
            }
          });

          // remove duplicates
          const uniqueStates = [...new Set(allStates)];
          // console.log(`Unique states for ${provider.name}:`, uniqueStates);
          // use provider.name as key
          statesByCompany[provider.name] = uniqueStates;
          let vendorState = document.getElementById("testVendorState");
          vendorState.value = uniqueStates[0] || "";
          enable("updateShippingFeesButton2");
        });

        generateRandomTestValues(transformed);
      }
    } finally {
        // do nothing
    }
}

// Utility: deep compare two objects
function deepEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
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
    } finally {
        // do nothing
    }
}

// ============== get shipping data ==============
// ============== get shipping data ==============
// ============== get shipping data ==============  
// ============== get shipping data ==============  
function collectShippingData() {
  const toFloat = (v) => {
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  };

  const shippingRules = {};

  // ✅ Weight-Based
  const weightTiers = [];
  document.querySelectorAll("#weightContainer .tier-row").forEach(row => {
    const inputs = row.querySelectorAll("input");
    const min = toFloat(inputs[0].value);
    const max = toFloat(inputs[1].value);
    const fee = toFloat(inputs[2].value);
    weightTiers.push({ min, max, fee });
  });

  const weightStates = Array.from(document.getElementById("state-selectMain4").selectedOptions)
                            .map(opt => opt.value);

  if (weightTiers.length) {
    shippingRules.weight_based = { 
      tiers: weightTiers, 
      states: JSON.stringify(weightStates) 
    };
  }

  // ✅ Flat Rate
  const flatFeeInput = document.querySelector("#flatFields input[type='number']");
  const flatStates = Array.from(document.getElementById("state-selectMain").selectedOptions)
                          .map(opt => opt.value);
  if (flatFeeInput && flatFeeInput.value) {
    shippingRules.flat_rate = {
      fee: toFloat(flatFeeInput.value),
      states: JSON.stringify(flatStates)
    };
  }

  // ✅ Free Shipping
  const freeInput = document.querySelector("#freeFields input[type='number']");
  const freeStates = Array.from(document.getElementById("state-selectMain3").selectedOptions)
                          .map(opt => opt.value);
  if (freeInput) {
    shippingRules.free_shipping = {
      enabled: true,
      min_order: toFloat(freeInput.value),
      states: JSON.stringify(freeStates)
    };
  }

  // ✅ Advanced Rules
  const advancedRules = [];
  document.querySelectorAll("#rulesContainer .rule-row").forEach(row => {
    const selects = row.querySelectorAll("select");
    const condition = selects[0].value;
    const operator = selects[1].value;
    const value = toFloat(row.querySelector("input[type='number']").value);
    const fee = toFloat(row.querySelectorAll("input[type='number']")[1].value);
    let unit = row.querySelector(".unit-label").innerText;
    if (unit == "₦") {
      unit = "N";
    }
    advancedRules.push({ condition, operator, value, unit, fee });
  });

  const advStates = Array.from(document.getElementById("state-selectMain5").selectedOptions)
                         .map(opt => opt.value);

  if (advancedRules.length) {
    shippingRules.advanced_rules = { 
      rules: advancedRules, 
      states: JSON.stringify(advStates) 
    };
  }

  // ✅ Distance-Based
  const perKmFee = toFloat(document.getElementById("validationCustom01").value);
  const maxFee   = toFloat(document.getElementById("validationCustom021").value);
  const minFee   = toFloat(document.getElementById("validationCustom031").value);
  const distanceStates = Array.from(document.getElementById("state-selectMain2").selectedOptions)
                              .map(opt => opt.value);

  // ✅ Radio for "Calculate using KG"
  const selectedRadio = document.querySelector('input[name="shipping"]:checked').value;
  const calculateUsingKg = selectedRadio === "true";

  if (perKmFee || maxFee || minFee || distanceStates.length) {
    shippingRules.distance_based = {
      per_km_fee: perKmFee,
      max_fee: maxFee,
      min_fee: minFee,
      calculate_using_kg: calculateUsingKg,
      states: JSON.stringify(distanceStates)
    };
  }

  // ✅ Active methods order
  const activeOrder = [];
  document.querySelectorAll("#activeMethods .method-item").forEach(item => {
    activeOrder.push(item.dataset.type);
  });

  if (activeOrder.length) {
    shippingRules.active_methods = JSON.stringify(activeOrder);
  }

  // 🔹 ADD THIS SECTION BELOW 🔹 
  // ===========================================
  // Build Selected Logistics array for vendors
  const selected_logistics = selectedCompanies.map((company, index) => ({
    elogistic_company_id: parseInt(company.elogistic_company_id), // assuming dataset.company holds the ID
    priority_order: index + 1,               // order of selection
    active: true
  }));
  // ===========================================

  // ✅ Return full request body
  return {
    selected_logistics,
    shipping_rules: shippingRules
  };
}

function parseStates(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value); // safely parse string -> array
  } catch (e) {
    return []; // fallback if parsing fails
  }
}

// ============== populate shipping data ==============  
// ============== populate shipping data ==============  
// ============== populate shipping data ==============  
// ============== populate shipping data ==============  
function populateShippingData(data) {
  // if (!data || !data) return;
    // adapt to backend response
  const rules_data = data;
  if (!rules_data) {
    // console.warn("No shipping rules found in response", data);
    return;
  }

  const rules = data;

  // ✅ Weight-Based
  if (rules.weight_based) {
    const container = document.getElementById("weightContainer");
    container.innerHTML = "";

    (rules.weight_based.tiers || []).forEach(tier => {
      const row = document.createElement("div");
      row.className = "tier-row mb-2 d-flex gap-2";
      row.innerHTML = `
        <input type="number" class="form-control" placeholder="Min" value="${tier.min}">
        <input type="number" class="form-control" placeholder="Max" value="${tier.max}">
        <input type="number" class="form-control" placeholder="Fee" value="${tier.fee}">
        <button type="button" class="btn btn-danger btn-sm remove-btn">&minus;</button>
      `;
      row.querySelector(".remove-btn").onclick = () => row.remove();
      container.appendChild(row);
    });

    const states = parseStates(rules.weight_based.state);
    // // console.log("weight rate", states);
    const select = document.getElementById("state-selectMain4");
    for (let i = 0; i < select.options.length; i++) {
      select.options[i].selected = states.includes(select.options[i].value);
    }
  }

  // ✅ Flat Rate
  if (rules.flat_rates) {
    document.querySelector("#flatFields input[type='number']").value = rules.flat_rates.fee || 0;
    const states = parseStates(rules.flat_rates.state);
    // // console.log("flat rate", states);
    const select = document.getElementById("state-selectMain");
    for (let i = 0; i < select.options.length; i++) {
      select.options[i].selected = states.includes(select.options[i].value);
    }
  }

  // ✅ Free Shipping
  if (rules.free_shipping) {
    document.querySelector("#freeFields input[type='number']").value = rules.free_shipping.min_order || 0;
    const states = parseStates(rules.free_shipping.state);
    // // console.log("free rate", states);
    const select = document.getElementById("state-selectMain3");
    for (let i = 0; i < select.options.length; i++) {
      select.options[i].selected = states.includes(select.options[i].value);
    }
  }

  // ✅ Advanced Rules
  if (rules.advanced_rules) {
    const container = document.getElementById("rulesContainer");
      // // console.log("running advanced rules");

    if (rules.advanced_rules && rules.advanced_rules.rules?.length > 0) {
      // // console.log("array not empty");
      container.innerHTML = "";

      (rules.advanced_rules.rules || []).forEach(rule => {
        const row = document.createElement("div");
        row.className = "rule-row mb-2 d-flex gap-2";
        if (rule.unit == "N") {
          rule.unit = "₦";
        }

        row.innerHTML = `
          <select class="form-select condition-select">
            <option value="distance" ${rule.condition === "distance" ? "selected" : ""}>Distance</option>
            <option value="weight" ${rule.condition === "weight" ? "selected" : ""}>Weight</option>
            <option value="price" ${rule.condition === "price" ? "selected" : ""}>Price</option>
            <option value="quantity" ${rule.condition === "quantity" ? "selected" : ""}>Quantity</option>
          </select>

          <select class="form-select">
            <option value="<" ${rule.operator === "<" ? "selected" : ""}>&lt;</option>
            <option value="<=" ${rule.operator === "<=" ? "selected" : ""}>&le;</option>
            <option value=">" ${rule.operator === ">" ? "selected" : ""}>&gt;</option>
            <option value=">=" ${rule.operator === ">=" ? "selected" : ""}>&ge;</option>
            <option value="==" ${rule.operator === "==" ? "selected" : ""}>=</option>
          </select>

          <input type="number" class="form-control" placeholder="Value" value="${rule.value}">
          <span class="unit-label align-self-center">${rule.unit}</span>
          <input type="number" class="form-control" placeholder="Fee" value="${rule.fee}">
          <button type="button" class="btn btn-danger btn-sm remove-btn">&minus;</button>
        `;
        row.querySelector(".remove-btn").onclick = () => row.remove();
        container.appendChild(row);
      });
    }

    const states = parseStates(rules.advanced_rules.state);
    // // console.log("advanced rate", states);
    const select = document.getElementById("state-selectMain5");
    for (let i = 0; i < select.options.length; i++) {
      select.options[i].selected = states.includes(select.options[i].value);
    }
  }

  // ✅ Distance-Based
  if (rules.distance_based) {
    document.getElementById("validationCustom01").value = rules.distance_based.per_km_fee || 0;
    document.getElementById("validationCustom021").value = rules.distance_based.max_fee || 0;
    document.getElementById("validationCustom031").value = rules.distance_based.min_fee || 0;

    // 👇 Restore radio selection
    if (rules.distance_based.calculate_using_kg) {
      document.getElementById("radio7").checked = true;  // Yes
      document.getElementById("radio8").checked = false;
      document.getElementById("radio7").parentElement.classList.add("active");
      document.getElementById("radio8").parentElement.classList.remove("active");
    } else {
      document.getElementById("radio7").checked = false;
      document.getElementById("radio8").checked = true;  // No
      document.getElementById("radio7").parentElement.classList.remove("active");
      document.getElementById("radio8").parentElement.classList.add("active");
    }

    const states = parseStates(rules.distance_based.state);
    const select = document.getElementById("state-selectMain2");
    for (let i = 0; i < select.options.length; i++) {
      select.options[i].selected = states.includes(select.options[i].value);
    }
  }

  // ✅ Active Methods
  if (rules.active_methods) {
    const activeMethods = parseStates(rules.active_methods.active_methods || rules.active_methods);
    // // console.log("active rate", activeMethods);
    const wrapper = document.getElementById("activeMethodsWrapper");
    const container = document.getElementById("activeMethods");
    container.innerHTML = "";

    activeMethods.forEach(method => {
      const div = document.createElement("div");
      div.className = "method-item p-2 border rounded mb-2";
      div.draggable = true;
      div.dataset.type = method;
      div.textContent = method.replace("_", " ").toUpperCase();
      container.appendChild(div);

      const checkbox = document.querySelector(`.method-check[value="${method}"]`);
      if (checkbox) checkbox.checked = true;
    });

    wrapper.style.display = activeMethods.length ? "block" : "none";
  }

  applySelect2States(rules);
}

function ensureArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    if (typeof val === "string") {
      return val.split(",").map(s => s.trim()).filter(Boolean);
    }
    return [];
  }
}

// 🔑 reusable function
function applySelect2States(rules) {
  const selects = [
    "#state-selectMain",   // flat_rate
    "#state-selectMain2",  // distance_based
    "#state-selectMain3",  // free_shipping
    "#state-selectMain4",  // weight_based
    "#state-selectMain5",   // advanced_rules
  ];

  // initialize Select2 if not already
  selects.forEach(id => {
    const $el = $(id);
    if ($el.length && !$el.data("select2")) {
      $el.select2({ width: "100%" });
    }
  });

  // set values + trigger change
  $("#state-selectMain4")
    .val(ensureArray(rules.weight_based?.state))
    .trigger("change");

  $("#state-selectMain")
    .val(ensureArray(rules.flat_rates?.state))
    .trigger("change");

  $("#state-selectMain3")
    .val(ensureArray(rules.free_shipping?.state))
    .trigger("change");

  $("#state-selectMain5")
    .val(ensureArray(rules.advanced_rules?.state))
    .trigger("change");

  $("#state-selectMain2")
    .val(ensureArray(rules.distance_based?.state))
    .trigger("change");

  // optional: active methods
  if (Array.isArray(rules.active_methods)) {
    $("#activeMethodsSelect")
      .val(rules.active_methods)
      .trigger("change");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const backendData = {
    shipping_rules: {
      active_methods: ["distance_based", "flat_rate", "free_shipping", "weight_based", "advanced_rules"],
      weight_based: {
        tiers: [
          { min: 0, max: 5, fee: 5000 },
          { min: 6, max: 10, fee: 10000 }
        ],
        states: ["Abia", "Delta"]
      },
      flat_rate: {
        fee: 5000,
        states: ["Lagos", "Rivers"]
      },
      free_shipping: {
        enabled: true,
        min_order: 10000,
        states: ["Enugu", "Kano"]
      },
      advanced_rules: {
        rules: [
          { condition: "distance", operator: ">", value: 5, unit: "Km", fee: 15000 }
        ],
        states: ["Oyo", "Kaduna"]
      },
      distance_based: {
        per_km_fee: 500,
        max_fee: 30000,
        min_fee: 2000,
        states: ["Abia", "Delta"]
      }
    }
  };

  // IMPORTANT: pass the shipping_rules object into your populate helper
//   const rules = backendData.shipping_rules;
//   populateShippingData(rules);

  // Delay very slightly to let any Select2 init complete in select2-custom.js.
  // If you control select2 init, better call this after that initialization instead of a timeout.
  setTimeout(() => {
    // rerenderSelect2(rules);
  }, 5000); // 60ms is conservative; increase slightly if your select2 init runs later
});

function rerenderSelect2(rules) {
       // Ensure select2 is initialized for each selector (if not already)
    const selects = [
      "#state-selectMain",   // flat_rate
      "#state-selectMain2",  // distance_based
      "#state-selectMain3",  // free_shipping
      "#state-selectMain4",  // weight_based
      "#state-selectMain5"   // advanced_rules
    ];

    selects.forEach(id => {
      const $el = $(id);
      if ($el.length && !$el.data("select2")) {
        // initialize with minimal options if your select2-custom.js doesn't do it yet
        $el.select2({ width: "100%" });
      }
    });

    // Set values using ensureArray, then trigger change for Select2 to update UI
    $("#state-selectMain4").val(ensureArray(rules.weight_based?.state)).trigger("change");
    $("#state-selectMain").val(ensureArray(rules.flat_rate?.state)).trigger("change");
    $("#state-selectMain3").val(ensureArray(rules.free_shipping?.state)).trigger("change");
    $("#state-selectMain5").val(ensureArray(rules.advanced_rules?.state)).trigger("change");
    $("#state-selectMain2").val(ensureArray(rules.distance_based?.state)).trigger("change");

    // if you also have a select for active methods (optional)
    if (Array.isArray(rules.active_methods)) {
    $('#activeMethodsSelect').val(rules.active_methods).trigger('change');
    }
}

// ============== fees calculation for all tiers ==============
// ============== fees calculation for all tiers ==============
// ============== fees calculation for all tiers ==============
// ============== fees calculation for all tiers ==============

function transformBackendData(apiData) {
  if (!Array.isArray(apiData)) {
    console.warn("⚠️ transformBackendData: Expected array, got:", apiData);
    return { logistics_providers: [] };
  }

  const logistics_providers = apiData.map(item => {
    // console.log("🔄 Transforming item:", item.store_name || item.ID);

    // Parse safely whether it’s a JSON array string or single value
    const parseStates = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      if (typeof val === "string") {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) return parsed;
          return [val]; // single string like "Abia"
        } catch {
          return [val]; // fallback
        }
      }
      return [];
    };

    // Normalize active_methods (string or array)
    let active_methods = [];
    if (item.active_methods?.active_methods) {
      const raw = item.active_methods.active_methods;
      if (typeof raw === "string") {
        // Could be a JSON array or single value
        try {
          const parsed = JSON.parse(raw);
          active_methods = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          active_methods = [raw];
        }
      } else if (Array.isArray(raw)) {
        active_methods = raw;
      }
    }

    const provider = {
      id: item.ID,
      elogistic_company_id: item.elogistic_company_id,
      name: item.store_name || `Company #${item.ID}`,
      shipping_rules: {
        active_methods,
        flat_rate: item.flat_rates ? {
          fee: Number(item.flat_rates.fee) || 0,
          states: parseStates(item.flat_rates.state)
        } : { fee: 0, states: [] },

        weight_based: item.weight_based ? {
          tiers: Array.isArray(item.weight_based.tiers)
            ? item.weight_based.tiers
            : [],
          states: parseStates(item.weight_based.state)
        } : { tiers: [], states: [] },

        free_shipping: item.free_shipping ? {
          enabled: Boolean(item.free_shipping.enabled),
          min_order: Number(item.free_shipping.min_order) || 0,
          states: parseStates(item.free_shipping.state)
        } : { enabled: false, min_order: 0, states: [] },

        advanced_rules: item.advanced_rules ? {
          rules: Array.isArray(item.advanced_rules.rules)
            ? item.advanced_rules.rules
            : [],
          states: parseStates(item.advanced_rules.state)
        } : { rules: [], states: [] },

        distance_based: item.distance_based ? {
          per_km_fee: Number(item.distance_based.per_km_fee) || 0,
          max_fee: Number(item.distance_based.max_fee) || 0,
          min_fee: Number(item.distance_based.min_fee) || 0,
          calculate_using_kg: Boolean(item.distance_based.calculate_using_kg),
          states: parseStates(item.distance_based.state)
        } : { per_km_fee: 0, max_fee: 0, min_fee: 0, calculate_using_kg: false, states: [] }
      }
    };

    // console.log("✅ Transformed provider:", provider);
    return provider;
  });

  // console.log("✅ All transformed logistics providers:", logistics_providers);
  return { logistics_providers };
}

const activeContainer = document.getElementById("activeMethods");

  // Shipping method labels
  const methodLabels = {
    flat_rate: "Flat Rate",
    weight_based: "Weight Based",
    distance_based: "Distance Based",
    free_shipping: "Free Shipping",
    advanced_rules: "Advanced Rules"
  };

  // Attach Sortable (drag and drop)
  new Sortable(activeContainer, {
    animation: 150,
    ghostClass: 'dragging'
  });

  // Checkbox handler
  document.querySelectorAll(".method-check").forEach(check => {
    check.addEventListener("change", function () {
      if (this.checked) {
        // Add to active methods
        const div = document.createElement("div");
        div.className = "method-item";
        div.dataset.type = this.value;
        div.innerHTML = `<strong>${methodLabels[this.value]}</strong> 
          <div class="settings mt-2">
          
          </div>`;
        activeContainer.appendChild(div);
      } else {
        // Remove if unchecked
        const item = activeContainer.querySelector(`[data-type='${this.value}']`);
        if (item) activeContainer.removeChild(item);
      }
    });
  });

  const activeWrapper = document.getElementById("activeMethodsWrapper");
  const methodChecks = document.querySelectorAll(".method-check");

  function toggleActiveWrapper() {
    const anyChecked = Array.from(methodChecks).some(chk => chk.checked);
    activeWrapper.style.display = anyChecked ? "block" : "none";
  }

  // attach listeners
  methodChecks.forEach(chk => chk.addEventListener("change", toggleActiveWrapper));

  // run once at load (to handle pre-checked from saved config)
  toggleActiveWrapper();

function safeParse(val) {
  try {
    return Array.isArray(val) ? val : JSON.parse(val || "[]");
  } catch {
    return [];
  }
}

function calculateShippingForBuyer(vendorLat, vendorLon, buyerLat, buyerLon, vendorState, buyerState, rules, inputs) {
  const data = collectShippingData();
  if (!rules) {
    // console.log("No rules passed, using backend defaults");
    rules = data.shipping_rules;
  }

  if (!rules.active_methods || !rules.active_methods.length) {
    return { fee: 0, reason: "❌ No active shipping methods" };
  }

  let orderValue, weight, quantity;
  if (inputs) {
    orderValue = parseFloat(inputs.orderValue) || 0;
    weight     = parseFloat(inputs.weight) || 0;
    quantity   = parseFloat(inputs.quantity) || 0;
  } else {
    orderValue = parseFloat(document.getElementById("testOrderValue")?.value) || 0;
    weight     = parseFloat(document.getElementById("testWeight")?.value) || 0;
    quantity   = parseFloat(document.getElementById("testQuantity")?.value) || 0;
  }

  let distance = null;
  if (buyerLat && buyerLon) {
    distance = calculateDistance(vendorLat, vendorLon, buyerLat, buyerLon);
  }

  let lastFailReason = "❌ No shipping rule matched";
  let methods = rules.active_methods;
  if (typeof methods === "string") {
    try { methods = JSON.parse(methods); }
    catch (e) { console.error("❌ Failed to parse active_methods:", e, methods); methods = []; }
  }

  // // console.log("All available methods:", methods);

  for (let method of methods) {
    // // console.log(`Evaluating method: ${method}`);

    // ---------------- Free Shipping ----------------
    if (method === "free_shipping" && rules.free_shipping?.enabled) {
      const allowedStates = Array.isArray(rules.free_shipping.states)
        ? rules.free_shipping.states
        : JSON.parse(rules.free_shipping.states || "[]");

      if (
        (allowedStates.length === 0 ||
          (allowedStates.includes(vendorState) && allowedStates.includes(buyerState))) &&
        orderValue >= rules.free_shipping.min_order
      ) {
        return { fee: 0, reason: "🎁 Free shipping (min order reached)", unitLabel: "Free 🎁" };
      }
      lastFailReason = "❌ Free shipping not eligible";
      continue;
    }

    // ---------------- Flat Rate ----------------
    if (method === "flat_rate" && rules.flat_rate) {
      const allowedStates = Array.isArray(rules.flat_rate.states)
        ? rules.flat_rate.states
        : JSON.parse(rules.flat_rate.states || "[]");

      if (
        allowedStates.length === 0 ||
        (allowedStates.includes(vendorState) && allowedStates.includes(buyerState))
      ) {
        return { fee: rules.flat_rate.fee, reason: `💵 Flat rate for ${buyerState}`, unitLabel: "Flat" };
      }
      lastFailReason = "❌ Flat rate not available for this vendor/buyer state";
      continue;
    }

    // ---------------- Weight Based ----------------
    if (method === "weight_based" && rules.weight_based) {
      const allowedStates = Array.isArray(rules.weight_based.states)
        ? rules.weight_based.states
        : JSON.parse(rules.weight_based.states || "[]");

      if (
        allowedStates.length === 0 ||
        (allowedStates.includes(vendorState) && allowedStates.includes(buyerState))
      ) {
        const tiers = rules.weight_based.tiers || [];
        for (let tier of tiers) {
          if (weight >= tier.min && weight <= tier.max) {
            return { fee: tier.fee, reason: `⚖️ Weight tier (${tier.min}-${tier.max}kg)`, unitLabel: `${weight}kg` };
          }
        }
        lastFailReason = "❌ No matching weight tier";
      } else {
        lastFailReason = "❌ Weight-based rule not available for this vendor/buyer state";
      }
      continue;
    }

    // ---------------- Distance Based ----------------
    if (method === "distance_based" && rules.distance_based && distance !== null) {
      const allowedStates = Array.isArray(rules.distance_based.states)
        ? rules.distance_based.states
        : JSON.parse(rules.distance_based.states || "[]");

      if (
        allowedStates.length === 0 ||
        (allowedStates.includes(vendorState) && allowedStates.includes(buyerState))
      ) {
        let fee = rules.distance_based.calculate_using_kg
          ? distance * weight * rules.distance_based.per_km_fee
          : distance * rules.distance_based.per_km_fee;

        if (fee < rules.distance_based.min_fee) fee = rules.distance_based.min_fee;
        if (fee > rules.distance_based.max_fee) fee = rules.distance_based.max_fee;

        return {
          fee,
          reason: rules.distance_based.calculate_using_kg
            ? `🚚 Distance + Weight (${distance.toFixed(2)} km × ${weight}kg)`
            : `🚚 Distance based (${distance.toFixed(2)} km)`,
            unitLabel: `${distance.toFixed(1)}km`
        };
      }
      lastFailReason = "❌ Distance based rule not available for this vendor/buyer state";
      continue;
    }

    // ---------------- Advanced Rules ----------------
    if (method === "advanced_rules" && rules.advanced_rules) {
      const advStates = Array.isArray(rules.advanced_rules.states)
        ? rules.advanced_rules.states
        : JSON.parse(rules.advanced_rules.states || "[]");

      const advRules = rules.advanced_rules.rules || [];
      if (Array.isArray(advRules)) {
        for (let r of advRules) {
          if (
            advStates.length &&
            (!advStates.includes(vendorState) || !advStates.includes(buyerState))
          ) continue;

          let leftValue = 0;
          if (r.condition === "price") leftValue = orderValue;
          if (r.condition === "weight") leftValue = weight;
          if (r.condition === "quantity") leftValue = quantity;
          if (r.condition === "distance" && distance !== null) leftValue = distance;

          if (evaluateCondition(leftValue, r.operator, r.value)) {
              let unit = "";
            if (r.condition === "price") unit = `₦${orderValue}`;
            if (r.condition === "weight") unit = `${weight}kg`;
            if (r.condition === "quantity") unit = `${quantity}pcs`;
            if (r.condition === "distance") unit = `${distance?.toFixed(1)}km`;

            return { fee: r.fee, reason: `⚙️ Advanced rule (${r.condition} ${r.operator} ${r.value}${r.unit})`, unitLabel: unit };
          }
        }
        lastFailReason = "❌ No advanced rule matched";
      } else {
        lastFailReason = "❌ No advanced rules configured";
      }
      continue;
    }
  }

  // Final fallback if no method matched
  return { fee: 0, reason: lastFailReason };
}

function evaluateCondition(left, operator, right) {
  switch (operator) {
    case "<": return left < right;
    case "<=": return left <= right;
    case ">": return left > right;
    case ">=": return left >= right;
    case "==": return left == right;
    default: return false;
  }
}

document.getElementById("testOrderValue").addEventListener("input", runShippingSimulation);
document.getElementById("testWeight").addEventListener("input", runShippingSimulation);
document.getElementById("testQuantity").addEventListener("input", runShippingSimulation);
document.getElementById("city-select").addEventListener("change", runShippingSimulation);
document.getElementById("city-select1").addEventListener("change", runShippingSimulation);

// Example function to identify state by first ward lat/long
function findStateByWardCoords(statesArray, latitude, longitude) {
  for (let state of statesArray) {
    for (let lga of state.lgas) {
      if (lga.wards && lga.wards.length > 0) {
        // pick the first ward of each LGA
        let firstWard = lga.wards[0];
        if (
          firstWard.latitude === latitude &&
          firstWard.longitude === longitude
        ) {
          return state.state; // return the state name
        }
      }
    }
  }
  return null; // if not found
}

function runShippingSimulation() {
  // console.log("🚀 Starting shipping simulation...");

  if (!buyersLat || !buyersLon) {
    // // console.log("❌ Missing buyer state and city");
    return;
  }
  if (!vendorCityLat || !vendorCityLon) {
    // // console.log("❌ Missing vendor state and city");
    return;
  }

  // // console.log("📍 Buyer Coords:", buyersLat, buyersLon);
  // // console.log("🏬 Vendor Coords:", vendorCityLat, vendorCityLon);

  // // console.log("🔎 Resolving buyer location...");
  // let buyerLocation = findStateByWardCoords(statesArray, latitude, longitude);
  // // console.log("✅ Buyer resolved to:", buyerState2);

  // // console.log("🔎 Resolving vendor location...");
  // let vendorLocation = findStateByWardCoords(statesArray, latitude, longitude);
  // // console.log("✅ Vendor resolved to:", storeState);

  // console.log("⚙️ Running shipping fee calculation...");
  const result = calculateShippingForBuyer(
    vendorCityLat, 
    vendorCityLon, 
    buyersLat, 
    buyersLon, 
    storeState, 
    buyerState2
  );

  // console.log("📦 Shipping Calculation Result:", result);

  // Update UI
  document.getElementById("validationCustom03").value = 
    `Shipping Fee: ₦${result.fee.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  document.getElementById("validationCustom02").value = `Reason: ${result.reason}`;

  // console.log("✅ Simulation finished.");
}

const pricingList = document.getElementById("pricingList");

// let backendData = {
//   logistics_providers: [
//     {
//       id: 1,
//       name: "DHL Nigeria",
//       shipping_rules: {
//         active_methods: ["distance_based", "flat_rate", "free_shipping", "weight_based", "advanced_rules"],
//         weight_based: {
//           tiers: [
//             { min: 0, max: 5, fee: 5000 },
//             { min: 6, max: 10, fee: 10000 }
//           ],
//           states: ["Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa"]
//         },
//         flat_rate: {
//           fee: 4500,
//           states: ["Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo"]
//         },
//         free_shipping: {
//           enabled: true,
//           min_order: 12000,
//           states: ["Ekiti", "Enugu", "Federal Capital Territory", "Gombe", "Imo", "Jigawa"]
//         },
//         advanced_rules: {
//           rules: [
//             { condition: "distance", operator: ">", value: 10, unit: "Km", fee: 15000 },
//             { condition: "weight", operator: "<=", value: 3, unit: "Kg", fee: 2000 }
//           ],
//           states: ["Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara"]
//         },
//         distance_based: {
//           per_km_fee: 50,
//           max_fee: 30000,
//           min_fee: 2500,
//           states: ["Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun"]
//         }
//       }
//     },
//     {
//       id: 2,
//       name: "GIG Logistics",
//       shipping_rules: {
//         active_methods: ["distance_based", "flat_rate", "free_shipping", "weight_based", "advanced_rules"],
//         weight_based: {
//           tiers: [
//             { min: 0, max: 3, fee: 2500 },
//             { min: 4, max: 8, fee: 7000 }
//           ],
//           states: ["Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe"]
//         },
//         flat_rate: {
//           fee: 6000,
//           states: ["Zamfara", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi"]
//         },
//         free_shipping: {
//           enabled: true,
//           min_order: 15000,
//           states: ["Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi"]
//         },
//         advanced_rules: {
//           rules: [
//             { condition: "orderValue", operator: ">", value: 20000, unit: "NGN", fee: 0 },
//             { condition: "distance", operator: "<=", value: 5, unit: "Km", fee: 3000 }
//           ],
//           states: ["Edo", "Ekiti", "Enugu", "Federal Capital Territory", "Gombe", "Imo"]
//         },
//         distance_based: {
//           per_km_fee: 40,
//           max_fee: 25000,
//           min_fee: 2000,
//           states: ["Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi"]
//         }
//       }
//     },
//     {
//       id: 3,
//       name: "ABC Express",
//       shipping_rules: {
//         active_methods: ["distance_based", "flat_rate", "free_shipping", "weight_based", "advanced_rules"],
//         weight_based: {
//           tiers: [
//             { min: 0, max: 2, fee: 1500 },
//             { min: 3, max: 6, fee: 4000 },
//             { min: 7, max: 12, fee: 9000 }
//           ],
//           states: ["Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo"]
//         },
//         flat_rate: {
//           fee: 3500,
//           states: ["Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba"]
//         },
//         free_shipping: {
//           enabled: true,
//           min_order: 8000,
//           states: ["Yobe", "Zamfara", "Abia", "Adamawa", "Akwa Ibom", "Anambra"]
//         },
//         advanced_rules: {
//           rules: [
//             { condition: "weight", operator: ">", value: 10, unit: "Kg", fee: 20000 }
//           ],
//           states: ["Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta"]
//         },
//         distance_based: {
//           per_km_fee: 60,
//           max_fee: 50000,
//           min_fee: 1500,
//           states: ["Ebonyi", "Edo", "Ekiti", "Enugu", "Federal Capital Territory", "Gombe"]
//         }
//       }
//     },
//     {
//       id: 4,
//       name: "FedEx Nigeria",
//       shipping_rules: {
//         active_methods: ["distance_based", "flat_rate", "free_shipping", "weight_based", "advanced_rules"],
//         weight_based: {
//           tiers: [
//             { min: 0, max: 5, fee: 3000 },
//             { min: 6, max: 15, fee: 12000 }
//           ],
//           states: ["Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi"]
//         },
//         flat_rate: {
//           fee: 8000,
//           states: ["Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun"]
//         },
//         free_shipping: {
//           enabled: true,
//           min_order: 20000,
//           states: ["Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto"]
//         },
//         advanced_rules: {
//           rules: [
//             { condition: "distance", operator: ">", value: 20, unit: "Km", fee: 18000 }
//           ],
//           states: ["Taraba", "Yobe", "Zamfara", "Abia", "Adamawa", "Akwa Ibom"]
//         },
//         distance_based: {
//           per_km_fee: 70,
//           max_fee: 100000,
//           min_fee: 5000,
//           states: ["Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River"]
//         }
//       }
//     },
//     {
//       id: 5,
//       name: "UPS Nigeria",
//       shipping_rules: {
//         active_methods: ["distance_based", "flat_rate", "free_shipping", "weight_based", "advanced_rules"],
//         weight_based: {
//           tiers: [
//             { min: 0, max: 4, fee: 4000 },
//             { min: 5, max: 12, fee: 11000 }
//           ],
//           states: ["Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Federal Capital Territory"]
//         },
//         flat_rate: {
//           fee: 5500,
//           states: ["Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina"]
//         },
//         free_shipping: {
//           enabled: true,
//           min_order: 18000,
//           states: ["Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger"]
//         },
//         advanced_rules: {
//           rules: [
//             { condition: "orderValue", operator: "<", value: 5000, unit: "NGN", fee: 2500 }
//           ],
//           states: ["Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers"]
//         },
//         distance_based: {
//           per_km_fee: 45,
//           max_fee: 28000,
//           min_fee: 3000,
//           states: ["Sokoto", "Taraba", "Yobe", "Zamfara", "Abia", "Adamawa"]
//         }
//       }
//     },
//     {
//       id: 6,
//       name: "ABC Courier",
//       shipping_rules: {
//         active_methods: ["distance_based", "flat_rate", "free_shipping", "weight_based", "advanced_rules"],
//         weight_based: {
//           tiers: [
//             { min: 0, max: 3, fee: 3500 },
//             { min: 4, max: 9, fee: 8500 }
//           ],
//           states: ["Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno"]
//         },
//         flat_rate: {
//           fee: 6000,
//           states: ["Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu"]
//         },
//         free_shipping: {
//           enabled: true,
//           min_order: 10000,
//           states: ["Federal Capital Territory", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano"]
//         },
//         advanced_rules: {
//           rules: [
//             { condition: "distance", operator: ">", value: 15, unit: "Km", fee: 16000 }
//           ],
//           states: ["Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa"]
//         },
//         distance_based: {
//           per_km_fee: 55,
//           max_fee: 30000,
//           min_fee: 2500,
//           states: ["Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"]
//         }
//       }
//     }
//   ]
// };

// // console.log("✅ States by company:", statesByCompany);

function disable(id) {
  const el = document.getElementById(id);
  if (el) el.disabled = true;
}

function enable(id) {
  const el = document.getElementById(id);
  if (el) el.disabled = false;
}

disable("updateShippingFeesButton2"); 

function goToCreateLogistics() {
  const logisticsFields = document.getElementById('logisticsFields');
  const customSetupFields = document.getElementById('customSetupFields');

  disable("updateShippingFeesButton2"); 
  logisticsFields.classList.add('d-none');
  customSetupFields.classList.remove('d-none');
}

function showCompanySkeletonLoader() {
  const pricingList = document.getElementById("pricingList");
  const skeletonItems = Array(3).fill(`
    <li class="mb-3">
      <div class="card p-3 shadow-sm border rounded">
        <div class="placeholder-glow mb-2">
          <span class="placeholder col-6"></span>
        </div>
        <div class="d-flex flex-wrap gap-2 mb-2">
          <span class="placeholder col-3 py-2"></span>
          <span class="placeholder col-3 py-2"></span>
          <span class="placeholder col-3 py-2"></span>
          <span class="placeholder col-2 py-2"></span>
        </div>
        <div class="d-flex justify-content-end">
          <span class="placeholder col-4 py-2"></span>
        </div>
      </div>
    </li>
  `);

  pricingList.innerHTML = skeletonItems.join("");
}

// Generate random values automatically on page load
// generateRandomTestValues();

function renderCompanies() {
  const pricingList = document.getElementById("pricingList");
  const selectedVendorState = document.getElementById("testVendorState")?.value;

  pricingList.innerHTML = Object.keys(statesByCompany).map(company => {
    const states = statesByCompany[company];

    // ✅ lookup provider once
    const provider = backendData.logistics_providers.find(
      p => p.name.toLowerCase() === company.toLowerCase()
    );
    if (!provider) return "";

    // const providerId = provider.id; // ✅ Get provider id
    const providerId = provider.elogistic_company_id; // ✅ Get provider id
    // console.log(`Calculating for ${company} (ID: ${providerId}) with states:`);
    // console.log(`Calculating for ${company} (ID: ${providerId}) with states:`);

    const vendorState = document.getElementById("testVendorState").value;
    const vendorCoords = getStateCoords(vendorState);

    const orderValue = parseFloat(document.getElementById("testOrderValue2")?.value) || 0;
    const weight     = parseFloat(document.getElementById("testWeight2")?.value) || 0;
    const quantity   = parseFloat(document.getElementById("testQuantity2")?.value) || 0;

    // ✅ Calculate fees for all states
    let stateFees = states.map(s => {
      const buyerCoords = getStateCoords(s);
      // console.log("data", vendorCoords, buyerCoords, vendorState, s, orderValue, weight, quantity);

      const result = calculateShippingForBuyer(
        vendorCoords.lat,
        vendorCoords.lon,
        buyerCoords.lat,
        buyerCoords.lon,
        vendorState,
        s,
        provider.shipping_rules,
        { orderValue, weight, quantity }
      );

      return {
        state: s,
        fee: result.fee,
        reason: result.reason,
        unitLabel: result.unitLabel || "",
        formattedFee: new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(result.fee)
      };
    });

    // ✅ Keep only valid ones
    stateFees = stateFees.filter(s => s.fee > 0 || s.reason?.includes("Free shipping"));

    // console.log("this is the company: ", company);

    if (stateFees.length === 0) {
      return `
        <li class="mb-3">
          <div class="card p-3 border-secondary">
            <strong>${company.toUpperCase()}</strong>
            <p class="mb-1">
              ⚠️ No shipping rates available for <strong>${selectedVendorState}</strong>
            </p>
            <small class="text-muted">
              Try adjusting weight, quantity, or order value
            </small>
          </div>
        </li>
      `;
    }

    stateFees.sort((a, b) => a.fee - b.fee);

    const previewStates = stateFees.slice(0, 3);
    const remainingStates = stateFees.slice(3);

    return `
      <li class="mb-3">
        <div class="card p-3 shadow-sm border rounded" 
             data-company="${company}" 
             data-id="${providerId}">
          <label class="form-label mb-2">
            <strong>${company.toUpperCase()}</strong> — Available Buyer's States
          </label>

          <div class="d-flex flex-wrap gap-2 mb-2">
            ${previewStates.map(s => `
              <span class="badge bg-primary text-white m-1 d-inline-block state-badge fs-6 fw-semibold px-3 py-2"
                data-state="${s.state}" 
                data-company="${company}"
                data-id="${providerId}"
                style="cursor:pointer;">
                ${s.state} 
                <span class="calculated-fee ms-1">${s.formattedFee}</span>
                ${s.unitLabel ? `<sup class="text-warning">${s.unitLabel}</sup>` : ""}
              </span>`).join("")}

            ${remainingStates.length > 0 ? 
              `<span class="badge bg-secondary view-more-toggle" 
                data-company="${company}" 
                data-id="${providerId}"
                style="cursor:pointer;">
                +${remainingStates.length} more
              </span>` : ""}
          </div>

          <div id="allStates-${company}" class="d-none mt-2">
            ${remainingStates.map(s => `
              <span class="badge bg-body-secondary text-dark m-1 d-inline-block state-badge fs-6 fw-semibold px-3 py-2" 
                data-state="${s.state}" 
                data-company="${company}"
                data-id="${providerId}"
                style="cursor:pointer;">
                ${s.state} 
                <span class="calculated-fee ms-1">${s.formattedFee}</span>
                ${s.unitLabel ? `<sup class="text-warning">${s.unitLabel}</sup>` : ""}
              </span>`).join(" ")}
          </div>

          <div class="mt-3 d-flex justify-content-end align-items-center gap-2">
            <button type="button" 
                    class="btn btn-sm btn-success select-provider" 
                    data-company="${company}" 
                    data-id="${providerId}">
              Select ${company.toUpperCase()}
            </button>
          </div>
        </div>
      </li>
    `;
  }).join("");

  // ✅ Toggle listeners
  document.querySelectorAll(".view-more-toggle").forEach(toggle => {
    toggle.addEventListener("click", () => {
      const company = toggle.dataset.company;
      const allStatesDiv = document.getElementById(`allStates-${company}`);
      allStatesDiv.classList.toggle("d-none");

      const remainingCount = allStatesDiv.querySelectorAll(".state-badge").length;
      toggle.innerText = allStatesDiv.classList.contains("d-none") 
        ? `+${remainingCount} more` 
        : "Show less";
    });
  });

  // ✅ Select provider with ID tracking
  document.querySelectorAll(".select-provider").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      const company = btn.dataset.company;
      const providerId = parseInt(btn.dataset.id, 10);

      if (selectedCompanies.some(c => c.company === company)) {
        selectedCompanies = selectedCompanies.filter(c => c.company !== company);
        card.classList.remove("border-success");
        showToastMessage(`${company.toUpperCase()} deselected.`);
        return;
      }

      if (selectedCompanies.length < 3) {
        selectedCompanies.push({ elogistic_company_id: providerId, company });
        card.classList.add("border-success");
        showToastMessage(`You selected ${company.toUpperCase()} as a logistics provider.`);
      } else {
        showToastMessage("❌ You can only select up to 3 logistics companies.");
      }

      // // console.log("✅ Currently selected:", selectedCompanies);
    });
  });
}

function generateRandomTestValues() {
  const orderValueInput = document.getElementById("testOrderValue2");
  const weightInput = document.getElementById("testWeight2");
  const quantityInput = document.getElementById("testQuantity2");

  // Generate random numbers
  orderValueInput.value = Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000; // ₦1,000 - ₦100,000
  weightInput.value = (Math.random() * (50 - 1) + 1).toFixed(2); // 1kg - 50kg
  quantityInput.value = Math.floor(Math.random() * 20) + 1; // 1 - 20 units

  // Render companies first
  renderCompanies();

  // Recalculate for all companies
  document.querySelectorAll("#pricingList .card").forEach(card => updateFeesForCard(card));
}

// Trigger random generation on button click
document.getElementById("generateRandomTest").addEventListener("click", generateRandomTestValues);

function getStateCoords(stateName) {
  if (!stateName) return { lat: 0, lon: 0, state: stateName };

  const s = states.find(x => x.state.toLowerCase() === stateName.toLowerCase());
  if (s) return { lat: s.lat, lon: s.lon, state: s.state };

  console.warn(`No coords for state "${stateName}" — falling back to 0,0`);
  return { lat: 0, lon: 0, state: stateName };
}

/**
 * Updates all state badges inside the given card.
 * - tries to call calculateShippingForBuyer with coords + (orderValue, weight, quantity)
 * - if that function doesn't accept extra args, temporarily set DOM test inputs and call it.
 */
// 🔹 Helper: calculate & update all fees for badges inside a card
function updateFeesForCard(card) {
  // ✅ Read company name directly from card
  const company = card.dataset.company;

  // ✅ Instead of returning the provider, just grab the rules directly
  const rules = backendData.logistics_providers.find(
    p => p.name.toLowerCase() === company.toLowerCase()
  )?.shipping_rules;

  if (!rules) return; // skip if no rules exist for this company

  const vendorState = document.getElementById("testVendorState").value;
  const vendorCoords = getStateCoords(vendorState);

  const orderValue = parseFloat(document.getElementById("testOrderValue")?.value) || 0;
  const weight     = parseFloat(document.getElementById("testWeight")?.value) || 0;
  const quantity   = parseFloat(document.getElementById("testQuantity")?.value) || 0;

  // Loop over states in this card
  card.querySelectorAll(".state-badge").forEach(badge => {
    const buyerState = badge.dataset.state;
    const buyerCoords = getStateCoords(buyerState);

    const result = calculateShippingForBuyer(
      vendorCoords.lat,
      vendorCoords.lon,
      buyerCoords.lat,
      buyerCoords.lon,
      vendorState,
      buyerState,
      rules, // ✅ pass rules directly
      { orderValue, weight, quantity }
    );

    const formattedFee = new Intl.NumberFormat("en-NG", { 
      style: "currency", 
      currency: "NGN" 
    }).format(result.fee);

    badge.querySelector(".calculated-fee").innerText = formattedFee;
  });
}

document.getElementById("generateRandomTest").addEventListener("click", generateRandomTestValues);

// Update when test inputs change
// 🔹 Re-render when vendor state or inputs change
["testVendorState", "testOrderValue2", "testWeight2", "testQuantity2"].forEach(id => {
  document.getElementById(id).addEventListener("change", () => renderCompanies());
});

function togglePreview() {
  const section = document.getElementById("previewSection");
  const btn = document.getElementById("previewToggleBtn");

  if (section.style.display === "none") {
    section.style.display = "block";
    btn.innerHTML = "❌ Hide Preview";
  } else {
    section.style.display = "none";
    btn.innerHTML = "🧪 Try Delivery Fee Preview";
  }
}
