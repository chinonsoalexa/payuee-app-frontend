var dstv = [
    { value: 'dstv-padi', text: 'DStv Padi - ₦2,950' },
    { value: 'dstv-yanga', text: 'DStv Yanga - ₦4,200' },
    { value: 'dstv-confam', text: 'DStv Confam - ₦7,400' },
    { value: 'dstv6', text: 'DStv Asia - ₦9,900' },
    { value: 'dstv79', text: 'DStv Compact - ₦12,500' },
    { value: 'dstv7', text: 'DStv Compact Plus - ₦19,800' },
    { value: 'dstv3', text: 'DStv Premium - ₦29,500' },
    { value: 'dstv10', text: 'DStv Premium Asia - ₦33,000' },
    { value: 'dstv9', text: 'DStv Premium-French - ₦45,600' },
    { value: 'confam-extra', text: 'DStv Confam + ExtraView - ₦11,400' },
    { value: 'yanga-extra', text: 'DStv Yanga + ExtraView - ₦8,200' },
    { value: 'padi-extra', text: 'DStv Padi + ExtraView - ₦6,950' },
    { value: 'com-asia', text: 'DStv Compact + Asia - ₦22,400' },
    { value: 'dstv30', text: 'DStv Compact + Extra View - ₦16,500' },
    { value: 'com-frenchtouch', text: 'DStv Compact + French Touch - ₦17,100' },
    { value: 'dstv33', text: 'DStv Premium – Extra View - ₦33,500' },
    { value: 'dstv40', text: 'DStv Compact Plus – Asia - ₦29,700' },
    { value: 'com-frenchtouch-extra', text: 'DStv Compact + French Touch + ExtraView - ₦21,100' },
    { value: 'com-asia-extra', text: 'DStv Compact + Asia + ExtraView - ₦26,400' },
    { value: 'dstv43', text: 'DStv Compact Plus + French Plus - ₦35,900' },
    { value: 'complus-frenchtouch', text: 'DStv Compact Plus + French Touch - ₦24,400' },
    { value: 'dstv45', text: 'DStv Compact Plus – Extra View - ₦23,800' },
    { value: 'complus-french-extraview', text: 'DStv Compact Plus + FrenchPlus + Extra View - ₦39,900' },
    { value: 'dstv47', text: 'DStv Compact + French Plus - ₦28,600' },
    { value: 'dstv48', text: 'DStv Compact Plus + Asia + ExtraView - ₦33,700' },
    { value: 'dstv61', text: 'DStv Premium + Asia + Extra View - ₦43,400' },
    { value: 'dstv62', text: 'DStv Premium + French + Extra View - ₦40,700' },
    { value: 'hdpvr-access-service', text: 'DStv HDPVR Access Service - ₦4,000' },
    { value: 'frenchplus-addon', text: 'DStv French Plus Add-on - ₦16,100' },
    { value: 'asia-addon', text: 'DStv Asian Add-on - ₦9,900' },
    { value: 'frenchtouch-addon', text: 'DStv French Touch Add-on - ₦4,600' },
    { value: 'extraview-access', text: 'ExtraView Access - ₦4,000' },
    { value: 'french11', text: 'DStv French 11 - ₦7,200' },
];

var gotv = [
    { value: 'gotv-smallie', text: 'GOtv Smallie - ₦1,300' },
    { value: 'gotv-jinja', text: 'GOtv Jinja - ₦2,700' },
    { value: 'gotv-jolli', text: 'GOtv Jolli - ₦3,950' },
    { value: 'gotv-max', text: 'GOtv Max - ₦5,700' },
    { value: 'gotv-supa', text: 'GOtv Supa - ₦7,600' },
];

var startime = [
    { value: 'nova', text: 'Startimes Nova - ₦1,500' },
    { value: 'basic', text: 'Startimes Basic - ₦2,600' },
    { value: 'smart', text: 'Startimes Smart - ₦3,500' },
    { value: 'classic', text: 'Startimes Classic - ₦3,800' },
    { value: 'super', text: 'Startimes Super - ₦6,500' },
];

// Assuming 'planSelectId' is the ID of the div wrapping the select element
var planSelectDiv = document.getElementById('planSelectId');

// Create a new div for nice-select
var niceSelectDiv = document.createElement('div');
niceSelectDiv.className = 'nice-select';
niceSelectDiv.setAttribute('tabindex', '0');

// Create the current span inside nice-select
var currentSpan = document.createElement('span');
currentSpan.className = 'current';
currentSpan.textContent = 'Select Bundle';

// Create the list ul inside nice-select
var listUl = document.createElement('ul');
listUl.className = 'list';

// Create an option li inside the list
var optionLi = document.createElement('li');
optionLi.className = 'option focus selected';
optionLi.setAttribute('data-value', 'plans');
optionLi.textContent = 'Loading Bundles...';

// Append elements to build the structure
listUl.appendChild(optionLi);
niceSelectDiv.appendChild(currentSpan);
niceSelectDiv.appendChild(listUl);

// Append the nice-select div to planSelectDiv
planSelectDiv.appendChild(niceSelectDiv);

document.addEventListener('DOMContentLoaded', function() {
    var container = document.getElementById('getDataDiv');
    var dataValue;

    if (container) {
        container.addEventListener('click', function(event) {
            if (event.target.closest('.nice-select') && event.target.classList.contains('option')) {
                dataValue = event.target.getAttribute('data-value');
                getSelectedPlan(dataValue);
            }
        });
    } else {
        console.error('Container not found.');
    }
});

function getSelectedPlan(dataValue) {
    var data;

    switch (dataValue) {
        case '2':
            data = dstv;
            break;
        case '3':
            data = gotv;
            break;
        case '4':
            data = startime;
            break;
        default:
            // Handle other cases
            break;
    }

    displaySecondaryList(data);
}

function displaySecondaryList(data) {
    var plansList = document.querySelector('#planSelectId .nice-select .list');
    var niceSelectCurrentSpan = document.querySelector('#planSelectId .nice-select .current');

    // Clear existing list items
    plansList.innerHTML = '';

    // Sort the 'data' array based on the 'text' property
    data.sort((a, b) => a.text.localeCompare(b.text));

    data.forEach(plan => {
        var listItem = document.createElement('li');
        listItem.className = 'option';
        listItem.setAttribute('data-value', plan.value);
        listItem.textContent = `${plan.text}`;

        // Add a click event listener to each listItem
        listItem.addEventListener('click', function (event) {
            var dataValue = '';

            // Remove 'focus' class from all list items
            plansList.querySelectorAll('.option').forEach(item => {
                item.classList.remove('focus');
            });

            // Get the data-value attribute of the clicked list item
            if (event.target.classList.contains('option')) {
                dataValue = event.target.getAttribute('data-value');
            }

            // Add 'focus' class to the clicked list item
            event.target.classList.add('focus');

            // Handle the data value here or pass it to a function
           console.log(dataValue)
        });

        plansList.appendChild(listItem);
    });

    // Update nice-select current span text after the loop
    if (data.length > 0) {
        niceSelectCurrentSpan.textContent = `Select a Plan`;
    } else {
        niceSelectCurrentSpan.textContent = `Error getting plans`;
    }
}

// for the plan operator selector

// Assuming 'planSelectId' is the ID of the div wrapping the select element
var planSelectDiv = document.getElementById('getDataDiv');

// Create a new div for nice-select
var niceSelectDiv = document.createElement('div');
niceSelectDiv.className = 'nice-select';  // Add your class here
niceSelectDiv.id = 'planSelectId';   // Add your ID here
niceSelectDiv.setAttribute('tabindex', '0');

// Create the current span inside nice-select
var currentSpan = document.createElement('span');
currentSpan.className = 'current';
currentSpan.textContent = 'Select a Plan';

// Create the list ul inside nice-select
var listUl = document.createElement('ul');
listUl.className = 'list';

// Sample array of options
var options = [
    { value: '1', text: 'Select Your Operator' },
    { value: '2', text: 'DSTV' },
    { value: '3', text: 'GOTV' },
    { value: '4', text: 'Startimes' }
];

// Loop through options and create list items
options.forEach(option => {
    var listItem = document.createElement('li');
    listItem.className = 'option';
    listItem.setAttribute('data-value', option.value);
    listItem.textContent = option.text;

    // Add a click event listener to each listItem
    listItem.addEventListener('click', function (event) {
        console.log('event.target:', event.target); // Add this line for debugging
        var dataPrice = '';
    
        // Remove 'focus' class from all list items
        // plansList.querySelectorAll('.option').forEach(item => {
        //     item.classList.remove('focus');
        // });
    
        // Get the data-value attribute of the clicked list item
        if (event.target.classList.contains('option')) {
            dataPrice = event.target.getAttribute('data-value');
        }
        console.log('data price: ', dataPrice)
    
        // Add 'focus' class to the clicked list item
        event.target.classList.add('focus');
    });
    

    listUl.appendChild(listItem);
});

// Append elements to build the structure
niceSelectDiv.appendChild(currentSpan);
niceSelectDiv.appendChild(listUl);

// Append the nice-select div to planSelectDiv
planSelectDiv.appendChild(niceSelectDiv);
