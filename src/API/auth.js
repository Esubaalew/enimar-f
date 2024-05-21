import axios from 'axios';

const domain = ' http://localhost:8000/';

export const signIn = async (userData) => {
  try {
    const response = await axios.post(`${domain}/account/signin/`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

