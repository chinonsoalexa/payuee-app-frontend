var NextPageOnLoad;
var PreviousPageOnLoad;
var CurrentPageOnLoad;
var TotalPageOnLoad;
var TwoBeforePageOnLoad;
var TwoAfterPageOnLoad;
var ThreeAfterPageOnLoad;
var AllRecordsOnPageLoad;

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
    renderStoreSkeleton(10);
    // Get the current URL
    const currentUrl = new URL(window.location.href);

    // Extract parameters using URLSearchParams
    const params = new URLSearchParams(currentUrl.search);

    // Get individual parameter values
    let pageNumber = params.get("page");
    if (pageNumber == null) {
        pageNumber = "1";
    }

    const apiUrl = "https://api.payuee.com/open/get-stores/" + pageNumber;
  
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
        // renderStores(responseData.success, responseData);
        renderStores(responseData?.success || [], responseData);
       
  } finally {
  
    }
  }

  async function searchStores(query) {
    renderStoreSkeleton(10);
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
            <a href="https://payuee.com/e-shop/v/shop-outfits?page=1">Back to Shop</a>
        `;
        storeBody.appendChild(noStoresMessage);
        return;
    }

    // Render store cards if stores exist
    const DEFAULT_STORE_IMAGE = "https://payuee.com/e-shop/images/shop/shop_banner6.png";
    const BASE_IMAGE_URL = "https://payuee.com/image/"; // adjust if needed

    stores.forEach(store => {

        const imageUrl = store.shop_image
            ? BASE_IMAGE_URL + store.shop_image
            : DEFAULT_STORE_IMAGE;

        const openDays = store.open_days === 0 ? 5 : store.open_days;

        const rowElement = document.createElement('div');
        rowElement.classList.add('store-card');

        rowElement.innerHTML = `
            <div class="store-card-inner">
                
                <!-- Store Image -->
                <div class="store-image">
                    <img src="${imageUrl}" alt="${store.shop_name}"
                        onerror="this.src='${DEFAULT_STORE_IMAGE}'">
                </div>

                <!-- Store Info -->
                <div class="store-info">
                    <h5>${store.shop_name}</h5>

                    <p class="location">
                        <span class="state">📍 ${store.shop_state}</span>, ${store.shop_city}
                    </p>

                    <p class="meta">
                        🛍 ${store.total_product} products <br>
                        📅 Open ${openDays} days/week
                    </p>

                    <a class="visit-btn" href="/store/v/${store.store_unique_url}">
                        Visit Store →
                    </a>
                </div>
            </div>
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
        // console.log(responseData);
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('page', CurrentPageOnLoad);
        window.history.pushState({path: newUrl.href}, '', newUrl.href);
        
        if (TotalPageOnLoad > 1) {
            document.getElementById('paginationDiv').classList.remove('disabled');
            document.getElementById('paginationDiv').disabled = false;
        }

        if (CurrentPageOnLoad <= 1) {
            deactivatePreviousButton();
            deactivateBeforeButton();
        } else if (CurrentPageOnLoad >= TotalPageOnLoad) {
            deactivateNextButton();
        }

        let nextPageButtonI = document.getElementById('nextPage');
        nextPageButtonI.href = `https://payuee.com/e-shop/v/store_location?page=${CurrentPageOnLoad+1}`;
        let previousPageButtonI = document.getElementById('previousPage');
        previousPageButtonI.href = `https://payuee.com/e-shop/v/store_location?page=${CurrentPageOnLoad-1}`;

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
            updateLink(currentPageElement, TwoBeforePageOnLoad);
            currentPageElement.textContent = TwoBeforePageOnLoad;
        } else {
            // let's disable the next page navigation button
            document.getElementById('twoBeforePage').classList.add('disabled');
            document.getElementById('twoBeforePage').disabled = true;
        }

        // let's update the pagination with the next page
        var currentPageElement = document.getElementById("beforePage");
        updateLink(currentPageElement, PreviousPageOnLoad);
        currentPageElement.textContent = PreviousPageOnLoad;

        // let's update the pagination with the current page
        var currentPageElement = document.getElementById("currentPage");
        updateLink(currentPageElement, CurrentPageOnLoad);
        currentPageElement.textContent = CurrentPageOnLoad;
        deactivateCurrentButton();

        if (CurrentPageOnLoad >= TotalPageOnLoad) {
            // let's disable the next page navigation button
            document.getElementById('afterPage').classList.add('disabled');
            document.getElementById('afterPage').disabled = true;
        } else {
            // let's update the pagination with the next page
            var currentPageElement = document.getElementById("afterPage");
            updateLink(currentPageElement, NextPageOnLoad);
            currentPageElement.textContent = NextPageOnLoad;
        }

        if (TwoAfterPageOnLoad < TotalPageOnLoad) {
            // let's update the pagination with the next page
            var currentPageElement = document.getElementById("twoAfterPage");
            updateLink(currentPageElement, TwoAfterPageOnLoad);
            currentPageElement.textContent = TwoAfterPageOnLoad;
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
            updateLink(currentPageElement, TotalPageOnLoad);
            currentPageElement.textContent = TotalPageOnLoad;
        }

        if (ThreeAfterPageOnLoad > TotalPageOnLoad) {
            // let's disable the next page navigation button
            document.getElementById('dotAfterPage').classList.add('disabled');
            document.getElementById('dotAfterPage').disabled = true;
        }
}

function renderStoreSkeleton(count = 6) {
    const storeBody = document.getElementById('availableStores');
    storeBody.innerHTML = "";

    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement('div');
        skeleton.classList.add('store-card');

        skeleton.innerHTML = `
            <div class="store-card-inner skeleton-card">
                
                <div class="store-image skeleton-box"></div>

                <div class="store-info">
                    <div class="skeleton-line title"></div>
                    <div class="skeleton-line small"></div>
                    <div class="skeleton-line small"></div>
                    <div class="skeleton-btn"></div>
                </div>

            </div>
        `;

        storeBody.appendChild(skeleton);
    }
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

function updateLink(urlIdToUpdate, pageNumber) {
    urlIdToUpdate.href = `https://payuee.com/e-shop/v/store_location?page=${pageNumber}`;
}