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

        const responseData = await response.json();
        displayErrorMessage(responseData.balance)
    } finally {

    }
}

function displayErrorMessage(balance) {
    var available_balance = document.getElementById('available_balance');

    let formattedBalance = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(balance);

    available_balance.textContent = formattedBalance;
}