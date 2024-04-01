function blogPost(postsData) {
    const parentElement = document.getElementById('blogPostContents');

    postsData.forEach((postData, index) => {
        const postId = `post_${index}_${Date.now()}`;

        const divContainer = document.createElement('div');
        divContainer.classList.add('blog__list__item', 'mb__30');

        divContainer.innerHTML = `
            <a href="#0" class="thumb">
                <img id="image" src="${postData.postImageSrc}" alt="img">
                <span class="date-item">
                    <span class="fz-18 fw-600 dtext lato d-block">
                        ${postData.dateMonth}
                    </span>
                    <span class="fz-18 fw-600 dtext lato">
                        ${postData.dateYear}
                    </span>
                </span>
            </a>
            <div class="content">
                <h5 class="mb__15">
                    <a href="#0">
                        ${postData.postTitle}
                    </a>
                </h5>
                <ul class="admin__commments mb__15">
                    <li>
                        <span class="icon">
                            <img src="../assets/img/svg/person.svg" alt="icon">
                        </span>
                        <span class="text">
                            Admin
                        </span>
                    </li>
                    <li>
                        <span class="icon">
                            <img src="../assets/img/svg/comments.svg" alt="icon">
                        </span>
                        <span class="text">
                            ${postData.adminComments}
                        </span>
                    </li>
                </ul>
                <p class="mb__30">
                    ${postData.postDescription}
                </p>
                <a href="#0" class="cmn__btn">
                    <span>
                        Read more
                    </span>
                </a>
            </div>
        `;

        parentElement.appendChild(divContainer);

        const readMoreButton = divContainer.querySelector('.cmn__btn');
        const title = divContainer.querySelector('.mb__15');
        const image = divContainer.querySelector('.thumb');
        readMoreButton.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Read more button clicked for post:', postId);
            prompt('Read more button clicked for post:', postId);
        });
        title.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Read more button clicked for post:', postId);
            prompt('Read more button clicked for post:', postId);
        });
        image.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Read more button clicked for post:', postId);
            prompt('Read more button clicked for post:', postId);
        });
    });
}

// Define an array of test data for multiple posts
const testData = [
    {
        postImageSrc: '../assets/img/blog/list1.jpg',
        dateMonth: '17 dec',
        dateYear: '2023',
        postTitle: 'Why you should think twice before booking the Maldives...',
        adminComments: 12,
        postDescription: 'There are many variations of passages of Lorem ipsum available, but the majority have suffered alteration in some form...'
    },
    {
        postImageSrc: '../assets/img/blog/list2.jpg',
        dateMonth: '24 jan',
        dateYear: '2024',
        postTitle: 'Flight booking service integrated with Pilot eTravel...',
        adminComments: 15,
        postDescription: 'There are many variations of passages of Lorem ipsum available, but the majority have suffered alteration in some form...'
    },
    {
        postImageSrc: '../assets/img/blog/list3.jpg',
        dateMonth: '13 oct',
        dateYear: '2023',
        postTitle: 'American Airlines brings back free 24-hour reservation hold...',
        adminComments: 43,
        postDescription: 'There are many variations of passages of Lorem ipsum available, but the majority have suffered alteration in some form...'
    },
    {
        postImageSrc: '../assets/img/blog/list4.jpg',
        dateMonth: '13 feb',
        dateYear: '2019',
        postTitle: 'Payuee rectifies technical Smart in bill payment service...',
        adminComments: 19,
        postDescription: 'There are many variations of passages of Lorem ipsum available, but the majority have suffered alteration in some form...'
    },
    {
        postImageSrc: '../assets/img/blog/list5.jpg',
        dateMonth: '05 may',
        dateYear: '2020',
        postTitle: 'Credit card bill payment platform Cred Payuee...',
        adminComments: 68,
        postDescription: 'There are many variations of passages of Lorem ipsum available, but the majority have suffered alteration in some form...'
    },
    {
        postImageSrc: '../assets/img/blog/list6.jpg',
        dateMonth: '23 nov',
        dateYear: '2022',
        postTitle: 'Payuee announces new album, world tour...',
        adminComments: 43,
        postDescription: 'There are many variations of passages of Lorem ipsum available, but the majority have suffered alteration in some form...'
    },
];

// Call the function to create multiple posts with the provided test data
blogPost(testData);

function popularBlogPost(popularPostData) {

    const parentElement = document.getElementById('popularBlogPosts');

    popularPostData.forEach((popularPostData, index) => {
        const postId = `post_${index}_${Date.now()}`;
        const divContainer = document.createElement('div');
        divContainer.classList.add('blog__list__item', 'mb__30');

        divContainer.innerHTML = `
    <a href="#0" class="recent__item">
        <span class="thumb">
            <img src="${popularPostData.postImageSrc}" alt="img">
        </span>
        <span class="content">
            <span class="title">
            ${popularPostData.postTitle}
            </span>
            <span class="date">
            ${popularPostData.postDate}
            </span>
        </span>
        </a>`;

        parentElement.appendChild(divContainer);

        const popularBlogClickEvent = divContainer.querySelector('.recent__item');
        popularBlogClickEvent.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Read more button clicked for post:', postId);
            prompt('Read more button clicked for post:', postId);
        });
        });
}

// Define an array of test data for multiple posts
const popularBlogPostData = [
    {
        postImageSrc: '../assets/img/blog/liss1.jpg',
        postDate: 'December 19, 2022',
        postTitle: 'Recharge to enable card payments...',
        },
    {
        postImageSrc: '../assets/img/blog/list2.jpg',
        postDate: 'November 23, 2021',
        postTitle: 'Stop auto payment in Paytm, turn off this...',
    },
    {
        postImageSrc: '../assets/img/blog/list3.jpg',
        postDate: 'October 17, 2020',
        postTitle: 'Paytm KYC- How to Complete Paytm...',
    },
];

popularBlogPost(popularBlogPostData)