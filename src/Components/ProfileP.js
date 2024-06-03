import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    getUserByUsername,
    getUserFollowers,
    getUserFollowing,
    getPostsByUser,
} from './users'; // Make sure to import your API functions correctly
import './Profile.css'; // Import the CSS file

const Profile = ({ accessToken }) => {
    const { username } = useParams(); // Get username from URL params
    const [user, setUser] = useState(null);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUserByUsername(username, accessToken);
                setUser(userData);
                
                const userFollowers = await getUserFollowers(userData.id, accessToken);
                setFollowers(userFollowers);

                const userFollowing = await getUserFollowing(userData.id, accessToken);
                setFollowing(userFollowing);

                const userPosts = await getPostsByUser(username, accessToken);
                setPosts(userPosts);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [username, accessToken]);

    return (
        <div className="profile">
            {user ? (
                <div className="profile-container">
                    <div className="profile-header">
                        <div className="profile-picture">
                            <img src={user.profile_picture_url || 'default-profile.png'} alt="Profile" />
                        </div>
                        <div className="profile-info">
                            <h1>{user.first_name} {user.last_name}</h1>
                            <p>@{user.username}</p>
                            <p>Address: {user.address || 'Not provided'}</p>
                            <p>Position: {user.position || 'Not provided'}</p>
                        </div>
                    </div>
                    <div className="profile-tabs">
                        <button>Posts</button>
                        <button>Courses</button>
                        <button>Followers</button>
                        <button>Following</button>
                    </div>
                    <div className="profile-content">
                        <h2>Posts</h2>
                        {posts.map(post => (
                            <div key={post.id} className="post">
                                <div className="post-header">
                                    <img src={user.profile_picture_url || 'default-profile.png'} alt="Profile" />
                                    <div className="post-user-info">
                                        <h3>{user.first_name} {user.last_name}</h3>
                                        <p>@{user.username}</p>
                                    </div>
                                </div>
                                <p>{post.content}</p>
                                <div className="post-actions">
                                    <button>Like</button>
                                    <button>Comment</button>
                                    <button>Share</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Profile;
