document.addEventListener("DOMContentLoaded", initWallet);

function initWallet() {

    const billAmountInput = document.getElementById("billAmountInput");

    if (!billAmountInput) return;

    billAmountInput.addEventListener("input", handleAmountInput);

    setupRadioButtons();

    loadWalletAccounts();
}

async function loadWalletAccounts() {

    const apiUrl = "https://api.payuee.com/account-details";

    const response = await fetch(apiUrl,{
        method:"GET",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        }
    });

    if(!response.ok){
        return;
    }

    const data = await response.json();

    const accounts = data.success;
    const balance = isNaN(Number(data.wallet_balance)) ? 0 : Number(data.wallet_balance);

    document.getElementById("wallet_balance").textContent =
    new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(balance);

    if (data.error) {
        if  (data.error === 'No Authentication cookie found' || data.error === "Unauthorized attempt! JWT's not valid!" || data.error === "No Refresh cookie found") {
            // let's log user out the users session has expired
            logUserOutIfTokenIsExpired();
		}
    }

    if (accounts.length > 0) {
        document.getElementById("create_wallet_section").classList.add("d-none");

        const first = accounts[0];

        updateBankDetails(
            "fund_payuee3",
            first.BankName,
            first.AccountName,
            first.AccountNumber
        );

        if (accounts.length > 1) {
            const first = accounts[1];
            updateBankDetails(
                "fund_payuee3",
                first.BankName,
                first.AccountName,
                first.AccountNumber
            );
        }
    } else {
        document.getElementById("create_wallet_section").classList.remove("d-none");
        document.getElementById("wallet_accounts_section").style.display = "none";
    }
}


// 1. DOM Elements
const modal = document.getElementById("phoneModal");
const submitPhoneBtn = document.getElementById("submitPhoneBtn");
const btnText = document.getElementById("btnText");
const btnLoader = document.getElementById("btnLoader");
const modalError = document.getElementById("modalError");
const phoneInput = document.getElementById("phoneInput");

// 2. Open Modal
document.getElementById("createWalletBtn").addEventListener("click", () => {
  modal.style.display = "flex";
  phoneInput.value = "";
  modalError.textContent = ""; // Clear previous errors
});

// 3. Submit Logic
submitPhoneBtn.addEventListener("click", async () => {
  // Grab Values
  const firstName = document.getElementById("firstNameInput").value.trim();
  const lastName = document.getElementById("lastNameInput").value.trim();
  let phone = phoneInput.value.trim(); // Use 'let' so we can modify it

  // Validation
  if (!firstName || !lastName || phone.length < 10) {
      modalError.textContent = "Full name and valid phone required.";
      return;
  }

  toggleLoadingState(true);

  // Format Phone: remove non-digits and leading zero
  phone = phone.replace(/\D/g, '');
  if (phone.startsWith('0')) {
      phone = phone.substring(1);
  }

  const apiUrl = "https://api.payuee.com/paga/create-persistent-account";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          FirstName: firstName,
          LastName: lastName,
          PhoneNumber: phone
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      modal.style.display = "none";
      document.getElementById("create_wallet_section").classList.add("d-none");

      // Update UI with new balance and accounts
      const accounts = data.success;
      const balance = isNaN(Number(data.wallet_balance)) ? 0 : Number(data.wallet_balance);

      const urlParams = new URLSearchParams(window.location.search);
      const isFromTransaction = urlParams.get("trans");
      const redirectUrl = urlParams.get("redirect");

      // Check if user came from same site
      const hasReferrer = document.referrer && document.referrer.includes(window.location.origin);

       if (isFromTransaction === "on_transaction") {
          if (hasReferrer) {
              // ✅ User came from your site → safe to go back
              window.history.back();
          } else if (redirectUrl) {
              // ✅ No history (e.g. opened in new tab) → use redirect param
              window.location.href = redirectUrl;
          } else {
              // ✅ Final fallback
              window.location.href = "https://payuee.com/e-shop/shop_checkout";
          }
      } 

      document.getElementById("wallet_balance").textContent =
        new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(balance);

      if (accounts.length > 0) {
        const first = accounts[0];
        // Ensure this function exists in your script
        updateBankDetails(
          "fund_payuee3",
          first.BankName,
          first.AccountName,
          first.AccountNumber
        );
      }
    } else {
        // Handle backend errors (Auth or Logic)
        const errorMessage = data.error || "Failed to create wallet";
        
        if (errorMessage.includes("Authentication") || errorMessage.includes("JWT")) {
            logUserOutIfTokenIsExpired();
        } else {
            modalError.textContent = errorMessage;
            toggleLoadingState(false);
        }
    }
  } catch (err) {
    modalError.textContent = "Connection lost. Please check your internet.";
    toggleLoadingState(false);
  }
});

/**
 * Helper to handle Button State
 */
function toggleLoadingState(isLoading) {
    if (isLoading) {
        submitPhoneBtn.disabled = true;
        submitPhoneBtn.style.opacity = "0.7";
        btnText.style.display = "none";
        btnLoader.style.display = "inline-block";
        modalError.textContent = ""; 
    } else {
        submitPhoneBtn.disabled = false;
        submitPhoneBtn.style.opacity = "1";
        btnText.style.display = "inline-block";
        btnLoader.style.display = "none";
    }
}

// Cancel Logic
document.getElementById("cancelPhoneBtn").addEventListener("click", () => {
    modal.style.display = "none";
});

// Helper for UI Update (Placeholder - make sure you have this)
function updateBankDetails(id, bank, name, number){

    const element = document.getElementById(id);

    if(!element) return;

    element.innerHTML = `
        <div class="wallet-bank-box">
            <p><strong>${bank}</strong></p>
            <p>${name}</p>
            <p>
                ${number}
                <span onclick="copyToClipboard('${number}')" style="cursor:pointer">📋</span>
            </p>
        </div>
    `;
}

function copyToClipboard(text){

    navigator.clipboard.writeText(text)
    .then(()=> alert("Account number copied"))
    .catch(err => console.error(err));
}

function setupRadioButtons(){

    const radios = document.querySelectorAll('input[name="flexRadioDefault"]');

    radios.forEach(radio => {

        radio.addEventListener("change", function(){

            if(this.id === "payuee"){

                toggleTransfer(true);
                toggleCard(false);

            } else {

                toggleTransfer(false);
                toggleCard(true);

            }

        });

    });
}

function toggleTransfer(active){

    document.getElementById("fund_payuee3")?.classList.toggle("disabled", !active);
    // document.getElementById("fund_payuee4")?.classList.toggle("disabled", !active);
}

function toggleCard(active){

    document.getElementById("fund_paystack1")?.classList.toggle("disabled", !active);
    document.getElementById("fund_paystack2")?.classList.toggle("disabled", !active);
    document.getElementById("fund_paystack3")?.classList.toggle("disabled", !active);
}

function formatNaira(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount);
}

const MAX_AMOUNT = 100_000_000; // ₦100,000,000

function calculateTransactionFee(amount) {
  if (!amount || amount <= 0) {
    return { fee: 0, net: 0 };
  }

  // Cap the amount
  if (amount > MAX_AMOUNT) {
    amount = MAX_AMOUNT;
  }

  // 1% fee
  let fee = amount * 0.01;

  // Cap fee at ₦1,000
  if (fee > 1000) {
    fee = 1000;
  }

  // Round to 2 decimal places
  fee = Math.round(fee * 100) / 100;

  let net = amount - fee;
  net = Math.round(net * 100) / 100;

  return { fee, net };
}

function handleAmountInput(e) {
  let amount = parseFloat(e.target.value);

  const feeInput = document.getElementById("feeInput");
  const netInput = document.getElementById("netInput");

  if (!feeInput || !netInput) {
    console.error("Missing DOM elements");
    return;
  }

  if (!amount || amount <= 0) {
    feeInput.value = "₦0.00";
    netInput.value = "₦0.00";
    return;
  }

  // Enforce maximum
  if (amount > MAX_AMOUNT) {
    alert(`Maximum allowed amount is ₦${MAX_AMOUNT.toLocaleString()}`);
    amount = MAX_AMOUNT;
    e.target.value = MAX_AMOUNT;
  }

  const result = calculateTransactionFee(amount);

  feeInput.value = formatNaira(result.fee);
  netInput.value = formatNaira(result.net);
}

function handleFundWallet(e) {
  e.preventDefault();

  const amount = parseFloat(document.getElementById("billAmountInput").value);

  if (!amount || amount <= 0) {
    alert("Enter a valid amount");
    return;
  }

  if (amount > MAX_AMOUNT) {
    alert(`Maximum allowed amount is ₦${MAX_AMOUNT.toLocaleString()}`);
    return;
  }

  // Proceed with wallet funding logic
//   console.log("Funding wallet with:", amount);
}

function logUserOutIfTokenIsExpired() {
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
    const response = fetch(apiUrl, requestOptions);

        localStorage.removeItem('auth')

        // Store the current page URL in local storage
        const currentUrl = window.location.href;
        localStorage.setItem('redirectTo', currentUrl);

        window.location.href = 'v/login_register.html'
    } finally{
        // do nothing
    }
}
