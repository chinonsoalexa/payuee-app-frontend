function renderSizes(clothingSizes, shoeSizes) {
    if (clothingSizes == "" && shoeSizeArray == "") return
    
    // Define labels for each size if needed
    const sizeLabels = {
      XS: "Extra Small",
      S: "Small",
      M: "Middle",
      L: "Large",
      XL: "Extra Large",
      XXL: "Extra Extra Large",
      "<- 20": "Less than 20",
      "20-25": "20 to 25",
      "25-30": "25 to 30",
      "30-40": "30 to 40",
      "40-45": "40 to 45",
      "45 ->": "Greater than 45",
    };
  
    // Split the size strings into arrays
    const clothingSizeArray = clothingSizes.split(",");
    const shoeSizeArray = shoeSizes.split(",");
    
    // Combine both clothing and shoe sizes into one array
    const allSizes = [...clothingSizeArray, ...shoeSizeArray];
    
    // Initialize an empty string to store the HTML
    let htmlOutput = "";
  
    // Generate HTML for each size
    allSizes.forEach((size, index) => {
      const id = `swatch-${index + 1}`;
      const label = sizeLabels[size] || size; // Use label from sizeLabels or fallback to size
  
      // Append input and label elements to the HTML string
      htmlOutput += `
        <input type="radio" name="size" id="${id}">
        <label class="swatch js-swatch" for="${id}" aria-label="${label}" 
               data-bs-toggle="tooltip" data-bs-placement="top" title="${label}">
          ${size}
        </label>

        <input type="radio" name="size" id="swatch-1">
        <label class="swatch js-swatch" for="swatch-1" aria-label="Extra Small" data-bs-toggle="tooltip" data-bs-placement="top" title="Extra Small">XS</label>
      `;
    });
  
    let returnedData = `
    <div class="product-single__swatches">
              <div class="product-swatch text-swatches">
                <label>Sizes</label>
                <div class="swatch-list">
                  ${htmlOutput}
                </div>
              </div>
            </div>`

    // Return the HTML string
    return htmlOutput;
  }

  let color = `
            <div class="product-swatch color-swatches">
            <label>Color</label>
            <div class="swatch-list">
              <input type="radio" name="color" id="swatch-11">
              <label class="swatch swatch-color js-swatch" for="swatch-11" aria-label="Black" data-bs-toggle="tooltip" data-bs-placement="top" title="Black" style="color: #222"></label>
              <input type="radio" name="color" id="swatch-12" checked>
              <label class="swatch swatch-color js-swatch" for="swatch-12" aria-label="Red" data-bs-toggle="tooltip" data-bs-placement="top" title="Red" style="color: #C93A3E"></label>
              <input type="radio" name="color" id="swatch-13">
              <label class="swatch swatch-color js-swatch" for="swatch-13" aria-label="Grey" data-bs-toggle="tooltip" data-bs-placement="top" title="Grey" style="color: #E4E4E4"></label>
            </div>
          </div>
        </div>`