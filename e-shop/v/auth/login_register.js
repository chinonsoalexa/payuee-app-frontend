var stateIsoCode;
var stateSelected;
var citySelected;
var latitude = 0.0;
var longitude = 0.0;

// document.addEventListener('DOMContentLoaded', async function () {
//     const loginButton = document.getElementById('loginButton'); // Target the login button
//     const loginForm = document.forms['login-form'];

//     const registerButton1 = document.getElementById('registerButton1'); // Target the register button
//     const registerForm = document.forms['register-form'];

//     const verifyButton1 = document.getElementById('verifyButton1'); // Target the verify button
//     const verifyForm = document.forms['register-form'];

//     // Ensure that when "Create Account" is clicked, it shows the "Register" tab.
//     document.querySelector('.js-show-register').addEventListener('click', function(e) {
//         e.preventDefault();
//         const registerTab = new bootstrap.Tab(document.getElementById('register-tab'));
//         registerTab.show();
//     });

//     await loadStates();

//     // ✅ Now add once
//     loginButton.addEventListener('click', loginButtonClickHandler);

//     // Handle register button click
//     const registerButton1ClickHandler = function (event) {
//         event.preventDefault();
//         event.stopPropagation();
        
//         const registerData = {
//             FirstName: registerForm.register_username.value.trim(),
//             email: registerForm.register_email.value.trim(),
//             password: registerForm.register_password.value.trim(),
//         };
    
//         if (!registerData.FirstName || !registerData.email || !registerData.password) {
//             showToastMessageE('Please fill in all fields.');
//             return;
//         }
    
//         const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailPattern.test(registerData.email)) {
//             showToastMessageE('Please enter a valid email address.');
//             return;
//         }
    
//         if (typeof latitude === 'undefined' || latitude <= 0 || typeof longitude === 'undefined' || longitude <= 0) {
//             showToastMessageE('Please select your state & city');
//             return;
//         }
    
//         const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
//         if (!passwordPattern.test(registerData.password)) {
//             showToastMessageE('Password must be at least 8 characters long and include at least one letter and one number.');
//             return;
//         }

//         registerEshop(registerData.email, registerData.password, registerData.FirstName);
//     };

//     // Remove previous listener (if any) and add the event listener
//     registerButton1.removeEventListener('click', registerButton1ClickHandler);
//     registerButton1.addEventListener('click', registerButton1ClickHandler);

//     // Handle verify button click
//     const verifyButton1ClickHandler = function (event) {
//         event.preventDefault();
        
//         const verifyData = {
//             Email: verifyForm.register_email.value.trim(),
//             SentOTP: verifyForm.register_otp.value.trim(),
//         };
    
//         const otpPattern = /^\d{6,}$/;
//         if (!otpPattern.test(verifyData.SentOTP)) {
//             showToastMessageE('Invalid OTP');
//             return;
//         }
    
//         verifyEshop(verifyData.Email, verifyData.SentOTP);
//     };

//     // Remove previous listener (if any) and add the event listener
//     verifyButton1.removeEventListener('click', verifyButton1ClickHandler);
//     verifyButton1.addEventListener('click', verifyButton1ClickHandler);
// });

// function loginButtonClickHandler(event) {
//     event.preventDefault();
//     event.stopPropagation();

//     const loginForm = document.forms['login-form'];
//     const loginData = {
//         email: loginForm.login_email.value.trim(),
//         password: loginForm.login_password.value.trim(),
//     };

//     if (!loginData.email || !loginData.password) {
//         showToastMessageE('Please fill in both email and password fields.');
//         return;
//     }

//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailPattern.test(loginData.email)) {
//         showToastMessageE('Please enter a valid email address.');
//         return;
//     }

//     loginEshop(loginData.email, loginData.password);
// }

document.addEventListener('DOMContentLoaded', async function () {
    const loginButton = document.getElementById('loginButton');
    const loginForm = document.forms['login-form'];

    const registerButton1 = document.getElementById('registerButton1');
    const registerForm = document.forms['register-form'];

    const verifyButton1 = document.getElementById('verifyButton1');
    const verifyForm = document.forms['register-form'];

    // Ensure that when "Create Account" is clicked, it shows the "Register" tab.
    document.querySelector('.js-show-register').addEventListener('click', function(e) {
        e.preventDefault();
        const registerTab = new bootstrap.Tab(document.getElementById('register-tab'));
        registerTab.show();
    });

    await loadStates();

    // ================= LOGIN =================
    let loginInProgress = false;
    async function loginButtonClickHandler(event) {
        event.preventDefault();
        event.stopPropagation();

        if (loginInProgress) return; // ⛔ prevent multiple clicks
        loginInProgress = true;
        loginButton.disabled = true;

        try {
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

            await loginEshop(loginData.email, loginData.password);
        } finally {
            loginInProgress = false;
            loginButton.disabled = false;
        }
    }
    loginButton.addEventListener('click', loginButtonClickHandler);

    // ================= REGISTER =================
    let registerInProgress = false;
    async function registerButton1ClickHandler(event) {
        event.preventDefault();
        event.stopPropagation();

        if (registerInProgress) return;
        registerInProgress = true;
        registerButton1.disabled = true;

        try {
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

            await registerEshop(registerData.email, registerData.password, registerData.FirstName);
        } finally {
            registerInProgress = false;
            registerButton1.disabled = false;
        }
    }
    registerButton1.addEventListener('click', registerButton1ClickHandler);

    // ================= VERIFY =================
    let verifyInProgress = false;
    async function verifyButton1ClickHandler(event) {
        event.preventDefault();

        if (verifyInProgress) return;
        verifyInProgress = true;
        verifyButton1.disabled = true;

        try {
            const verifyData = {
                Email: verifyForm.register_email.value.trim(),
                SentOTP: verifyForm.register_otp.value.trim(),
            };

            const otpPattern = /^\d{6,}$/;
            if (!otpPattern.test(verifyData.SentOTP)) {
                showToastMessageE('Invalid OTP');
                return;
            }

            await verifyEshop(verifyData.Email, verifyData.SentOTP);
        } finally {
            verifyInProgress = false;
            verifyButton1.disabled = false;
        }
    }
    verifyButton1.addEventListener('click', verifyButton1ClickHandler);
});

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

// function filterStates(term, states) {
//     const filtered = states.filter(state => 
//         state.name.toLowerCase().includes(term.toLowerCase())
//     );
//     renderStates(filtered);
// }

// function filterCities(term, cities) {
//     const filtered = cities.filter(state => 
//         state.name.toLowerCase().includes(term.toLowerCase())
//     );
//     renderCities(filtered);
// }

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
    startLoading("loginButton"); // 🚀 Start loading

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
                stopLoading("loginButton", true); // ❌ error -> shake + flash red
                showToastMessageE('Your account has been suspended. Please contact support for more details.');
                // displayErrorMessage();
            } else if (errorData.error === 'Invalid email or password') {
                // need to do a data of just null event 
                stopLoading("loginButton", true); // ❌ error -> shake + flash red
                showToastMessageE('Invalid email or password');
            } else {
                // displayErrorMessage();
            }
                stopLoading("loginButton", true); // ❌ error -> shake + flash red

            return;
        }

        const responseData = await response.json();
        showToastMessageS('Login successful');
        stopLoading("loginButton"); // ✅ Always stop loading
        
        syncGuestCartToServer();
        
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

function syncGuestCartToServer() {
  const guestCart = getCartFromStorage('cart_guest');

  if (!guestCart || guestCart.length === 0) {
    console.log('No guest cart to sync.');
    return;
  }

  guestCart.forEach(item => {
    const body = {
      product_id: item.product_id,
      eshop_user_id: item.eshop_user_id,
      quantity: item.quantity,
    };

    fetch('https://api.payuee.com/creat-and-add-cart-item', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    .then(res => {
      if (!res.ok) throw new Error(`Failed to sync item: ${item.product_id}`);
      return res.json();
    })
    .then(data => console.log('Synced:', data))
    .catch(err => console.error(err));
  });

  // Optionally remove cart_guest after syncing
  localStorage.removeItem('cart_guest');
}

// Helper to safely parse localStorage
function getCartFromStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

// Start loading state for a button
function startLoading(buttonId) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;

    btn.disabled = true;
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Loading...`;
}

// Stop loading state for a button
function stopLoading(buttonId, isError = false) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;

    btn.disabled = false;

    if (btn.dataset.originalText) {
        btn.innerHTML = btn.dataset.originalText;
    }

    // If error, add shake + red flash
    if (isError) {
        btn.classList.add("btn-error-shake");
        setTimeout(() => {
            btn.classList.remove("btn-error-shake");
        }, 600); // reset after animation
    }
}

async function registerEshop(email, password, name) {
    startLoading("registerButton1"); // 🚀 Start loading
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
                stopLoading("registerButton1", true); // ❌ error -> shake + flash red
                showToastMessageS('Please check your email to verify your email ID');
                //  send user email verification notification
                resendOtpEmail(email);
                toggleOTP();
                return;
            } else if (errorData.error === 'User already exist, please login') {
                // need to do a data of just null event 
                stopLoading("registerButton1", true); // ❌ error -> shake + flash red
                showToastMessageE('user already exist, please login');
            } else {
                stopLoading("registerButton1", true); // ❌ error -> shake + flash red
                showToastMessageE('Error signing you up. Please try again');
            }

            return;
        }

        const responseData = await response.json();
        stopLoading("registerButton1"); // ✅ Always stop loading
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
