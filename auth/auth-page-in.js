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
});

// this would be for unauthenticated pages
function get_auth_status() {

	// Key does not exist in localStorage
	sessionStorage.setItem('analyticsData', 'true');

        // send a post request with the email and password
        const otp = {
            Email: email,
            Password: password,
            };

            const apiUrl = "https://api.payuee.com/auth-status";

            const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include', // set credentials to include cookies
            };
            
        try {
            const response = fetch(apiUrl, requestOptions);
            

            if (!response.ok) {
                const errorData = response.json();

                if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!") {
                    // let's log user out the users session has expired
					Swal.fire({
						title: "The Internet?",
						text: "That thing is still around?",
						icon: "question",
						confirmButtonColor: "#556ee6"
					}).then((result) => {
						// Check if the user clicked the confirmation button
						if (result.isConfirmed) {
							// Task to perform after the user clicks OK
							logUserOutIfTokenIsExpired();
							// console.log("User clicked OK");
							// Call your function or execute your code here
						} else {
							// Task to perform if the user clicks outside the dialog or cancels
							logUserOutIfTokenIsExpired();
							// console.log("User clicked outside the dialog or cancelled");
							// Call your function or execute your code here
						}
					});
                } else {
					logUserOutIfTokenIsExpired();
					// showError('passwordError', 'An error occurred. Please try again.');
                }

                return;
            }
            localStorage.setItem('auth', 'true');
        } finally{
            
        }
    
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

	function logUserOutIfTokenIsExpired() {
		
		// also send a request to the logout api endpoint
		const apiUrl = "https://api.payuee.com/log-out";
	
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
			window.location.href = 'page/signin-new.html'
		} finally{
		}
	}