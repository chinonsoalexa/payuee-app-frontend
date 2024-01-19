window.onload = async function() {
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
    available_balance.textContent = transactionDetails.balance;

    // Access properties within the success object using dot notation
    transaction_id.textContent = transactionDetails.success.transaction_id;
    
    // Parse the timestamp string
    var parsedTimestamp = new Date(transactionDetails.success.paid_at);
    transaction_date.textContent = parsedTimestamp.toLocaleString(); // Adjust the format as needed

    transaction_method.textContent = transactionDetails.success.transaction_type;
    transaction_status.textContent = transactionDetails.success.transaction_status;
    users_name.textContent = transactionDetails.success.user_name;
    transaction_amount.textContent = '₦' + transactionDetails.success.fees;
}

function displayErrorMessage() {

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
    available_balance.textContent = 'NA';

    // Access properties within the success object using dot notation
    transaction_id.textContent = 'NA';
    
    transaction_date.textContent = 'NA'; // Adjust the format as needed

    transaction_method.textContent = 'NA';
    transaction_status.textContent = 'NA';
    users_name.textContent = 'NA';
    transaction_amount.textContent = '₦' + 'NA';
}