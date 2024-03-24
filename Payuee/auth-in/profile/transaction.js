var NextPageOnLoad;
var PreviousPageOnLoad;
var CurrentPageOnLoad;
var TotalPageOnLoad;
var TwoBeforePageOnLoad;
var TwoAfterPageOnLoad;
var ThreeAfterPageOnLoad;

document.addEventListener('DOMContentLoaded', async function () {
    // Get the current URL
    const currentUrl = new URL(window.location.href);

    // Extract parameters using URLSearchParams
    const params = new URLSearchParams(currentUrl.search);

    // Get individual parameter values
    let pageNumber = params.get("page");
    if (pageNumber == null) {
        pageNumber = "1";
    }

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

        // render the transaction history
        renderTransactionHistory(responseData.success);
        
        NextPageOnLoad = responseData.pagination.NextPage;
        PreviousPageOnLoad = responseData.pagination.PreviousPage;
        CurrentPageOnLoad = responseData.pagination.CurrentPage;
        TotalPageOnLoad = responseData.pagination.TotalPages;
        TwoBeforePageOnLoad = responseData.pagination.TwoBefore;
        TwoAfterPageOnLoad = responseData.pagination.TwoAfter;
        ThreeAfterPageOnLoad = responseData.pagination.ThreeAfter;
        if (CurrentPageOnLoad <= 1) {
            deactivatePreviousButton();
            deactivateBeforeButton();
        } else if (CurrentPageOnLoad >= responseData.pagination.TotalPages) {
            deactivateNextButton();
        }

        if (CurrentPageOnLoad < 4) {
            // let's disable the next page navigation button
            document.getElementById('constantBeforePage').classList.add('disabled');
            document.getElementById('constantBeforePage').disabled = true;
        }

        if (CurrentPageOnLoad < 5) {
            // let's disable the next page navigation button
            document.getElementById('dotBeforePage').classList.add('disabled');
            document.getElementById('dotBeforePage').disabled = true;
        }

        if (CurrentPageOnLoad > 2) {
            // let's update the pagination with the next page
            var currentPageElement = document.getElementById("twoBeforePage");
            var currentPageAnchor = currentPageElement.querySelector("a");
            currentPageAnchor.textContent = TwoBeforePageOnLoad;
        } else {
            // let's disable the next page navigation button
            document.getElementById('twoBeforePage').classList.add('disabled');
            document.getElementById('twoBeforePage').disabled = true;
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

        if (CurrentPageOnLoad >= TotalPageOnLoad) {
            // let's disable the next page navigation button
            document.getElementById('afterPage').classList.add('disabled');
            document.getElementById('afterPage').disabled = true;
        } else {
            // let's update the pagination with the next page
            var currentPageElement = document.getElementById("afterPage");
            var currentPageAnchor = currentPageElement.querySelector("a");
            currentPageAnchor.textContent = NextPageOnLoad;
        }

        if (TwoAfterPageOnLoad < TotalPageOnLoad) {
            // let's update the pagination with the next page
            var currentPageElement = document.getElementById("twoAfterPage");
            var currentPageAnchor = currentPageElement.querySelector("a");
            currentPageAnchor.textContent = TwoAfterPageOnLoad;
        } else {
            // let's disable the next page navigation button
            document.getElementById('twoAfterPage').classList.add('disabled');
            document.getElementById('twoAfterPage').disabled = true;
        }

        if (TwoAfterPageOnLoad > TotalPageOnLoad) {
            // let's disable the next page navigation button
            document.getElementById('constantAfterPage').classList.add('disabled');
            document.getElementById('constantAfterPage').disabled = true;
        } else {
            // let's update the pagination with the next page
            var currentPageElement = document.getElementById("constantAfterPage");
            var currentPageAnchor = currentPageElement.querySelector("a");
            currentPageAnchor.textContent = TotalPageOnLoad;
        }

        if (ThreeAfterPageOnLoad > TotalPageOnLoad) {
            // let's disable the next page navigation button
            document.getElementById('dotAfterPage').classList.add('disabled');
            document.getElementById('dotAfterPage').disabled = true;
        }
} finally {

    }
});


function renderTransactionHistory(historyData) {
    // Initialize variables for the latest and oldest dates
    let latestDate = null;
    let oldestDate = null;

    // Loop through the transactions array
    historyData.forEach(historyData => {
        // Parse the CreatedAt property into a Date object
        const createdAt = new Date(historyData.created_at);

        // Check if latestDate is null or the current transaction's date is later
        if (latestDate === null || createdAt > latestDate) {
            latestDate = createdAt; // Update latestDate
        }

        // Check if oldestDate is null or the current transaction's date is earlier
        if (oldestDate === null || createdAt < oldestDate) {
            oldestDate = createdAt; // Update oldestDate
        }
    });

    // Get a reference to the input element by its ID
    const datePickerInput = document.getElementById('datepicker2');

    // Set the new placeholder text
    datePickerInput.placeholder = formatTimestampForPlaceholder(latestDate) + ' - ' + formatTimestampForPlaceholder(oldestDate);

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
        rowElement.id = historyData.transaction_id; // Set the ID of the row

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
            // Retrieve the ID of the clicked row
            const rowId = event.target.closest('tr').id;
            // Use the ID as needed
            window.location.href = 'success-trans-id.html?id=' + rowId + '&page=' + CurrentPageOnLoad;
        });
    });
}

function renderTransactionHistoryLoading() {
    // Assuming you have a reference to the table body element
    const tableBody = document.getElementById('table_body_id');

    // Remove all child elements of the tbody
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    // Create a new table row element
    const rowElement = document.createElement('tr');

    // Create the HTML string for displaying "No History Available"
    rowElement.innerHTML = `
        <td>Getting Transactions</td>
        <td>Getting Transactions</td>
        <td>Getting Transactions</td>
        <td>Getting Transactions</td>
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
            window.location.href = 'transaction.html?page=' + PreviousPageOnLoad;
    } finally {
    
        }
});

document.getElementById("constantBeforePage").addEventListener("click", async function(event){
    event.preventDefault(); 

    const apiUrl = "https://payuee.onrender.com/transactions/" + "1";
    
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
            window.location.href = 'transaction.html?page=' + "1";
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
            window.location.href = 'transaction.html?page=' + PreviousPageOnLoad;
    } finally {
    
        }
});

document.getElementById("twoBeforePage").addEventListener("click", async function(event){
    event.preventDefault(); 

    const apiUrl = "https://payuee.onrender.com/transactions/" + TwoBeforePageOnLoad;
    
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
            window.location.href = 'transaction.html?page=' + TwoBeforePageOnLoad;
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
            window.location.href = 'transaction.html?page=' + CurrentPageOnLoad;
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
            window.location.href = 'transaction.html?page=' + NextPageOnLoad;
    } finally {
    
    }
});

document.getElementById("constantAfterPage").addEventListener("click", async function(event){
    event.preventDefault(); 

    const apiUrl = "https://payuee.onrender.com/transactions/" + TotalPageOnLoad;
    
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
            window.location.href = 'transaction.html?page=' + TotalPageOnLoad;
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
            window.location.href = 'transaction.html?page=' + NextPageOnLoad;
    } finally {
    
    }
});

document.getElementById("twoAfterPage").addEventListener("click", async function(event){
    event.preventDefault(); 

    const apiUrl = "https://payuee.onrender.com/transactions/" + TwoAfterPageOnLoad;
    
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
            window.location.href = 'transaction.html?page=' + TwoAfterPageOnLoad;
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

function formatTimestampForPlaceholder(timestamp) {
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
    return formattedDay + ' / ' + months[month] + ' / ' + year;
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
    var dotButtonBefore = document.getElementById('dotBeforePage');
    dotButtonBefore.classList.add('deactivated'); // Add a class to the button

    var dotButtonAfter = document.getElementById('dotAfterPage');
    dotButtonAfter.classList.add('deactivated'); // Add a class to the button

    var resendButton = document.getElementById('currentPage');
    resendButton.classList.add('deactivated'); // Add a class to the button
}
