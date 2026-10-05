var stateSelected;
var citySelected;
var lgaSelected;
var wardSelected;
var latitude = 0.0;
var longitude = 0.0;

// ===== Location data (single detailed JSON: state -> lgas -> wards) =====
// Adjust this URL to wherever the detailed file is hosted
const NIGERIA_DATA_URL = 'https://payuee.com/e-shop/v/nigeria_state.json';
const MAX_RENDERED_CITIES = 300; // keeps the dropdown fast for big states (search narrows it down)

let nigeriaData = [];   // full dataset
let currentLgas = [];   // LGAs (with wards) of the selected state

const byId = (id) => document.getElementById(id);

const phoneInput = byId("customerPhoneRegisterInput");
if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
        // digits only, max 11
        e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11);
    });
}

document.addEventListener('DOMContentLoaded', async function () {
    const loginButtonn = byId('loginButtonn');
    const loginForm = document.forms['login-form'];

    const registerButton1 = byId('registerButton1');
    const registerForm = document.forms['register-form'];

    const verifyButton1 = byId('verifyButton1');
    const verifyForm = document.forms['register-form'];

    // Ensure that when "Create Account" is clicked, it shows the "Register" tab.
    document.querySelector('.js-show-register').addEventListener('click', function (e) {
        e.preventDefault();
        const registerTab = new bootstrap.Tab(byId('register-tab'));
        registerTab.show();
    });

    setCityVisibility(false); // city stays hidden until a state is chosen

    setupLocationPickers(); // attach listeners ONCE
    await loadStates();

    // ================= LOGIN =================
    let loginInProgress = false;
    async function loginButtonClickHandler(event) {
        event.preventDefault();
        event.stopPropagation();

        if (loginInProgress) return;
        loginInProgress = true;
        loginButtonn.disabled = true;

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
            loginButtonn.disabled = false;
        }
    }
    loginButtonn.addEventListener('click', loginButtonClickHandler);

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
                phone: registerForm.register_phone.value.trim(),
                password: registerForm.register_password.value.trim(),
            };

            if (!registerData.FirstName || !registerData.email || !registerData.password || !registerData.phone) {
                showToastMessageE('Please fill in all fields.');
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(registerData.email)) {
                showToastMessageE('Please enter a valid email address.');
                return;
            }

            if (!stateSelected || !citySelected ||
                !Number.isFinite(latitude) || !Number.isFinite(longitude) ||
                latitude <= 0 || longitude <= 0) {
                showToastMessageE('Please select your state & city');
                return;
            }

            const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
            if (!passwordPattern.test(registerData.password)) {
                showToastMessageE('Password must be at least 8 characters long and include at least one letter and one number.');
                return;
            }

            await registerEshop(registerData.email, registerData.phone, registerData.password, registerData.FirstName);
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

/* ---------- States / cities (single JSON: state -> lgas -> wards) ---------- */

async function loadStates() {
    try {
        const response = await fetch(NIGERIA_DATA_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        nigeriaData = await response.json();
        renderStates(nigeriaData);
    } catch (err) {
        console.error('Error loading location data:', err);
    }
}

function loadCities(stateName) {
    const stateData = nigeriaData.find(s => s.state === stateName);
    currentLgas = (stateData && stateData.lgas) ? stateData.lgas : [];
    renderCities(currentLgas, stateName);
}

// Attach all click/search listeners once (render functions are called many times,
// so adding listeners inside them would stack duplicates)
function setupLocationPickers() {
    const stateList = byId('state-list');
    const cityList = byId('city-list');
    const stateSearch = byId('stateSearchInput');
    const citySearch = byId('citySearchInput');

    if (stateSearch) {
        stateSearch.addEventListener('input', () => filterStates(stateSearch.value, nigeriaData));
    }
    if (citySearch) {
        citySearch.addEventListener('input', () => filterCities(citySearch.value, currentLgas));
    }

    if (stateList) {
        stateList.addEventListener('click', function (event) {
            const item = event.target.closest('.js-search-select');
            if (!item || !item.dataset.state) return;

            const selectedState = item.dataset.state;
            stateSelected = selectedState;

            // Reset everything city-related
            citySelected = '';
            lgaSelected = '';
            wardSelected = '';
            latitude = 0.0;
            longitude = 0.0;

            byId('search-dropdown').value = selectedState;
            byId('city-dropdown').value = '';
            if (citySearch) citySearch.value = '';

            toggleClassById("formeStateList", "js-content_visible");
            setCityVisibility(true);
            loadCities(selectedState);
        });
    }

    if (cityList) {
        cityList.addEventListener('click', function (event) {
            const item = event.target.closest('.js-search-select');
            if (!item || !item.dataset.city) return;

            citySelected = item.dataset.city;      // "LGA - Ward"
            lgaSelected = item.dataset.lga;
            wardSelected = item.dataset.ward;
            latitude = parseFloat(item.dataset.latitude);
            longitude = parseFloat(item.dataset.longitude);

            byId('city-dropdown').value = citySelected;
            toggleClassById("formeCityList", "js-content_visible");
        });
    }
}

function renderStates(states) {
    const stateList = byId('state-list');
    if (!stateList) return;
    stateList.innerHTML = '';

    if (states.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No states found';
        li.classList.add('search-suggestion__item');
        stateList.appendChild(li);
        return;
    }

    states.forEach(state => {
        const li = document.createElement('li');
        li.textContent = state.state;
        li.classList.add('search-suggestion__item', 'js-search-select');
        li.dataset.state = state.state;
        stateList.appendChild(li);
    });
}

function renderCities(cities, stateName) {
    const cityList = byId('city-list');
    if (!cityList) return;
    cityList.innerHTML = '';

    let count = 0;
    let truncated = false;

    outer:
    for (const city of cities) {
        if (!city.wards) continue;
        for (const ward of city.wards) {
            if (count >= MAX_RENDERED_CITIES) { truncated = true; break outer; }

            const li = document.createElement('li');
            const label = `${city.name} - ${ward.name}`;
            li.textContent = label;
            li.classList.add('search-suggestion__item', 'js-search-select');
            li.dataset.state = stateName || stateSelected;
            li.dataset.city = label;
            li.dataset.lga = city.name;
            li.dataset.ward = ward.name;
            li.dataset.latitude = ward.latitude;
            li.dataset.longitude = ward.longitude;
            cityList.appendChild(li);
            count++;
        }
    }

    if (count === 0) {
        const li = document.createElement('li');
        li.textContent = 'No cities found';
        li.classList.add('search-suggestion__item');
        cityList.appendChild(li);
        return;
    }

    if (truncated) {
        const li = document.createElement('li');
        li.textContent = 'Keep typing to narrow down results...';
        li.classList.add('search-suggestion__item');
        cityList.appendChild(li);
    }
}

function filterStates(term, states) {
    const t = term.toLowerCase();
    renderStates(states.filter(s => s.state.toLowerCase().includes(t)));
}

function filterCities(term, cities) {
    const t = term.toLowerCase();
    const filtered = [];

    cities.forEach(city => {
        if (!city.wards) return;
        const matchingWards = city.wards.filter(ward =>
            `${city.name} - ${ward.name}`.toLowerCase().includes(t)
        );
        if (city.name.toLowerCase().includes(t) || matchingWards.length > 0) {
            filtered.push({
                ...city,
                wards: matchingWards.length > 0 ? matchingWards : city.wards
            });
        }
    });

    renderCities(filtered, stateSelected);
}

/* ---------- Toasts / helpers ---------- */

function showToastMessageS(message) {
    byId('toastMessage2').textContent = message;
    const toast = new bootstrap.Toast(byId('liveToast3'));
    toast.show();
}

function showToastMessageE(message) {
    byId('toastError').textContent = message;
    const toast = new bootstrap.Toast(byId('liveToast1'));
    toast.show();
}

function setCityVisibility(show) {
    const cityDiv = byId('cityDiv');
    if (cityDiv) cityDiv.classList.toggle('d-none', !show);
}

function toggleClassById(elementId, className) {
    const element = byId(elementId);
    if (element) {
        element.classList.toggle(className);
    }
}

/* ---------- Auth API calls ---------- */

async function loginEshop(email, password) {
    startLoading("loginButtonn");

    const apiUrl = "https://api.payuee.com/sign-in";

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ email: email, password: password })
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            const errorData = await response.json();

            if (errorData.error === 'Your account has been suspended. Please contact support for more details.') {
                showToastMessageE('Your account has been suspended. Please contact support for more details.');
            } else if (errorData.error === 'Invalid email or password') {
                showToastMessageE('Invalid email or password');
            }
            stopLoading("loginButtonn", true);
            return;
        }

        const responseData = await response.json();
        showToastMessageS('Login successful');
        stopLoading("loginButtonn");

        syncGuestCartToServer();

        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirectTo');
        localStorage.setItem('auth', 'true');

        if (redirectTo) {
            window.location.href = redirectTo;
        } else {
            window.location.href = 'https://payuee.com/e-shop/home';
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

  localStorage.removeItem('cart_guest');
}

function getCartFromStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function startLoading(buttonId) {
  const btn = byId(buttonId);
  if (!btn) return;

  btn.disabled = true;

  if (!btn.dataset.originalText) {
    btn.dataset.originalText = btn.innerHTML;
  }

  btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Loading...`;
}

function stopLoading(buttonId, isError = false) {
  const btn = byId(buttonId);
  if (!btn) return;

  btn.disabled = false;

  if (btn.dataset.originalText) {
    btn.innerHTML = btn.dataset.originalText;
  }

  if (isError) {
    btn.classList.add("btn-error-shake");
    setTimeout(() => btn.classList.remove("btn-error-shake"), 600);
  }
}

async function registerEshop(email, phone, password, name) {
    startLoading("registerButton1");
    const apiUrl = "https://api.payuee.com/app/sign-up";

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
            FirstName: name,
            email: email,
            phone_number: phone.toString(),
            password: password,
            state: stateSelected,
            city: citySelected,      // "LGA - Ward"
            // lga: lgaSelected,     // uncomment if your backend accepts them
            // ward: wardSelected,
            latitude: latitude,      // now ward-level coordinates
            longitude: longitude,
        })
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            const errorData = await response.json();

            if (errorData.error === 'User already exist, please verify your email ID') {
                stopLoading("registerButton1", true);
                showToastMessageS('Please check your email to verify your email ID');
                resendOtpEmail(email);
                toggleOTP();
                return;
            } else if (errorData.error === 'User already exist, please login') {
                stopLoading("registerButton1", true);
                showToastMessageE('user already exist, please login');
            } else {
                stopLoading("registerButton1", true);
                showToastMessageE('Error signing you up. Please try again');
            }
            stopLoading("registerButton1");

            return;
        }

        const responseData = await response.json();
        stopLoading("registerButton1");
        showToastMessageS('Please verify your email address');
        toggleOTP();
    } finally {
        stopLoading("registerButton1");
    }
}

async function resendOtpEmail(email) {
    const apiUrl = "https://api.payuee.com/app/resend-otp";

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ Email: email })
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            const errorData = await response.json();

            if (errorData.error === 'user not found in the db') {
                showToastMessageE('User not found');
            } else if (errorData.error === 'email verification failed') {
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
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ Email: Email, SentOTP: SentOTP })
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            const errorData = await response.json();

            if (errorData.error === 'email limit check exceeded') {
                showToastMessageE('email limit check exceeded check email for new OTP');
                resendOtpEmail(Email);
            } else if (errorData.error === 'error getting otp by email for limit check') {
                showToastMessageE('error verifying otp email');
            } else if (errorData.error === 'Wrong OTP') {
                showToastMessageE('wrong OTP code');
            } else if (errorData.error === 'Verification Code Expired') {
                showToastMessageE('Verification code expired');
            } else {
                showToastMessageE('Error verifying OTP. Please try again');
            }

            return;
        }

        const responseData = await response.json();
        showToastMessageS('Successfully registered');
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirectTo');
        localStorage.setItem('auth', 'true');

        if (redirectTo) {
            window.location.href = redirectTo;
        } else {
            window.location.href = 'https://payuee.com/e-shop/home';
        }
    } finally {

    }
}

function toggleOTP() {
    const otpDiv = byId('otpDiv');
    const nameDiv = byId('nameDiv');
    const emailDiv = byId('emailDiv');
    const phoneDiv = byId('phoneDiv');
    const stateDiv = byId('stateDiv');
    const cityDiv = byId('cityDiv');
    const passwordDiv = byId('passwordDiv');
    const registerButton1 = byId('registerButton1');
    const verifyButton1 = byId('verifyButton1');

    if (otpDiv.classList.contains('d-none')) {
        otpDiv.classList.remove('d-none');
        verifyButton1.classList.remove('d-none');
        registerButton1.classList.add('d-none');
        nameDiv.classList.add('d-none');
        emailDiv.classList.add('d-none');
        phoneDiv.classList.add('d-none');
        stateDiv.classList.add('d-none');
        cityDiv.classList.add('d-none');
        passwordDiv.classList.add('d-none');
    } else {
        otpDiv.classList.add('d-none');
        verifyButton1.classList.add('d-none');
        nameDiv.classList.remove('d-none');
        emailDiv.classList.remove('d-none');
        phoneDiv.classList.remove('d-none');
        stateDiv.classList.remove('d-none');
        cityDiv.classList.remove('d-none');
        passwordDiv.classList.remove('d-none');
        registerButton1.classList.remove('d-none');
    }
}