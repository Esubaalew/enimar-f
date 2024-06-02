import axios from 'axios';

const domain = 'http://127.0.0.1:8000/';
// const domain = 'http://localhost:8000/';

// Function to sign up a user



export const signIn = async (userData) => {
  try {
    const response = await axios.post(`${domain}/account/signin/`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const signUpTeacher = async (teacherData) => {
  try {
    const response = await axios.post(`${domain}/account/signup/teacher/`, teacherData);
    return response.data; // Ensure the correct path to the data
  } catch (error) {
    console.error('Error signing up teacher:', error);
    // Handle the error appropriately
    throw error;
  }
};

export const signUpStudent = async (teacherData) => {
  try {
    const response = await axios.post(`${domain}/account/signup/student/`, teacherData);
    return response.data; // Ensure the correct path to the data
  } catch (error) {
    console.error('Error signing up teacher:', error);
    // Handle the error appropriately
    throw error;
  }
};


  // Function to get details of the logged-in user
export const getLoggedInUser = async (accessToken) => {
  try {
    const response = await axios.get(`${domain}api/loggedin/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
