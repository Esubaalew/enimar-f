import React, { useState } from 'react';
import '../styles/PostModal.css';
import { createPost } from '../API/posts';

const PostModal = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const accessToken = JSON.parse(localStorage.getItem('user')).access;
  const author = JSON.parse(localStorage.getItem('user')).id; 

  const handlePhotoChange = (event) => {
    setPhoto(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const postData = new FormData();
    postData.append('title', title);
    postData.append('text', caption);
    postData.append('author', author);
    if (photo) {
      postData.append('photo', photo);
    }

    try {
      const newPost = await createPost(postData, accessToken);
      console.log('New post created:', newPost);
      onClose();
    } catch (error) {
      setError(error.message);
      console.error('Failed to create post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Pmodal-overlay" onClick={onClose}>
      <div className="Pmodal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="caption">Caption</label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="photo">Photo</label>
            <input
              type="file"
              id="photo"
              onChange={handlePhotoChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="post-button" disabled={loading}>
              {loading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                'Post'
              )}
            </button>
            <button type="button" className="cancel-button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default PostModal;
