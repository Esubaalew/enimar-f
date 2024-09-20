import axios from 'axios';

const domain = 'https://enimar.4gmobiles.com';
const getUserFollowers = async (userId, accessToken) => {
    try {
        const response = await axios.get(`${domain}/account/users/${userId}/followers/`, {
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
        const response = await axios.get(`${domain}/account/users/${userId}/following/`, {
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
// Function to get a user by username
const getUserByUsername = async (username, accessToken) => {
    try {
        const response = await axios.get(`${domain}/account/user/${username}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user by username:', error.response.data);
        throw new Error('Error fetching user by username');
    }
};

export const getUserById = async (userId, accessToken) => {
    try {
        const response = await axios.get(`${domain}/account/users/${userId}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user by ID:', error.response ? error.response.data : error.message);
        throw new Error('Error fetching user by ID');
    }
};
export const getPostsByUser = async (username, accessToken) => {
    try {
        const response = await axios.get(`${domain}/account/user/${username}/posts/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user posts:', error.response ? error.response.data : error.message);
        throw new Error('Error fetching user posts');
    }
}

// get course by teaher
export const getCoursesByTeacher = async (username, accessToken) => {
    try {
        const response = await axios.get(`${domain}/account/teacher/${username}/courses/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user courses:', error.response ? error.response.data : error.message);
        throw new Error('Error fetching user courses');
    }
}

// Function to follow a user
const followUser = async (userId, accessToken) => {
    try {
        const response = await axios.post(`${domain}api/follow/`, { followed_user_id: userId }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error following user:', error.response.data);
        throw new Error('Error following user');
    }
};

// Function to unfollow a user
const unfollowUser = async (userId, accessToken) => {
    try {
        const response = await axios.post(`${domain}api/unfollow/`, { followed_user_id: userId }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error unfollowing user:', error.response.data);
        throw new Error('Error unfollowing user');
    }
};

// Function to update user's first name
const updateFirstName = async (userId, firstName, accessToken) => {
    try {
        const response = await axios.patch(`${domain}account/users/${userId}/`, {
            first_name: firstName
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating first name:', error.response.data);
        throw new Error('Error updating first name');
    }
};

// Function to update user's last name
const updateLastName = async (userId, lastName, accessToken) => {
    try {
        const response = await axios.patch(`${domain}account/users/${userId}/`, {
            last_name: lastName
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating last name:', error.response.data);
        throw new Error('Error updating last name');
    }
};

// Function to update user's bio
const updateBio = async (userId, bio, accessToken) => {
    try {
        const response = await axios.patch(`${domain}account/users/${userId}/`, {
            bio: bio
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating bio:', error.response.data);
        throw new Error('Error updating bio');
    }
};

// Function to update user's profile picture
const updateProfilePicture = async (userId, profilePictureFile, accessToken) => {
    const formData = new FormData();
    formData.append('profile_picture', profilePictureFile);

    try {
        const response = await axios.patch(`${domain}account/users/${userId}/`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating profile picture:', error.response.data);
        throw new Error('Error updating profile picture');
    }
};

const deactivateUser = async (userId, accessToken) => {
    try {
        const response = await axios.post(`${domain}account/users/${userId}/deactivate/`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deactivating user:', error.response.data);
        throw new Error('Error deactivating user');
    }
};

// Function to delete a user
const deleteUser = async (userId, accessToken) => {
    try {
        const response = await axios.delete(`${domain}account/users/${userId}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error.response.data);
        throw new Error('Error deleting user');
    }
};

const getAllUsers = async (accessToken) => {
    try {
        const response = await axios.get(`${domain}/account/users/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching all users:', error.response.data);
        throw new Error('Error fetching all users');
    }
}

// courses enrolled  by student
export const getCoursesEnrolledByStudent = async (userId, accessToken) => {
    try {
        const response = await axios.get(`${domain}/account/student/${userId}/courses/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching courses enrolled by student:', error.response ? error.response.data : error.message);
        throw new Error('Error fetching courses enrolled by student');
    }
};

export { 
    getUserFollowers, 
    getUserFollowing, 
    getUserByUsername, 
    followUser, unfollowUser, 
    updateFirstName, updateLastName, 
    updateBio, updateProfilePicture, 
    deactivateUser, deleteUser,  
    getAllUsers,
};
