document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchField");
    searchInput.addEventListener("input", async function () {
        const query = this.value.trim();

        if (query.length > 0) { // Start searching after 1 characters
            const resultsContainer = document.getElementById("searchResults");
            resultsContainer.innerHTML = ''; // Clear previous results
            resultsContainer.innerHTML = `<li>Loading...</li>`;
            await getSearchResults(query);
        } else if (query.length == "") {
            const resultsContainer = document.getElementById("searchResults");
            resultsContainer.innerHTML = ''; // Clear previous results
            resultsContainer.innerHTML = `<li>Enter a search key to search for a product</li>`;
        }
        
    });
})


function renderSearch(results) {
    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = ''; // Clear previous results

    if (results.length > 0) {
        results.forEach(item => {
            const resultItem = document.createElement("li");
            resultItem.classList.add("sub-menu__item");

            // Check if there's an image to display
            const imageUrl = item.product_image?.[0]?.url
                ? `https://payuee.com/image/${encodeURIComponent(item.product_image[0].url)}`
                : '';

            resultItem.innerHTML = `
                <a href="${item.product_url_id}" class="menu-link menu-link_us-s d-flex align-items-center justify-content-between">
                    <span>${item.title}</span>
                    ${imageUrl ? `<img src="${imageUrl}" alt="${item.title}" class="search-result__image-small">` : ''}
                </a>
            `;

            resultsContainer.appendChild(resultItem);
        });
    } else {
        resultsContainer.innerHTML = `<li>No results found</li>`;
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