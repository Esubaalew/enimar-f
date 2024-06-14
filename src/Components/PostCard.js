import React, { useState, useEffect } from 'react';
import { getUserById } from '../API/users';
import ProfileIcon from './ProfileIcon';
import { FaThumbsUp, FaCommentAlt, FaShare } from 'react-icons/fa'; 
import { formatDistanceToNow } from 'date-fns'; 
import CommentModal from './CommentModal'; 
import '../styles/PostCard.css';

const PostCard = ({ post }) => {
    const accessToken = JSON.parse(localStorage.getItem('user'))?.access;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

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
            <div className="post-header">
                {user && (
                    <ProfileIcon firstName={user.first_name} lastName={user.last_name} />
                )}
                <div className="post-author">
                    <strong>{user?.username}</strong>
                    <small>{formatDistanceToNow(new Date(post.created))} ago</small>
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
                <button className="comment-button" onClick={() => setIsCommentModalOpen(true)}>
                    <FaCommentAlt />
                </button>
                <button className="share-button">
                    <FaShare />
                </button>
            </div>
            <CommentModal 
                isOpen={isCommentModalOpen} 
                onClose={() => setIsCommentModalOpen(false)} 
                post={post}
                accessToken={accessToken}
            />
        </div>
    );
};

export default PostCard;
