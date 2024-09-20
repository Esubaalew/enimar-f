import axios from 'axios';

const domain = 'https://enimar.4gmobiles.com/';


// Function to Add COMMENT
export const addComment = async (commentData, accessToken) => {
    try {
        const response = await axios.post(`${domain}social/comments/`, commentData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding comment:', error.response.data);
        throw new Error('Error adding comment');
    }
}


