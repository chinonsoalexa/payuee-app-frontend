// document.addEventListener('DOMContentLoaded', function() {
    var transID
    document.addEventListener('DOMContentLoaded', async function () {
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
            getSuccessMessage(responseData);
            transID = responseData.success.transaction_id;
        } finally {
    
        }
    });
    
    function getSuccessMessage(transactionDetails) {
        var available_balance = document.getElementById('available_balance');
    
        let availableBalanceString = transactionDetails.balance;
        
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        // Combine the parts
        const customFormattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        // Access balance directly
        available_balance.textContent = formatNumberToNaira(availableBalanceString);
        let send_funds_transaction_date = document.getElementById('send_funds_transaction_date');
        send_funds_transaction_date.textContent = customFormattedDateTime; // Adjust the format as needed
        
    
    }
    
    function displayErrorMessage(balance) {
        document.getElementById('data-section').classList.add('disabled');
        document.getElementById('data-section').disabled = true;
        var payment_icon_color = document.getElementById('payment_icon_color');
        var payment_condition = document.getElementById('payment_condition');
        var payment_display_message = document.getElementById('payment_display_message');
        var available_balance = document.getElementById('available_balance');
        var transaction_status = document.getElementById('transaction_status');
        var transaction_small_status = document.getElementById('transaction_small_status');
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
        payment_condition.textContent = 'Transaction Unsuccessful'
    
        payment_display_message.textContent = 'Your Transaction Failed, Please Try Again!'
        // Access balance directly
        available_balance.textContent = balance;
        
        transaction_status.textContent = 'failed';
        transaction_small_status.textContent = 'Failed';
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
    
    document.getElementById('download_receipt').addEventListener('click', function(event) {
        event.preventDefault();
        downloadReceipt();
    });
    
    function downloadReceipt() {
        // Create a new element to contain the content to be included in the PDF
        var pdfContentElement = document.createElement('div');
    
        // Copy the content you want to include to the new element
        var successReceiptElement = document.getElementById('successReceipt');
        var clonedSuccessReceipt = successReceiptElement.cloneNode(true); // Clone with children
        pdfContentElement.appendChild(clonedSuccessReceipt);
    
        // Optionally, you can remove specific elements you want to exclude
        var elementsToExclude = pdfContentElement.querySelectorAll('.available__balance, .order__button, #footer-download-section');
        elementsToExclude.forEach(function(element) {
            element.remove();
        });
    
        // Create the company logo element dynamically
        var companyLogoElement = document.createElement('img');
        companyLogoElement.src = 'assets/img/logo/favicon2.png';  // Set the path or base64 data for your logo
        companyLogoElement.alt = 'Payuee';
        companyLogoElement.style.position = 'absolute';
        companyLogoElement.style.top = '50%'; // Force the logo to start from the top
        companyLogoElement.style.left = '50%';
        // companyLogoElement.style.transform = 'translateX(-50%)'; // Center the logo horizontally
        companyLogoElement.style.opacity = '0.5'; // Set opacity to 0.5 (50% transparency)
        pdfContentElement.appendChild(companyLogoElement); 
    
        var options = {
            filename: 'Payuee Receipt ' + transID+ '.pdf',
            image: { type: 'jpeg', quality: 0.98 },
        };  // Use default options
    
        // Generate the PDF using html2pdf library
        html2pdf().from(pdfContentElement).set(options).save();
    }
    