function createMultiplePosts(postsData) {
    const firstParentElement = document.getElementById('blogPostContents'); // Get the parent element by ID
    
    // Loop through the array of posts data
    postsData.forEach((postData, index) => {
        // Generate a unique ID for the post
        const postId = `post_${index}_${Date.now()}`;
        
        // Create a div element to contain the post HTML code
        const divContainer = document.createElement('div');
        divContainer.id = postId; // Assign the unique ID to the container element
        divContainer.innerHTML = `
            <div class="col-xl-6 col-md-6">
                <div class="blog__list__item">
                    <a href="#0" class="thumb">
                        <img src="${postData.postImageSrc}" alt="img" id="blog_post_image">
                        <span class="date__box">
                            <span id="blog_date_month">
                                ${postData.dateMonth}
                                <span class="dat" id="blog_date_year">
                                    ${postData.dateYear}
                                </span>
                            </span>
                        </span>
                    </a>
                    <div class="content">
                        <h5 class="mb__15">
                            <a href="#0" id="blog_post_title">
                                ${postData.postTitle}
                            </a>
                        </h5>
                        <ul class="admin__commments mb__15">
                            <li>
                                <span class="icon">
                                    <img src="assets/img/svg/person.svg" alt="icon">
                                </span>
                                <span class="text">
                                    Admin
                                </span>
                            </li>
                            <li>
                                <span class="icon">
                                    <img src="assets/img/svg/comments.svg" alt="icon">
                                </span>
                                <span class="text">
                                    ${postData.adminComments}
                                </span>
                            </li>
                        </ul>
                        <p class="mb__30" id="blog_post_description">
                            ${postData.postDescription}
                        </p>
                        <a href="#0" class="cmn__btn" id="blog_post_read_more_button">
                            <span>
                                Read more
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // Append the div container to the DocumentFragment
        firstParentElement.appendChild(divContainer);
        
        // Add event listener to the "Read more" button for each post
        const readMoreButton = divContainer.querySelector('#blog_post_read_more_button');
        readMoreButton.addEventListener('click', function(event) {
            // Prevent the default action of the anchor tag
            event.preventDefault();
            
            // Perform your desired action here when the button is clicked
            // For example, you can navigate to another page, toggle visibility of content, etc.
            console.log('Read more button clicked for post:', postId);
        });
    });
    
    // // Get the parent element by ID and append the fragment
    // const parentElement = document.getElementById('blogPostContents'); // Replace 'blogPostContents' with the actual ID of your parent element
    // parentElement.appendChild(firstParentElement);
}

// Define an array of test data for multiple posts
const testData = [
    {
        postImageSrc: 'assets/img/blog/list1.jpg',
        dateMonth: '17 dec',
        dateYear: '2023',
        postTitle: 'Why you should think twice before booking the Maldives...',
        adminComments: 12,
        postDescription: 'There are many variations of passages of Lorem ipsum available, but the majority have suffered alteration in some form...'
    },
    {
        postImageSrc: 'assets/img/blog/list2.jpg',
        dateMonth: '24 jan',
        dateYear: '2024',
        postTitle: 'Flight booking service integrated with Pilot eTravel...',
        adminComments: 15,
        postDescription: 'There are many variations of passages of Lorem ipsum available, but the majority have suffered alteration in some form...'
    },
    {
        postImageSrc: 'assets/img/blog/list3.jpg',
        dateMonth: '13 oct',
        dateYear: '2023',
        postTitle: 'American Airlines brings back free 24-hour reservation hold...',
        adminComments: 43,
        postDescription: 'There are many variations of passages of Lorem ipsum available, but the majority have suffered alteration in some form...'
    },
    {
        postImageSrc: 'assets/img/blog/list4.jpg',
        dateMonth: '13 feb',
        dateYear: '2019',
        postTitle: 'Payuee rectifies technical Smart in bill payment service...',
        adminComments: 19,
        postDescription: 'There are many variations of passages of Lorem ipsum available, but the majority have suffered alteration in some form...'
    },
    {
        postImageSrc: 'assets/img/blog/list5.jpg',
        dateMonth: '05 may',
        dateYear: '2020',
        postTitle: 'Credit card bill payment platform Cred Payuee...',
        adminComments: 68,
        postDescription: 'There are many variations of passages of Lorem ipsum available, but the majority have suffered alteration in some form...'
    },
    {
        postImageSrc: 'assets/img/blog/list6.jpg',
        dateMonth: '23 nov',
        dateYear: '2022',
        postTitle: 'Payuee announces new album, world tour...',
        adminComments: 43,
        postDescription: 'There are many variations of passages of Lorem ipsum available, but the majority have suffered alteration in some form...'
    },
];

// Call the function to create multiple posts with the provided test data
createMultiplePosts(testData);
