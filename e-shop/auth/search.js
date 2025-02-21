document.addEventListener("DOMContentLoaded", async function () {
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

    const searchInput2 = document.getElementById('searchFIeldM');
    const searchButton = document.getElementById('searchButtonM');
    const clearButton = document.getElementById('clearButtonM');
    const productSearch2 = document.getElementById('productSearch2');

    // Function to toggle buttons based on input
    async function toggleButtons() {
        if (searchInput2.value.trim() !== "") {
            if (searchInput2.value.trim().length > 0) { // Start searching after 1 characters
                const resultsContainer2 = document.getElementById("searchResults2");
                resultsContainer2.innerHTML = ''; // Clear previous results
                resultsContainer2.innerHTML = `<li>Loading...</li>`;
                await getSearchResults2(searchInput2.value.trim());
            } else if (searchInput2.value.trim().length == "") {
                const resultsContainer2 = document.getElementById("searchResults2");
                resultsContainer2.innerHTML = ''; // Clear previous results
                resultsContainer2.innerHTML = `<li>Enter a search key to search for a product</li>`;
            }
            searchButton.classList.add('hiddenn'); // Hide search button
            clearButton.classList.remove('hiddenn'); // Show clear button
            productSearch2.classList.remove('hiddenn'); // Show search list
        } else {
            searchButton.classList.remove('hiddenn'); // Show search button
            clearButton.classList.add('hiddenn'); // Hide clear button
            productSearch2.classList.add('hiddenn'); // Show clear button
        }
    }

    toggleButtons(); // Update button visibility

    // Listen for input changes
    searchInput2.addEventListener('input', toggleButtons);

    // Clear input and reset buttons when clear button is clicked
    clearButton.addEventListener('click', function() {
        searchInput2.value = ""; // Clear the input
        toggleButtons(); // Update button visibility
        searchInput2.focus(); // Optionally refocus on the input
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

                let url = ""
                if (item.category == "outfits") {
                    url = "https://payuee.com/outfits/" + item.product_url_id;
                } else if (item.category == "jewelry") {
                    url = "https://payuee.com/jewelry/" + item.product_url_id;
                } else if (item.category == "kids-accessories") {
                    url = "https://payuee.com/kids/" + item.product_url_id;
                } else if (item.category == "cars-car-parts") {
                    url = "https://payuee.com/cars/" + item.product_url_id;
                } else if (item.category == "tools") {
                    url = "https://payuee.com/tools/" + item.product_url_id;
                } else if (item.category == "gadgets") {
                    url = "https://payuee.com/gadgets/" + item.product_url_id;
                } else if (item.category == "others") {
                    url = "https://payuee.com/outfits/" + item.product_url_id;
                }
            resultItem.innerHTML = `
                <a href="${url}" class="menu-link d-flex align-items-center justify-content-between">
                    <span>${item.title}</span>
                    ${imageUrl ? `<img src="${imageUrl}" alt="${item.title}" class="search-result__image-small">` : ''}
                </a>
            `;

            // Add click event listener to track product clicks
            resultItem.addEventListener("click", () => {
                fetch(`https://api.payuee.com/product-click/${encodeURIComponent(item.title)}/${encodeURIComponent(item.product_url_id)}/${encodeURIComponent(item.category)}/${encodeURIComponent(item.selling_price)}`, {
                    method: "GET",
                    credentials: 'include' // Ensures cookies and authentication are sent
                });
            });

            resultsContainer.appendChild(resultItem);
        });
    } else {
        resultsContainer.innerHTML = `<li>No results found</li>`;
    }
}

function renderSearch2(results) {
    const resultsContainer = document.getElementById("searchResults2");
    resultsContainer.innerHTML = ''; // Clear previous results

    if (results.length > 0) {
        results.forEach(item => {
            const resultItem = document.createElement("li");
            resultItem.classList.add("sub-menu__item", "searchResultu");

            // Check if there's an image to display
            const imageUrl = item.product_image?.[0]?.url
                ? `https://payuee.com/image/${encodeURIComponent(item.product_image[0].url)}`
                : '';

                let url = ""
                if (item.category == "outfits") {
                    url = "https://payuee.com/outfits/" + item.product_url_id;
                } else if (item.category == "jewelry") {
                    url = "https://payuee.com/jewelry/" + item.product_url_id;
                } else if (item.category == "kids-accessories") {
                    url = "https://payuee.com/kids/" + item.product_url_id;
                } else if (item.category == "cars-car-parts") {
                    url = "https://payuee.com/cars/" + item.product_url_id;
                } else if (item.category == "tools") {
                    url = "https://payuee.com/tools/" + item.product_url_id;
                } else if (item.category == "gadgets") {
                    url = "https://payuee.com/gadgets/" + item.product_url_id;
                } else if (item.category == "others") {
                    url = "https://payuee.com/outfits/" + item.product_url_id;
                }
            resultItem.innerHTML = `
                <a  href="${url}" class="menu-link d-flex align-items-center justify-content-between">
                    <span>${item.title}</span>
                    ${imageUrl ? `<img src="${imageUrl}" alt="${item.title}" class="search-result__image-small">` : ''}
                </a>
            `;

            // Add click event listener to track product clicks
            resultItem.addEventListener("click", () => {
                fetch(`https://api.payuee.com/product-click/${encodeURIComponent(item.title)}/${encodeURIComponent(item.product_url_id)}/${encodeURIComponent(item.category)}/${encodeURIComponent(item.selling_price)}`, {
                    method: "GET",
                    credentials: 'include' // Ensures cookies and authentication are sent
                });
            });

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

async function getSearchResults2(query) {
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
            renderSearch2(data.success);
        }

    } catch (error) {
        console.error('Error fetching search details: ', error);
    }
}