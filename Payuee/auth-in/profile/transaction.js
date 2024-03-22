document.addEventListener('DOMContentLoaded', async function () {
    const apiUrl = "https://payuee.onrender.com/transactions/";

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
                // displayErrorMessage();
            } else if (errorData.error === 'failed to get transaction history') {
                // need to do a data of just null event 
                
            } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!") {
                // let's log user out the users session has expired
                logUserOutIfTokenIsExpired();
            }else {
                // displayErrorMessage();
            }

            return;
        }

        const responseData = await response.json();
        console.log("this is the response data for transaction: ", responseData);
    } finally {

    }
});


function renderTransactionHistory(historyData) {
    // Assuming you have a reference to the table body element
    const tableBody = document.getElementById('table_body_id');

    // Check if historyData is empty
    if (historyData.length === 0) {
        // Create a new table row element
        const rowElement = document.createElement('tr');

        // Create the HTML string for displaying "No History Available"
        rowElement.innerHTML = `
            <td>No History Available</td>
            <td>No History Available</td>
            <td>No History Available</td>
            <td>No History Available</td>
            <td>
                <a href="javascript:void(0)" class="edi">
                    <img src="assets/img/payment/g-worning.png" alt="img">
                </a>
            </td>
        `;

        // Append the row to the table body
        tableBody.appendChild(rowElement);

        return; // Exit the function
    }
    
    historyData.forEach((historyData, index) => {
        // Generate a unique ID for each row
        const rowId = `historyRow_${index}`;

        let transactionStatus;
        // let's check the status of the transaction
        if (historyData.status == 'success') {
            transactionStatus = 'assets/img/payment/g-check.png';
        } else if (historyData.status == 'pending') {
            transactionStatus = 'assets/img/payment/g-worning.png';
        } else if (historyData.status == 'failed') {
            transactionStatus = 'assets/img/payment/g-cross.png';
        }

        // Create a new table row element
        const rowElement = document.createElement('tr');
        rowElement.id = rowId; // Set the ID of the row

        // Create the HTML string with dynamic data using template literals
        rowElement.innerHTML = `
            <td>${historyData.date}</td>
            <td>${historyData.service}</td>
            <td>${historyData.price}</td>
            <td>${historyData.charge}</td>
            <td>
                <a href="javascript:void(0)" class="edi">
                    <img src="${transactionStatus}" alt="img">
                </a>
            </td>
        `;

        // Append the row to the table body
        tableBody.appendChild(rowElement);

        // Add event listener to the row element
        rowElement.addEventListener('click', function(event) {
            event.preventDefault();
            alert('Row clicked: ' + rowId);
            // You can print out or perform any action here
        });
    });
}

const testData = [
    {
        date: '01 Jan 2024',
        service: 'Mobile Recharge',
        price: '₦750.00',
        charge: '-₦50.00',
        status: 'success',
    },
    {
        date: '27 Jan 2022',
        service: 'Electric Bill',
        price: '₦320.00',
        charge: '-₦15.00',
        status: 'failed',
    },
    {
        date: '24 Feb',
        service: 'Cable TV Bill',
        price: '₦410.00',
        charge: '-₦30.00',
        status: 'success',
    },
    {
        date: '7 Mar',
        service: 'Flight Booking',
        price: '₦777.00',
        charge: '-₦20.00',
        status: 'success',
    },
    {
        date: '27 Apr',
        service: 'Gas Bill',
        price: '₦450.00',
        charge: '-₦5.00',
        status: 'failed',
    },
    {
        date: '01 Jun',
        service: 'Flight Booking',
        price: '₦440.00',
        charge: '-₦10.00',
        status: 'pending',
    },
];

function formatNumberToNaira(number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(number);
}

renderTransactionHistory(testData)

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