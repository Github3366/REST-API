async function fetchPostsAndUsers() {
    try {
        const loadingIndicator = document.getElementById('loading');
        const errorMessage = document.getElementById('error-message');
        const postsContainer = document.getElementById('posts-container');

        loadingIndicator.style.display = 'block';
        errorMessage.style.display = 'none';
        postsContainer.innerHTML = '';

        // Fetch posts and users
        const [postsResponse, usersResponse] = await Promise.all([
            fetch('https://jsonplaceholder.typicode.com/posts'),
            fetch('https://jsonplaceholder.typicode.com/users')
        ]);
        const posts = await postsResponse.json();
        const users = await usersResponse.json();

        // Create a map of users by ID for quick lookup
        const usersMap = {};
        users.forEach(user => {
            usersMap[user.id] = user;
        });

        // Combine posts with user information
        const postsWithUserInfo = posts.map(post => {
            const user = usersMap[post.userId];
            return {
                ...post,
                userName: user.name,
                userEmail: user.email
            };
        });

        // Display posts with user information
        postsWithUserInfo.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <p><strong>User:</strong> ${post.userName} (${post.userEmail})</p>
                <hr>
            `;
            postElement.addEventListener('click', () => displayPostDetails(post.id, postElement));
            postsContainer.appendChild(postElement);
        });

        loadingIndicator.style.display = 'none';
    } catch (error) {
        document.getElementById('error-message').textContent = 'Error fetching posts or users';
        document.getElementById('error-message').style.display = 'block';
        console.error('Error fetching posts or users:', error);
    }
}

async function displayPostDetails(postId, postElement) {
    try {
        // Fetch comments for the post
        const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        const comments = await commentsResponse.json();

        // Create comments section
        let commentsSection = postElement.querySelector('.comments');
        if (!commentsSection) {
            commentsSection = document.createElement('div');
            commentsSection.classList.add('comments');
            postElement.appendChild(commentsSection);
        }

        commentsSection.innerHTML = '<h3>Comments:</h3>';
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `
                <p><strong>${comment.name} (${comment.email}):</strong></p>
                <p>${comment.body}</p>
            `;
            commentsSection.appendChild(commentElement);
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

document.getElementById('fetch-button').addEventListener('click', fetchPostsAndUsers);
