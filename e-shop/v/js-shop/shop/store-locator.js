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
    // Get the current URL
    const currentUrl = new URL(window.location.href);

    // Extract parameters using URLSearchParams
    const params = new URLSearchParams(currentUrl.search);

    // Get individual parameter values
    let pageNumber = params.get("page");
    if (pageNumber == null) {
        pageNumber = "1";
    }

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
        renderStores(responseData.success, responseData);
       
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
        renderStores(responseData.success, null);
       
  } finally {
  
    }
  }
  
function renderStores(stores, responseData) {
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
        // const location = store.shop_address ? `${store.shop_address}<br>${store.shop_state}, ${store.shop_city}` : `${store.shop_state}, ${store.shop_city}`;

        // rowElement.innerHTML = `
        //     <h5>${store.shop_name}</h5>
        //     <p>${store.shop_state}, ${store.shop_city}<br>${location}<br>Nigeria<br>${store.shop_phone}<br>${store.shop_email}<br>Open, ${store.open_days} days a week</p>
        //     <a id="store_selector_${store.userID}" href="/store/v/${store.store_unique_url}">Visit Store</a>
        // `;

        rowElement.innerHTML = `
        <h5>${store.shop_name}</h5>
        <p>${store.shop_state}, ${store.shop_city}<br>Nigeria<br>Open, ${store.open_days === 0 ? 5 : store.open_days} days a week</p>
        <a id="store_selector_${store.userID}" href="/store/v/${store.store_unique_url}">Visit Store</a>
    `;
        storeBody.appendChild(rowElement);
    });

    if (responseData == null) {
        return;
    }

    NextPageOnLoad = responseData.pagination.NextPage;
    PreviousPageOnLoad = responseData.pagination.PreviousPage;
    CurrentPageOnLoad = responseData.pagination.CurrentPage;
    TotalPageOnLoad = responseData.pagination.TotalPages;
    TwoBeforePageOnLoad = responseData.pagination.TwoBefore;
    TwoAfterPageOnLoad = responseData.pagination.TwoAfter;
    ThreeAfterPageOnLoad = responseData.pagination.ThreeAfter;
    AllRecordsOnPageLoad = responseData.pagination.AllRecords;
    if (AllRecordsOnPageLoad > 6) {
        // let's disable the next page navigation button
        document.getElementById('paginationDiv').classList.remove('disabled');
        document.getElementById('paginationDiv').disabled = false;
    }

    if (CurrentPageOnLoad <= 1) {
        deactivatePreviousButton();
        deactivateBeforeButton();
    } else if (CurrentPageOnLoad >= responseData.pagination.TotalPages) {
        deactivateNextButton();
    }

    if (CurrentPageOnLoad < 4) {
        // let's disable the next page navigation button
        document.getElementById('constantBeforePage').classList.add('disabled');
        document.getElementById('constantBeforePage').disabled = true;
    }

    if (CurrentPageOnLoad < 5) {
        // let's disable the next page navigation button
        document.getElementById('dotBeforePage').classList.add('disabled');
        document.getElementById('dotBeforePage').disabled = true;
    }

    if (CurrentPageOnLoad > 2) {
        // let's update the pagination with the next page
        var currentPageElement = document.getElementById("twoBeforePage");
        var currentPageAnchor = currentPageElement.querySelector("a");
        currentPageAnchor.textContent = TwoBeforePageOnLoad;
    } else {
        // let's disable the next page navigation button
        document.getElementById('twoBeforePage').classList.add('disabled');
        document.getElementById('twoBeforePage').disabled = true;
    }

    // let's update the pagination with the next page
    var currentPageElement = document.getElementById("beforePage");
    var currentPageAnchor = currentPageElement.querySelector("a");
    currentPageAnchor.textContent = PreviousPageOnLoad;

    // let's update the pagination with the current page
    var currentPageElement = document.getElementById("currentPage");
    var currentPageAnchor = currentPageElement.querySelector("a");
    currentPageAnchor.textContent = CurrentPageOnLoad;
    deactivateCurrentButton();

    if (CurrentPageOnLoad >= TotalPageOnLoad) {
        // let's disable the next page navigation button
        document.getElementById('afterPage').classList.add('disabled');
        document.getElementById('afterPage').disabled = true;
    } else {
        // let's update the pagination with the next page
        var currentPageElement = document.getElementById("afterPage");
        var currentPageAnchor = currentPageElement.querySelector("a");
        currentPageAnchor.textContent = NextPageOnLoad;
    }

    if (TwoAfterPageOnLoad < TotalPageOnLoad) {
        // let's update the pagination with the next page
        var currentPageElement = document.getElementById("twoAfterPage");
        var currentPageAnchor = currentPageElement.querySelector("a");
        currentPageAnchor.textContent = TwoAfterPageOnLoad;
    } else {
        // let's disable the next page navigation button
        document.getElementById('twoAfterPage').classList.add('disabled');
        document.getElementById('twoAfterPage').disabled = true;
    }

    if (TwoAfterPageOnLoad > TotalPageOnLoad) {
        // let's disable the next page navigation button
        document.getElementById('constantAfterPage').classList.add('disabled');
        document.getElementById('constantAfterPage').disabled = true;
    } else {
        // let's update the pagination with the next page
        var currentPageElement = document.getElementById("constantAfterPage");
        var currentPageAnchor = currentPageElement.querySelector("a");
        currentPageAnchor.textContent = TotalPageOnLoad;
    }

    if (ThreeAfterPageOnLoad > TotalPageOnLoad) {
        // let's disable the next page navigation button
        document.getElementById('dotAfterPage').classList.add('disabled');
        document.getElementById('dotAfterPage').disabled = true;
    }
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
    // const location = store.shop_address ? `${store.shop_address}<br>${store.shop_state}, ${store.shop_city}` : `${store.shop_state}, ${store.shop_city}`;

    // rowElement.innerHTML = `
    //     <h5>${store.shop_name}</h5>
    //     <p>${store.shop_state}, ${store.shop_city}<br>${location}<br>Nigeria<br>${store.shop_phone}<br>${store.shop_email}<br>Open, ${store.open_days} days a week</p>
    //     <a id="store_selector_${store.userID}" href="/store/v/${store.store_unique_url}">Visit Store</a>
    // `;

    rowElement.innerHTML = `
        <h5>${store.shop_name}</h5>
        <p>${store.shop_state}, ${store.shop_city}<br>Nigeria<br>Open, ${store.open_days === 0 ? 5 : store.open_days} days a week</p>
        <a id="store_selector_${store.userID}" href="/store/v/${store.store_unique_url}">Visit Store</a>
    `;

    storeBody.appendChild(rowElement);
}

function deactivatePreviousButton() {
    var resendButton = document.getElementById('previousPage');
    // resendButton.className = '';
    resendButton.classList.add('deactivated'); // Add a class to the button
}

function deactivateBeforeButton() {
    var resendButton = document.getElementById('beforePage');
    // resendButton.className = '';
    resendButton.classList.add('deactivated'); // Add a class to the button
}

function deactivateNextButton() {
    var resendButton = document.getElementById('nextPage');
    // resendButton.className = '';
    resendButton.classList.add('deactivated'); // Add a class to the button
}

function deactivateCurrentButton() {
    var dotButtonBefore = document.getElementById('dotBeforePage');
    dotButtonBefore.classList.add('deactivated'); // Add a class to the button

    var dotButtonAfter = document.getElementById('dotAfterPage');
    dotButtonAfter.classList.add('deactivated'); // Add a class to the button

    var resendButton = document.getElementById('currentPage');
    resendButton.classList.add('deactivated'); // Add a class to the button
}