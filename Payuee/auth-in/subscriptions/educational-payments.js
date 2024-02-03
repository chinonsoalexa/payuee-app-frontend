document.getElementById('education-button-id').addEventListener('click', function(event) {
    // Prevent the default behavior (in this case, the redirect)
    event.preventDefault();
    buy_education_pin()
})

document.getElementById('back-to-data').addEventListener('click', function(event) {
    // Prevent the default behavior (in this case, the redirect)
    event.preventDefault();
    enableEducationDiv()
})

function buy_education_pin(){
var validated = true
// let's take all fields and validate
var phone = document.getElementById("phone-number").value;
console.log(phone)

if (phone.length > 12 || phone.length < 11) {
    validated = false
    showError('phone-error', 'Phone number should be at least 11 digits.');
}

// let's check the radio button that was checked
let checkedButton = radioButtonCheck('input[name="flexRadioDefault"]');

console.log('Checked radio button:', checkedButton);

// let's send a post request to make an education pin purchase

if (validated) {
    disableEducationDiv()
}
}

function showError(id, message, duration = 5000) {
var errorElement = document.getElementById(id);
errorElement.textContent = message;
errorElement.style.display = 'block'; // Change display to 'block'
errorElement.style.color = 'red'; // Set text color to red

// Set a timeout to hide the error message after the specified duration
setTimeout(function () {
    errorElement.textContent = ''; // Clear the error message
    errorElement.style.display = 'none'; // Hide the error message
}, duration);
}

function radioButtonCheck(idName) {
    let radioButtonCheck = ''
    // Get all radio buttons with the name 'flexRadioDefault'
    const radioButtons = document.querySelectorAll(idName);

    // Loop through the radio buttons
    radioButtons.forEach(function(radioButton) {
        // Check if the radio button is checked
        if (radioButton.checked) {
            // Log the id of the checked radio button
            radioButtonCheck = radioButton.id
        }
    });
    return radioButtonCheck
}

// Function to disable the div and its content
function disableEducationDiv() {
    document.getElementById('education-section').classList.add('disabled');
    document.getElementById('education-section').disabled = true;

    document.getElementById('invoice-section').classList.remove('disabled');
    document.getElementById('invoice-section').disabled = false;
}

// Function to enable the div and its content
function enableEducationDiv() {
    document.getElementById('education-section').classList.remove('disabled');
    document.getElementById('education-section').disabled = false;

    document.getElementById('invoice-section').classList.add('disabled');
    document.getElementById('invoice-section').disabled = true;
}