import React, { useState, useEffect } from 'react';
import { addComment } from '../API/comments';
import { getPostComments } from '../API/posts';
import { getUserById } from '../API/users';
import '../styles/CommentModal.css';
import { formatDistanceToNow } from 'date-fns';

const CommentModal = ({ isOpen, onClose, post, accessToken }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            const fetchComments = async () => {
                try {
                    const fetchedComments = await getPostComments(post.id, accessToken);
                    
                    // Fetch user details for each comment
                    const commentsWithUser = await Promise.all(
                        fetchedComments.map(async (comment) => {
                            const user = await getUserById(comment.user, accessToken);
                            return { ...comment, user };
                        })
                    );

                    setComments(commentsWithUser);
                } catch (error) {
                    console.error('Error fetching comments:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchComments();
        }
    }, [isOpen, post.id, accessToken]);

    const handleAddComment = async () => {
        if (newComment.trim() === '') return;

        try {
            const commentData = {
                text: newComment,
                post: post.id,
            };
            const addedComment = await addComment(commentData, accessToken);
            
            // Fetch user details for the new comment
            const user = await getUserById(addedComment.user, accessToken);
            setComments([...comments, { ...addedComment, user }]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="COM-modal-overlay" onClick={onClose}>
            <div className="COM-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="COM-comment-modal">
                    <div className="COM-post-card">
                        <div className="COM-post-header">
                            <strong>{post.title}</strong>
                            <small>{formatDistanceToNow(new Date(post.created))} ago</small>
                        </div>
                        <div className="COM-post-content">
                            <p>{post.text}</p>
                            {post.photos && post.photos.length > 0 && (
                                <div className="COM-post-photos">
                                    {post.photos.map((photo, index) => (
                                        <img key={index} src={photo.url} alt={` ${index + 1}`} />
                                    ))}
                                </div>
                            )}
                            {post.video && (
                                <div className="COM-post-video">
                                    <video controls>
                                        <source src={post.video.url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="COM-comments-section">
                        {loading ? (
                            <p>Loading comments...</p>
                        ) : (
                            <div className="COM-comments-list">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="COM-comment">
                                        <div className="COM-comment-user">
                                            <div className="COM-user-icon">
                                                {comment.user.first_name[0]}{comment.user.last_name[0]}
                                            </div>
                                            <div>
                                                <p><strong>{comment.user.first_name} {comment.user.last_name}</strong></p>
                                                <small>{formatDistanceToNow(new Date(comment.created))} ago</small>
                                            </div>
                                        </div>
                                        <p>{comment.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="COM-add-comment">
                        <textarea 
                            value={newComment} 
                            onChange={(e) => setNewComment(e.target.value)} 
                            placeholder="Add a comment..."
                        />
                        <button onClick={handleAddComment}>Comment</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentModal;
