var NextPageOnLoad;
var PreviousPageOnLoad;
var CurrentPageOnLoad;
document.addEventListener('DOMContentLoaded', async function () {
     // Get the current URL
     const currentUrl = new URL(window.location.href);

     // Extract parameters using URLSearchParams
     const params = new URLSearchParams(currentUrl.search);
 
     // Get individual parameter values
     const pageNumber = params.get("page");

    const apiUrl = "https://payuee.onrender.com/transactions/" + pageNumber;

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
        
        NextPageOnLoad = responseData.pagination.NextPage;
        PreviousPageOnLoad = responseData.pagination.PreviousPage;
        CurrentPageOnLoad = responseData.pagination.CurrentPage;
        if (CurrentPageOnLoad <= 1) {
            deactivatePreviousButton();
            deactivateBeforeButton();
        } else if (CurrentPageOnLoad >= responseData.pagination.TotalPages) {
            deactivateNextButton();
        }

        // let's update the pagination with the next page
        var currentPageElement = document.getElementById("beforePage");
        var currentPageAnchor = currentPageElement.querySelector("a");
        currentPageAnchor.textContent = PreviousPageOnLoad;

        // let's update the pagination with the current page
        var currentPageElement = document.getElementById("currentPage");
        var currentPageAnchor = currentPageElement.querySelector("a");
        currentPageAnchor.textContent = CurrentPageOnLoad;
        deactivateCurrentButton();

        // let's update the pagination with the next page
        var currentPageElement = document.getElementById("afterPage");
        var currentPageAnchor = currentPageElement.querySelector("a");
        currentPageAnchor.textContent = NextPageOnLoad;

        renderTransactionHistory(responseData.success);
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
        if (historyData.transaction_status == 'success') {
            transactionStatus = 'assets/img/payment/g-check.png';
        } else if (historyData.transaction_status == 'pending') {
            transactionStatus = 'assets/img/payment/g-worning.png';
        } else if (historyData.transaction_status == 'failed') {
            transactionStatus = 'assets/img/payment/g-cross.png';
        }

        // Create a new table row element
        const rowElement = document.createElement('tr');
        rowElement.id = rowId; // Set the ID of the row

        // Create the HTML string with dynamic data using template literals
        rowElement.innerHTML = `
            <td>${formatTimestamp(historyData.created_at)}</td>
            <td>${historyData.service_type}</td>
            <td>${formatNumberToNaira(historyData.amount)}</td>
            <td>${historyData.fees}</td>
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

document.getElementById("previousPage").addEventListener("click", async function(event){
    event.preventDefault(); 

    const apiUrl = "https://payuee.onrender.com/transactions/" + PreviousPageOnLoad;
    
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
            window.location.href = 'transaction.html?page=' + PreviousPageOnLoad;
            renderTransactionHistory(testData);
    } finally {
    
        }
});

document.getElementById("nextPage").addEventListener("click", async function(event){
    event.preventDefault(); 

    const apiUrl = "https://payuee.onrender.com/transactions/" + NextPageOnLoad;
    
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
            window.location.href = 'transaction.html?page=' + NextPageOnLoad;
    } finally {
    
    }
});

document.getElementById("currentPage").addEventListener("click", async function(event){
    event.preventDefault(); 

    const apiUrl = "https://payuee.onrender.com/transactions/" + CurrentPageOnLoad;
    
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
            window.location.href = 'transaction.html?page=' + CurrentPageOnLoad;
    } finally {
    
    }
});

document.getElementById("beforePage").addEventListener("click", async function(event){
    event.preventDefault(); 

    const apiUrl = "https://payuee.onrender.com/transactions/" + PreviousPageOnLoad;
    
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
            window.location.href = 'transaction.html?page=' + PreviousPageOnLoad;
            renderTransactionHistory(testData);
    } finally {
    
        }
});

document.getElementById("afterPage").addEventListener("click", async function(event){
    event.preventDefault(); 

    const apiUrl = "https://payuee.onrender.com/transactions/" + NextPageOnLoad;
    
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
            window.location.href = 'transaction.html?page=' + NextPageOnLoad;
    } finally {
    
    }
});

function formatTimestamp(timestamp) {
    // Parse the provided timestamp string
    var dateObj = new Date(timestamp);

    // Define an array of month abbreviations
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Extract year, month, and day from the date object
    var year = dateObj.getFullYear();
    var month = dateObj.getMonth();
    var day = dateObj.getDate();

    // Convert day to two-digit format if necessary
    var formattedDay = day < 10 ? '0' + day : day;

    // Return the formatted timestamp string
    return formattedDay + ' - ' + months[month] + ' - ' + year;
}

function deactivatePreviousButton() {
    var resendButton = document.getElementById('previousPage');
    // resendButton.className = '';
    resendButton.classList.add('deactivated'); // Add a class to the button
}

function deactivateBeforeButton() {
    var resendButton = document.getElementById('beforePage');
    // resendButton.className = '';
    resendButton.classList.add('deactivated'); // Add a class to the button
}

function deactivateNextButton() {
    var resendButton = document.getElementById('nextPage');
    // resendButton.className = '';
    resendButton.classList.add('deactivated'); // Add a class to the button
}

function deactivateCurrentButton() {
    var resendButton = document.getElementById('currentPage');
    // resendButton.className = '';
    resendButton.classList.add('deactivated'); // Add a class to the button
}