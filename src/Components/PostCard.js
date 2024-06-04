import React, { useState, useEffect } from 'react';
import { getUserById } from '../API/users';
import ProfileIcon from './ProfileIcon'; // Make sure to import the ProfileIcon component
import { FaThumbsUp, FaCommentAlt, FaShare } from 'react-icons/fa'; // Import the icons
import '../styles/PostCard.css';

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
        <div className="postt-card">
            <div className="post-header">
                {user && (
                    <ProfileIcon firstName={user.first_name} lastName={user.last_name} />
                )}
                <div className="post-author">
                    <strong>{user?.username}</strong>
                    <small>{new Date(post.created).toLocaleDateString()}</small>
                </div>
            </div>
            <div className="post-content">
                <h3>{post.title}</h3>
                <p>{post.text}</p>
                {post.photos && post.photos.length > 0 && (
                    <div className="post-photos">
                        {post.photos.map((photo, index) => (
                            <img key={index} src={photo.url} alt={` ${index + 1}`} />
                        ))}
                    </div>
                )}
                {post.video && (
                    <div className="post-video">
                        <video controls>
                            <source src={post.video.url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}
            </div>
            <div className="post-buttons">
                <button className="like-button">
                    <FaThumbsUp />
                </button>
                <button className="comment-button">
                    <FaCommentAlt />
                </button>
                <button className="share-button">
                    <FaShare />
                </button>
            </div>
        </div>
    );
};

export default PostCard;
