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

    var available_balance = document.getElementById('available_balance');
    var transaction_id = document.getElementById('transaction_id');
    var transaction_date = document.getElementById('transaction_date');
    var transaction_method = document.getElementById('transaction_method');
    var transaction_status = document.getElementById('transaction_status');
    var users_name = document.getElementById('users_name');
    // var recharged_number = document.getElementById('recharged_number');
    // var service_name = document.getElementById('service_name');
    var transaction_amount = document.getElementById('transaction_amount');

    // Access balance directly
    let availableBalanceString = transactionDetails.balance;
    available_balance.textContent = '₦' + availableBalanceString.toFixed(2);

    // Access properties within the success object using dot notation
    transaction_id.textContent = transactionDetails.success.transaction_id;

    // Parse the timestamp string
    var parsedTimestamp = new Date(transactionDetails.success.paid_at);
    transaction_date.textContent = parsedTimestamp.toLocaleString(); // Adjust the format as needed

    transaction_method.textContent = transactionDetails.success.transaction_type;
    transaction_status.textContent = transactionDetails.success.transaction_status;
    users_name.textContent = transactionDetails.success.user_name;
    let transactionAmountString = transactionDetails.success.amount;
    transaction_amount.textContent = '₦' + (transactionAmountString / 100).toFixed(2);
}

function displayErrorMessage() {

    var payment_icon_color = document.getElementById('payment_icon_color');
    var payment_condition = document.getElementById('payment_condition');
    var available_balance = document.getElementById('available_balance');
    var transaction_id = document.getElementById('transaction_id');
    var transaction_date = document.getElementById('transaction_date');
    var transaction_method = document.getElementById('transaction_method');
    var transaction_status = document.getElementById('transaction_status');
    var users_name = document.getElementById('users_name');
    var recharged_number = document.getElementById('recharged_number');
    var service_name = document.getElementById('service_name');
    var transaction_amount = document.getElementById('transaction_amount');

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
    payment_condition.textContent = 'Payment Unsuccessful'
    // Access balance directly
    available_balance.textContent = '₦ NA';

    // Access properties within the success object using dot notation
    transaction_id.textContent = 'NA';

    transaction_date.textContent = 'NA'; // Adjust the format as needed

    transaction_method.textContent = 'NA';
    transaction_status.textContent = 'NA';
    users_name.textContent = 'NA';
    recharged_number.textContent = 'NA';
    service_name.textContent = 'NA';
    transaction_amount.textContent = '₦ NA';
}
