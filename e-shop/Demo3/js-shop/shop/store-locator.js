document.addEventListener('DOMContentLoaded', async function () {
    await getStores();

    const searchInput = document.getElementById("storeSearchInput");

    if (searchInput) {
      searchInput.addEventListener("input", function(event) {
        const searchTerm = event.target.value;
  
        searchStores(searchTerm);
      });
    }
});

async function getStores() {
    const apiUrl = "https://api.payuee.com/get-stores";
  
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
  
            // if (errorData.error === 'failed to get user from request') {
            //     // need to do a data of just null event 
            //     // displayErrorMessage();
            // } else if (errorData.error === 'failed to get transaction history') {
            //     // need to do a data of just null event 
                
            // } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
            //     // let's log user out the users session has expired
            //     logout();
            // }else {
            //     // displayErrorMessage();
            // }
  
            return;
        }
  
        const responseData = await response.json();
        renderStores(responseData.success);
       
  } finally {
  
    }
  }

  async function searchStores(query) {
    const apiUrl = "https://api.payuee.com/search-stores";

    const requestBody = {
        query: query, 
    };   

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include', // set credentials to include cookies
        body: JSON.stringify(requestBody)
    };
  
    try {
        const response = await fetch(apiUrl, requestOptions);
  
        if (!response.ok) {
            const errorData = await response.json();
  
            // if (errorData.error === 'failed to get user from request') {
            //     // need to do a data of just null event 
            //     // displayErrorMessage();
            // } else if (errorData.error === 'failed to get transaction history') {
            //     // need to do a data of just null event 
                
            // } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
            //     // let's log user out the users session has expired
            //     logout();
            // }else {
            //     // displayErrorMessage();
            // }
  
            return;
        }
  
        const responseData = await response.json();
        renderStores(responseData.success);
       
  } finally {
  
    }
  }
  
  function renderStores(stores) {
    const storeBody = document.getElementById('availableStores');
    
    // Clear any existing content
    storeBody.innerHTML = "";

    // Check if stores array is empty or null
    if (!stores || stores.length === 0) {
        const noStoresMessage = document.createElement('p');
        noStoresMessage.classList.add('no-stores-message');
        noStoresMessage.textContent = "No available stores found.";
        storeBody.appendChild(noStoresMessage);
        return;
    }

    // Render store cards if stores exist
    stores.forEach(store => {
        const rowElement = document.createElement('div');
        rowElement.classList.add('store-location__search-result__item');
        rowElement.innerHTML = `
            <h5>Store in ${store.shop_state}, ${store.shop_city}</h5>
            <p>${store.shop_address}<br>Nigeria<br>${store.shop_phone}<br>Open, ${store.open_days} days a week</p>
            <a id="store_selector_1" href="shop-vendor.html?">Visit Store</a>
        `;
        storeBody.appendChild(rowElement);
    });
}