document.addEventListener("DOMContentLoaded", function() {
    // Get the current URL
    const currentUrl = new URL(window.location.href);

    // Extract parameters using URLSearchParams
    const params = new URLSearchParams(currentUrl.search);

    // Get individual parameter values
    const blogPost = params.get("post");

    blogDetails.forEach(function(blog) {
        // Perform actions with the data
        if (blog.postID === blogPost) {
            // Select the <h3> element by its ID
            const postHeader = document.getElementById('postHeader');
            const postImage = document.getElementById('postImage');
            const postComments = document.getElementById('postComments');
            const postDate = document.getElementById('postDate');
            const postDescription = document.getElementById('postDescription');
            // Update the text content
            postImage.src = blog.postImageSrc;
            postHeader.textContent = blog.postTitle;
            postComments.textContent = blog.adminComments;
            postDate.textContent = blog.dateMonth + ' ' + blog.dateYear;
            postDescription.textContent = blog.postDescription;

            // Exit the function after executing once
            return;
        }
    });
    
});


const blogDetails = [
    {
        postID: 'post_0_',
        postImageSrc: 'assets/img/blog/list6.jpg',
        dateMonth: '17 Apr',
        dateYear: '2024',
        postTitle: 'The Evolution of Digital Payments: How Payuee is Transforming the Landscape...',
        adminComments: 12,
        postDescription: `In this blog post, we would begin by providing a comprehensive overview of the history and evolution of digital payments. We would explore how traditional payment methods, such as cash and checks, have gradually given way to electronic and digital alternatives over the years. This section could include key milestones, technological advancements, and shifts in consumer behavior that have shaped the digital payments landscape.
        Next, we would focus on the role of Payuee in driving this transformation. We would highlight Payuee's innovative solutions and how they have contributed to making payments faster, more secure, and more convenient for users. This could include discussions on Payuee's digital wallet, online payment gateway, and other fintech services that cater to diverse needs and preferences.
        The blog post would also feature insights from industry experts, discussing the current state of digital payments and future trends. We could explore topics such as the rise of contactless payments, the growing importance of cybersecurity, and the emergence of new payment technologies like blockchain and cryptocurrencies.
        Finally, we would tie everything together by emphasizing Payuee's commitment to driving innovation and leading the way in the ever-evolving landscape of digital payments.`
    },
    {
        postID: 'post_1_',
        postImageSrc: 'assets/img/blog/list2.jpg',
        dateMonth: '06 Apr',
        dateYear: '2024',
        postTitle: "Empowering Small Businesses: Payuee's Impact on Entrepreneurship...",
        adminComments: 15,
        postDescription: `This blog post would center around Payuee's dedication to supporting small businesses and entrepreneurs. We would highlight the challenges faced by small businesses in managing finances, accepting payments, and expanding their reach in a competitive market.
        We would then showcase Payuee's suite of tools and services designed specifically for small businesses. This could include features such as invoicing solutions, customizable payment forms, and analytics dashboards that provide valuable insights into sales and customer behavior.
        To add depth to the post, we could include real-life success stories of small businesses that have benefited from using Payuee's platform. These case studies would illustrate how Payuee has helped entrepreneurs streamline operations, increase sales, and achieve their business goals.
        Additionally, we would discuss Payuee's commitment to fostering entrepreneurship through initiatives such as educational resources, mentorship programs, and community partnerships. By empowering small businesses, Payuee is not only driving economic growth but also fostering innovation and creating opportunities for individuals to pursue their passions.
        `
    },
    {
        postID: 'post_2_',
        postImageSrc: 'assets/img/blog/list3.jpg',
        dateMonth: '02 Apr',
        dateYear: '2024',
        postTitle: "Navigating the Future of Financial Inclusion: Payuee's Role in Bridging the Gap...",
        adminComments: 43,
        postDescription: `This blog post would focus on Payuee's efforts to promote financial inclusion and address the disparities between the banked and unbanked populations. We would begin by discussing the importance of financial access and how it impacts individuals' ability to save, invest, and build a better future.
        We would then explore the challenges faced by underserved communities in accessing traditional banking services, such as physical branch locations, documentation requirements, and affordability issues. This section could also touch on the impact of socioeconomic factors, such as poverty and inequality, on financial exclusion.
        Next, we would highlight Payuee's role in bridging this gap by offering accessible and inclusive financial solutions. This could include discussions on Payuee's mobile banking app, digital payment options, and partnerships with local organizations to reach underserved populations.
        The blog post would also feature stories of individuals who have benefited from using Payuee's services to gain access to banking and financial services for the first time. These personal anecdotes would illustrate the transformative impact of financial inclusion on people's lives and communities.
        Finally, we would emphasize Payuee's commitment to advancing financial inclusion as part of its broader mission to create a more equitable and inclusive society.`
    },
    {
        postID: 'post_3_',
        postImageSrc: 'assets/img/blog/list4.jpg',
        dateMonth: '13 Mar',
        dateYear: '2024',
        postTitle: 'Securing Digital Transactions: How Payuee Protects Your Financial Information...',
        adminComments: 19,
        postDescription: "In this blog post, we would dive into the topic of cybersecurity and the measures Payuee takes to ensure the safety of its users' financial information. We would discuss common threats faced by online transactions, such as phishing attacks, malware, and data breaches, and explain how Payuee employs encryption, multi-factor authentication, and other security protocols to safeguard user data. The post could also include tips for users on how to protect themselves from online fraud and maintain secure online habits."
    },
    {
        postID: 'post_4_',
        postImageSrc: 'assets/img/blog/list5.jpg',
        dateMonth: '05 Feb',
        dateYear: '2024',
        postTitle: "Driving Financial Literacy: Payuee's Initiatives for Educating Users About Money Management...",
        adminComments: 34,
        postDescription: "This blog post would explore Payuee's efforts to promote financial literacy among its users. We would discuss the importance of understanding basic financial concepts, such as budgeting, saving, and investing, and highlight Payuee's educational resources, workshops, and interactive tools designed to empower users with the knowledge and skills they need to make informed financial decisions. The post could also feature insights from financial experts and success stories of users who have benefited from Payuee's financial education initiatives."
    },
    {
        postID: 'post_5_',
        postImageSrc: 'assets/img/blog/list1.jpg',
        dateMonth: '23 Nov',
        dateYear: '2022',
        postTitle: 'Sustainability in Fintech: How Payuee is Driving Environmental Responsibility...',
        adminComments: 43,
        postDescription: "In this blog post, we would examine Payuee's commitment to sustainability and environmental responsibility. We would discuss the environmental impact of digital transactions, including energy consumption and electronic waste, and explain how Payuee is working to minimize its carbon footprint through initiatives such as paperless billing, energy-efficient data centers, and eco-friendly business practices. The post could also include tips for users on how to reduce their environmental impact when using digital payment services."
    },
];