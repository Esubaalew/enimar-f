import React, { useState, useEffect } from 'react';
import { getPostLikes } from '../API/posts';
import { getUserById } from '../API/users';
import { addLike, deleteLike } from '../API/likes';
import { getLoggedInUser } from '../API/auth';
import '../styles/LikeModal.css';
import { formatDistanceToNow } from 'date-fns';

const LikeModal = ({ isOpen, onClose, post, accessToken }) => {
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasLiked, setHasLiked] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentLikeId, setCurrentLikeId] = useState(null); // Store the like ID for deletion

    useEffect(() => {
        if (isOpen) {
            const fetchLikes = async () => {
                try {
                    const fetchedLikes = await getPostLikes(post.id, accessToken);

                    const likesWithUser = await Promise.all(
                        fetchedLikes.map(async (like) => {
                            const user = await getUserById(like.user, accessToken);
                            return { ...like, user };
                        })
                    );

                    setLikes(likesWithUser);

                    // Get the current logged-in user
                    const loggedInUser = await getLoggedInUser(accessToken);
                    setCurrentUser(loggedInUser);

                    // Check if the current user has already liked the post and get the like ID
                    const userLike = likesWithUser.find(like => like.user.id === loggedInUser.id);
                    setHasLiked(!!userLike);
                    setCurrentLikeId(userLike ? userLike.id : null);
                } catch (error) {
                    console.error('Error fetching likes or current user:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchLikes();
        }
    }, [isOpen, post.id, accessToken]);

    const handleLikePost = async () => {
        if (!currentUser) return;

        try {
            const likeData = {
                post: post.id,
            };
            const newLike = await addLike(likeData, accessToken);
            const user = await getUserById(currentUser.id, accessToken);
            setLikes([...likes, { id: newLike.id, user, created: new Date() }]);
            setHasLiked(true);
            setCurrentLikeId(newLike.id); // Store the new like ID
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleUnlikePost = async () => {
        if (!currentUser || !currentLikeId) return;

        try {
            await deleteLike(currentLikeId, accessToken);
            setLikes(likes.filter(like => like.id !== currentLikeId));
            setHasLiked(false);
            setCurrentLikeId(null); // Clear the like ID
        } catch (error) {
            console.error('Error unliking post:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="LM-modal-overlay" onClick={onClose}>
            <div className="LM-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="LM-like-modal">
                    <div className="LM-post-card">
                        <div className="LM-post-header">
                            <strong>{post.title}</strong>
                            <small>{formatDistanceToNow(new Date(post.created))} ago</small>
                        </div>
                        <div className="LM-post-content">
                            <p>{post.text}</p>
                            {post.photos && post.photos.length > 0 && (
                                <div className="LM-post-photos">
                                    {post.photos.map((photo, index) => (
                                        <img key={index} src={photo.url} alt={`Photoing ${index + 1}`} />
                                    ))}
                                </div>
                            )}
                            {post.video && (
                                <div className="LM-post-video">
                                    <video controls>
                                        <source src={post.video.url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="LM-likes-section">
                        {loading ? (
                            <p>Loading likes...</p>
                        ) : (
                            <div className="LM-likes-list">
                                {likes.map((like) => (
                                    <div key={like.id} className="LM-like">
                                        <div className="LM-like-user">
                                            <div className="LM-user-icon">
                                                {like.user.first_name[0]}{like.user.last_name[0]}
                                            </div>
                                            <div>
                                                <p><strong>{like.user.first_name} {like.user.last_name}</strong></p>
                                                <small>{formatDistanceToNow(new Date(like.created))} ago</small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="LM-add-like">
                        {hasLiked ? (
                            <button onClick={handleUnlikePost}>Unlike</button>
                        ) : (
                            <button onClick={handleLikePost}>Like this post</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LikeModal;
