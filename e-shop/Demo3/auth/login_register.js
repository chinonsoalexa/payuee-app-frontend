var stateIsoCode;
var stateSelected;
var citySelected;
var latitude = 0.0;
var longitude = 0.0;

document.addEventListener('DOMContentLoaded', async function () {
    const loginButton = document.getElementById('loginButton'); // Target the login button
    const loginForm = document.forms['login-form'];

    const registerButton = document.getElementById('registerButton'); // Target the login button
    const registerForm = document.forms['register-form'];

    await loadStates();

    // Handle login button click
    loginButton.addEventListener('click', function (event) {
        event.preventDefault();
        // Get the data from the login form
        const loginData = {
            email: loginForm.login_email.value.trim(),
            password: loginForm.login_password.value.trim(),
        };

        // Check if email or password fields are empty
        if (!loginData.email || !loginData.password) {
            showToastMessageE('Please fill in both email and password fields.');
            return;
        }

        // Call the login API endpoint
        loginEshop(loginForm.login_email.value.trim(), loginForm.login_password.value.trim());
        
    });

    registerButton.addEventListener('click', function (event) {
        event.preventDefault();
        // Get the data from the login form 
        const registerData = {
            FirstName: registerForm.register_username.value.trim(),
            email: registerForm.register_email.value.trim(),
            password: registerForm.register_password.value.trim(),
        };

        // Check if email or password fields are empty
        if (!registerData.email || !registerData.password || !registerData.FirstName) {
            showToastMessageE('Please fill in all fields.');
            return;
        }
        if (latitude <= 0 || longitude <= 0) {
            showToastMessageE('Please select your state & city');
            return;
        }

        // Call the login API endpoint
        registerEshop(registerData.email, registerData.password, registerData.FirstName);
        
    });

});

// Function to fetch and populate state data
async function loadStates() {
    try {
        // Update the URL to the correct path of your JSON file
        const response = await fetch('nigeria_states.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const states = await response.json();
        
        renderStates(states);
        const searchInput = document.getElementById('stateSearchInput');
        searchInput.addEventListener('input', function () {
            const searchTerm = searchInput.value;
            filterStates(searchTerm, states);
        });

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
        
        // Filter cities by state_iso2
        const filteredCities = cities.filter(city => city.state_iso2 === stateIso2);

        // Sort cities alphabetically by name
        filteredCities.sort((a, b) => a.name.localeCompare(b.name));

        renderCities(filteredCities);

        const searchInput = document.getElementById('citySearchInput');
        searchInput.addEventListener('input', function () {
            const searchTerm = searchInput.value;
            filterCities(searchTerm, filteredCities);
        });

    } catch (error) {
        console.error('Error fetching city data:', error);
    }
}

function renderStates(states) {
    const stateList = document.getElementById('state-list');
    stateList.innerHTML = ''; // Clear existing items

    if (states.length === 0) {
        // No states found
        const noResultsItem = document.createElement('li');
        noResultsItem.textContent = 'No states found';
        noResultsItem.classList.add('search-suggestion__item');
        stateList.appendChild(noResultsItem);
    } else {
        // Render the states
        states.forEach(state => {
            const listItem = document.createElement('li');
            listItem.textContent = state.name;
            listItem.id = state.id;
            listItem.classList.add('search-suggestion__item', 'js-search-select');
            listItem.dataset.iso2 = state.iso2; // Store ISO2 code in data attribute
            listItem.dataset.state = state.name; // Store State in data attribute
            stateList.appendChild(listItem); // Append list item to the list
        });
    }

    // Add click event listener to each list item
    stateList.addEventListener('click', async function (event) {
        if (event.target.classList.contains('js-search-select')) {
            const selectedState = event.target.textContent;
            const isoCode = event.target.dataset.iso2;
            customerState = event.target.dataset.state;
            document.getElementById('search-dropdown').value = selectedState; // Set the value of the input
            document.getElementById('city-dropdown').value = ''; // Reset the city input value
            // CalculateCartSubtotal() 
            // console.log(`Selected State: ${selectedState}, ISO Code: ${isoCode}`);
            stateSelected = selectedState;
            citySelected = '';
            toggleClassById("formeStateList", "js-content_visible");
            await loadCities(isoCode);
        }
    });
}

// Function to render cities to the DOM
function renderCities(cities) {
    const cityList = document.getElementById('city-list');
    cityList.innerHTML = ''; // Clear existing items

    if (cities.length === 0) {
        const noResultsItem = document.createElement('li');
        noResultsItem.textContent = 'No cities found';
        noResultsItem.classList.add('search-suggestion__item');
        cityList.appendChild(noResultsItem);
    } else {
        cities.forEach(city => {
            const listItem = document.createElement('li');
            listItem.textContent = city.name;
            listItem.classList.add('search-suggestion__item', 'js-search-select');
            listItem.dataset.cityName = city.name; // Store city name in data attribute
            listItem.dataset.latitude = city.latitude; // Store latitude in data attribute
            listItem.dataset.longitude = city.longitude; // Store longitude in data attribute
            cityList.appendChild(listItem);
        });
    }

    // Add click event listener to each city list item
    cityList.addEventListener('click', function (event) {
        if (event.target.classList.contains('js-search-select')) {
            const selectedCity = event.target.dataset.cityName;
            latitude = parseFloat(event.target.dataset.latitude);
            longitude = parseFloat(event.target.dataset.longitude);

            // Update the input value and other elements
            document.getElementById('city-dropdown').value = selectedCity;

            // CalculateCartSubtotal();
            // Perform additional actions if needed, such as toggling visibility
            toggleClassById("formeCityList", "js-content_visible");
        }
    });
}

function filterStates(term, states) {
    const filtered = states.filter(state => 
        state.name.toLowerCase().includes(term.toLowerCase())
    );
    renderStates(filtered);
}

function filterCities(term, cities) {
    const filtered = cities.filter(state => 
        state.name.toLowerCase().includes(term.toLowerCase())
    );
    renderCities(filtered);
}

// Show success toast
function showToastMessageS(message) {
    document.getElementById('toastMessage2').textContent = message;
    const toastElement = document.getElementById('liveToast3');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

// Show error toast
function showToastMessageE(message) {
    document.getElementById('toastError').textContent = message;
    const toastElement = document.getElementById('liveToast1');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
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

async function loginEshop(email, password) {
    const apiUrl = "https://api.payuee.com/sign-in";

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include', // set credentials to include cookies
        body: JSON.stringify({
            email: email,
            password: password,
        })
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            const errorData = await response.json();

            if (errorData.error === 'Your account has been suspended. Please contact support for more details.') {
                // need to do a data of just null event 
                showToastMessageE('Your account has been suspended. Please contact support for more details.');
                // displayErrorMessage();
            } else if (errorData.error === 'Invalid email or password') {
                // need to do a data of just null event 
                showToastMessageE('Invalid email or password');
            } else {
                // displayErrorMessage();
            }

            return;
        }

        const responseData = await response.json();
        showToastMessageS('Login successful');
            
        // Check if `redirectTo` exists in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirectTo');

        // Redirect to `redirectTo` if it exists, else go to a default page
        if (redirectTo) {
            window.location.href = redirectTo;
        } else {
            window.location.href = 'https://payuee.com/e-shop/Demo3/home'; // Replace with your default page
        }
} finally {

    }
}

async function registerEshop(email, password, name) {
    const apiUrl = "https://api.payuee.com/app/sign-up";

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include', // set credentials to include cookies
        body: JSON.stringify({
            FirstName: name,
            email: email,
            password: password,
        })
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            const errorData = await response.json();

            if (errorData.error === 'User already exist, please verify your email ID') {
                // need to do a data of just null event 
                showToastMessageE('Please check your email to verify your email ID');
                //  send user email verification notification

                // displayErrorMessage();
            } else if (errorData.error === 'User already exist, please login') {
                // need to do a data of just null event 
                showToastMessageE('User already exist, please login');
            } else {
                showToastMessageE('Error signing you up. Please try again');
                // displayErrorMessage();
            }

            return;
        }

        const responseData = await response.json();
        showToastMessageS('Registration successful');
            
        // Check if `redirectTo` exists in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirectTo');

        // Redirect to `redirectTo` if it exists, else go to a default page
        if (redirectTo) {
            window.location.href = redirectTo;
        } else {
            window.location.href = 'https://payuee.com/e-shop/Demo3/home'; // Replace with your default page
        }
} finally {

    }
}