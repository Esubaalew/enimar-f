import axios from "axios";



const domain = 'http://localhost:8000/';

// function to get all notifications
export const getAllNotifications = async (userId, accessToken) => {
  try {
    const response = await axios.get(`${domain}account/user/${userId}/notifications/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error.response ? error.response.data : error.message);
    throw new Error('Error fetching notifications');
  }
};
