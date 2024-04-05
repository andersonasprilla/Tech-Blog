

const commentHandler = async (event) => {
    event.preventDefault()
    const comment_description = document.querySelector("#userComment").value.trim()
    if(comment_description) {
        console.log(comment_description)
        const response = await fetch(`/api/comments`, {
            method: 'POST',
            body: JSON.stringify({ comment_description }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        
        if(response.ok) {
            document.location.replace("/")
        }else {
            alert('Failed to create comment')
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