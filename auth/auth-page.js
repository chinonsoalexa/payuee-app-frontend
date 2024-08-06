
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

    // Run the authentication status check function
    get_auth_status();
});

// this is for authenticated pages
function get_auth_status() {
    if (localStorage.getItem('auth') !== 'true') {
        // let's clear auth local storage item
        //  let's log user out the users session has expired
         Swal.fire({
            title: "Session Expired",
            text: "Please Try To Login Again Your Session Has Expired!!!",
            icon: "info",
            confirmButtonColor: "#556ee6"
        }).then((result) => {
            // Check if the user clicked the confirmation button
            if (result.isConfirmed) {
                // Task to perform after the user clicks OK
                //  // logout();
            } else {
                // Task to perform if the user clicks outside the dialog or cancels
                 // logout();
            }
    });
    }
        check_auth_status();
}

// this is to log users out
document.getElementById('logout-button').addEventListener('click', async function (event) {
    event.preventDefault()
    await logout()
})

document.getElementById('logout-button2').addEventListener('click', async function (event) {
    event.preventDefault()
    await logout()
})

async function logout() {
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
    const response = await fetch(apiUrl, requestOptions);
    
    if (!response.ok) {
            // alert('an error occurred. Please try again');
                if (!response.ok) {
        // alert('an error occurred. Please try again');
        return;
    }
        return;
      }
        const data = await response.json();
        localStorage.removeItem('auth')
        window.location.href = 'page/signin-new.html'
    } finally{
        // do nothing
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
            // Check if the request URL matches the specific URL to exclude
            if (arguments[0] === "https://api.payuee.com/auth-status") {
                // Call the original fetch function without triggering event handling
                return originalFetch.apply(this, arguments);
            }
			if (!navigator.onLine) {
				// Handle the case when there's no internet connection
                onRequestComplete();
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

async function check_auth_status() {
    const apiUrl = "https://api.payuee.com/auth-status";

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

            if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!") {
                Swal.fire({
                    title: "Session Expired",
                    text: "Please Try To Logging Again Your Session Has Expired!!!",
                    icon: "info",
                    confirmButtonColor: "#556ee6"
                }).then((result) => {
                    if (result.isConfirmed) {
                         // logout();
                    } else {
                         // logout();
                    }
                });
            } else {
                 // logout();
            }
            return;
        }
        localStorage.setItem('auth', 'true');
    } finally {
        // do nothing here
    }
}
