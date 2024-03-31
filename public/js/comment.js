const commentHanlder = async (event) => {
    event.preventDefault();

    const comment = document.querySelector('#userComment').value.trim()

    if(comment) {
        const response = await fetch('/api/blog/:id')
    }
}

document.querySelector('.commentForm').addEventListener('submit', commentHanlder)