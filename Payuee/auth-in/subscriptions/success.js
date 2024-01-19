var transactionDetails

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
                transactionDetails = '';
            } else {
                transactionDetails = '';
            }

            return;
        }

        const responseData = await response.json();
        transactionDetails = responseData;
    } finally {
        
    }
}

document.addEventListener('DOMContentLoaded', function(event) {
    event.preventDefault;

    var available_balance = document.getElementById('available_balance');
    var transaction_id = document.getElementById('transaction_id');
    var transaction_date = document.getElementById('transaction_date');
    var transaction_method = document.getElementById('transaction_method');
    var transaction_status = document.getElementById('transaction_status');
    var users_name = document.getElementById('users_name');
    // var recharged_number = document.getElementById('recharged_number');
    // var service_name = document.getElementById('service_name');
    var transaction_amount = document.getElementById('transaction_amount');

    available_balance.textContent = transactionDetails.balance;
    transaction_id.textContent = transactionDetails.success.TransactionID;
    // Parse the timestamp string
    var parsedTimestamp = new Date(transactionDetails.success.Paid_AT);
    transaction_date.textContent = parsedTimestamp;
    transaction_method.textContent = transactionDetails.success.TransactionType;
    transaction_status.textContent = transactionDetails.success.Status;
    users_name.textContent = transactionDetails.success.UserName;
    // recharged_number.textContent = transactionDetails.success.;
    // service_name.textContent = transactionDetails.success.;
    transaction_amount.textContent = '₦' + transactionDetails.success.Fees;

})