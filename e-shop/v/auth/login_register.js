var stateIsoCode;
var stateSelected;
var citySelected;
var latitude = 0.0;
var longitude = 0.0;

document.addEventListener('DOMContentLoaded', async function () {
    const loginButton = document.getElementById('loginButton'); // Target the login button
    const loginForm = document.forms['login-form'];

    const registerButton1 = document.getElementById('registerButton1'); // Target the register button
    const registerForm = document.forms['register-form'];

    const verifyButton1 = document.getElementById('verifyButton1'); // Target the verify button
    const verifyForm = document.forms['register-form'];

    // Ensure that when "Create Account" is clicked, it shows the "Register" tab.
    document.querySelector('.js-show-register').addEventListener('click', function(e) {
        e.preventDefault();
        const registerTab = new bootstrap.Tab(document.getElementById('register-tab'));
        registerTab.show();
    });

    await loadStates();

    // Handle login button click
    const loginButtonClickHandler = function (event) {
        event.preventDefault();
        event.stopPropagation();
        const loginData = {
            email: loginForm.login_email.value.trim(),
            password: loginForm.login_password.value.trim(),
        };

        if (!loginData.email || !loginData.password) {
            showToastMessageE('Please fill in both email and password fields.');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(loginData.email)) {
            showToastMessageE('Please enter a valid email address.');
            return;
        }

        loginEshop(loginForm.login_email.value.trim(), loginForm.login_password.value.trim());
    };

    // Remove previous listener (if any) and add the event listener
    loginButton.removeEventListener('click', loginButtonClickHandler);
    loginButton.addEventListener('click', loginButtonClickHandler);

    // Handle register button click
    const registerButton1ClickHandler = function (event) {
        event.preventDefault();
        event.stopPropagation();
        
        const registerData = {
            FirstName: registerForm.register_username.value.trim(),
            email: registerForm.register_email.value.trim(),
            password: registerForm.register_password.value.trim(),
        };
    
        if (!registerData.FirstName || !registerData.email || !registerData.password) {
            showToastMessageE('Please fill in all fields.');
            return;
        }
    
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(registerData.email)) {
            showToastMessageE('Please enter a valid email address.');
            return;
        }
    
        if (typeof latitude === 'undefined' || latitude <= 0 || typeof longitude === 'undefined' || longitude <= 0) {
            showToastMessageE('Please select your state & city');
            return;
        }
    
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (!passwordPattern.test(registerData.password)) {
            showToastMessageE('Password must be at least 8 characters long and include at least one letter and one number.');
            return;
        }

        registerEshop(registerData.email, registerData.password, registerData.FirstName);
    };

    // Remove previous listener (if any) and add the event listener
    registerButton1.removeEventListener('click', registerButton1ClickHandler);
    registerButton1.addEventListener('click', registerButton1ClickHandler);

    // Handle verify button click
    const verifyButton1ClickHandler = function (event) {
        event.preventDefault();
        
        const verifyData = {
            Email: verifyForm.register_email.value.trim(),
            SentOTP: verifyForm.register_otp.value.trim(),
        };
    
        const otpPattern = /^\d{6,}$/;
        if (!otpPattern.test(verifyData.SentOTP)) {
            showToastMessageE('Invalid OTP');
            return;
        }
    
        verifyEshop(verifyData.Email, verifyData.SentOTP);
    };

    // Remove previous listener (if any) and add the event listener
    verifyButton1.removeEventListener('click', verifyButton1ClickHandler);
    verifyButton1.addEventListener('click', verifyButton1ClickHandler);
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
            citySelected = selectedCity;

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
        localStorage.setItem('auth', 'true');

        // Redirect to `redirectTo` if it exists, else go to a default page
        if (redirectTo) {
            window.location.href = redirectTo;
        } else {
            window.location.href = 'https://payuee.com/e-shop/home'; // Replace with your default page
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
            state: stateSelected,
            city: citySelected,
            latitude: latitude,
            longitude: longitude,
        })
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            const errorData = await response.json();

            if (errorData.error === 'User already exist, please verify your email ID') {
                // need to do a data of just null event 
                showToastMessageS('Please check your email to verify your email ID');
                //  send user email verification notification
                resendOtpEmail(email);
                toggleOTP();
                return;
            } else if (errorData.error === 'User already exist, please login') {
                // need to do a data of just null event 
                showToastMessageE('user already exist, please login');
            } else {
                showToastMessageE('Error signing you up. Please try again');
            }

            return;
        }

        const responseData = await response.json();
        showToastMessageS('Please verify your email address');
        toggleOTP();
        //  Send email verification email
} finally {

    }
}

async function resendOtpEmail(email) {
    const apiUrl = "https://api.payuee.com/app/resend-otp";

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include', // set credentials to include cookies
        body: JSON.stringify({
            Email: email,
        })
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            const errorData = await response.json();

            if (errorData.error === 'user not found in the db') {
                //  send user email verification notification
                showToastMessageE('User not found');
            } else if (errorData.error === 'email verification failed') {
                // need to do a data of just null event 
                showToastMessageE('Email verification failed');
            } else {
                showToastMessageE('Error signing you up. Please try again');
            }

            return;
        }

        const responseData = await response.json();
        showToastMessageS(responseData.success);
} finally {

    }
}

async function verifyEshop(Email, SentOTP) {
    const apiUrl = "https://api.payuee.com/app/email-verification";

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include', // set credentials to include cookies
        body: JSON.stringify({
            Email: Email,
            SentOTP: SentOTP,
        })
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            const errorData = await response.json();

            if (errorData.error === 'email limit check exceeded') {
                // need to do a data of just null event 
                showToastMessageE('email limit check exceeded check email for new OTP');
                //  send user email verification notification
                resendOtpEmail(Email);
            } else if (errorData.error === 'error getting otp by email for limit check') {
                // need to do a data of just null event 
                showToastMessageE('error verifying otp email');
            } else if (errorData.error === 'Wrong OTP') {
                // need to do a data of just null event 
                showToastMessageE('wrong OTP code');
            }  else if (errorData.error === 'Verification Code Expired') {
                // need to do a data of just null event 
                showToastMessageE('Verification code expired');
            } else {
                showToastMessageE('Error verifying OTP. Please try again');
            }

            return;
        }

        const responseData = await response.json();
        showToastMessageS('Successfully registered');
        // Check if `redirectTo` exists in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirectTo');
        localStorage.setItem('auth', 'true');

        // Redirect to `redirectTo` if it exists, else go to a default page
        if (redirectTo) {
            window.location.href = redirectTo;
        } else {
            window.location.href = 'https://payuee.com/e-shop/home'; // Replace with your default page
        }
} finally {

    }
}

function toggleOTP() {
    // Get the OTP div and other form divs by their IDs
    const otpDiv = document.getElementById('otpDiv');
    const nameDiv = document.getElementById('nameDiv');
    const emailDiv = document.getElementById('emailDiv');
    const stateDiv = document.getElementById('stateDiv');
    const cityDiv = document.getElementById('cityDiv');
    const passwordDiv = document.getElementById('passwordDiv');
    const registerButton1 = document.getElementById('registerButton1');
    const verifyButton1 = document.getElementById('verifyButton1');

    // Check if OTP div has the d-none class
    if (otpDiv.classList.contains('d-none')) {
        // Show OTP div and hide others
        otpDiv.classList.remove('d-none');
        verifyButton1.classList.remove('d-none');
        registerButton1.classList.add('d-none');
        nameDiv.classList.add('d-none');
        emailDiv.classList.add('d-none');
        stateDiv.classList.add('d-none');
        cityDiv.classList.add('d-none');
        passwordDiv.classList.add('d-none');
    } else {
        // Hide OTP div and show all other fields
        otpDiv.classList.add('d-none');
        verifyButton1.classList.add('d-none');
        nameDiv.classList.remove('d-none');
        emailDiv.classList.remove('d-none');
        stateDiv.classList.remove('d-none');
        cityDiv.classList.remove('d-none');
        passwordDiv.classList.remove('d-none');
        registerButton1.classList.remove('d-none');
    }
}
