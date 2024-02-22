    // Get the radio buttons by name
    const radioButtons = document.querySelectorAll('input[name="flexRadioDefault"]');

    // Add an event listener to each radio button
    radioButtons.forEach(button => {
        button.addEventListener('change', function() {
            // Perform your desired action here
            console.log(`Selected option: ${this.id}`);

            if (this.id === "transfer") {
                enablePaystackDiv()
            } else if (this.id === "paystack") { 
                disablePaystackDiv()
            }
        });
    });

    // Function to disable the div and its content
function disablePaystackDiv() {
    deactivateButtonStyles();
    document.getElementById('fund_payuee1').classList.remove('disabled');
    document.getElementById('fund_payuee1').disabled = false;
    document.getElementById('fund_payuee2').classList.remove('disabled');
    document.getElementById('fund_payuee2').disabled = false;
}

// Function to enable the div and its content
function enablePaystackDiv() {
    reactivateButtonStyles();
    document.getElementById('fund_payuee1').classList.add('disabled');
    document.getElementById('fund_payuee1').disabled = true;
    document.getElementById('fund_payuee2').classList.add('disabled');
    document.getElementById('fund_payuee2').disabled = true;
}

// Add this function to remove onclick and on hover styles
function deactivateButtonStyles() {
    var resendButton = document.getElementById('fund_wallet');
    resendButton.classList.add('deactivated'); // Add a class to the button
}

// Add this function to reactivate the button styles
function reactivateButtonStyles() {
    var resendButton = document.getElementById('fund_wallet');
    // Remove all existing classes
    resendButton.className = '';
    // Add the original class 'cmn__btn'
    resendButton.classList.add('cmn__btn');
}