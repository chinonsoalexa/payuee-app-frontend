/** * 1. STATE & GLOBAL VARIABLES
 */
let flowState = "PIN";
// "PIN" | "OTP_REQUIRED" | "RESET_PIN"

let currentTransaction = {
    amount: 0,
    recipient: "",
    accountNumber: ""
};

let sendFundsToStatus = "paga"; // Default to Bank Transfer based on your HTML 'checked' attribute
let banksData = null;
let pincode = "";
let BankCode = "";
let Bank = "";
let BankAccountName = "";
let BankUuid = "";
let BankCountryType = "";
let GetName = 0;
const Currency = "NGN";
let SentOTP = ""; // To store the OTP sent for PIN reset
let pinStatus = false; // To track if the user has set a transaction PIN

var inputElement = document.getElementById("searchBankID");
var searchOptionsDiv = document.getElementById("searchOptions");

let triggerForgotPinBtn, backToConfirmViewBtn;
let otpInput, newPinInput, submitNewPinBtn, resetPinError;

/**
 * 2. INITIALIZATION
 */
document.addEventListener("DOMContentLoaded", function () {
    triggerForgotPinBtn = document.getElementById('triggerForgotPin');
    backToConfirmViewBtn = document.getElementById('backToConfirmView');

    otpInput = document.getElementById('otpInput');
    newPinInput = document.getElementById('newPinInput');
    // submitNewPinBtn = document.getElementById('submitNewPin');
    resetPinError = document.getElementById('resetPinError');

    // Apply restrictions
    restrictPinInput(otpInput, 6);   // 6-digit OTP
    restrictPinInput(newPinInput, 4); // 4-digit PIN

    loadWalletBalance();
    loadBankCodes();
    setupEventListeners();
});

function switchUI(state, options = {}) {
    const skipResetStates = ["PROCESSING", "SENDING_OTP"];

    if (!skipResetStates.includes(state)) {
        flowState = state;
    }

    // Modal
    const modal = document.getElementById('transactionPinModal');

    // Views
    const confirmView = document.getElementById('pinConfirmView');
    const resetView = document.getElementById('pinResetView');

    // Confirm UI
    const title = document.querySelector("#pinConfirmView .custom-modal-title");
    const summary = document.getElementById("transactionSummary");
    const status = document.getElementById("transactionPinStatus");
    const pinInput = document.getElementById("transactionPinInput");
    const errorText = document.getElementById("transactionPinError");

    // Buttons
    const confirmBtn = document.getElementById("submitTransactionPin");
    const cancelBtn = document.getElementById("cancelTransactionPin");
    const forgotPin = document.getElementById("triggerForgotPin");
    const resetBtn = document.getElementById("submitNewPin");

    // Reset UI
    const resetStatus = document.getElementById("resetPinStatus");

    // Success
    const successIcon = document.getElementById("successIconContainer");

    // =========================
    // RESET STATE (SAFE)
    // =========================
    if (successIcon) successIcon.style.display = "none";
    if (errorText) errorText.textContent = "";
    if (pinInput) pinInput.style.display = "block";
    if (forgotPin) forgotPin.style.display = "block";
    if (cancelBtn) cancelBtn.style.display = "inline-block";

    if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = "Confirm";
    }

    if (otpInput) otpInput.disabled = true;
    if (newPinInput) newPinInput.disabled = true;
    if (resetBtn) resetBtn.disabled = true;

    // Save transaction context
    if (options.amount) currentTransaction.amount = options.amount;
    if (options.recipient) currentTransaction.recipient = options.recipient;

    // =========================
    // STATES
    // =========================

    // PIN ENTRY
    if (state === "PIN") {
        modal.style.display = "flex";

        confirmView.style.display = "block";
        resetView.style.display = "none";

        title.textContent = "Confirm Transfer";
        title.style.color = "#111";

        summary.textContent = `Send ₦${currentTransaction.amount} to ${currentTransaction.recipient}`;
        status.textContent = "Enter your 4-digit PIN";

        if (pinInput) {
            pinInput.value = "";
            pinInput.focus();
        }
    }

    // PROCESSING
    else if (state === "PROCESSING") {
        status.textContent = options.message || "Processing...";

        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.textContent = "Processing...";
        }
    }

    // OTP REQUIRED
    else if (state === "OTP_REQUIRED") {
        confirmView.style.display = "none";
        resetView.style.display = "block";

        resetStatus.textContent = "Enter OTP to continue transfer (Check Your Email)";
        resetStatus.style.color = "#f59e0b";

        if (otpInput) {
            otpInput.disabled = false;
            otpInput.focus();
        }

        if (newPinInput) newPinInput.style.display = "none";
        if (resetBtn) resetBtn.disabled = false;
    }

    // RESET PIN
    else if (state === "RESET_PIN") {
        modal.style.display = "flex";

        confirmView.style.display = "none";
        resetView.style.display = "block";

        resetStatus.textContent = "Enter OTP and new PIN";
        resetStatus.style.color = "#64748b";

        if (otpInput) otpInput.disabled = false;
        if (newPinInput) {
            newPinInput.disabled = false;
            newPinInput.style.display = "block";
        }

        if (resetBtn) resetBtn.disabled = false;
    }

    // SENDING OTP
    else if (state === "SENDING_OTP") {
        modal.style.display = "flex";

        confirmView.style.display = "none";
        resetView.style.display = "block";

        resetStatus.textContent = "Sending OTP...";
        resetStatus.style.color = "#64748b";

        if (otpInput) otpInput.disabled = true;
        if (newPinInput) newPinInput.disabled = true;
        if (resetBtn) resetBtn.disabled = true;

        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.textContent = "Sending OTP...";
        }
    }

    // SUCCESS
    else if (state === "SUCCESS") {
        modal.style.display = "flex";

        confirmView.style.display = "block";
        resetView.style.display = "none";

        if (successIcon) successIcon.style.display = "flex";

        title.textContent = "Transfer Successful!";
        title.style.color = "#10b981";

        summary.textContent = `₦${currentTransaction.amount} sent to ${currentTransaction.recipient}`;
        status.textContent = "Transaction completed successfully";

        if (pinInput) pinInput.style.display = "none";
        if (forgotPin) forgotPin.style.display = "none";
        if (cancelBtn) cancelBtn.style.display = "none";

        if (confirmBtn) {
            confirmBtn.textContent = "Done";
            confirmBtn.disabled = false;
            confirmBtn.onclick = () => window.location.reload();
        }
    }

    else if (state === "SUCCESS_FULL") {
        modal.style.display = "flex";

        confirmView.style.display = "block";
        resetView.style.display = "none";

        if (successIcon) successIcon.style.display = "flex";

        title.textContent = "Transfer Successful!";
        title.style.color = "#10b981";

        summary.textContent = `${options.message}`;
        status.textContent = "Pin successfully updated";

        if (pinInput) pinInput.style.display = "none";
        if (forgotPin) forgotPin.style.display = "none";
        if (cancelBtn) cancelBtn.style.display = "none";

        if (confirmBtn) {
            confirmBtn.textContent = "Done";
            confirmBtn.disabled = false;
            confirmBtn.onclick = () => window.location.reload();
        }
    }

    // ERROR
    else if (state === "ERROR") {
        if (errorText) {
            errorText.textContent = options.message || "Something went wrong";
        }

        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.textContent = "Try Again";
        }
    }
}

function setupEventListeners() {
    // Main Action Button
    document.getElementById("sendMoney").addEventListener("click", async (e) => {
        e.preventDefault();
        if (!pinStatus) {
            // send an otp to the user to set a transaction pin and then show a modal to enter the otp and the new transaction pin and then update the transaction pin and then allow the user to continue with the transfer
            switchUI("SENDING_OTP");
            await requestPinResetOtp();
            return;
        }
        validateAndSendFunds();
    });

    // Transfer Type Toggles
    const radioButtons = document.querySelectorAll('input[name="transferType"]');
    radioButtons.forEach(button => {
        button.addEventListener('change', function () {
            // Update status based on ID
            sendFundsToStatus = this.id === "payueeTransfer" ? "payuee" : "paga";
            resetTransferForm();
            this.id === "payueeTransfer" ? enablePayueeDiv() : disablePayueeDiv();
        });
    });

    document.getElementById("submitTransactionPin").addEventListener("click", () => {
        const pin = document.getElementById("transactionPinInput").value.trim();

        if (pin.length !== 4) {
            switchUI("ERROR", { message: "Enter a valid 4-digit PIN" });
            return;
        }

        pincode = pin;

        sendFunds(currentTransaction.amount, currentTransaction.recipient);
    });

    document.getElementById("cancelTransactionPin").addEventListener("click", () => {
        document.getElementById("transactionPinModal").style.display = "none";
    });

    inputElement.addEventListener("input", function () {
        var inputValue = inputElement.value.trim();

        // Clear previous search options
        searchOptionsDiv.innerHTML = '';

        // Show search options if the input is not empty
        if (inputValue !== "") {
            // Mock search results
            var mockSearchResults = searchBanksByName(inputValue, banksData);

            // Create and append search options
            for (var i = 0; i < mockSearchResults.length; i++) {
                var option = document.createElement("a");
                option.href = "#";
                option.textContent = mockSearchResults[i].name;

                // Set data attributes
                option.setAttribute("data-name", mockSearchResults[i].name);
                option.setAttribute("data-code", mockSearchResults[i].sortCode);
                option.setAttribute("data-uuid", mockSearchResults[i].uuid);
                option.setAttribute("data-type", "nuban"); // Assuming all are Nigerian banks for this example
                option.setAttribute("data-currency", "NGN");

                searchOptionsDiv.appendChild(option);
            }

            // let's check if mockSearchResults is less than 1 so that we can trow an error
            if (mockSearchResults.length < 1) {
                var option = document.createElement("a");
                option.href = "#";
                option.textContent = "Bank Not Found";
                searchOptionsDiv.appendChild(option);
            }

            // Show search options
            searchOptionsDiv.style.display = "block";
        } else {
            // Hide search options if the input is empty
            searchOptionsDiv.style.display = "none";
        }
    });

    searchOptionsDiv.addEventListener("click", function (event) {
        event.preventDefault();
        var clickedOption = event.target;
        let name = clickedOption.dataset.name;
        let code = clickedOption.dataset.code;
        let type = clickedOption.dataset.type;
        let uuid = clickedOption.dataset.uuid;
        let currency = clickedOption.dataset.currency;

        sendFundsToStatus = "paga";
        BankCountryType = type;
        BankCode = code;
        Bank = name;
        BankUuid = uuid;

        // Check if the clicked element is an anchor tag
        if (clickedOption.tagName.toLowerCase() === 'a') {
            // Set input value with the selected bank's name
            inputElement.value = name;

            // Hide or remove the dropdown
            // searchOptionsDiv.innerHTML = ''; // Clear search options
            searchOptionsDiv.style.display = "none";

            // Get the input element
            const accountNumber = document.getElementById('AccountNumber').value;
            getAccountDetails(accountNumber);
        }

        // Use the retrieved values as needed

    });

    // Get the input element
    const accountNumberInput = document.getElementById('AccountNumber');

    if (accountNumberInput) {
        // Add an event listener for the 'input' event
        accountNumberInput.addEventListener('input', function () {
            // Get the current value of the input
            // Limit the input to a maximum of 10 digits
            const inputValue = this.value;
            if (inputValue.length > 10) {
                this.value = inputValue.slice(0, 10);
            }
            getAccountDetails(inputValue)
        });
    }

    // 1. Toggle to Reset View & Request OTP
    if (triggerForgotPinBtn) {
        triggerForgotPinBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await requestPinResetOtp();
        });
    }

    if (backToConfirmViewBtn) {
        // 2. Go back to the standard transfer view
        backToConfirmViewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchUI("PIN", currentTransaction);

            // Clear the reset fields
            otpInput.value = '';
            newPinInput.value = '';
            resetPinError.textContent = '';
        });
    }

    submitNewPinBtn = document.getElementById('submitNewPin');

    if (submitNewPinBtn) {
        // 3. Submit the new PIN
        submitNewPinBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const otp = otpInput.value.trim();
            const newPin = newPinInput.value.trim();

            if (flowState === "RESET_PIN") {
                if (otp.length !== 6 || newPin.length !== 4) {
                    resetPinError.textContent = "Invalid OTP or PIN";
                    return;
                }

                amount = parseFloat(document.getElementById("AmountToTransfer").value);

                if (isNaN(amount) || amount < 100) {
                    showError('amountToTransferError', "Min amount ₦100");
                    isValid = false;
                }

                if (isNaN(amount) || amount > 5000000) {
                    showError('amountToTransferError', "Max amount ₦5,000,000");
                    isValid = false;
                }

                pincode = newPin; // Update the global pincode variable with the new PIN
                SentOTP = otp; // Update the global SentOTP variable with the entered OTP

                await sendFunds(amount || 1, BankAccountName);
            }

            if (flowState === "OTP_REQUIRED") {
                if (otp.length !== 6) {
                    resetPinError.textContent = "OTP must be 6 digits";
                    return;
                }

                SentOTP = otp;

                sendFunds(currentTransaction.amount, currentTransaction.recipient);
            }
        });
    }

    // Input Restrictions
    setupInputValidation("AccountNumber", 10);
    setupInputValidation("AmountToTransfer", 9); // Max 999,999,999
    setupInputValidation("payueeAmount");
}

/**
 * 3. UI HELPERS & TOGGLES
 */
function setupInputValidation(id, limit = null) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (limit) value = value.slice(0, limit);
        e.target.value = value;
    });
}

function disablePayueeDiv() {
    toggleVisibility('payueeEmailDiv', false); // Disable these
    toggleVisibility('payueeAmountDiv', true);
    toggleVisibility('bankSearchDiv', true); // Enable these
    toggleVisibility('accountNumberDiv', false);
    toggleVisibility('bankAmountDiv', false);
}

function enablePayueeDiv() {
    toggleVisibility('payueeEmailDiv', true); // Enable these
    toggleVisibility('payueeAmountDiv', false);
    toggleVisibility('bankSearchDiv', false);   // Disable these
    toggleVisibility('accountNumberDiv', true);
    toggleVisibility('bankAmountDiv', true);
}

function toggleVisibility(id, shouldDisable) {
    const el = document.getElementById(id);
    if (shouldDisable) {
        el.classList.add('disabled');
        el.querySelectorAll('input').forEach(i => i.disabled = true);
    } else {
        el.classList.remove('disabled');
        el.querySelectorAll('input').forEach(i => i.disabled = false);
    }
}

/**
 * 4. VALIDATION & FLOW CONTROL
 */
function validateAndSendFunds() {
    let isValid = true;
    let amount = 0;
    let recipient = "";

    if (sendFundsToStatus === "payuee") {
        const email = document.getElementById("payueeEmailId").value.trim();
        amount = parseFloat(document.getElementById("payueeAmount").value);

        if (!isValidEmail(email)) {
            showError('emailError', "Valid email required");
            isValid = false;
        }
        if (isNaN(amount) || amount < 10) {
            showError('amountError', "Min amount ₦10");
            isValid = false;
        }
        recipient = email;
    } else {
        const accNo = document.getElementById("AccountNumber").value;
        amount = parseFloat(document.getElementById("AmountToTransfer").value);

        if (accNo.length !== 10 || !BankCode) {
            showError('accountNumberError', "Select bank and enter 10 digits");
            isValid = false;
        }
        if (isNaN(amount) || amount < 100) {
            showError('amountToTransferError', "Min amount ₦100");
            isValid = false;
        }

        if (isNaN(amount) || amount > 100000) {
            showError('amountToTransferError', "Max amount ₦100,000");
            isValid = false;
        }

        recipient = document.getElementById("userBankName").value || accNo;
    }

    if (isValid) {
        switchUI("PIN", { amount, recipient });
    }
}

/**
 * 5. API CALLS
 */
async function sendFunds(amount, recipient) {
    const currentFlow = flowState; // snapshot BEFORE UI change

    switchUI("PROCESSING");

    const payload = {
        ServiceID: "sendFunds",
        BankType: sendFundsToStatus === "payuee" ? "payuee" : "paga",
        EmailID: sendFundsToStatus === "payuee" ? document.getElementById("payueeEmailId").value.trim() : "",
        Amount: parseFloat(amount),
        AccountNumber: sendFundsToStatus === "paga" ? document.getElementById("AccountNumber").value : "",
        BankCode: BankCode,
        BankUuid: BankUuid,
        Currency: Currency,
        TranCharge: 0,
        AccountName: BankAccountName,
        Description: "",
    };

    const pin = document.getElementById("transactionPinInput").value.trim();

    if (pin.length !== 4) {
        switchUI("ERROR", { message: "Enter a valid 4-digit PIN" });
        return;
    }

    // CONDITIONAL PAYLOAD PROPERTIES BASED ON FLOW STATE
    if (currentFlow === "PIN") {
        payload.Pin = pin;
    }

    if (currentFlow === "OTP_REQUIRED") {
        payload.Pin = pincode;
        payload.SentOTP = SentOTP;
    }

    if (currentFlow === "RESET_PIN") {
        payload.Pin = newPinInput.value.trim();
        payload.SentOTP = otpInput.value.trim();
        newPinInput.style.display = "block";
        payload.Action = "reset_pin";
    }

    try {
        const response = await fetch("https://api.payuee.com/send-money", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            const msg = data.error || "";

            if (msg === "No Authentication cookie found" || msg === "Unauthorized attempt! JWT's not valid!" 
                || msg === "No Refresh cookie found"
                || msg === "account suspended due to too many invalid PIN attempts. please contact support to resolve this issue"
            ) {
                // let's log user out the users session has expired
                logUserOutIfTokenIsExpired();
            }

            // CASE 1: OTP REQUIRED
            if (msg.toLowerCase().includes("otp")) {
                switchUI("OTP_REQUIRED");
                await requestPinResetOtp();
                return;
            }

            // NORMAL ERROR
            switchUI("ERROR", { message: msg || "Transaction failed" });
            return;
        }

        if (data.success === "transfer limit reached. please verify with OTP to continue making transfers"
            || data.success === "OTP verification required for transfers above 100. please verify with OTP to continue"
            || data.success === "for transfers above 5 million, require OTP or manual review"
        ) {
            switchUI("OTP_REQUIRED");
            await requestPinResetOtp();
        }

        // CASE 2: PIN RESET SUCCESS (your backend mistake)
        if ((data.success + "").toLowerCase().includes("pin reset successful")) {
            switchUI("SUCCESS_FULL", { message: data.success });
            setTimeout(() => {
                switchUI("PIN", {
                    amount: amount,
                    recipient: BankAccountName
                });
            }, 3000);
            return;
        } else {
            const balanceEl = document.getElementById("wallet_balance");
            const rawBalance = data.success !== undefined ? data.success : 0;
            const balance = Number(rawBalance);

            if (balanceEl) {
                balanceEl.textContent = new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                    minimumFractionDigits: 2
                }).format(balance);
            }
            // ✅ SUCCESS LOGIC
            switchUI("SUCCESS", { amount, recipient: BankAccountName, message: `₦${amount} sent successfully!` });
        }

    } catch (error) {
        switchUI("ERROR", { message: error });
    } finally {
        reactivateButtonStyles();
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(id, message, duration = 5000) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, duration);
}

function handleApiError(errorData, amount) {
    if (errorData.error === 'insufficient funds') {
        returnedErrorMessageDisplay2(`Sorry, you don't have up to ₦${amount} in your account`);
    } else {
        returnedErrorMessageDisplay(errorData.error || 'An error occurred. Please try again.');
    }
}

function resetTransferForm() {
    BankCode = "";
    Bank = "";
    GetName = 0;
    document.getElementById("sendMoneyForm").reset();
    document.getElementById("userBankName").value = "";
    // Hide all error messages
    document.querySelectorAll('.text-danger').forEach(el => el.textContent = '');
}

function returnedErrorMessageDisplay(errorMessage) {
    const installPopup = document.getElementById('error-popup');
    const cancelButton = document.getElementById('cancel-btn2');
    const returnedEmailID = document.getElementById('returnedEmailID');

    returnedEmailID.textContent = errorMessage;

    installPopup.style.display = 'block';

    // Cancel button click event
    cancelButton.addEventListener('click', () => {
        installPopup.style.display = 'none';
    });
}

function returnedErrorMessageDisplay2(errorMessage) {
    const installPopup = document.getElementById('error-popup3');
    const cancelButton = document.getElementById('cancel-btn3');
    const returnedEmailID = document.getElementById('returnedEmailID3');

    returnedEmailID.textContent = errorMessage; // Display the error message

    installPopup.style.display = 'block'; // Show the popup

    // Cancel button click event
    cancelButton.addEventListener('click', () => {
        // Redirect to the Fund Wallet page
        window.location.href = '/fund-wallet'; // Replace with the actual URL of the Fund Wallet page
    });
}

// Add this function to remove onclick and on hover styles
function deactivateButtonStyles() {
    var resendButton = document.getElementById('sendMoney');
    resendButton.classList.add('deactivated'); // Add a class to the button
}

// Add this function to reactivate the button styles
function reactivateButtonStyles() {
    var resendButton = document.getElementById('sendMoney');
    resendButton.classList.remove('deactivated');
}

// Function to search for banks by name
function searchBanksByName(query, banksData) {
    query = query.toLowerCase().trim();
    return (banksData || []).filter(bank => bank.name.toLowerCase().includes(query));
}

async function loadBankCodes() {
    try {
        // const response = await fetch('bankCodes.json');
        const response = await fetch('bankCodes2.json');
        const data = await response.json();
        banksData = data.banks; // Store the loaded data
    } catch (error) {
        console.error('Error loading JSON:', error);
    }

    // const apiUrl = "https://api.payuee.com/get-bank-list";

    // try {
    //     const response = await fetch(apiUrl, {
    //         method: "GET",
    //         credentials: "include",
    //         headers: { "Content-Type": "application/json" }
    //     });

    //     // 1. Check if the network request actually worked
    //     if (!response.ok) {
    //         console.error(`HTTP Error: ${response.status}`);
    //         return;
    //     }

    //     const data = await response.json();
    //     // banksData = data.success.bank; // Store the loaded data

    //     // 2. Handle Authentication Errors immediately
    //     if (data.error) {
    //         const authErrors = ['No Authentication cookie found', "Unauthorized attempt! JWT's not valid!", "No Refresh cookie found"];
    //         if (authErrors.includes(data.error)) {
    //             return logUserOutIfTokenIsExpired();
    //         }
    //         console.warn("API Error:", data.error);
    //         return;
    //     }
    // } catch (error) {
    //     console.error("Critical error loading wallet:", error);
    // }
}

function fillInTheAccountName(accountName) {
    BankAccountName = accountName;
    const userBankName = document.getElementById('userBankName');
    userBankName.value = accountName;
}

let debounceTimer;

function getAccountDetails(inputValue) {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {

        if (!inputValue || inputValue.length !== 10 || !BankCode) return;

        fillInTheAccountName("Verifying...");

        const payload = {
            ServiceID: "sendFunds",
            BankType: sendFundsToStatus === "payuee" ? "payuee" : "paga",
            EmailID: sendFundsToStatus === "payuee"
                ? document.getElementById("payueeEmailId").value.trim()
                : "",
            Amount: 99.00,
            AccountNumber: sendFundsToStatus === "paga"
                ? document.getElementById("AccountNumber").value
                : "",
            BankCode: BankCode,
            BankUuid: BankUuid,
            Pin: pincode,
            SentOTP: SentOTP,
            Currency: Currency,
            TranCharge: 0,
            AccountName: "Verify Bank Details",
            Description: ""
        };

        fetch(`https://api.payuee.com/verify-bank-details`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {

                if (!data.success) {
                    fillInTheAccountName("Verification failed");
                    return;
                }

                if (data.success.responseCode !== 0) {
                    fillInTheAccountName("Invalid Bank Details");
                    return;
                }

                BankAccountName =
                    data.success.DestinationAccountHolderNameAtBank ||
                    data.success.destinationAccountHolderNameAtBank;

                document.getElementById('accountNameDiv').classList.remove('disabled');
                fillInTheAccountName(BankAccountName || "Invalid Bank Details");
            })
            .catch(err => {
                console.error(err);
                fillInTheAccountName("Network error");
            });

    }, 500);
}

async function logUserOutIfTokenIsExpired() {
    const apiUrl = "https://api.payuee.com/log-out";
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
    };

    try {
        await fetch(apiUrl, requestOptions); // Await the fetch!
    } catch (error) {
        console.error("Logout request failed", error);
    } finally {
        localStorage.removeItem('auth');
        window.location.href = '../pay.html';
    }
}

async function loadWalletBalance() {
    const apiUrl = "https://api.payuee.com/get-wallet-balance";
    const balanceEl = document.getElementById("wallet_balance");
    const pinStatusEl = document.getElementById("transactionPinStatus");

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });

        // 1. Check if the network request actually worked
        if (!response.ok) {
            console.error(`HTTP Error: ${response.status}`);
            return;
        }

        const data = await response.json();
        // console.log("Wallet Data Received:", data); // Check your console!

        // 2. Handle Authentication Errors immediately
        if (data.error) {
            const authErrors = ['No Authentication cookie found', "Unauthorized attempt! JWT's not valid!", "No Refresh cookie found"];
            if (authErrors.includes(data.error)) {
                return logUserOutIfTokenIsExpired();
            }
            console.warn("API Error:", data.error);
            return;
        }

        // 3. Process the Balance
        // We use a fallback of 0 if the field is missing or null
        const rawBalance = data.wallet_balance !== undefined ? data.wallet_balance : 0;
        const balance = Number(rawBalance);

        if (balanceEl) {
            balanceEl.textContent = new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN',
                minimumFractionDigits: 2
            }).format(balance);
        } else {
            console.error("Element #wallet_balance not found in HTML");
        }

        pinStatus = data.pin_set;

        // 4. Update PIN Status
        if (pinStatusEl) {
            pinStatusEl.textContent = data.pin_set
                ? "Enter your 4-digit Transaction PIN"
                : "Please set a Transaction PIN to continue";

            // Optional: Add a class for styling based on status
            pinStatusEl.classList.toggle('text-success', data.pin_set);
            pinStatusEl.classList.toggle('text-warning', !data.pin_set);
        }

    } catch (error) {
        console.error("Critical error loading wallet:", error);
    }
}

function restrictPinInput(inputElement, maxLength) {
    if (!inputElement) return; // ✅ prevent crash

    inputElement.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "");

        if (this.value.length > maxLength) {
            this.value = this.value.slice(0, maxLength);
        }
    });
}

async function requestPinResetOtp() {
    switchUI("SENDING_OTP");

    try {
        // Automatically request OTP from your backend
        const response = await fetch("https://api.payuee.com/request-pin-reset-otp", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: 'include' // Uses active session/cookies
        });

        const data = await response.json();

        if (data.success) {
            switchUI("RESET_PIN");
        } else {
            throw new Error("Failed to send OTP");
        }
    } catch (error) {
        switchUI("ERROR", { message: "Failed to send OTP" });
    }
}

async function logUserOutIfTokenIsExpired() {
    const apiUrl = "https://api.payuee.com/log-out";
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include', // Include cookies with the request
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            showToastMessageE('An error occurred while logging out.');
            return;
        }

        // Clear auth data and redirect to login page
        localStorage.removeItem('auth');
        // Get the full URL of the current page
        const fullUrl = window.location.href;

        let fullUrl2 = window.location.href; // Get the current full URL
        let baseUrl = fullUrl2.split('?')[0].split('#')[0]; // Remove query and fragment parts
        
        // Adjust to get the base part, which includes the protocol, domain, and '/store/'
        baseUrl = baseUrl.split('/').slice(0, 4).join('/') + '/'; 
        
        // console.log(baseUrl); // Outputs: "https://payuee.com/store/"


        if (baseUrl == "https://payuee.com/store/") {
            // Replace '/store/' with '/store/v/' to update the URL
            let newUrl = fullUrl.replace('/store/', '/store/v/');
            location.replace(newUrl);
            return;
        } else {
            // Redirect to the login/register page with the current URL as the redirectTo parameter
            location.replace(`https://payuee.com/e-shop/v/login_register?redirectTo=${encodeURIComponent(fullUrl)}`);
        }

    } catch (error) {
        console.error("Error during logout:", error);
        showToastMessageE("Failed to log out. Please try again.");
    }
}