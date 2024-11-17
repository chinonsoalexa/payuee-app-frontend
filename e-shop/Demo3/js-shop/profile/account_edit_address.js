document.addEventListener('DOMContentLoaded', async function () {
    await getShippingFees();
});

async function getShippingFees() {
    // Endpoint URL
    const apiUrl = "https://api.payuee.com/shipping_address";

    // Request body is just the array of IDs
    const requestBody = getUniqueVendorIds();  // Directly send the array, not as an object
    const checkoutButton = document.getElementById('placeOrderButton');
    
    checkoutButton.disabled = true;
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',  // Include cookies with the request
        body: JSON.stringify(requestBody)  // Send array as JSON
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

            shippingName.value = data.customer_fname + " " + data.customer_user_sname;
            shippingAddress.value = data.customer_street_address_1;
            shippingState.value = data.customer_state + " " + data.customer_city + " " + "Nigeria";
            shippingEmail.value = data.customer_email;
            shippingPhone.value = data.customer_phone_number;
    
        }

    } catch (error) {
        console.error('Error fetching address data:', error);
    }
}