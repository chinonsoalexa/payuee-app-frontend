// document.addEventListener('DOMContentLoaded', function() {
var transID
document.addEventListener('DOMContentLoaded', async function () {
    const apiUrl = "https://api.payuee.com/payuee/get-latest-transaction";

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
            const errorData = await response.json();

            // console.log(errorData);

            if (errorData.error === 'failed to get user from request') {
                // need to do a data of just null event 
                displayErrorMessage();
            } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!") {
                // let's log user out the users session has expired
                logUserOutIfTokenIsExpired();
            }else {
                displayErrorMessage();
            }

            return;
        }

        const responseData = await response.json();
        getSuccessMessage(responseData);
        transID = responseData.success.transaction_id;
    } finally {

    }
});

function getSuccessMessage(transactionDetails) {
    var payment_condition = document.getElementById('payment_condition');
    var payment_display_message = document.getElementById('payment_display_message');
    var available_balance = document.getElementById('available_balance');
    
    let availableBalanceString = transactionDetails.balance;
    
    if (transactionDetails.success.transaction_status === "success") {
        // let's change to payment unsuccessful
        payment_condition.textContent = 'Transaction Successful'

        payment_display_message.textContent = 'Congratulations! Your Transaction is Successfully Processed!'
    } else {
        displayErrorMessage(formatNumberToNaira(availableBalanceString));
    }
    // Access balance directly
    available_balance.textContent = formatNumberToNaira(availableBalanceString);
    
    let serviceType = transactionDetails.success.service_type;

    switch (serviceType) {
    // airtime field from response
    // let's enable the airtime field
    case "airtime":
    enableDiv('airtime-section');
    // airtime fields
    let transaction_id = document.getElementById('transaction_id');
    let transaction_date = document.getElementById('transaction_date');
    let transaction_amount = document.getElementById('transaction_amount');
    let service_name = document.getElementById('service_name');
    let transaction_method = document.getElementById('transaction_method');
    let transaction_status = document.getElementById('transaction_status');
    let users_name = document.getElementById('users_name');
    let recharged_number = document.getElementById('recharged_number');
    let airtime_type = document.getElementById('airtime_type');    

    // Access properties within the success object using dot notation
    transaction_id.textContent = transactionDetails.success.transaction_id;
    // Parse the timestamp string
    let parsedTimestamp = new Date(transactionDetails.success.paid_at);
    transaction_date.textContent = parsedTimestamp.toLocaleString(); // Adjust the format as needed
    let transactionAmountString = transactionDetails.success.amount;
    transaction_amount.textContent = formatNumberToNaira(transactionAmountString);
    service_name.textContent = transactionDetails.success.service_type;
    transaction_method.textContent = transactionDetails.success.transaction_type;
    users_name.textContent = transactionDetails.success.user_name;
    transaction_status.textContent = transactionDetails.success.transaction_status;
    airtime_type.textContent = transactionDetails.service.airtime_type;
    recharged_number.textContent = transactionDetails.service.mobile_number;
    let airtimeBackLink = document.getElementById('backLink');
    airtimeBackLink.href = "airtime.html"; // Let's redirect back to transaction page
    break;
    case "data":
        enableDiv('data-section');
         // data fields
        let data_transaction_id = document.getElementById('data_transaction_id');
        let data_transaction_date = document.getElementById('data_transaction_date');
        let data_transaction_amount = document.getElementById('data_transaction_amount');
        let data_service_name = document.getElementById('data_service_name');
        let data_transaction_method = document.getElementById('data_transaction_method');
        let data_transaction_status = document.getElementById('data_transaction_status');
        let data_users_name = document.getElementById('data_users_name');
        let data_recharged_number = document.getElementById('data_recharged_number');
        let data_network_plan = document.getElementById('data_network_plan');
        let data_bundle = document.getElementById('data_bundle');
        let data_auto_renew = document.getElementById('data_auto_renew');
        // Access properties within the success object using dot notation
        data_transaction_id.textContent = transactionDetails.success.transaction_id;
        // Parse the timestamp string
        let dataParsedTimestamp = new Date(transactionDetails.success.paid_at);
        data_transaction_date.textContent = dataParsedTimestamp.toLocaleString(); // Adjust the format as needed
        let dataTransactionAmountString = transactionDetails.success.amount;
        data_transaction_amount.textContent = formatNumberToNaira(dataTransactionAmountString);
        data_service_name.textContent = transactionDetails.success.service_type;
        data_transaction_method.textContent = transactionDetails.success.transaction_type;
        data_transaction_status.textContent = transactionDetails.success.transaction_status;
        data_users_name.textContent = transactionDetails.success.user_name;
        data_network_plan.textContent = transactionDetails.service.network_plan;
        data_recharged_number.textContent = transactionDetails.service.phone_number;
        data_bundle.textContent = transactionDetails.service.bundle;
        data_auto_renew.textContent = transactionDetails.service.auto_renew;
        let dataBackLink = document.getElementById('backLink');
        dataBackLink.href = "data.html"; // Let's redirect back to transaction page
        break;
    case "rechargePin":
        enableDiv('rechage-pin-section');
            // data fields
        let recharge_pin_transaction_id = document.getElementById('recharge_pin_transaction_id');
        let recharge_pin_transaction_date = document.getElementById('recharge_pin_transaction_date');
        let recharge_pin_transaction_amount = document.getElementById('recharge_pin_transaction_amount');
        let recharge_pin_purchased_pin = document.getElementById('recharge_pin_purchased_pin');
        let recharge_pin_transaction_method = document.getElementById('recharge_pin_transaction_method');
        let recharge_pin_transaction_status = document.getElementById('recharge_pin_transaction_status');
        let recharge_pin_users_name = document.getElementById('recharge_pin_users_name');
        let recharge_pin_number = document.getElementById('recharge_pin_number');
        let recharge_pin_value = document.getElementById('recharge_pin_value');
        let recharge_pin_network_type = document.getElementById('recharge_pin_network_type');
        // Access properties within the success object using dot notation
        console.log(transactionDetails);
        recharge_pin_transaction_id.textContent = transactionDetails.success.transaction_id;
        // Parse the timestamp string
        let rechargePinDataParsedTimestamp = new Date(transactionDetails.success.paid_at);
        recharge_pin_transaction_date.textContent = rechargePinDataParsedTimestamp.toLocaleString(); // Adjust the format as needed
        recharge_pin_transaction_amount.textContent = formatNumberToNaira(transactionDetails.success.amount);
        // recharge_pin_service_name.textContent = transactionDetails.success.service_type;
        recharge_pin_transaction_method.textContent = transactionDetails.success.transaction_type;
        recharge_pin_transaction_status.textContent = transactionDetails.success.transaction_status;
        recharge_pin_users_name.textContent = transactionDetails.success.user_name;
        recharge_pin_network_type.textContent = transactionDetails.service.RechargePinDetails.network;
        recharge_pin_number.textContent = transactionDetails.service.RechargePinDetails.number_of_pin;
        recharge_pin_value.textContent = transactionDetails.service.RechargePinDetails.value;
        recharge_pin_purchased_pin.addEventListener('click', function(event) {
            // Prevent the default behavior (in this case, the redirect)
            event.preventDefault();
            // console.log('this are the pin click event: ', transactionDetails.service.Pins);
            showCardPin(transactionDetails.service.Pins);
        })
        let rechargePinBackLink = document.getElementById('backLink');
        rechargePinBackLink.href = "recharge-pin.html"; // Let's redirect back to transaction page
        break;
    case "educationalPayment":
        enableDiv('educational-payments-section');
        // airtime fields
        let education_transaction_id = document.getElementById('education_transaction_id');
        let education_transaction_date = document.getElementById('education_transaction_date');
        let education_transaction_amount = document.getElementById('education_transaction_amount');
        let education_transaction_method = document.getElementById('education_transaction_method');
        let education_transaction_status = document.getElementById('education_transaction_status');
        let education_users_name = document.getElementById('education_users_name');
        let education_recharged_number = document.getElementById('education_recharged_number');
        // Access properties within the success object using dot notation
        education_transaction_id.textContent = transactionDetails.success.transaction_id;
        // Parse the timestamp string
        let educationParsedTimestamp = new Date(transactionDetails.success.paid_at);
        education_transaction_date.textContent = educationParsedTimestamp.toLocaleString(); // Adjust the format as needed
        let educationTransactionAmountString = transactionDetails.success.amount;
        education_transaction_amount.textContent = formatNumberToNaira(educationTransactionAmountString);
        // education_service_name.textContent = transactionDetails.success.service_type;
        education_transaction_method.textContent = transactionDetails.success.transaction_type;
        education_users_name.textContent = transactionDetails.success.user_name;
        education_transaction_status.textContent = transactionDetails.success.transaction_status;
        education_recharged_number.textContent = transactionDetails.service.phone_number;
        let educationalPaymentPinBackLink = document.getElementById('backLink');
        educationalPaymentPinBackLink.href = "educational-payments.html"; // Let's redirect back to transaction page
        break;
    case "decoder":
        enableDiv('decoder-section');
        console.log(transactionDetails);
            // data fields
        let decoder_transaction_id = document.getElementById('decoder_transaction_id');
        let decoder_transaction_date = document.getElementById('decoder_transaction_date');
        let decoder_transaction_amount = document.getElementById('decoder_transaction_amount');
        // let decoder_service_name = document.getElementById('data_service_name');
        let decoder_transaction_method = document.getElementById('decoder_transaction_method');
        let decoder_transaction_status = document.getElementById('decoder_transaction_status');
        let decoder_users_name = document.getElementById('decoder_users_name');
        let decoder_recharged_number = document.getElementById('decoder_recharged_number');
        let decoder_operator = document.getElementById('decoder_operator');
        let decoder_plan = document.getElementById('decoder_plan');
        let decoder_auto_renew = document.getElementById('decoder_auto_renew');
        // Access properties within the success object using dot notation
        decoder_transaction_id.textContent = transactionDetails.success.transaction_id;
        // Parse the timestamp string
        let decoderParsedTimestamp = new Date(transactionDetails.success.paid_at);
        decoder_transaction_date.textContent = decoderParsedTimestamp.toLocaleString(); // Adjust the format as needed
        decoder_transaction_amount.textContent = formatNumberToNaira(transactionDetails.success.amount);
        // data_service_name.textContent = transactionDetails.success.service_type;
        decoder_transaction_method.textContent = transactionDetails.success.transaction_type;
        decoder_transaction_status.textContent = transactionDetails.success.transaction_status;
        decoder_users_name.textContent = transactionDetails.success.user_name;
        decoder_operator.textContent = transactionDetails.service.service_id;
        decoder_recharged_number.textContent = transactionDetails.service.phone_number;
        decoder_plan.textContent = transactionDetails.service.plan;
        decoder_auto_renew.textContent = transactionDetails.service.auto_renew;
        let decoderBackLink = document.getElementById('backLink');
        decoderBackLink.href = "tv.html"; // Let's redirect back to transaction page
        break;
    case "electricity":
        enableDiv('electricity-section');
        // console.log(transactionDetails);
            // data fields
        let electric_transaction_id = document.getElementById('electric_transaction_id');
        let electric_transaction_date = document.getElementById('electric_transaction_date');
        let electric_transaction_amount = document.getElementById('electric_transaction_amount');
        // let electric_service_name = document.getElementById('electric_service_name');
        let electric_transaction_method = document.getElementById('electric_transaction_method');
        let electric_transaction_status = document.getElementById('electric_transaction_status');
        let electric_users_name = document.getElementById('electric_users_name');
        let electric_recharged_number = document.getElementById('electric_recharged_number');
        let electric_region = document.getElementById('electric_region');
        let electric_meter_number = document.getElementById('electric_meter_number');
        let electric_auto_renew = document.getElementById('electric_auto_renew');
        let electric_meter_token = document.getElementById('electric_meter_token');
        let electric_meter_units = document.getElementById('electric_meter_units');
        // Access properties within the success object using dot notation
        electric_transaction_id.textContent = transactionDetails.success.transaction_id;
        // Parse the timestamp string
        let electricParsedTimestamp = new Date(transactionDetails.success.paid_at);
        electric_transaction_date.textContent = electricParsedTimestamp.toLocaleString(); // Adjust the format as needed
        electric_transaction_amount.textContent = formatNumberToNaira(transactionDetails.success.amount);
        // data_service_name.textContent = transactionDetails.success.service_type;
        electric_transaction_method.textContent = transactionDetails.success.transaction_type;
        electric_transaction_status.textContent = transactionDetails.success.transaction_status;
        electric_users_name.textContent = transactionDetails.success.user_name;
        electric_region.textContent = transactionDetails.service.region;
        electric_recharged_number.textContent = transactionDetails.service.phone_number;
        electric_meter_number.textContent = transactionDetails.service.meter_number;
        electric_meter_token.textContent = transactionDetails.service.token;
        electric_meter_units.textContent = transactionDetails.service.units;
        electric_auto_renew.textContent = transactionDetails.service.auto_renew;
        let electricityBackLink = document.getElementById('backLink');
        electricityBackLink.href = "electricity.html"; // Let's redirect back to transaction page
        break;
    case "fundWallet":
        enableDiv('fund-wallet-section');
        // console.log(transactionDetails);
            // data fields
        let fund_wallet_transaction_id = document.getElementById('fund_wallet_transaction_id');
        let fund_wallet_transaction_date = document.getElementById('fund_wallet_transaction_date');
        let fund_wallet_transaction_amount = document.getElementById('fund_wallet_transaction_amount');
        let fund_wallet_transaction_method = document.getElementById('fund_wallet_transaction_method');
        let fund_wallet_transaction_status = document.getElementById('fund_wallet_transaction_status');
        let fund_wallet_users_name = document.getElementById('fund_wallet_users_name');
        // Access properties within the success object using dot notation
        fund_wallet_transaction_id.textContent = transactionDetails.success.transaction_id;
        // Parse the timestamp string
        let fundWalletParsedTimestamp = new Date(transactionDetails.success.paid_at);
        fund_wallet_transaction_date.textContent = fundWalletParsedTimestamp.toLocaleString(); // Adjust the format as needed
        fund_wallet_transaction_amount.textContent = formatNumberToNaira(transactionDetails.success.amount);
        fund_wallet_transaction_method.textContent = transactionDetails.success.transaction_type;
        fund_wallet_transaction_status.textContent = transactionDetails.success.transaction_status;
        fund_wallet_users_name.textContent = transactionDetails.success.user_name;
        let fundWalletBackLink = document.getElementById('backLink');
        fundWalletBackLink.href = "fund-wallet.html"; // Let's redirect back to transaction page
        break;
    case "sendFunds":
    if (transactionDetails.success.transaction_type == "wallet"){
        enableDiv('send-funds-section');
        // send fund fields
        let send_funds_transaction_id = document.getElementById('send_funds_transaction_id');
        let send_funds_transaction_date = document.getElementById('send_funds_transaction_date');
        let send_funds_transaction_method = document.getElementById('send_funds_transaction_method');
        let send_funds_transaction_status = document.getElementById('send_funds_transaction_status');
        let send_funds_receivers_email = document.getElementById('send_funds_receivers_email');
        let send_funds_senders_name = document.getElementById('send_funds_senders_name');
        let send_funds_service_name = document.getElementById('send_funds_service_name');
        let send_funds_transaction_amount = document.getElementById('send_funds_transaction_amount');
        // Access properties within the success object using dot notation
        send_funds_transaction_id.textContent = transactionDetails.success.transaction_id;
        // Parse the timestamp string
        let sendFundsParsedTimestamp = new Date(transactionDetails.success.paid_at);
        send_funds_transaction_date.textContent = sendFundsParsedTimestamp.toLocaleString(); // Adjust the format as needed
        send_funds_transaction_method.textContent = transactionDetails.success.transaction_type;
        send_funds_transaction_status.textContent = transactionDetails.success.transaction_status;
        send_funds_receivers_email.textContent = transactionDetails.service.email_id;
        send_funds_senders_name.textContent = transactionDetails.success.user_name;
        send_funds_service_name.textContent = "send funds";
        send_funds_transaction_amount.textContent = formatNumberToNaira(transactionDetails.success.amount);
        let sendFundsBackLink = document.getElementById('backLink');
        sendFundsBackLink.href = "send-funds.html"; // Let's redirect back to transaction page
    } else {
        
    }
    break;

    default:
    let availableBalanceString = transactionDetails.balance;
    displayErrorMessage(formatNumberToNaira(availableBalanceString));
    break;
    }
}

function displayErrorMessage(balance) {
    document.getElementById('data-section').classList.add('disabled');
    document.getElementById('data-section').disabled = true;
    var payment_icon_color = document.getElementById('payment_icon_color');
    var payment_condition = document.getElementById('payment_condition');
    var payment_display_message = document.getElementById('payment_display_message');
    var available_balance = document.getElementById('available_balance');
    var transaction_status = document.getElementById('transaction_status');
    var transaction_small_status = document.getElementById('transaction_small_status');
    // let's change the error icon color to red
    // Remove the existing class
    payment_icon_color.classList.remove("icon");

    //  let's change the icon to an error icon
    // Get the element by its id
    var iconElement = document.getElementById("change_icon_type");

    // Change the text content
    iconElement.textContent = "clear";

    // Add a new class
    payment_icon_color.classList.add("icon_color");

    // let's change to payment unsuccessful
    payment_condition.textContent = 'Transaction Unsuccessful'

    payment_display_message.textContent = 'Your Transaction Failed, Please Try Again!'
    // Access balance directly
    available_balance.textContent = balance;
    
    transaction_status.textContent = 'failed';
    transaction_small_status.textContent = 'Failed';
}

function formatNumberToNaira(number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(number);
}

function enableDiv(id) {
    document.getElementById(id).classList.remove('disabled');
    document.getElementById(id).disabled = false;
}

function showCardPin(serverData) {
    const cardPopup = document.getElementById('card-popup');
    const cancelBtn = document.getElementById('cancel-btn');
    const copyBtn = document.getElementById('copy-btn');
    const cardList = document.getElementById('card-list');

    // Function to dynamically insert items into the list
    const populateCardList = (data) => {
        // Clear existing items
        cardList.innerHTML = '';

        // Insert items from the serverData
        data.forEach((item) => {
            const listItem = document.createElement('li');
            listItem.textContent = item.pin;
            cardList.appendChild(listItem);
        });
    };

    // Function to copy the content of the list
    const copyContent = () => {
        const contentToCopy = Array.from(cardList.children).map(item => item.textContent).join('\n');

        // Create a temporary textarea to copy the content
        const textarea = document.createElement('textarea');
        textarea.value = contentToCopy;
        document.body.appendChild(textarea);

        // Select and copy the content
        navigator.clipboard.writeText(contentToCopy)
        .then(() => {
            // Success
            copyBtn.textContent = 'Copied';
        })
        .catch((err) => {
            // Handle error
            copyBtn.textContent = 'error...';
        });
    };

    // Event listener for the Copy button
    copyBtn.addEventListener('click', copyContent);

    // Show the popup and populate the list
    const showPopup = () => {
        cardPopup.style.display = 'block';
        populateCardList(serverData);
    };

    // Close the popup
    const closePopup = () => {
        cardPopup.style.display = 'none';
    };

    // Event listener for the Close button
    cancelBtn.addEventListener('click', closePopup);

    // Event listener for showing the popup (you can call this function when needed)
    // For example, call showPopup() when the server responds with insufficient funds
    // For demonstration purposes, I'm calling it after 2 seconds here
    setTimeout(showPopup, 0);
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

        // const data = response.json();
        localStorage.removeItem('auth')
        window.location.href = '../index.html'
    } finally{
        // do nothing
    }
}

document.getElementById('download_receipt').addEventListener('click', function(event) {
    event.preventDefault();
    downloadReceipt();
});

function downloadReceipt() {
    // Create a new element to contain the content to be included in the PDF
    var pdfContentElement = document.createElement('div');

    // Copy the content you want to include to the new element
    var successReceiptElement = document.getElementById('successReceipt');
    var clonedSuccessReceipt = successReceiptElement.cloneNode(true); // Clone with children
    pdfContentElement.appendChild(clonedSuccessReceipt);

    // Optionally, you can remove specific elements you want to exclude
    var elementsToExclude = pdfContentElement.querySelectorAll('.available__balance, .order__button, #footer-download-section');
    elementsToExclude.forEach(function(element) {
        element.remove();
    });

    // Create the company logo element dynamically
    var companyLogoElement = document.createElement('img');
    companyLogoElement.src = 'assets/img/logo/favicon2.png';  // Set the path or base64 data for your logo
    companyLogoElement.alt = 'Payuee';
    companyLogoElement.style.position = 'absolute';
    companyLogoElement.style.top = '50%'; // Force the logo to start from the top
    companyLogoElement.style.left = '50%';
    // companyLogoElement.style.transform = 'translateX(-50%)'; // Center the logo horizontally
    companyLogoElement.style.opacity = '0.5'; // Set opacity to 0.5 (50% transparency)
    pdfContentElement.appendChild(companyLogoElement); 

    var options = {
        filename: 'Payuee Receipt ' + transID+ '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
    };  // Use default options

    // Generate the PDF using html2pdf library
    html2pdf().from(pdfContentElement).set(options).save();
}
