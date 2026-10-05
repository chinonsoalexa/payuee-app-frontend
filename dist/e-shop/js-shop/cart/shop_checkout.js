/* =========================================================
   Payuee e-Shop – Checkout page (shop_checkout.js)
   ========================================================= */

const API_BASE = 'https://api.payuee.com';
const AUTH_ERRORS = [
    'No Authentication cookie found',
    "Unauthorized attempt! JWT's not valid!",
    'No Refresh cookie found'
];

/* ---------- State ---------- */
var stateSelected = '';
var citySelected = '';
var totalCharge = 0;

let nigeriaData = [];
var citiesS = [];

var cart;                 // last cart returned by the server
var CartFullData = [];    // may be filled by other scripts

let currentShipping = [];
let currentCart = [];

var customerState = '';
var latitude = null;
var longitude = null;
var shippingCost = 0;
var subtotal = 0;

var usersSavedAddress;
var transactionCodeStatus = false;
var orderStatus = false;

let pendingFormData = null;   // form snapshot taken when "Place Order" is clicked
let isPaying = false;         // guards against double submit
let shippingRequestId = 0;    // ignores stale shipping responses

/* ---------- Small helpers ---------- */
function byId(id) { return document.getElementById(id); }

// Works on every Bootstrap 5.x (getOrCreateInstance only exists from 5.1)
function bsInstance(Component, el) {
    if (Component.getOrCreateInstance) return Component.getOrCreateInstance(el);
    return (Component.getInstance && Component.getInstance(el)) || new Component(el);
}

function onId(id, evt, fn) {
    const el = byId(id);
    if (el) el.addEventListener(evt, fn);
}

function getLocalCart() {
    try {
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        return [];
    }
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
}

// Full-precision Naira (the old K/M/B abbreviation hid real amounts at checkout)
function formatNumberToNaira(amount) {
    const n = Number(amount);
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(Number.isFinite(n) ? n : 0);
}

function toggleClassById(elementId, className) {
    const el = byId(elementId);
    if (el) el.classList.toggle(className);
}

/* ---------- Page init ---------- */
document.addEventListener('DOMContentLoaded', async function () {
    const checkoutButton = byId('placeOrderButton');
    if (checkoutButton) checkoutButton.disabled = true;

    updateCartNumber();
    if (typeof updateCartDrawer === 'function') updateCartDrawer();
    renderCheckoutProducts();

    bindUI();

    if (getLocalCart().length > 0) {
        await loadStates();
        await getShippingAddress();
    }
});

function bindUI() {
    // City selection
    onId('city-list', 'click', function (event) {
        const item = event.target.closest('.js-search-select');
        if (!item) return;

        const selectedCity = item.dataset.city;
        const lat = parseFloat(item.dataset.latitude);
        const lng = parseFloat(item.dataset.longitude);

        latitude = lat;
        longitude = lng;
        citySelected = selectedCity;

        byId('city-dropdown').value = selectedCity;
        resetFieldError('city-dropdown');

        getShippingFees(lat, lng, customerState, selectedCity);
        CalculateCartSubtotal();
        toggleClassById('formeCityList', 'js-content_visible');
    });

    // State selection
    onId('state-list', 'click', function (event) {
        const item = event.target.closest('.js-search-select');
        if (!item) return;

        customerState = item.dataset.state;
        stateSelected = customerState;
        citySelected = '';

        byId('search-dropdown').value = customerState;
        byId('city-dropdown').value = '';
        resetFieldError('search-dropdown');

        // A new state invalidates previous shipping results
        resetShippingState();

        toggleClassById('formeStateList', 'js-content_visible');
        byId('formeCityList').style.display = 'block';

        loadCities(customerState);
    });

    onId('stateSearchInput', 'input', function () {
        if (nigeriaData) filterStates(this.value, nigeriaData);
    });

    onId('citySearchInput', 'input', function () {
        if (citiesS) filterCities(this.value, citiesS);
    });

    onId('forgotTransactionPinLink', 'click', function (event) {
        event.preventDefault();
        localStorage.setItem('redirectTo', window.location.href);
        window.location.href = 'https://payuee.com/e-shop/v/reset_trans_pin';
    });

    // Shipping tooltip toggle (bound ONCE – it used to be re-bound on every fee request)
    document.addEventListener('click', function (e) {
        document.querySelectorAll('.info-wrapper').forEach(el => {
            if (el.contains(e.target)) el.classList.toggle('active');
            else el.classList.remove('active');
        });
    });

    // Live validation
    document.querySelectorAll('.form-control').forEach(function (field) {
        field.addEventListener('input', function () { validateField(field); });
    });

    // Numeric-only transaction code inputs
    ['transactionCodeInput', 'createTransactionCodeInput'].forEach(id => {
        onId(id, 'input', function () {
            if (/\D/.test(this.value)) showToastMessageE('Only numbers are allowed');
            this.value = this.value.replace(/\D/g, '');
        });
    });

    // Buttons (bound ONCE – the pay button used to get a new listener on every
    // "Place Order" click, which caused duplicate orders)
    onId('placeOrderButton', 'click', handlePlaceOrderClick);
    onId('paymentButton', 'click', handlePayment);
}

/* ---------- States / cities ---------- */
async function loadStates() {
    try {
        const response = await fetch('nigeria_state.json');
        nigeriaData = await response.json();
        renderStates(nigeriaData);
    } catch (err) {
        console.error('Error loading JSON:', err);
    }
}

function loadCities(stateName) {
    const stateData = nigeriaData.find(s => s.state === stateName);
    if (stateData && stateData.lgas) {
        citiesS = stateData.lgas;
        renderCities(stateData.lgas, stateName);
    } else {
        citiesS = [];
        renderCities([], stateName);
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

    if (cities.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No cities found';
        li.classList.add('search-suggestion__item');
        cityList.appendChild(li);
        return;
    }

    cities.forEach(city => {
        if (!city.wards) return;
        city.wards.forEach(ward => {
            const li = document.createElement('li');
            const label = `${city.name} - ${ward.name}`;
            li.textContent = label;
            li.classList.add('search-suggestion__item', 'js-search-select');
            li.dataset.state = stateName || customerState;
            li.dataset.city = label;
            li.dataset.lga = city.name;
            li.dataset.ward = ward.name;
            li.dataset.latitude = ward.latitude;
            li.dataset.longitude = ward.longitude;
            cityList.appendChild(li);
        });
    });
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

    renderCities(filtered, customerState);
}

/* ---------- Cart display ---------- */
function updateCartNumber() {
    const count = getLocalCart().length;
    ['cartNumber', 'cartNumber2', 'cartNumber3', 'cartNumber4'].forEach(id => {
        const el = byId(id);
        if (el) el.innerHTML = count;
    });
}

// One place for the price rule so the list and the subtotal always agree
function getItemTotal(item) {
    const qty = Number(item.quantity) || 1;

    if (item.reposted == true) {
        return (Number(item.reposted_selling_price) || 0) * qty;
    }

    const selling = Number(item.selling_price);
    const initial = Number(item.initial_cost);
    let unit = 0;

    if (Number.isFinite(selling) && Number.isFinite(initial)) unit = Math.min(selling, initial);
    else if (Number.isFinite(initial)) unit = initial;
    else if (Number.isFinite(selling)) unit = selling;

    return (unit * qty);  // convert kobo to naira
}

function renderCheckoutProducts(cartArg) {
    const items = cartArg || getLocalCart();
    const body = byId('detailsCheckoutProducts');
    if (!body) return;
    body.innerHTML = '';

    if (items.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="2">No product added yet. Select a product and click "Add To Cart".</td>`;
        body.appendChild(row);
    } else {
        items.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${escapeHtml(product.title)}</td>
                <td>${formatNumberToNaira(getItemTotal(product))}</td>
            `;
            body.appendChild(row);
        });
    }

    CalculateCartSubtotal(items);
}

function CalculateCartSubtotal(cartArg) {
    const items = Array.isArray(cartArg) ? cartArg : getLocalCart();

    subtotal = items.reduce((sum, item) => sum + getItemTotal(item), 0);
    totalCharge = subtotal + shippingCost;

    const set = (id, text) => { const el = byId(id); if (el) el.innerText = text; };
    set('cart_sub_total_price', formatNumberToNaira(subtotal));
    set('subtotalMain2', formatNumberToNaira(subtotal));
    set('shippingFee', formatNumberToNaira(shippingCost));
    set('totalMain', formatNumberToNaira(totalCharge));
}

/* ---------- Validation ---------- */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getFieldError(fieldId, rawValue) {
    const value = (rawValue || '').trim();
    switch (fieldId) {
        case 'checkout_first_name':    return value ? '' : 'First Name is required.';
        case 'checkout_last_name':     return value ? '' : 'Last Name is required.';
        case 'search-dropdown':        return value ? '' : 'State/Region is required.';
        case 'city-dropdown':          return value ? '' : 'City is required.';
        case 'checkout_street_address':return value ? '' : 'Street Address 1 is required.';
        case 'checkout_zipcode':       return value ? '' : 'Postcode/ZIP is required.';
        case 'checkout_province':      return value ? '' : 'Province is required.';
        case 'checkout_phone':
            if (!value) return 'Phone number is required.';
            return /^\d{11}$/.test(value) ? '' : 'Invalid phone number.';
        case 'checkout_email':
            if (!value) return 'Email is required.';
            return isValidEmail(value) ? '' : 'Invalid Email Address.';
        default: return '';
    }
}

function validateField(field) {
    const message = getFieldError(field.id, field.value);
    if (message) showError(field.id, message);
    else resetFieldError(field.id);   // only clears THIS field (used to clear all)
}

function showError(fieldId, message) {
    const field = byId(fieldId);
    if (!field) return;
    field.style.borderColor = 'red';

    const next = field.nextElementSibling;
    if (next && next.classList.contains('error-message')) {
        next.innerText = message;     // update text if it changed
        return;
    }

    const el = document.createElement('div');
    el.className = 'error-message';
    el.style.color = 'red';
    el.style.marginTop = '5px';
    el.innerText = message;
    field.parentNode.insertBefore(el, field.nextSibling);
}

function resetFieldError(fieldId) {
    const field = byId(fieldId);
    if (!field) return;
    field.style.borderColor = '';
    const next = field.nextElementSibling;
    if (next && next.classList.contains('error-message')) next.remove();
}

function resetErrors() {
    document.querySelectorAll('.form-control').forEach(f => { if (f.id) resetFieldError(f.id); });
}

function collectFormData() {
    const val = id => (byId(id) ? byId(id).value.trim() : '');
    const notes = document.querySelector('textarea');
    const method = document.querySelector('input[name="checkout_payment_method"]:checked');

    return {
        firstName: val('checkout_first_name'),
        lastName: val('checkout_last_name'),
        companyName: val('checkout_company_name'),
        state: val('search-dropdown'),
        city: val('city-dropdown'),
        streetAddress1: val('checkout_street_address'),
        streetAddress2: val('checkout_city'),     // "Street Address 2" input
        zipcode: val('checkout_zipcode'),
        province: val('checkout_province'),
        phone: val('checkout_phone'),
        email: val('checkout_email'),
        saveAddress: byId('ship_different_address') ? byId('ship_different_address').checked : false,
        orderNotes: notes ? notes.value.trim() : '',
        paymentMethod: method ? method.id : ''
    };
}

function validateForm(formData) {
    resetErrors();
    const map = {
        checkout_first_name: formData.firstName,
        checkout_last_name: formData.lastName,
        'search-dropdown': formData.state,
        'city-dropdown': formData.city,
        checkout_street_address: formData.streetAddress1,
        checkout_zipcode: formData.zipcode,
        checkout_province: formData.province,
        checkout_phone: formData.phone,
        checkout_email: formData.email
    };

    let firstBad = null;
    Object.keys(map).forEach(id => {
        const message = getFieldError(id, map[id]);
        if (message) {
            showError(id, message);
            if (!firstBad) firstBad = id;
        }
    });

    if (firstBad && byId(firstBad)) byId(firstBad).scrollIntoView({ behavior: 'smooth', block: 'center' });
    return !firstBad;
}

/* ---------- Place order -> payment modal ---------- */
function handlePlaceOrderClick(event) {
    event.preventDefault();

    const formData = collectFormData();
    if (!validateForm(formData)) return;

    if (!getLocalCart().length) {
        showToastMessageE('Your cart is empty');
        return;
    }
    if (!currentShipping.length) {
        showToastMessageE('Please choose a state and city to calculate shipping');
        return;
    }

    pendingFormData = formData;

    const withCode = byId('transactionCodeSection');
    const createCode = byId('createTransactionCodeSection');
    if (transactionCodeStatus) {
        withCode.classList.remove('d-none');
        createCode.classList.add('d-none');
    } else {
        createCode.classList.remove('d-none');
        withCode.classList.add('d-none');
    }

    byId('cartSubTotalPopUp').textContent = formatNumberToNaira(subtotal);
    byId('shippingSubTotalPopUp').textContent = formatNumberToNaira(shippingCost);
    byId('cartShippingTotalPopUp').textContent = formatNumberToNaira(subtotal + shippingCost);
    byId('paymentButton').textContent = `Pay ${formatNumberToNaira(subtotal + shippingCost)}`;

    bsInstance(bootstrap.Modal, byId('checkoutModal')).show();
}

function getTransactionCode() {
    const id = transactionCodeStatus ? 'transactionCodeInput' : 'createTransactionCodeInput';
    return byId(id) ? byId(id).value.trim() : '';
}

function clearTransactionInputs() {
    ['transactionCodeInput', 'createTransactionCodeInput'].forEach(id => {
        if (byId(id)) byId(id).value = '';
    });
}

async function handlePayment(event) {
    event.preventDefault();
    if (isPaying || !pendingFormData) return;

    const code = getTransactionCode();
    if (code === '') {
        showToastMessageE('Please fill in the transaction code field');
        return;
    }
    if (!/^\d{6}$/.test(code)) {
        showToastMessageE('Transaction code should be 6 digits');
        return;
    }

    const paymentButton = byId('paymentButton');
    const paymentModal = bsInstance(bootstrap.Modal, byId('checkoutModal'));

    isPaying = true;
    paymentButton.disabled = true;

    try {
        const userResponse = await getUsersBalance();
        if (!userResponse) {
            showToastMessageE('Could not check your wallet balance. Please try again.');
            return;
        }

        const balance = Number(userResponse.success) || 0;

        if (balance < totalCharge || balance < 1) {
            paymentModal.hide();
            clearTransactionInputs();

            const result = calculateTransactionFee(totalCharge - balance);
            setTimeout(function () {
                renderWalletDetails(userResponse, result.fee + result.net);
                bsInstance(bootstrap.Modal, byId('insufficientBalanceModal')).show();
            }, 300);
            return;
        }

        const result = await placeOrder(pendingFormData, code);

        if (orderStatus && result) {
            paymentModal.hide();
            byId('amountToCharge').textContent = formatNumberToNaira(totalCharge);
            bsInstance(bootstrap.Modal, byId('transactionSuccessModal')).show();
            clearTransactionInputs();

            // Remove purchased items from server + local cart
            getLocalCart().forEach(item => syncRemove(item.ID));
            localStorage.removeItem('cart');
            localStorage.removeItem('cart_copy');
            updateCartNumber();

            const orders = Array.isArray(result.order) ? result.order : [result.order];
            const link = byId('viewTransactionDetails');
            if (link) {
                link.href = `https://payuee.com/e-shop/shop_order_complete?OrderIDs=${orders.join(',')}`;
            }
        } else {
            clearTransactionInputs();
        }
    } catch (error) {
        console.error('Error:', error);
        showToastMessageE('An error occurred while processing your order.');
    } finally {
        isPaying = false;
        paymentButton.disabled = false;
    }
}

function calculateTransactionFee(amount) {
    if (!amount || amount <= 0) return { fee: 0, net: 0 };

    let fee = Math.min(amount * 0.01, 1000);   // 1% capped at ₦1,000
    fee = Math.round(fee * 100) / 100;
    const net = Math.round((amount - fee) * 100) / 100;

    return { fee, net };
}

function renderWalletDetails(response, requiredAmount) {
    const container = byId('walletAccountDetails');
    const continueBtn = byId('continuePurchaseButton');
    const amountEl = byId('amountNeededToContinue');

    const accounts = (response && response.account_details) || [];
    const account = accounts.find(a => a && a.AccountNumber);

    if (!account) {
        container.innerHTML = `
            <div class="text-danger">
                No wallet account found. Please create a wallet account to continue.
            </div>`;
        continueBtn.innerHTML = `<i class="bi bi-person-plus me-2"></i> Create Wallet Account`;
        continueBtn.onclick = function () {
            window.location.href = `https://payuee.com/e-shop/fund_account?trans=on_transaction&redirect=${encodeURIComponent(window.location.href)}`;
        };
        return;
    }

    if (requiredAmount > 0) {
        amountEl.innerHTML = `You need ${formatNumberToNaira(requiredAmount)} more to continue (Includes Charges).`;
        amountEl.classList.add('text-danger');
    } else {
        amountEl.innerHTML = '';
    }

    container.innerHTML = `
        <div class="wallet-row"><span class="wallet-label">Bank</span><span class="wallet-value">${escapeHtml(account.BankName)}</span></div>
        <div class="wallet-row"><span class="wallet-label">Account Name</span><span class="wallet-value">${escapeHtml(account.AccountName)}</span></div>
        <div class="wallet-row"><span class="wallet-label">Account Number</span><span class="wallet-value">${escapeHtml(account.AccountNumber)}</span></div>
        <div class="wallet-row"><span class="wallet-label">Currency</span><span class="wallet-value">${escapeHtml(account.Currency)}</span></div>
    `;

    continueBtn.innerHTML = `<i class="bi bi-arrow-right-circle me-2"></i> Continue Purchase`;
    continueBtn.onclick = function () {
        const modal = bootstrap.Modal.getInstance(byId('insufficientBalanceModal'));
        if (modal) modal.hide();
    };
}

/* ---------- API: place order ---------- */
async function placeOrder(formData, transCode) {
    orderStatus = false;   // reset so a previous success can't leak into this attempt

    if (!currentCart.length) {
        showToastMessageE('Cart is empty');
        return;
    }
    if (!currentShipping.length) {
        showToastMessageE('Shipping not calculated');
        return;
    }

    const cartItems = currentCart.map(item => ({
        product_id: item.ID,
        cart_meta: {
            quantity: item.quantity,
            outfit_size: item.outfit_size || ''
        }
    }));

    const shipping = currentShipping.map(s => ({
        fee: s.fee,
        vendor_id: s.vendor_id,
        method_id: s.method_id,
        company_name: s.company_name,
        config_id: s.config_id
    }));

    if (shipping.some(s => !s.method_id || s.method_id === 'not_available')) {
        showToastMessageE('Some vendors have no valid shipping method');
        return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    const customer = {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phone,
        state: formData.state,
        city: formData.city,
        latitude: lat,
        longitude: lng,
        address_1: formData.streetAddress1,
        address_2: formData.streetAddress2,
        zip_code: formData.zipcode,
        order_note: formData.orderNotes,
        province: formData.province,
        save_address: formData.saveAddress
    };

    const requestBody = {
        trans_code: String(transCode),
        customer: customer,
        cart_items: cartItems,
        shipping: shipping
    };

    try {
        const response = await fetch(`${API_BASE}/place-order-new`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        orderStatus = !!data.success;

        if (!data.success) {
            if (data.error === 'invalid transaction code') {
                showToastMessageE('Wrong transaction code');
            } else {
                showToastMessageE(data.error || 'Failed to place order');
            }
            return;
        }

        showToastMessageS('Order placed successfully 🎉');
        return data;
    } catch (error) {
        console.error('Network error:', error);
        showToastMessageE('An error occurred while placing order.');
        throw error;
    }
}

function syncRemove(productId) {
    fetch(`${API_BASE}/delete-cart-item/${productId}`, {
        method: 'GET',
        credentials: 'include'
    }).catch(err => console.error('Cart sync failed:', err));
}

/* ---------- Toasts ---------- */
function showToastMessageS(message) {
    byId('toastMessage2').textContent = message;
    bsInstance(bootstrap.Toast, byId('liveToast3')).show();
}

function showToastMessageE(message) {
    byId('toastError').textContent = message;
    bsInstance(bootstrap.Toast, byId('liveToast1')).show();
}

/* ---------- Shipping ---------- */
function getUniqueVendorIds() {
    // CartFullData is filled elsewhere; fall back to the local cart if it's empty
    const items = (CartFullData && CartFullData.length) ? CartFullData : getLocalCart();
    const ids = new Set();

    items.forEach(item => {
        const id = item.reposted ? item.original_eshop_user_id : item.eshop_user_id;
        if (id !== undefined && id !== null) ids.add(id);
    });

    return Array.from(ids);
}

function resetShippingState() {
    shippingRequestId++;          // drop any in-flight shipping response
    currentShipping = [];
    shippingCost = 0;
    latitude = null;
    longitude = null;

    const body = byId('vendors_shipping_fees');
    if (body) body.innerHTML = '<tr><td>Choose State/City</td></tr>';

    const btn = byId('placeOrderButton');
    if (btn) btn.disabled = true;

    CalculateCartSubtotal();
}

function handleCartAndShippingResponse(data) {
    currentCart = data.cart || [];
    currentShipping = data.shipping || [];
}

function updateShippingPrices(vendorsShippingFees, cartArg) {
    const body = byId('vendors_shipping_fees');
    const checkoutButton = byId('placeOrderButton');

    shippingCost = 0;
    body.innerHTML = '';
    checkoutButton.disabled = true;

    if (!vendorsShippingFees || vendorsShippingFees.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="2" style="background-color: yellow; font-weight: bold;">
                No shipping fees available
            </td>`;
        body.appendChild(row);
        CalculateCartSubtotal(cartArg);   // refresh totals (was skipped before)
        return;
    }

    const isInvalid = fee => !fee.method_id || fee.method_id === 'not_available';
    const hasInvalid = vendorsShippingFees.some(isInvalid);

    if (hasInvalid) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="2" style="background-color: yellow; font-weight: bold;">
                Some vendors do not have available shipping methods
            </td>`;
        body.appendChild(row);
    }

    vendorsShippingFees.forEach(fee => {
        if (isInvalid(fee)) return;

        shippingCost += Number(fee.fee || 0);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(fee.company_name)}</td>
            <td class="price-cell">
                <span class="info-wrapper">
                    <span class="info-icon">i</span>
                    <span class="info-tooltip">
                        ${escapeHtml(fee.reason || 'Calculated based on logistics rules')}
                    </span>
                </span>
                ${formatNumberToNaira(fee.fee)}
            </td>`;
        body.appendChild(row);
    });

    if (!hasInvalid) checkoutButton.disabled = false;

    CalculateCartSubtotal(cartArg);
}

async function handleAuthError(response) {
    try {
        const errorData = await response.json();
        if (AUTH_ERRORS.includes(errorData.error)) {
            logout();
            return true;
        }
    } catch (e) { /* body was not JSON */ }
    return false;
}

async function getShippingFees(buyerLatitude, buyerLongitude, buyerState, buyerCity) {
    const myRequest = ++shippingRequestId;
    const checkoutButton = byId('placeOrderButton');
    checkoutButton.disabled = true;

    try {
        const response = await fetch(`${API_BASE}/logistics/get-logistics-shipping-fee`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                vendors: getUniqueVendorIds(),
                latitude: buyerLatitude,
                longitude: buyerLongitude,
                state: buyerState,
                city: buyerCity
            })
        });

        if (myRequest !== shippingRequestId) return;   // a newer request replaced this one

        if (!response.ok) {
            await handleAuthError(response);
            currentShipping = [];
            updateShippingPrices([], getLocalCart());
            return;
        }

        const data = await response.json();
        if (myRequest !== shippingRequestId) return;

        handleCartAndShippingResponse(data);
        cart = data.cart;
        transactionCodeStatus = !!data.status;

        renderCheckoutProducts(data.cart);
        updateShippingPrices(data.shipping, data.cart);
    } catch (error) {
        console.error('Error fetching shipping fees:', error);
        if (myRequest === shippingRequestId) checkoutButton.disabled = true;
    }
}

/* ---------- Saved address ---------- */
function updateFormFields(d) {
    const set = (id, v) => { if (byId(id)) byId(id).value = v || ''; };
    set('checkout_first_name', d.customer_fname);
    set('checkout_last_name', d.customer_user_sname);
    set('checkout_company_name', d.customer_company_name);
    set('search-dropdown', d.customer_state);
    set('city-dropdown', d.customer_city);
    set('checkout_street_address', d.customer_street_address_1);
    set('checkout_city', d.customer_street_address_2);
    set('checkout_zipcode', d.customer_zip_code);
    set('checkout_province', d.customer_province);
    set('checkout_phone', d.customer_phone_number);
    set('checkout_email', d.customer_email);

    const notes = document.querySelector('textarea');
    if (notes) notes.value = d.order_note || '';
}

async function getShippingAddress() {
    try {
        const response = await fetch(`${API_BASE}/logistics/get-shipping-address`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) {
            await handleAuthError(response);
            return;
        }

        const data = await response.json();
        const addr = data && data.address;
        if (!addr) return;

        usersSavedAddress = addr;
        if (!addr.save_shipping_address) return;

        updateFormFields(addr);

        const savedState = addr.customer_state || '';
        const savedCity = addr.customer_city || '';
        const lat = parseFloat(addr.latitude);
        const lng = parseFloat(addr.longitude);

        if (savedState) {
            // Keep internal state in sync with the pre-filled form
            customerState = savedState;
            stateSelected = savedState;
            citySelected = savedCity;
            byId('formeCityList').style.display = 'block';
            if (nigeriaData.length) loadCities(savedState);
        }

        if (savedState && savedCity && Number.isFinite(lat) && Number.isFinite(lng) && getLocalCart().length) {
            latitude = lat;
            longitude = lng;
            getShippingFees(lat, lng, savedState, savedCity);
        }
    } catch (error) {
        console.error('Error fetching saved address:', error);
    }
}

/* ---------- Wallet balance ---------- */
async function getUsersBalance() {
    try {
        const response = await fetch(`${API_BASE}/check-balance`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) {
            await handleAuthError(response);
            return;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
}

/* ---------- Logout ---------- */
async function logout() {
    try {
        await fetch(`${API_BASE}/log-out`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
    } catch (e) {
        console.error('Logout request failed:', e);
    } finally {
        localStorage.removeItem('auth');
        window.location.href = 'v/login_register';
    }
}