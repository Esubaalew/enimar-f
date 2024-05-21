import axios from 'axios';

const API_URL = 'http://localhost:8000/account/users/id/posts/'; // Adjust the base URL as needed

export const createPost = async (userId, postData) => {
  try {
    const response = await axios.post(`${API_URL}${userId}/posts/`, postData, {
      headers: {
        'Content-Type': 'multipart/form-data', // If you are sending files
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Server error');
  }
};