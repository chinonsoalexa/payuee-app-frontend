document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchField");
    searchInput.addEventListener("input", function () {
        const query = this.value.trim();

        if (query.length > 1) { // Start searching after 1 characters
            getSearchResults(query);
        }
        
    });
})


function renderSearch(results) {
    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = ''; // Clear previous results

    if (results.length > 0) {
        results.forEach(item => {
        const resultItem = document.createElement("div");
        resultItem.classList.add("col");

        resultItem.innerHTML = `
          <a href="${item.product_url_id}" class="search-result__item">
            <img src="../images/home/demo3/category_7.png" alt="${item.title}" class="search-result__image w-100">
            <p class="search-result__name">${item.title}</p>
          </a>
        `;

        resultsContainer.appendChild(resultItem);
      });
    } else {
      resultsContainer.innerHTML = `<p>No results found</p>`;
    }
}

async function getSearchResults(query) {
    // Endpoint URL
    const apiUrl = "https://api.payuee.com/search-products/" + query;

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
            const data = await response.json();
            // showToastMessageE(`response: ${data}`);
            return;
        }else {
            // Process the response data
            const data = await response.json();
            renderSearch(data.success);
        }

    } catch (error) {
        console.error('Error fetching user balance: ', error);
    }
}