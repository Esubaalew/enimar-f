import React, { useState } from 'react';
import '../styles/AddPhotoModal.css';

const AddPhotoModal = ({ isOpen, onClose, onAddPhoto, subsectionId }) => {
  const [photo, setPhoto] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const photoData = new FormData();
    photoData.append('image', photo);
    photoData.append('subsection', subsectionId);

    setLoading(true);
    try {
      await onAddPhoto(photoData);
      setSuccessMessage('Photo added successfully!');
      setPhoto(null);
    } catch (error) {
      setErrorMessage('Failed to add photo. Please try again.');
    } finally {
      setLoading(false);
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
        <div className="photo-modal-overlay" onClick={closeModal}>
          <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="add-photo-modal">
              <h2>Add Photo</h2>
              {successMessage && <p className="success-message">{successMessage}</p>}
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="photo">Photo:</label>
                  <input
                    key="photo"
                    type="file"
                    id="photo"
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" disabled={loading}>
                    {loading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      'Add Photo'
                    )}
                  </button>
                  <button type="button" onClick={closeModal} disabled={loading}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPhotoModal;
