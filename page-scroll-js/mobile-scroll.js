// Focus on the first input field when the page loads
document.addEventListener('DOMContentLoaded', function(event) {
    if ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
        // Code to run only on mobile phones or ipads
        // Get the current URL
        const currentUrl = new URL(window.location.href);
        const pathName = currentUrl.pathname;

        // Check if the clicked link has a specific class or ID
        if (pathName === '/airtime') {
            scrollToSection('airtime-section1');
        } else if (pathName === '/recharge-pin') {
            scrollToSection('card-pin-section1');
        } else if (pathName === '/data') {
            scrollToSection('data-section1');
        } else if (pathName === '/educational-payments') {
            scrollToSection('education-section');
        } else if (pathName === '/tv') {
            scrollToSection('tv-section1');
        } else if (pathName === '/electricity') {
            scrollToSection('electricity-section1');
        } else if (pathName === '/fund-wallet') {
            scrollToSection('wallet-section1');
        } else if (pathName === '/send-funds') {
            scrollToSection('send-funds-section1');
        }
    }
});

// Handle scrolling when a link is clicked
document.addEventListener('click', function (event) {
    if ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
        // Code to run only on mobile phones or ipads
        // Check if the clicked link has a specific class or ID
        if (event.target.classList.contains('airtime-id') || event.target.id === 'airtime-id') {
            event.preventDefault();
            scrollToSection('airtime-section1');
        } else if (event.target.classList.contains('card-id') || event.target.id === 'card-pin-id') {
            event.preventDefault();
            scrollToSection('card-pin-section1');
        } else if (event.target.classList.contains('data-id') || event.target.id === 'data-id') {
            event.preventDefault();
            scrollToSection('data-section1');
        } else if (event.target.classList.contains('education-id') || event.target.id === 'education-id') {
            event.preventDefault();
            scrollToSection('education-section');
        } else if (event.target.classList.contains('tv-id') || event.target.id === 'tv-id') {
            event.preventDefault();
            scrollToSection('tv-section1');
        } else if (event.target.classList.contains('electricity-id') || event.target.id === 'electricity-id') {
            event.preventDefault();
            scrollToSection('electricity-section1');
        } else if (event.target.classList.contains('wallet-id') || event.target.id === 'wallet-id') {
            event.preventDefault();
            scrollToSection('wallet-section1');
        } else if (event.target.classList.contains('send-funds-id') || event.target.id === 'send-funds-id') {
            event.preventDefault();
            scrollToSection('send-funds-section1');
        }
    } else {
        // Check if the clicked link has a specific class or ID
        if (event.target.classList.contains('airtime-id') || event.target.id === 'airtime-id') {
            event.preventDefault();
            // scrollToSection('airtime-section');
            // scrollToSection('invoice-section');
        } else if (event.target.classList.contains('card-id') || event.target.id === 'card-pin-id') {
            event.preventDefault();
            // scrollToSection('card-pin-section');
            // scrollToSection('invoice-section');
        } else if (event.target.classList.contains('data-id') || event.target.id === 'data-id') {
            event.preventDefault();
            // scrollToSection('data-section');
            // scrollToSection('invoice-section');
        } else if (event.target.classList.contains('education-id') || event.target.id === 'education-id') {
            event.preventDefault();
            // scrollToSection('education-section');
            // scrollToSection('invoice-section');
        } else if (event.target.classList.contains('tv-id') || event.target.id === 'tv-id') {
            event.preventDefault();
            // scrollToSection('tv-section');
            // scrollToSection('invoice-section');
        } else if (event.target.classList.contains('electricity-id') || event.target.id === 'electricity-id') {
            event.preventDefault();
            // scrollToSection('electricity-section');
            // scrollToSection('invoice-section');
        } else if (event.target.classList.contains('wallet-id') || event.target.id === 'wallet-id') {
            event.preventDefault();
            // scrollToSection('wallet-section');
        } else if (event.target.classList.contains('send-funds-id') || event.target.id === 'send-funds-id') {
            event.preventDefault();
            // scrollToSection('send-funds-section');
        }
    }
});

// Function to scroll to a specific section
function scrollToSection(sectionId) {
    var targetElement = document.getElementById(sectionId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth'
        });
    }
}
