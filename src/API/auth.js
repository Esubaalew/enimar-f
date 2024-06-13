import axios from 'axios';

const domain = 'http://127.0.0.1:8000/';



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
    throw error;
  }
};


  // Function to get details of the logged-in user
  export const getLoggedInUser = async (accessToken) => {
    try {
      const response = await axios.get(`${domain}account/loggedin/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching logged-in user:', error.response || error.message || error);
      throw error.response.data;
    }
  };


  // Function to request password reset
export const requestPasswordReset = async (emailData) => {
  try {
    const response = await axios.post(`${domain}api/password-reset/`, emailData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to confirm password reset
export const confirmPasswordReset = async (uidb64, token, newPasswordData) => {
  try {
    const response = await axios.post(`${domain}api/password-reset-confirm/${uidb64}/${token}/`, newPasswordData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};