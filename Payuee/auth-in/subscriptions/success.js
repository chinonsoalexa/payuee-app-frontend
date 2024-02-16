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
    document.getElementById('airtime-section').classList.remove('disabled');
    document.getElementById('airtime-section').disabled = false;
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
        document.getElementById('data-section').classList.remove('disabled');
        document.getElementById('data-section').disabled = false;
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
        console.log("mobile number: " + transactionDetails.service.phone_number);
        data_recharged_number.textContent = transactionDetails.service.phone_number;
        data_bundle.textContent = transactionDetails.service.bundle;
        data_auto_renew.textContent = transactionDetails.service.auto_renew;
        break;
    default:
        let availableBalanceString = transactionDetails.balance;
        displayErrorMessage(formatNumberToNaira(availableBalanceString));
        break;
    }
}

function displayErrorMessage(balance) {
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