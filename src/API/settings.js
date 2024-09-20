import axios from "axios";

const domain = 'https://enimar.4gmobiles.com/';

// Function to edit first name
export const editFirstName = async (userId, firstName, accessToken) => {
  try {
    const response = await axios.patch(
      `${domain}account/users/${userId}/`,
      { first_name: firstName },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error editing first name:', error.response ? error.response.data : error.message);
    throw new Error('Error editing first name');
  }
};

// Function to edit last name
export const editLastName = async (userId, lastName, accessToken) => {
  try {
    const response = await axios.patch(
      `${domain}account/users/${userId}/`,
      { last_name: lastName },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error editing last name:', error.response ? error.response.data : error.message);
    throw new Error('Error editing last name');
  }
};

// Function to edit position
export const editPosition = async (userId, position, accessToken) => {
  try {
    const response = await axios.patch(
      `${domain}account/users/${userId}/`,
      { position: position },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error editing position:', error.response ? error.response.data : error.message);
    throw new Error('Error editing position');
  }
};

// Function to edit bio
export const editBio = async (userId, bio, accessToken) => {
  try {
    const response = await axios.patch(
      `${domain}account/users/${userId}/`,
      { bio: bio },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error editing bio:', error.response ? error.response.data : error.message);
    throw new Error('Error editing bio');
  }
};

// Function to edit username
export const editUsername = async (userId, username, accessToken) => {
  try {
    const response = await axios.patch(
      `${domain}account/users/${userId}/`,
      { username: username },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error editing username:', error.response ? error.response.data : error.message);
    throw new Error('Error editing username');
  }
};
