document.addEventListener('DOMContentLoaded', async function () {
    // Get URL parameters
    const url = window.location.pathname;
    const parts = url.split('-');
    vendorId = parseInt(parts[parts.length - 1], 10);  // Convert to a number    

    // Get the current URL
    const currentUrl = new URL(window.location.href);
    // Assuming you have a reference to the table body element

    // Extract parameters using URLSearchParams
    const params = new URLSearchParams(currentUrl.search);

    // Get individual parameter values
    OrderID = params.get("OrderID");

    await updateOrderInfo(OrderID);
});

async function updateOrderInfo(orderId) {
    // Define the endpoint and include the order ID
    if (isNaN(+orderId)) {
      const errorMessage = document.getElementById('errorMessage');
          errorMessage.classList.remove('hiddenn'); // Show the error message
          errorMessage.textContent = "Sorry, you can only track orders associated with your order history.";
          document.getElementById('orderTrackingDetails').classList.add('hiddenn');
          document.getElementById('getOrderTrackingDetails').classList.remove('hiddenn');
      return;
    }
    const endpoint = `https://api.payuee.com/track-order/${orderId}`;
  
    try {
      // Make the request using Fetch API with credentials included
      const response = await fetch(endpoint, {
        credentials: 'include' // Include cookies in the request
      });
  
      if (!response.ok) {
        const data = await response.json();
        if (data.error === "sorry you can only track orders related to your order history") {
          const errorMessage = document.getElementById('errorMessage');
          errorMessage.classList.remove('hiddenn'); // Show the error message
          errorMessage.textContent = "Sorry, you can only track orders associated with your order history.";
          document.getElementById('orderTrackingDetails').classList.add('hiddenn');
          document.getElementById('getOrderTrackingDetails').classList.remove('hiddenn');
          return; // Stop further execution if there's an error
        } else if (data.error === "failed to get order history") {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.classList.remove('hiddenn'); // Show the error message
            errorMessage.textContent = "Wrong or invalid order detail";
            document.getElementById('orderTrackingDetails').classList.add('hiddenn');
            document.getElementById('getOrderTrackingDetails').classList.remove('hiddenn');
            return; // Stop further execution if there's an error
        }
        throw new Error('Failed to fetch order data.');
      }
  
      const data = await response.json();
  
      // Update the order tracking current URL
    //   const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?OrderID=${orderId}`;
    //   history.pushState({ path: newUrl }, '', newUrl);
  
      const errorMessage = document.getElementById('errorMessage');
      errorMessage.classList.add('hiddenn'); // Show the error message
  
    //   document.getElementById('getOrderTrackingDetails').classList.add('hidden');
    //   document.getElementById('orderTrackingDetails').classList.remove('hidden');
      displayTrackingInfo(data.success.order_status);
  
      // Update order information
      document.getElementById('orderNumber').textContent = data.success.ID;
  
      // Convert to a Date object and format
      const date = new Date(data.success.CreatedAt);
      const formattedDate = date.toLocaleDateString();
      document.getElementById('orderDate').textContent = formattedDate;
  
      document.getElementById('orderTotal').textContent = `${formatNumberToNaira(data.success.order_cost)}`;
  
      // Clear existing order details and update with new data
      const orderDetailsTable = document.getElementById('orderDetails');
      orderDetailsTable.innerHTML = ''; // Clear existing rows
  
      data.success.product_orders.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.title}${item.quantity > 1 ? ` x ${item.quantity}` : ''}</td>
          <td>${formatNumberToNaira(item.order_cost)}</td>
        `;
        orderDetailsTable.appendChild(row);
      });
  
      // Update totals
      document.getElementById('subtotalMain2').textContent = `${formatNumberToNaira(data.success.order_sub_total_cost)}`;
      document.getElementById('shippingCost').textContent = formatNumberToNaira(data.success.shipping_cost);
      document.getElementById('orderDiscount').textContent = `${formatNumberToNaira(data.success.order_discount)}`;
      document.getElementById('orderTotalFinal').textContent = `${formatNumberToNaira(data.success.order_cost)}`;
    } catch (error) {
      console.error('Error fetching order data:', error);
    }
  }
  
  function formatNumberToNaira(number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(number);
  }
  
  function displayTrackingInfo(status) {
    if (status === "processing") {
        document.getElementById('shippingIcon').classList.remove('hidden');
  
        document.getElementById('orderCompleteText').textContent = 'Your order is being processed!';
        document.getElementById('orderThanksText').textContent = 'Your order is being shipped to your destination.';
    } else if (status === "shipped") {
        document.getElementById('deliveredIcon').classList.remove('hidden');
    
        document.getElementById('orderCompleteText').textContent = 'Your order is completed!';
        document.getElementById('orderThanksText').textContent = 'Thank you. Your order has been delivered successfully.';
    } else {
        // the order is being canceled
        document.getElementById('canceledIcon').classList.remove('hidden');
  
        document.getElementById('orderCompleteText').textContent = 'Your order was cancelled!';
        document.getElementById('orderThanksText').textContent = 'Sorry your order was cancelled. If you think this was a mistake you can contact us at support@dorngherbal.com for more info.';
    }
  
  }