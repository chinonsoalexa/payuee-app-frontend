
get_auth_status();

// this is for authenticated pages
function get_auth_status() {
    if (localStorage.getItem('user_auth') === 'true') {
        // let's push user to auth page
        window.location.href = 'https://payuee.com/e-shop/home';
    }
        check_auth_status();
}

async function check_auth_status() {
    const apiUrl = "https://api.payuee.com/user-auth-status";

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

            if (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                logout();
            } else {
                logout();
            }
            return;
        }

        const responseData = await response.json(); // Parse response JSON

        localStorage.setItem('user_auth', 'true');
        window.location.href = 'https://payuee.com/e-shop/home';
    } finally {
    }
}

function showToastMessageE(message) {
    document.getElementById('toastError').textContent = message;
    const toastElement = document.getElementById('liveToast1');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

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
        showToastMessageE('an error occurred');
        return;
    }
        return;
      }
        const data = await response.json();
        localStorage.removeItem('user_auth')
        // window.location.href = 'https://payuee.com/e-shop/login_register'
    } finally{
        // do nothing
    }
}