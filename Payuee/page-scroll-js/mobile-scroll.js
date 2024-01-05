// Handle scrolling when a link is clicked
document.addEventListener('click', function (event) {
    // Check if the clicked link has a specific class or ID
    if (event.target.classList.contains('airtime-id') || event.target.id === 'airtime-id') {
        scrollToSection('airtime-section');
    } else if (event.target.classList.contains('card-id') || event.target.id === 'card-pin-id') {
        scrollToSection('card-pin-section');
    } else if (event.target.classList.contains('data-id') || event.target.id === 'data-id') {
        scrollToSection('data-section');
    } else if (event.target.classList.contains('education-id') || event.target.id === 'education-id') {
        scrollToSection('education-section');
    } else if (event.target.classList.contains('tv-id') || event.target.id === 'tv-id') {
        scrollToSection('tv-section');
    } else if (event.target.classList.contains('electricity-id') || event.target.id === 'electricity-id') {
        scrollToSection('electricity-section');
    } else if (event.target.classList.contains('bet-id') || event.target.id === 'bet-id') {
        scrollToSection('bet-section');
    } else if (event.target.classList.contains('wallet-id') || event.target.id === 'wallet-id') {
        scrollToSection('wallet-section');
    } else if (event.target.classList.contains('send-funds-id') || event.target.id === 'send-funds-id') {
        scrollToSection('send-funds-section');
    } else if (event.target.classList.contains('withdraw-funds-id') || event.target.id === 'withdraw-funds-id') {
        scrollToSection('withdraw-funds-section');
    }
});

// Function to scroll to a specific section
function scrollToSection(sectionId) {
    var targetElement = document.getElementById(sectionId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth'
        });
        event.preventDefault();
    }
}
