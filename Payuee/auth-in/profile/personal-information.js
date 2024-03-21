// make request to the server for users profile details on load of the page
var responseData;
window.onload = async function () {
    const apiUrl = "https://payuee.onrender.com/profile";

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

            console.log(errorData);

            if (errorData.error === 'failed to get user from request') {
                // need to do a data of just null event 
                displayErrorMessage();
            } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!") {
                // let's log user out the users session has expired
                logUserOutIfTokenIsExpired();
            }else {
                
            }

            return;
        }

        responseData = await response.json();
        // console.log(responseData);
        // this is for the previous data
        document.getElementById('toggle-first-name-main').textContent = responseData.FirstName;
        document.getElementById('toggle-last-name-main').textContent = responseData.LastName;
        document.getElementById('toggle-address-main').textContent = responseData.Address;
        document.getElementById('toggle-balance-main').textContent = responseData.AccountBalance;
    } finally {

    }
}

var referral_link

var SHOW_EDIT = false;

document.getElementById('edit_button').addEventListener('click', function (event) {
    event.preventDefault()
    if (!SHOW_EDIT) {
        SHOW_EDIT = true;
        showEdit();
    } else if (SHOW_EDIT) {
        SHOW_EDIT = false;
        hideEdit();
        // let's make a request to the server to update the user's profile details
    }
})

function showEdit() {
    // this is for the previous data
    let firstName = document.getElementById('toggle-first-name-main').textContent.trim();
    let lastName = document.getElementById('toggle-last-name-main').textContent.trim();
    let address = document.getElementById('toggle-address-main').textContent.trim();

    // this is the input box to fill in the new data
    document.getElementById('first-name-input').value = firstName;
    document.getElementById('last-name-input').value = lastName;
    document.getElementById('address-input').value = address;

    document.getElementById('edit_button_one').classList.add('disabled');
    document.getElementById('edit_button_one').disabled = true;
    document.getElementById('toggle-first-name-main').classList.add('disabled');
    document.getElementById('toggle-first-name-main').disabled = true;
    document.getElementById('toggle-last-name-main').classList.add('disabled');
    document.getElementById('toggle-last-name-main').disabled = true;
    document.getElementById('toggle-address-main').classList.add('disabled');
    document.getElementById('toggle-address-main').disabled = true;

    document.getElementById('save_button_one').classList.remove('disabled');
    document.getElementById('save_button_one').disabled = false;
    document.getElementById('toggle-first-name').classList.remove('disabled');
    document.getElementById('toggle-first-name').disabled = false;
    document.getElementById('toggle-last-name').classList.remove('disabled');
    document.getElementById('toggle-last-name').disabled = false;
    document.getElementById('toggle-address').classList.remove('disabled');
    document.getElementById('toggle-address').disabled = false;
}

function hideEdit() {
    document.getElementById('toggle-first-name-main').classList.remove('disabled');
    document.getElementById('toggle-first-name-main').disabled = false;
    document.getElementById('edit_button_one').classList.remove('disabled');
    document.getElementById('edit_button_one').disabled = false;
    document.getElementById('toggle-last-name-main').classList.remove('disabled');
    document.getElementById('toggle-last-name-main').disabled = false;
    document.getElementById('toggle-address-main').classList.remove('disabled');
    document.getElementById('toggle-address-main').disabled = false;

    document.getElementById('toggle-first-name').classList.add('disabled');
    document.getElementById('toggle-first-name').disabled = true;
    document.getElementById('save_button_one').classList.add('disabled');
    document.getElementById('save_button_one').disabled = true;
    document.getElementById('toggle-last-name').classList.add('disabled');
    document.getElementById('toggle-last-name').disabled = true;
    document.getElementById('toggle-address').classList.add('disabled');
    document.getElementById('toggle-address').disabled = true;
}

document.getElementById('referral_link').addEventListener('click', function (event) {
    event.preventDefault();

    // Select and copy the content
    navigator.clipboard.writeText('https://payuee.vercel.app/Payuee/page/signin-new.html?referral-code=' + referral_link)
    .then(() => {
        // Success
        referralLinkCopier();
        console.log('success');
    })
    .catch((err) => {
        // Handle error
        // copyBtn.textContent = 'error...';
    });

})

function referralLinkCopier() {
    const installPopup = document.getElementById('referral-popup');
    const cancelButton = document.getElementById('cancel-btn');

      installPopup.style.display = 'block';

    // Cancel button click event
    cancelButton.addEventListener('click', () => {
      installPopup.style.display = 'none';
    });
}


function logUserOutIfTokenIsExpired() {
    // also send a request to the logout api endpoint
    const apiUrl = "https://payuee.onrender.com/log-out";

    const requestOptions = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    credentials: 'include', // set credentials to include cookies
    };
    
try {
    const response = fetch(apiUrl, requestOptions);

        // const data = response.json();
        localStorage.removeItem('auth')
        window.location.href = '../index.html'
    } finally{
        // do nothing
    }
}