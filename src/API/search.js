import axios from 'axios';

const domain = 'https://enimar.4gmobiles.com/';

// Function to search for users
const searchUsers = async (query, accessToken) => {
    try {
        const response = await axios.get(`${domain}account/search/?query=${query}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching users:', error.response.data);
        throw new Error('Error searching users');
    }
};

// Function to search for resources
const searchCourses = async (query, accessToken) => {
    try {
        const response = await axios.get(`${domain}learning/search/?query=${query}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching resources:', error.response.data);
        throw new Error('Error searching resources');
    }
};

export { searchUsers, searchCourses};
