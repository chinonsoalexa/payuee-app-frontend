// make request to the server for users profile details on load of the page
var responseData;
var ReferralCode;
document.addEventListener('DOMContentLoaded', async function () {
    document.getElementById('toggle-first-name-main').textContent = "Loading...";
    document.getElementById('toggle-last-name-main').textContent = "Loading...";
    document.getElementById('toggle-address-main').textContent = "Loading...";
    document.getElementById('referral_link_number').textContent = "Loading...";
    const apiUrl = "https://api.payuee.com/web/profile";

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

            // console.log(errorData);

            if (errorData.error === 'failed to get user from request') {
                // need to do a data of just null event 
                // displayErrorMessage();
            } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!") {
                // let's log user out the users session has expired
                // logUserOutIfTokenIsExpired();
            }else {
                document.getElementById('toggle-first-name-main').textContent = "...";
                document.getElementById('toggle-last-name-main').textContent = "...";
                document.getElementById('toggle-address-main').textContent = "...";
                document.getElementById('referral_link_number').textContent = "...";
            }
            return;
        }

        responseData = await response.json();
        // this is for the previous data
        var firstNamee = document.getElementById('toggle-first-name-main');
        var lastNamee = document.getElementById('toggle-last-name-main'); 
        var homeAddress = document.getElementById('toggle-address-main');
        var referralNum = document.getElementById('referral_link_number');
        var phoneNumberActivated = document.getElementById('link_whatsapp_ai');
        firstNamee.textContent = responseData.success.FirstName;
        if (responseData.success.FirstName == "") {
            firstNamee.textContent = "Add First Name";
        }
        lastNamee.textContent = responseData.success.LastName;
        if (responseData.success.lastNamee == "") {
            lastNamee.textContent = "Add Last Name";
        }
        homeAddress.textContent = responseData.success.Address;
        if (responseData.success.Address == "") {
            homeAddress.textContent = "Add Home Address";
        }
        referralNum.textContent = responseData.success.NumberOfReferrals;
        if (responseData.success.NumberOfReferrals == "") {
            referralNum.textContent = 0;
        }
        document.getElementById('toggle-balance-main').textContent = formatNumberToNaira(responseData.success.AccountBalance);
        document.getElementById('toggle-email-main').textContent = responseData.success.Email;
        ReferralCode = responseData.success.ReferralCode;
        // if (responseData.success.PhoneNumberActivated == true) {
        //     phoneNumberActivated.textContent = "Congratulations! Your account is now linked to our AI-powered WhatsApp chat for advanced assistance. Get ready for a seamless and personalized customer care experience like never before!";
        // }
    } finally {

    }
});

function formatNumberToNaira(number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(number);
}

var referral_link

var SHOW_EDIT = false;

document.getElementById('edit_button').addEventListener('click', async function (event) {
    event.preventDefault()
    if (!SHOW_EDIT) {
        SHOW_EDIT = true;
        showEdit();
    } else if (SHOW_EDIT) {
        SHOW_EDIT = false;
        // let's compare the previous data and the updated data to be sent and only send a request when there is a change in any of the previous data
        // let's first get the old data
        // this is for the previous data
        let firstName = document.getElementById('toggle-first-name-main').textContent.trim();
        let lastName = document.getElementById('toggle-last-name-main').textContent.trim();
        let address = document.getElementById('toggle-address-main').textContent.trim();

        // this is the input box to fill in the new data
        let firstNameBox = document.getElementById('first-name-input').value;
        let lastNameBox = document.getElementById('last-name-input').value;
        let addressBox = document.getElementById('address-input').value;

        if (firstName !== firstNameBox || lastName !== lastNameBox || address !== addressBox) {
                // let's fill in data to send to the server for profile update
                const details = {
                    FirstName:     firstNameBox,
                    LastName:       lastNameBox,
                    Email:          "",
                    AccountBalance: 0,
                    Address:        addressBox,
                    ReferralCode:   "",
                  };
        
                  const apiUrl = "https://api.payuee.com/web/profile/update";
        
                  const requestOptions = {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    credentials: 'include', // set credentials to include cookies
                    body: JSON.stringify(details),
                  };
                  
                try {
                    const response = await fetch(apiUrl, requestOptions);
                    if (!response.ok) {
                        // Parse the response JSON
                        const errorData = await response.json();
                        // Check the error message
                        // Handle fetch-related errors
                        if (errorData.error === 'User ID is < nil >') {
                            // Perform actions specific to this error
                            // showError('magicLinkError', 'User does not exist');
                        } else if  (errorData.error === 'Failed to read profile updated body') {
                            // Handle other error cases
                            showError('magicLinkError', 'This email is invalid because it uses illegal characters. Please enter a valid email.');
                        } else if  (errorData.error === "an error occurred while updating user's profile") {
                            // redirect user to verify email ID
                            showErrorUserExist('magicLinkError', 'User already exist, please verify your email ID.');
                            // window.location.href = '/verify';
                        } else {
                            showError('magicLinkError', 'An error occurred. Please try again.');
                        }
                        return;
                    }
                    const responseData = await response.json();
                    document.getElementById('toggle-first-name-main').textContent = responseData.success.FirstName;
                    document.getElementById('toggle-last-name-main').textContent = responseData.success.LastName;
                    document.getElementById('toggle-address-main').textContent = responseData.success.Address;
                    document.getElementById('toggle-balance-main').textContent = formatNumberToNaira(responseData.success.AccountBalance);
                    document.getElementById('toggle-email-main').textContent = responseData.success.Email;
                    ReferralCode = responseData.success.ReferralCode;
                } finally{
                   // do nothing cause error has been handled
            }
        }

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
    navigator.clipboard.writeText('https://payuee.com/page/signup-new?referral-code=' + ReferralCode)
    .then(() => {
        // Success
        referralLinkCopier();
        console.log('success');
    })
    .catch((err) => {
        // Handle error
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
    const apiUrl = "https://api.payuee.com/web/log-out";

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

const firstName = document.getElementById('first-name-input');
const lastName = document.getElementById('last-name-input');
const address = document.getElementById('address-input');

firstName.addEventListener('input', function (event) {
    const inputValue = event.target.value;

    // Replace any characters that are not alphabets, numbers, underscores, or hyphens with an empty string
    const sanitizedValue = inputValue.replace(/[^A-Za-z0-9_\-]/g, '');

    // Update the input box value with the sanitized value
    event.target.value = sanitizedValue;
});

lastName.addEventListener('input', function (event) {
    const inputValue = event.target.value;

    // Replace any characters that are not alphabets, numbers, underscores, or hyphens with an empty string
    const sanitizedValue = inputValue.replace(/[^A-Za-z0-9_\-]/g, '');

    // Update the input box value with the sanitized value
    event.target.value = sanitizedValue;
});

address.addEventListener('input', function (event) {
    const inputValue = event.target.value;

    // Replace any characters that are not alphabets, numbers, underscores, hyphens, full stops, commas, or spaces with an empty string
    const sanitizedValue = inputValue.replace(/[^A-Za-z0-9_\-.,\s]/g, '');

    // Update the input box value with the sanitized value
    event.target.value = sanitizedValue;
});

// const whatsappNumberInput = document.getElementById("whatsapp-number");

// whatsappNumberInput.addEventListener('input', function (event) {
//     let inputValue = event.target.value;

//     // Remove any characters that are not numbers
//     inputValue = inputValue.replace(/\D/g, '');

//     // Limit the input to 10 digits
//     inputValue = inputValue.substring(0, 10);

//     // Update the input box value with the sanitized value
//     event.target.value = inputValue;
// });

// // Function to send OTP code to WhatsApp number
// async function sendOtpToWhatsappNumber(whatsappNumber) {
//     console.log('Number to send OTP to:', whatsappNumber);
//     const apiUrl = 'https://api.payuee.com/web/link-whatsapp/' + whatsappNumber;

//     const requestOptions = {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         credentials: 'include', // Include cookies in the request
//     };

//     try {
//         const response = await fetch(apiUrl, requestOptions);

//         if (!response.ok) {
//             const errorData = await response.json();

//             if (errorData.error === 'failed to get user from request') {
//                 // Handle specific error condition
//             } else if (errorData.error === 'failed to get transaction history') {
//                 // Handle specific error condition
//             } else if (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!") {
//                 // Handle session expiration
//                 logUserOutIfTokenIsExpired();
//             } else {
//                 // Handle other errors
//             }

//             return null;
//         }

//         const responseData = await response.json();
//         return responseData; // Return the response data
//     } catch (error) {
//         console.error('Error:', error);
//         throw error; // Throw the error to handle it outside the function
//     }
// }

// // Function to verify WhatsApp OTP code
// async function verifyWhatsappOtpCode(whatsappNumber, sentOtp) {
//     const url = 'https://api.payuee.com/web/verify-whatsapp';
//     try {
//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             credentials: 'include', // Include cookies in the request
//             body: JSON.stringify({
//                 Number: whatsappNumber,
//                 SentOTP: sentOtp,
//             }),
//         });
//         const data = await response.json();
//         return data; // Return the response data
//     } catch (error) {
//         console.error('Error:', error);
//         throw error; // Throw the error to handle it outside the function
//     }
// }

// // Function to handle WhatsApp connection
// // Add event listener to connect button
// document.getElementById('connectWhatsapp').addEventListener('click',  (event) => {
    
//     event.preventDefault()
//     const installPopup = document.getElementById('whatsapp-connect-popup');
//     const cancelButton = document.getElementById('whatsapp-cancel-btn');
//     const verifyButton = document.getElementById('verify-btn');
//     const whatsappNumberInput = document.getElementById('whatsapp-number');

//     installPopup.style.display = 'block';

//     // Cancel button click event
//     cancelButton.addEventListener('click', () => {
//         installPopup.style.display = 'none';
//     });

//     // Verify button click event
//     verifyButton.addEventListener('click', async (event) => {
//         event.preventDefault()
//         const whatsappNumber = whatsappNumberInput.value;

//         // Send request to send OTP
//         const sendOtpResponse = await sendOtpToWhatsappNumber(whatsappNumber);
//         console.log(sendOtpResponse);

//         // Display verification popup
//         installPopup.style.display = 'none';
//         const verificationPopup = document.getElementById('whatsapp-verification-popup');
//         verificationPopup.style.display = 'block';

//         // Handle verification submit button click
//         const submitButton = document.getElementById('submit-verification-btn');
//         const verificationCodeInput = document.getElementById('verification-code');
//         submitButton.addEventListener('click', async () => {
//             verificationPopup.style.display = 'none';
//             const whatsappOtp = verificationCodeInput.value;

//             // Send request to verify OTP
//             const verifyOtpResponse = await verifyWhatsappOtpCode(whatsappNumber, whatsappOtp);
//             console.log(verifyOtpResponse);

//             // Display verification message
//             const verificationMessagePopup = document.getElementById('whatsapp-verification-popup2');
//             const whatsappAuthMessage = document.getElementById('whatsappAuthMessage');
//             whatsappAuthMessage.textContent = verifyOtpResponse;
//             verificationMessagePopup.style.display = 'block';

//             // Handle message popup close button click
//             const closeButton = document.getElementById('message-cancel-btn');
//             closeButton.addEventListener('click', () => {
//                 verificationMessagePopup.style.display = 'none';
//             });
//         });
//     });
// });
