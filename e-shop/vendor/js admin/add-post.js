document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('nextButton');
    const productTitleInput = document.getElementById('productTitle1');
    const descriptionEditor = document.querySelector('.ql-editor'); // Assuming this is a rich text editor
    
    form.addEventListener('click', function (event) {
        event.preventDefault();
        
        // Validate Product Title
        const productTitle = productTitleInput.value.trim();
        if (!productTitle) {
            productTitleInput.classList.add('is-invalid');
            productTitleInput.classList.remove('is-valid');
        } else {
            productTitleInput.classList.remove('is-invalid');
            productTitleInput.classList.add('is-valid');
        }

        // Validate Description
        const productDescription = descriptionEditor.innerHTML.trim(); // Assuming you're using innerHTML for rich text content
        if (!productDescription) {
            descriptionEditor.classList.add('is-invalid');
            descriptionEditor.classList.remove('is-valid');
        } else {
            descriptionEditor.classList.remove('is-invalid');
            descriptionEditor.classList.add('is-valid');
        }

        // If form is valid, proceed
        // if (form.checkValidity()) {
            // console.log('Product Title:', productTitle);
            // console.log('Product Description:', productDescription);

            // Submit the form or send data via AJAX
            // Example of AJAX submission (optional):
            /*
            fetch('your-server-endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: productTitle,
                    description: productDescription,
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
            */
        // }
    });
});
