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
            } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!") {
                // let's log user out the users session has expired
                logUserOutIfTokenIsExpired();
            }else {
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


}

function formatNumberToNaira(number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(number);
}

function logUserOutIfTokenIsExpired() {
    // also send a request to the logout api endpoint
    const apiUrl = "https://payuee.onrender.com/log-out";

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