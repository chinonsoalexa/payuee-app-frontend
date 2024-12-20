document.addEventListener('DOMContentLoaded', async function () {
    const params = new URLSearchParams(window.location.search);

    let storeId = params.get('store-id')

    if (!isNullOrEmpty(storeId)) {
        await getStore(storeId);
        return;
    }
    await getStores();

    const searchInput = document.getElementById("storeSearchInput");

    if (searchInput) {
      searchInput.addEventListener("input", async function(event) {
        const searchTerm = event.target.value;
  
        if (searchTerm == "") {
            await getStores();
        } else {
            searchStores(searchTerm);
        }
      });
    }
});

function isNullOrEmpty(value) {
    return value === null || value.trim() === '';
}

async function getStore(id) {
    const apiUrl = "https://api.payuee.com/open/get-store/" + id;
  
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
  
            if (errorData.error === 'failed to get top available stores') {
                // need to do a data of just null event 
                // displayErrorMessage();
             } // else if (errorData.error === 'failed to get transaction history') {
                // need to do a data of just null event 
                
             //} else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
            //     // let's log user out the users session has expired
            //     logout();
            // }else {
            //     // displayErrorMessage();
            // }
  
            return;
        }
  
        const responseData = await response.json();
        renderStore(responseData.success);
       
  } finally {
  
    }
  }

async function getStores() {
    const apiUrl = "https://api.payuee.com/open/get-stores";
  
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
        const noStoresMessage = document.createElement('div');
        noStoresMessage.classList.add('store-location__search-result__item');
        noStoresMessage.innerHTML = `
            <h5>No available stores found</h5>
            <a href="https://payuee.com/e-shop/shop-outfits?page=1">Back to Shop</a>
        `;
        storeBody.appendChild(noStoresMessage);
        return;
    }

    // Render store cards if stores exist
    stores.forEach(store => {
        const rowElement = document.createElement('div');
        rowElement.classList.add('store-location__search-result__item');

        // Check if shop address is empty and set location accordingly
        const location = store.shop_address ? `${store.shop_address}<br>${store.shop_state}, ${store.shop_city}` : `${store.shop_state}, ${store.shop_city}`;

        rowElement.innerHTML = `
            <h5>${store.shop_name}</h5>
            <p>${store.shop_state}, ${store.shop_city}<br>${location}<br>Nigeria<br>${store.shop_phone}<br>${store.shop_email}<br>Open, ${store.open_days} days a week</p>
            <a id="store_selector_${store.userID}" href="/store/v/${store.store_unique_url}">Visit Store</a>
        `;
        storeBody.appendChild(rowElement);
    });
}

function renderStore(store) {
    const storeBody = document.getElementById('availableStores');
    
    // Clear any existing content
    storeBody.innerHTML = "";

    // Check if stores array is empty or null
    if (!store) {
        const noStoresMessage = document.createElement('div');
        noStoresMessage.classList.add('store-location__search-result__item');
        noStoresMessage.innerHTML = `
            <h5>No available stores found</h5>
            <a href="https://payuee.com/e-shop/shop-outfits?page=1">Back to Shop</a>
        `;
        storeBody.appendChild(noStoresMessage);
        return;
    }

    // Render store cards if stores exist
    const rowElement = document.createElement('div');
    rowElement.classList.add('store-location__search-result__item');

    // Check if shop address is empty and set location accordingly
    const location = store.shop_address ? `${store.shop_address}<br>${store.shop_state}, ${store.shop_city}` : `${store.shop_state}, ${store.shop_city}`;

    rowElement.innerHTML = `
        <h5>${store.shop_name}</h5>
        <p>${store.shop_state}, ${store.shop_city}<br>${location}<br>Nigeria<br>${store.shop_phone}<br>${store.shop_email}<br>Open, ${store.open_days} days a week</p>
        <a id="store_selector_${store.userID}" href="/store/v/${store.store_unique_url}">Visit Store</a>
    `;
    storeBody.appendChild(rowElement);
}