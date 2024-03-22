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
        if (historyData.status == 'success') {
            transactionStatus = 'assets/img/payment/g-check.png';
        } else if (historyData.status == 'pending') {
            transactionStatus = 'assets/img/payment/g-worning.png';
        } else if (historyData.status == 'failed') {
            transactionStatus = 'assets/img/payment/g-cross.png';
        }

        // Create a new table row element
        const rowElement = document.createElement('tr');
        rowElement.id = rowId; // Set the ID of the row

        // Create the HTML string with dynamic data using template literals
        rowElement.innerHTML = `
            <td>${historyData.date}</td>
            <td>${historyData.service}</td>
            <td>${historyData.price}</td>
            <td>${historyData.charge}</td>
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
        date: '01 Jan',
        service: 'Mobile Recharge',
        price: '₦750.00',
        charge: '-₦50.00',
        status: 'success',
    },
    {
        date: '27 Jan',
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

renderTransactionHistory(testData)