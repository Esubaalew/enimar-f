import axios from 'axios';

const domain = ' http://127.0.0.1:8000';
const getUserFollowers = async (userId, accessToken) => {
    try {
        const response = await axios.get(`/account/users/${userId}/followers/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user followers:', error.response ? error.response.data : error.message);
        throw new Error('Error fetching user followers');
    }
};

const getUserFollowing = async (userId, accessToken) => {
    try {
        const response = await axios.get(`/account/users/${userId}/following/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user followings:', error.response ? error.response.data : error.message);
        throw new Error('Error fetching user followings');
    }
};