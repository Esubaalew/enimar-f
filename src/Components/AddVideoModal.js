import React, { useState } from 'react';
import '../styles/AddVideoModal.css';

const AddVideoModal = ({ isOpen, onClose, onAddVideo, subsectionId }) => {
  const [video, setVideo] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const videoData = new FormData();
    videoData.append('video_file', video);
    videoData.append('subsection', subsectionId);

    try {
      await onAddVideo(videoData);
      setSuccessMessage('Video added successfully!');
      setVideo(null);
    } catch (error) {
      setErrorMessage('Failed to add video. Please try again.');
    }
  };

  const closeModal = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="video-modal-overlay" onClick={closeModal}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="add-video-modal">
              <h2>Add Video</h2>
              {successMessage && <p className="success-message">{successMessage}</p>}
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="video">Video:</label>
                  <input
                    key="video"
                    type="file"
                    id="video"
                    onChange={(e) => setVideo(e.target.files[0])}
                  />
                </div>
                <button type="submit">Add Video</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddVideoModal;
