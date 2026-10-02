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
    const OrderID = params.get("OrderIDs");

    let orderIds = [];

    if (OrderID) {
      orderIds = OrderID.split(',').map(id => Number(id));
    }

    await updateOrderInfo(orderIds);
});

async function updateOrderInfo(orderIds) {
  if (!orderIds.length) {
    console.error("Invalid order ID");
    return;
  }

  const endpoint = `https://api.payuee.com/track-orders?ids=${orderIds.join(',')}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.error || "Failed to fetch orders");
      return;
    }

    const orders = data.success;

    let subtotal = 0;
    let shipping = 0;
    let discount = 0;

    const orderDetailsTable = document.getElementById('orderDetails');
    orderDetailsTable.innerHTML = '';
    let earliestDate = null;

    // ===============================
    // 🔥 LOOP ALL ORDERS
    // ===============================
    orders.forEach(order => {

      // Track earliest date
      const orderDate = new Date(order.CreatedAt);
      if (!earliestDate || orderDate < earliestDate) {
        earliestDate = orderDate;
      }

      shipping += order.shipping_cost || 0;
      discount += order.order_discount || 0;

      order.product_orders.forEach(item => {
        const qty = item.quantity || 1;
        const itemTotal = item.order_cost;

        subtotal += itemTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.title} ${qty > 1 ? ` x ${qty}` : ''}</td>
          <td>${formatNumberToNaira(itemTotal)}</td>
        `;
        orderDetailsTable.appendChild(row);
      });
    });

    if (earliestDate) {
      document.getElementById('orderDate').textContent =
        earliestDate.toLocaleDateString();
    }

    const total = subtotal + shipping - discount;

    // ===============================
    // UI UPDATE
    // ===============================
    document.getElementById('orderNumber').textContent =
      orderIds.join(', '); // multiple IDs

    document.getElementById('orderTotal').textContent =
      formatNumberToNaira(total);

    document.getElementById('subtotalMain2').textContent =
      formatNumberToNaira(subtotal);

    document.getElementById('shippingCost').textContent =
      formatNumberToNaira(shipping);

    document.getElementById('orderDiscount').textContent =
      formatNumberToNaira(discount);

    document.getElementById('orderTotalFinal').textContent =
      formatNumberToNaira(total);

    displayTrackingInfo(orders[0].order_status);

  } catch (error) {
    console.error(error);
    console.error("Something went wrong");
  }
}
  
function showError(message) {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.classList.remove('hiddenn');
  errorMessage.textContent = message;

  document.getElementById('orderTrackingDetails').classList.add('hiddenn');
  document.getElementById('getOrderTrackingDetails').classList.remove('hiddenn');
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