import axios from 'axios';

const domain = 'http://localhost:8000/';

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