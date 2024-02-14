window.onload = async function () {
    const apiUrl = "https://payuee.onrender.com/paystack/get-latest-transaction";

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
    var transaction_id = document.getElementById('transaction_id');
    var transaction_date = document.getElementById('transaction_date');
    var transaction_amount = document.getElementById('transaction_amount');
    var service_name = document.getElementById('service_name');

// airtime fields
    var transaction_method = document.getElementById('transaction_method');
    var transaction_status = document.getElementById('transaction_status');
    var users_name = document.getElementById('users_name');
    var recharged_number = document.getElementById('recharged_number');
    var airtime_type = document.getElementById('airtime_type');

    // let's change to payment unsuccessful
    payment_condition.textContent = 'Transaction Successful'

    payment_display_message.textContent = 'Congratulations! Your Transaction is Successfully Processed!'

    // Access balance directly
    let availableBalanceString = transactionDetails.balance;
    let formattedBalance = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(availableBalanceString);
    available_balance.textContent = formattedBalance;

    // Access properties within the success object using dot notation
    transaction_id.textContent = transactionDetails.success.transaction_id;

    // Parse the timestamp string
    var parsedTimestamp = new Date(transactionDetails.success.paid_at);
    transaction_date.textContent = parsedTimestamp.toLocaleString(); // Adjust the format as needed

    let transactionAmountString = transactionDetails.success.amount;
    let formattedTranAmount = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(transactionAmountString);
    transaction_amount.textContent = formattedTranAmount;

    service_name.textContent = transactionDetails.success.service_type;
    var serviceType = transactionDetails.success.service_type;
    console.log("transaction type: " + serviceType);

    switch (serviceType) {
    // airtime field from response
    // let's enable the airtime field
    case "airtime":
    document.getElementById('airtime-section').classList.remove('disabled');
    document.getElementById('airtime-section').disabled = false;
    transaction_method.textContent = transactionDetails.success.transaction_type;
    transaction_status.textContent = transactionDetails.success.transaction_status;
    users_name.textContent = transactionDetails.success.user_name;
    airtime_type.textContent = transactionDetails.service.airtime_type;
    recharged_number.textContent = transactionDetails.service.mobile_number;
    break;
    default:
        let availableBalanceString = transactionDetails.balance;
        let formattedBalance = new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(availableBalanceString);
        displayErrorMessage(formattedBalance);
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
