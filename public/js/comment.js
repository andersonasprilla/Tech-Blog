const commentHandler = async (event) => {
    event.preventDefault();

    // Extracting data from the form
    const content = document.querySelector('#userComment').value.trim(); // Assuming there's an input field for comment content with id 'comment-content'
    console.log(content)

    const blogId = event.target.getAttribute('data-blog-id'); // Assuming the form or a parent element has a 'data-blog-id' attribute
    console.log(blogId)

    if (content && blogId) {
        const response = await fetch('/api/comments', { // The URL might be different based on your API's routing
            method: 'POST',
            body: JSON.stringify({
                content,
                blog_id: blogId // The property name should match what your backend expects
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            document.location.reload(); // Reload the page to show the new comment
        } else {
            alert('Failed to post comment. Please try again.'); // Inform the user of failure
        }
    } else {
        // Handle the case where data is missing
        alert('Please write a comment before submitting.');
    }
};

// Adding the event listener to the form
document.querySelector('.commentForm').addEventListener('submit', commentHandler);

