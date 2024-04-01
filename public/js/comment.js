const commentHandler = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const comment_description = document.querySelector('#userComment').value.trim();

    if (comment_description) {
        // Assuming we have an endpoint to handle POST request for comments
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({ comment_description }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const comment = await response.json(); // Assuming the server responds with the created comment
            const commentCard = createCommentCard({content: comment_description}); // Create a new comment card
            document.querySelector('#commentsContainer').appendChild(commentCard); // Append the new comment to the comments container
            document.querySelector('#userComment').value = ''; // Clear the textarea after submitting
        } else {
            alert('Failed to post comment');
        }
    }
};

// Utility function to create a comment card element
function createCommentCard(comment) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card mb-3'; // Add your card classes here

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    // Assuming `comment.content` holds the text of the comment
    const cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.textContent = comment.content;

    cardBody.appendChild(cardText);
    cardDiv.appendChild(cardBody);

    return cardDiv;
}

document.querySelector('.commentForm').addEventListener('submit', commentHandler);