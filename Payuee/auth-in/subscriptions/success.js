window.onload = async function () {
    const apiUrl = "https://payuee.onrender.com/payuee/get-latest-transaction";

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

            console.log(errorData);

            if (errorData.error === 'failed to get user from request') {
                // need to do a data of just null event 
                displayErrorMessage();
            } else {
                displayErrorMessage();
            }

            return;
        }

        const responseData = await response.json();
        getSuccessMessage(responseData)
    } finally {

    }
}

function getSuccessMessage(transactionDetails) {
    var payment_condition = document.getElementById('payment_condition');
    var payment_display_message = document.getElementById('payment_display_message');
    var available_balance = document.getElementById('available_balance');
    // var recharged_number;
    // var airtime_type;
    // var data_recharged_number;
    
    // let's change to payment unsuccessful
    payment_condition.textContent = 'Transaction Successful'

    payment_display_message.textContent = 'Congratulations! Your Transaction is Successfully Processed!'

    // Access balance directly
    let availableBalanceString = transactionDetails.balance;
    available_balance.textContent = formatNumberToNaira(availableBalanceString);
    
    let serviceType = transactionDetails.success.service_type;

    switch (serviceType) {
    // airtime field from response
    // let's enable the airtime field
    case "airtime":
    // document.getElementById('airtime-section').classList.remove('disabled');
    // document.getElementById('airtime-section').disabled = false;
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
        let recharge_pin_network_plan = document.getElementById('recharge_pin_network_plan');
        let recharge_pin_bundle = document.getElementById('recharge_pin_bundle');
        let recharge_pin_auto_renew = document.getElementById('recharge_pin_auto_renew');
        // Access properties within the success object using dot notation
        recharge_pin_transaction_id.textContent = transactionDetails.success.transaction_id;
        // Parse the timestamp string
        let rechargePinDataParsedTimestamp = new Date(transactionDetails.success.paid_at);
        recharge_pin_transaction_date.textContent = rechargePinDataParsedTimestamp.toLocaleString(); // Adjust the format as needed
        let rechargePinDataTransactionAmountString = transactionDetails.success.amount;
        recharge_pin_transaction_amount.textContent = formatNumberToNaira(rechargePinDataTransactionAmountString);
        // recharge_pin_service_name.textContent = transactionDetails.success.service_type;
        recharge_pin_transaction_method.textContent = transactionDetails.success.transaction_type;
        recharge_pin_transaction_status.textContent = transactionDetails.success.transaction_status;
        recharge_pin_users_name.textContent = transactionDetails.success.user_name;
        recharge_pin_network_plan.textContent = transactionDetails.service.network;
        recharge_pin_number.textContent = transactionDetails.service.number_of_pin;
        recharge_pin_value.textContent = transactionDetails.service.value;
        recharge_pin_bundle.textContent = transactionDetails.service.bundle;
        recharge_pin_auto_renew.textContent = transactionDetails.service.auto_renew;
        recharge_pin_purchased_pin.addEventListener('click', function(event) {
            // Prevent the default behavior (in this case, the redirect)
            event.preventDefault();
            showCardPin(transactionDetails.Pins);
        })

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
    var transaction_id = document.getElementById('transaction_id');
    var transaction_date = document.getElementById('transaction_date');
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

    // Access properties within the success object using dot notation
    transaction_id.textContent = 'NA';

    transaction_date.textContent = 'NA'; // Adjust the format as needed
    
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

    // Example data from the server
    // const serverData = [14343545334223230, 14343545334223230, 14343545334223230, 14343545334223230, 14343545334223230, 14343545334223230, 14343545334223230, 14343545334223230, 14343545334223230, 14343545334223230];

    // Function to dynamically insert items into the list
    const populateCardList = (data) => {
        // Clear existing items
        cardList.innerHTML = '';

        // Insert items from the serverData
        data.forEach((item) => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
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
