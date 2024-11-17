document.addEventListener('DOMContentLoaded', async function () {
    await getUserInfo();
});

async function getUserInfo() {
    // Endpoint URL
    const apiUrl = "https://api.payuee.com/profile_info";

    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',  // Include cookies with the request
    };
    
    try {
        const response = await fetch(apiUrl, requestOptions);
        
        if (!response.ok) {
            // const data = await response.json();
            // showToastMessageE(`response: ${data}`);
            // updateShippingPrices();
            return;
        }else {
            const userName1 = document.getElementById('userName1');
            const userName2 = document.getElementById('userName2');
            // Process the response data
            const data = await response.json();
            user = data.user;

            if (user) {  // Check if address.customer_email exists
                userName1.textContent = user;
                userName2.textContent = user;
            } else {
                userName1.textContent = "NA";
                userName2.textContent = "NA";
            }
    
        }

    } catch (error) {
        console.error('Error fetching address data:', error);
    }
}