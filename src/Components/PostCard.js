import React, { useState, useEffect } from 'react';
import { getUserById } from '../API/users';


const PostCard = ({ post }) => {
    const accessToken = JSON.parse(localStorage.getItem('user'))?.access;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUserById(post.author, accessToken);
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [post.author, accessToken]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="post-card">
            <h3>{post.title}</h3>
            <p>{post.text}</p>
            {user && <small>By: {user.username}</small>}
        </div>
    );
};

export default PostCard;
