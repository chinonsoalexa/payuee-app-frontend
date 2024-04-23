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
        postImageSrc: '../assets/img/blog/list6.jpg',
        dateMonth: '17 Apr',
        dateYear: '2024',
        postTitle: 'The Evolution of Digital Payments: How Payuee is Transforming the Landscape...',
        adminComments: 12,
        postDescription: 'In this blog post, we would begin by providing a comprehensive overview of the history and evolution of digital payments...'
    },
    {
        postImageSrc: '../assets/img/blog/list2.jpg',
        dateMonth: '06 Apr',
        dateYear: '2024',
        postTitle: "Empowering Small Businesses: Payuee's Impact on Entrepreneurship...",
        adminComments: 15,
        postDescription: "This blog post would center around Payuee's dedication to supporting small businesses and entrepreneurs..."
    },
    {
        postImageSrc: '../assets/img/blog/list3.jpg',
        dateMonth: '02 Apr',
        dateYear: '2024',
        postTitle: "Navigating the Future of Financial Inclusion: Payuee's Role in Bridging the Gap...",
        adminComments: 43,
        postDescription: "This blog post would focus on Payuee's efforts to promote financial inclusion and address the disparities between the banked and unbanked populations..."
    },
    {
        postImageSrc: '../assets/img/blog/list4.jpg',
        dateMonth: '13 Mar',
        dateYear: '2024',
        postTitle: 'Securing Digital Transactions: How Payuee Protects Your Financial Information...',
        adminComments: 19,
        postDescription: "In this blog post, we would dive into the topic of cybersecurity and the measures PayUee takes to ensure the safety of its users' financial information..."
    },
    {
        postImageSrc: '../assets/img/blog/list5.jpg',
        dateMonth: '05 Feb',
        dateYear: '2024',
        postTitle: "Driving Financial Literacy: PayUee's Initiatives for Educating Users About Money Management...",
        adminComments: 34,
        postDescription: "This blog post would explore Payuee's efforts to promote financial literacy among its users. We would discuss the importance of understanding basic financial concepts..."
    },
    {
        postImageSrc: '../assets/img/blog/list1.jpg',
        dateMonth: '23 Nov',
        dateYear: '2022',
        postTitle: 'Sustainability in Fintech: How Payuee is Driving Environmental Responsibility...',
        adminComments: 43,
        postDescription: "In this blog post, we would examine Payuee's commitment to sustainability and environmental responsibility. We would discuss the environmental impact of digital transactions..."
    },
];

// Call the function to create multiple posts with the provided test data
blogPost(testData);

function popularBlogPost(popularPostData) {

    const parentElement = document.getElementById('popularBlogPosts');

    popularPostData.forEach((popularPostData, index) => {
        const postId = `post_${index}_`;
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
            window.location.href = 'blog-details.html?post=' + postId;
        });
        });
}

// Define an array of test data for multiple posts
const popularBlogPostData = [
    {
        postImageSrc: '../assets/img/blog/liss1.jpg',
        postDate: 'February 05, 2024',
        postTitle: 'Recharge to enable card payments...',
        },
    {
        postImageSrc: '../assets/img/blog/list2.jpg',
        postDate: 'April 06, 2024',
        postTitle: 'Empowering Small Businesses...',
    },
    {
        postImageSrc: '../assets/img/blog/list3.jpg',
        postDate: 'April 02, 2024',
        postTitle: "Navigating the Future of Financial Inclusion...",
    },
];

popularBlogPost(popularBlogPostData)