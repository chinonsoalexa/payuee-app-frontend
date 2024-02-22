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
    document.getElementById('fund_payuee1').classList.remove('disabled');
    document.getElementById('fund_payuee1').disabled = false;
    document.getElementById('fund_payuee2').classList.remove('disabled');
    document.getElementById('fund_payuee2').disabled = false;
    document.getElementById('fund_payuee3').classList.remove('disabled');
    document.getElementById('fund_payuee3').disabled = false;
    document.getElementById('fund_payuee4').classList.remove('disabled');
    document.getElementById('fund_payuee4').disabled = false;

    document.getElementById('fund_paystack1').classList.add('disabled');
    document.getElementById('fund_paystack1').disabled = true;
    document.getElementById('fund_paystack2').classList.add('disabled');
    document.getElementById('fund_paystack2').disabled = true;
}

// Function to enable the div and its content
function enablePaystackDiv() {
    document.getElementById('fund_paystack1').classList.remove('disabled');
    document.getElementById('fund_paystack1').disabled = false;
    document.getElementById('fund_paystack2').classList.remove('disabled');
    document.getElementById('fund_paystack2').disabled = false;

    document.getElementById('fund_payuee1').classList.add('disabled');
    document.getElementById('fund_payuee1').disabled = true;
    document.getElementById('fund_payuee2').classList.add('disabled');
    document.getElementById('fund_payuee2').disabled = true;
    document.getElementById('fund_payuee3').classList.add('disabled');
    document.getElementById('fund_payuee3').disabled = true;
    document.getElementById('fund_payuee4').classList.add('disabled');
    document.getElementById('fund_payuee4').disabled = true;
}