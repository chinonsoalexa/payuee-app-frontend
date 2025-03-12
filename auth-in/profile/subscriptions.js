var NextPageOnLoad;
var PreviousPageOnLoad;
var CurrentPageOnLoad;
var TotalPageOnLoad;
var TwoBeforePageOnLoad;
var TwoAfterPageOnLoad;
var ThreeAfterPageOnLoad;
var AllRecordsOnPageLoad;

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

    const apiUrl = "https://api.payuee.com/subscription/" + pageNumber;

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
                displayErrorMessage();
            } else if (errorData.error === 'failed to get transaction history') {
                // need to do a data of just null event 
                
            } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                // let's log user out the users session has expired
                logUserOutIfTokenIsExpired();
            }else {
                // displayErrorMessage();
            }

            return;
        }

        const responseData = await response.json();

        // console.log('this is the response data', responseData);
        // console.log('this is the success data', responseData.success);

        // render the transaction history
        renderSubscriptionHistory(responseData.success);
        
        NextPageOnLoad = responseData.pagination.NextPage;
        PreviousPageOnLoad = responseData.pagination.PreviousPage;
        CurrentPageOnLoad = responseData.pagination.CurrentPage;
        TotalPageOnLoad = responseData.pagination.TotalPages;
        TwoBeforePageOnLoad = responseData.pagination.TwoBefore;
        TwoAfterPageOnLoad = responseData.pagination.TwoAfter;
        ThreeAfterPageOnLoad = responseData.pagination.ThreeAfter;
        AllRecordsOnPageLoad = responseData.pagination.AllRecords;
        
        if (AllRecordsOnPageLoad > 6) {
            // let's disable the next page navigation button
            document.getElementById('paginationList').classList.remove('disabled');
            document.getElementById('paginationList').disabled = false;
        }

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

function renderSubscriptionHistory(historyData) {
    // Assuming you have a reference to the table body element
    const tableBody = document.getElementById('table_body_id');

    // Remove all child elements of the tbody
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    // Check if historyData is empty
    if (historyData == null || historyData.length === 0) {
        // Create a new table row element
        const rowElement = document.createElement('tr');

        // Create the HTML string for displaying "No History Available"
        rowElement.innerHTML = `
            <td>
                <span class="oparetor">
                    <img src="assets/img/svg/setting.svg" alt="img" style="width: 35%; height: 50%;">
                </span>
            </td>
            <td>No Subscription Yet</td>
            <td>No Subscription Yet</td>
            <td>
                <a id="addSub" href="#" class="purchase">
                    <span>
                        Add Subscription
                    </span>
                </a>
            </td>
            <td>
                <a id="cancelSub" href="#" class="edit">
                    <img src="assets/img/svg/edits.svg" alt="img">
                </a>
            </td>
        `;

        // Append the row to the table body
        tableBody.appendChild(rowElement);

        // Add event listener to the addSub link
        document.getElementById("addSub").addEventListener('click', function(event) {
            event.preventDefault();
            // handle add subscription action
            windows.location.href = 'data.html'
        });

        // Add event listener to the cancelSub link
        document.getElementById("cancelSub").addEventListener('click', function(event) {
            event.preventDefault();
            // handle cancel subscription action
        });

        return; // Exit the function
    }
    
    historyData.forEach((historyItem) => {
        // Create a new table row element for each history item
        const rowElement = document.createElement('tr');
    
        let subscriptionIcon;
        let serviceID;
        let iconStyle;
    
        // let's check the status of the transaction
        if (historyItem.ServiceName == 'airtime') {
            subscriptionIcon = 'assets/img/svg/phone.svg';
            serviceID = 'Airtime Top-Up';
            iconStyle = 'width: 35%; height: 50%; fill: red;';
        } else if (historyItem.ServiceName == 'data') {
            subscriptionIcon = 'assets/img/svg/broadband.svg';
            serviceID = 'Data Subscription';
            iconStyle = 'width: 50%; height: 50%;';
        } else if (historyItem.ServiceName == 'electricity') {
            subscriptionIcon = 'assets/img/svg/eletricity.svg';
            serviceID = 'Electric Bill';
            iconStyle = 'width: 50%; height: 50%;';
        } else if (historyItem.ServiceName == 'decoder') {
            subscriptionIcon = 'assets/img/svg/tv.svg';
            serviceID = 'TV/Decoder Subscription';
            iconStyle = 'width: 50%; height: 50%;';
        }
    
        rowElement.innerHTML = `
            <td>
                <span class="oparetor">
                    <img id="settingSvg" src="${subscriptionIcon}" alt="img" fill="red" style="${iconStyle}">
                </svg>
                </span>
            </td>
            <td>${serviceID}</td>
            <td>${historyItem.ServiceNumber}</td>
            <td>
                <a id="renew_${historyItem.ServiceID}" href="#" class="purchase">
                    <span>
                        Recharge Now
                    </span>
                </a>
            </td>
            <td>
                <a id="edit_${historyItem.ServiceID}" href="#" class="edit">
                    <i class="material-symbols-outlined" style="font-size: 24px;">
                        delete
                    </i>
                </a>
            </td>
        `;

        // Set the ID of the row element
        rowElement.id = historyItem.ServiceID;
    
        // Append the row to the table body
        tableBody.appendChild(rowElement);

        // Add event listeners for edit and autoRecharge links
        addEventListeners(historyItem);
    });

    if (historyData.length > 6) {
        // let's disable the next page navigation button
        document.getElementById('paginationList').classList.remove('disabled');
        document.getElementById('paginationList').disabled = false;
    }
}

async function addEventListeners(historyItem) {
    // Add event listener to the edit link
    const editLink = document.getElementById(`edit_${historyItem.ServiceID}`);
    // Get all elements with class 'edit'
    // const editButtons = document.querySelectorAll('.edit');
    if (editLink) {
        editLink.addEventListener('click', function(event) {
            event.preventDefault();
            // Retrieve the ID of the clicked row
            const rowId = editLink.closest('tr').id; // Declare rowId using let
            const confirmPopup = document.getElementById('confirm-popup');
            const cancelButton = document.getElementById('cancel-verification-btn');
            const verifyButton = document.getElementById('submit-verification-btn');
            const contentData1 = document.getElementById('contentData1');

            confirmPopup.style.display = 'block';

            contentData1.textContent = 'Are you sure you want to cancel this subscription?';
        
            // Cancel button click event
            cancelButton.addEventListener('click', () => {
                confirmPopup.style.display = 'none';
            });

            verifyButton.addEventListener('click', async (event) => {
                confirmPopup.style.display = 'none';
                event.preventDefault();
                const apiUrl = "https://api.payuee.com/cancel-subscription/" + rowId;

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
                            // Handle error
                            errorFunction("failed to cancel subscription");
                        } else if (errorData.error === 'failed to get transaction history') {
                            // Handle error
                            errorFunction("failed to cancel subscription");
                        } else if (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                            // Handle error
                            logUserOutIfTokenIsExpired();
                        } else {
                            // Handle error
                            errorFunction("an unknown error occurred");
                        }
                
                        return;
                    }
                
                    const responseData = await response.json();
                    // Process the responseData as needed
                    removeRowById(rowId);
                    errorFunction("subscription successfully canceled");
                } catch (error) {
                    // Handle error
                    confirmPopup.style.display = 'none';
                }                
            });
        });
    }

    // Add event listener to the autoRecharge link
    const autoRechargeLink = document.getElementById(`renew_${historyItem.ServiceID}`);
    if (autoRechargeLink) {
        autoRechargeLink.addEventListener('click', function(event) {
            event.preventDefault();
            // Retrieve the ID of the clicked row
            let rowId = autoRechargeLink.closest('tr').id; // Declare rowId using let
            const confirmPopup = document.getElementById('confirm-popup2');
            const cancelButton = document.getElementById('cancel-verification-btn2');
            const verifyButton = document.getElementById('submit-verification-btn2');
            const contentData1 = document.getElementById('contentData2');
        
            confirmPopup.style.display = 'block';

            contentData1.textContent = 'Are you sure you want to renew this subscription?';
        
            // Cancel button click event
            cancelButton.addEventListener('click', () => {
                confirmPopup.style.display = 'none';
            });

            verifyButton.addEventListener('click', async (event) => {
                confirmPopup.style.display = 'none';

                event.preventDefault();
                
                const apiUrl = "https://api.payuee.com/recharge-subscription/" + rowId;

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
                            // Handle error
                            errorFunction("failed to renew subscription");
                        } else if (errorData.error === 'insufficient balance') {
                            // Handle error
                            errorFunction("sorry you don't have sufficient funds to complete this transaction");
                        }else if (errorData.error === 'failed to get transaction history') {
                            // Handle error
                            errorFunction("failed to renew subscription");
                        } else if (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                            // Handle error
                            logUserOutIfTokenIsExpired();
                        } else {
                            // Handle error
                            errorFunction("an unknown error occurred");
                        }
                
                        return;
                    }
                
                    const responseData = await response.json();
                    // Process the responseData as needed
                    errorFunction("subscription successfully renewed");
                } catch (error) {
                    // Handle error
                    confirmPopup.style.display = 'none';
                }                
            });
        });
    }
}

function errorFunction(errorMessage) {
    const confirmPopup = document.getElementById('confirm-message');
    const cancelButton = document.getElementById('cancel-verification-btn3');
    const contentData1 = document.getElementById('contentData3');

    confirmPopup.style.display = 'block';

    contentData1.textContent = errorMessage;

    // Cancel button click event
    cancelButton.addEventListener('click', () => {
        confirmPopup.style.display = 'none';
    });

}

function removeRowById(rowId) {
    const rowToRemove = document.getElementById(rowId);
    if (rowToRemove) {
        rowToRemove.parentNode.removeChild(rowToRemove);
    }
}

function formatNumberToNaira(number) {
    let formattedNumber;
    if (number >= 1_000_000_000) {
        formattedNumber = `₦${(number / 1_000_000_000).toFixed(1).replace('.0', '')}B`;
    } else if (number >= 1_000_000) {
        formattedNumber = `₦${(number / 1_000_000).toFixed(1).replace('.0', '')}M`;
    } else if (number >= 1_000) {
        formattedNumber = `₦${(number / 1_000).toFixed(1).replace('.0', '')}K`;
    } else {
        formattedNumber = `₦${number.toFixed(0)}`;
    }
    return formattedNumber;
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

document.getElementById("previousPage").addEventListener("click", async function(event){
    event.preventDefault(); 

    const apiUrl = "https://api.payuee.com/subscription/" + PreviousPageOnLoad;
    
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
                    // displayErrorMessage();
                } else if (errorData.error === 'failed to get transaction history') {
                    // need to do a data of just null event 
                    
                } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                    // let's log user out the users session has expired
                    logUserOutIfTokenIsExpired();
                }else {
                    // displayErrorMessage();
                }
    
                return;
            }
    
            const responseData = await response.json();
            window.location.href = 'subscriptions.html?page=' + PreviousPageOnLoad;
    } finally {
    
        }
});

document.getElementById("constantBeforePage").addEventListener("click", async function(event){
    event.preventDefault(); 

    const apiUrl = "https://api.payuee.com/subscription/" + "1";
    
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
                    // displayErrorMessage();
                } else if (errorData.error === 'failed to get transaction history') {
                    // need to do a data of just null event 
                    
                } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                    // let's log user out the users session has expired
                    logUserOutIfTokenIsExpired();
                }else {
                    // displayErrorMessage();
                }
    
                return;
            }
    
            const responseData = await response.json();
            window.location.href = 'subscriptions.html?page=' + "1";
    } finally {
    
        }
});

document.getElementById("beforePage").addEventListener("click", async function(event){
    event.preventDefault(); 

    const apiUrl = "https://api.payuee.com/subscription/" + PreviousPageOnLoad;
    
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
                    // displayErrorMessage();
                } else if (errorData.error === 'failed to get transaction history') {
                    // need to do a data of just null event 
                    
                } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                    // let's log user out the users session has expired
                    logUserOutIfTokenIsExpired();
                }else {
                    // displayErrorMessage();
                }
    
                return;
            }
    
            const responseData = await response.json();
            window.location.href = 'subscriptions.html?page=' + PreviousPageOnLoad;
    } finally {
    
        }
});

document.getElementById("twoBeforePage").addEventListener("click", async function(event){
    event.preventDefault(); 

    const apiUrl = "https://api.payuee.com/subscription/" + TwoBeforePageOnLoad;
    
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
                    // displayErrorMessage();
                } else if (errorData.error === 'failed to get transaction history') {
                    // need to do a data of just null event 
                    
                } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                    // let's log user out the users session has expired
                    logUserOutIfTokenIsExpired();
                }else {
                    // displayErrorMessage();
                }
    
                return;
            }
    
            const responseData = await response.json();
            window.location.href = 'subscriptions.html?page=' + TwoBeforePageOnLoad;
    } finally {
    
        }
});

document.getElementById("currentPage").addEventListener("click", async function(event){
    event.preventDefault(); 

    const apiUrl = "https://api.payuee.com/subscription/" + CurrentPageOnLoad;
    
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
                    // displayErrorMessage();
                } else if (errorData.error === 'failed to get transaction history') {
                    // need to do a data of just null event 
                    
                } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                    // let's log user out the users session has expired
                    logUserOutIfTokenIsExpired();
                }else {
                    // displayErrorMessage();
                }
    
                return;
            }
    
            const responseData = await response.json();
            window.location.href = 'subscriptions.html?page=' + CurrentPageOnLoad;
    } finally {
    
    }
});

document.getElementById("nextPage").addEventListener("click", async function(event){
    event.preventDefault(); 

    const apiUrl = "https://api.payuee.com/subscription/" + NextPageOnLoad;
    
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
                    // displayErrorMessage();
                } else if (errorData.error === 'failed to get transaction history') {
                    // need to do a data of just null event 
                    
                } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                    // let's log user out the users session has expired
                    logUserOutIfTokenIsExpired();
                }else {
                    // displayErrorMessage();
                }
    
                return;
            }
    
            const responseData = await response.json();
            window.location.href = 'subscriptions.html?page=' + NextPageOnLoad;
    } finally {
    
    }
});

document.getElementById("constantAfterPage").addEventListener("click", async function(event){
    event.preventDefault(); 

    const apiUrl = "https://api.payuee.com/subscription/" + TotalPageOnLoad;
    
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
                    // displayErrorMessage();
                } else if (errorData.error === 'failed to get transaction history') {
                    // need to do a data of just null event 
                    
                } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                    // let's log user out the users session has expired
                    logUserOutIfTokenIsExpired();
                }else {
                    // displayErrorMessage();
                }
    
                return;
            }
    
            const responseData = await response.json();
            window.location.href = 'subscriptions.html?page=' + TotalPageOnLoad;
    } finally {
    
    }
});

document.getElementById("afterPage").addEventListener("click", async function(event){
    event.preventDefault(); 

    const apiUrl = "https://api.payuee.com/subscription/" + NextPageOnLoad;
    
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
                    // displayErrorMessage();
                } else if (errorData.error === 'failed to get transaction history') {
                    // need to do a data of just null event 
                    
                } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                    // let's log user out the users session has expired
                    logUserOutIfTokenIsExpired();
                }else {
                    // displayErrorMessage();
                }
    
                return;
            }
    
            const responseData = await response.json();
            window.location.href = 'subscriptions.html?page=' + NextPageOnLoad;
    } finally {
    
    }
});

document.getElementById("twoAfterPage").addEventListener("click", async function(event){
    event.preventDefault(); 

    const apiUrl = "https://api.payuee.com/subscription/" + TwoAfterPageOnLoad;
    
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
                    // displayErrorMessage();
                } else if (errorData.error === 'failed to get transaction history') {
                    // need to do a data of just null event 
                    
                } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                    // let's log user out the users session has expired
                    logUserOutIfTokenIsExpired();
                }else {
                    // displayErrorMessage();
                }
    
                return;
            }
    
            const responseData = await response.json();
            window.location.href = 'subscriptions.html?page=' + TwoAfterPageOnLoad;
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
