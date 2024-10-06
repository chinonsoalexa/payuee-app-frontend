
// Listen for the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function () {
    var analyticsData = sessionStorage.getItem('analyticsData');

    if (analyticsData === null) {
        // Key does not exist in localStorage
        sessionStorage.setItem('analyticsData', 'true');

        fetch('https://api.payuee.com/payuee-analytics', {
            method: 'GET'
        });
    }
    
    // Run your authentication status check function
    get_auth_status();

	// Register the service worker
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('../service-worker.js')
			.then(registration => {
				//   console.log('Service Worker registered with scope:', registration.scope);
			})
			.catch(error => {
				//   console.error('Service Worker registration failed:', error);
			});
	}
});

// this would be for unauthenticated pages
function get_auth_status() {
    if (localStorage.getItem('auth') === 'true') {
        // let's redirect to a authenticated page cause the user is not authenticated
        window.location.href = '../index-in.html';
    }
}

	//--Preloader--//
	setTimeout(function(){
		$('.preloader__wrap').fadeToggle();
	}, 1000);
	//--Preloader--//
	
	function onRequestSent() {
		// Code to execute when a request is sent
		// Trigger the preloader fadeToggle 
			$('.preloader__wrap').fadeToggle();
	}
	
	function onRequestComplete() {
		// Code to execute when a request is complete
		// Trigger the preloader fadeToggle 
			$('.preloader__wrap').fadeToggle();
	}
	
	(function() {
		// Save reference to the original fetch function
		const originalFetch = window.fetch;
	
		// Override the fetch function with our own custom implementation
		window.fetch = function() {

			if (!navigator.onLine) {
				// Handle the case when there's no internet connection
                // onRequestComplete();
                Swal.fire({
					title: "No Internet?",
					text: "Please Connect to the Internet!!!",
					icon: "question",
					confirmButtonColor: "#556ee6"
				  })
				return Promise.reject(new Error("No internet connection."));
			}
	
			// Trigger onRequestSent when a request is sent
			onRequestSent();
	
			// Call the original fetch function
			const fetchPromise = originalFetch.apply(this, arguments);
	
        // When the fetch request is complete, trigger onRequestComplete
        fetchPromise.then(() => {
            onRequestComplete();
        }).catch(error => {
            onRequestComplete();
        });
	
			// Return the fetch promise
			return fetchPromise;
		};
	})();