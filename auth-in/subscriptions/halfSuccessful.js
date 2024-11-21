document.addEventListener('DOMContentLoaded', async function() {
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
            } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
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

    function getSuccessMessage(transactionDetails) {
        var user_name = document.getElementById('user_name');
        var service = document.getElementById('service');
        var available_balance = document.getElementById('available_balance');

        user_name.textContent = transactionDetails.success.user_name;
        service.textContent = transactionDetails.success.service_type;
        available_balance.textContent = formatNumberToNaira(transactionDetails.balance);
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
            window.location.href = '../indexs.html'
        } finally{
            // do nothing
        }
    }
    });