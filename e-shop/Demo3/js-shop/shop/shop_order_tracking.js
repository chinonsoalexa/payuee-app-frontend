document.addEventListener('DOMContentLoaded', async function () {
  // Get the URL parameters
  const urlParams = new URLSearchParams(window.location.search);

  // Retrieve the value of 'OrderID'
  const orderId = urlParams.get('OrderID');

  // Check if orderId is null or empty
  if (!orderId) {
      // console.log("OrderID not found in URL parameters");
      document.getElementById('getOrderTrackingDetails').classList.remove('hiddenn');
      return;
  } else {
    // console.log("OrderID found:", orderId);
    document.getElementById('orderTrackingDetails').classList.remove('hiddenn');
    await updateOrderInfo(orderId);
  }

  
});

let isScanning = false; // Flag to prevent multiple scans

// Function called when a QR code is successfully scanned
async function onScanSuccess(decodedText, decodedResult) {
  if (isScanning) return;
  isScanning = true; // Set flag to indicate scanning is in progress

  // document.getElementById('result').innerText = decodedText; // Display the result
  // console.log(`QR Code scanned: ${decodedText}`);
  await updateOrderInfo(decodedText);

  // const orderIDInput = document.getElementById('orderID');
  // const trackOrder = document.getElementById('trackOrder');
  // const reader = document.getElementById('reader');
  // // Hide order ID input and show video element
  // orderIDInput.classList.remove('hiddenn');
  // trackOrder.classList.remove('hiddenn');
  // reader.classList.add('hiddenn');
  // stopScan.classList.add('hiddenn');

  html5QrcodeScanner.clear().then(() => {
    console.log("Scanner stopped.");
  }).catch((error) => {
      console.error("Error stopping scanner:", error);
      isScanning = false; // Reset flag in case of error
  });
}

// Function called when there's a scanning error (e.g., QR code not found)
function onScanFailure(error) {
  console.warn(`QR Code scan error: ${error}`);
}

// Initialize the QR Code scanner, but don't start immediately
const html5QrcodeScanner = new Html5QrcodeScanner(
  "reader", 
  {
    fps: 10,            // Frames per second for scanning
    qrbox: { width: 250, height: 250 } // Define scan area size
  }
);

// Start scanning when the "Start Scanning" button is clicked
document.getElementById("startScan").addEventListener("click", () => {
  const orderIDInput = document.getElementById('orderID');
  const trackOrder = document.getElementById('trackOrder');
  const reader = document.getElementById('reader');
  orderIDInput.classList.add('hiddenn');
  trackOrder.classList.add('hiddenn');
  reader.classList.remove('hiddenn');

  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    })
    .catch((error) => {
      console.error("Camera access denied or unavailable:", error);
    });
});

async function updateOrderInfo(orderId) {
  // Define the endpoint and include the order ID
  const endpoint = `https://api.payuee.com/track-order/${orderId}`;

  try {
    // Make the request using Fetch API with credentials included
    const response = await fetch(endpoint, {
      credentials: 'include' // Include cookies in the request
    });

    if (!response.ok) {
      const data = await response.json();
      if (data.error.message === "sorry you can only track order related to your order history") {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.classList.remove('hiddenn'); // Show the error message
        errorMessage.textContent = "Sorry, you can only track orders associated with your order history.";
        return; // Stop further execution if there's an error
      }
      throw new Error('Failed to fetch order data.');
    }

    const data = await response.json();

    // Update the order tracking current URL
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?OrderID=${orderId}`;
    history.pushState({ path: newUrl }, '', newUrl);

    document.getElementById('getOrderTrackingDetails').classList.add('hidden');
    document.getElementById('orderTrackingDetails').classList.remove('hidden');
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