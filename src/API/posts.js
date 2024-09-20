import axios from 'axios';

const domain = 'https://enimar.4gmobiles.com/';

export const createPost = async (postData, accessToken) => {
  try {
  
    const response = await axios.post(`${domain}social/posts/`, postData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error.response ? error.response.data : error.message);
    throw new Error('Error creating post');
  }
}

// Function to get all posts
export const getPosts = async (accessToken) => {
  try {
    const response = await axios.get(`${domain}social/posts/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error.response ? error.response.data : error.message);
    throw new Error('Error fetching posts');
  }
};

// Function to get comments of a post
export const getPostComments = async (postId, accessToken) => {
  try {
    const response = await axios.get(`${domain}social/posts/${postId}/comments/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error.response ? error.response.data : error.message);
    throw new Error('Error fetching comments');
  }
}

// Function to get likes of a post

export const getPostLikes = async (postId, accessToken) => {
  try {
    const response = await axios.get(`${domain}social/posts/${postId}/likes/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching likes:', error.response ? error.response.data : error.message);
    throw new Error('Error fetching likes');
  }
}
