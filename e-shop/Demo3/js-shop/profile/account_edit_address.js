document.addEventListener('DOMContentLoaded', async function () {
    await getUsersAddress();
});

async function getUsersAddress() {
    // Endpoint URL
    const apiUrl = "https://api.payuee.com/shipping_address";

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
            const shippingName = document.getElementById('shippingName');
            const shippingAddress = document.getElementById('shippingAddress');
            const shippingState = document.getElementById('shippingState');
            const shippingEmail = document.getElementById('shippingEmail');
            const shippingPhone = document.getElementById('shippingPhone');
            // Process the response data
            const data = await response.json();
            address = data.address;

            if (address.customer_email) {  // Check if address.customer_email exists
                shippingName.textContent = address.customer_fname + " " + address.customer_user_sname;
                shippingAddress.textContent = address.customer_street_address_1;
                shippingState.textContent = address.customer_state + " " + address.customer_city + " " + "Nigeria";
                shippingEmail.textContent = address.customer_email;
                shippingPhone.textContent = address.customer_phone_number;
            } else {
                shippingName.textContent = "NA";
                shippingAddress.textContent = "NA";
                shippingState.textContent = "NA";
                shippingEmail.textContent = "NA";
                shippingPhone.textContent = "NA";
            }
    
        }

    } catch (error) {
        console.error('Error fetching address data:', error);
    }
}