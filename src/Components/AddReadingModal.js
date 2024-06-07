import React, { useState } from 'react';
import '../styles/AddReadingModal.css';

const AddReadingModal = ({ isOpen, onClose, onAddReading, subsectionId }) => {
  const [readingTitle, setReadingTitle] = useState('');
  const [readingContent, setReadingContent] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onAddReading({ title: readingTitle, content: readingContent, subsection: subsectionId });
      setSuccessMessage('Reading added successfully!');
      setReadingTitle('');
      setReadingContent('');
    } catch (error) {
      setErrorMessage('Failed to add reading. Please try again.');
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
        <div className="reading-modal-overlay" onClick={closeModal}>
          <div className="reading-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="add-reading-modal">
              <h2>Add Reading</h2>
              {successMessage && <p className="success-message">{successMessage}</p>}
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="readingTitle">Title:</label>
                  <input
                    key="readingTitle"
                    type="text"
                    id="readingTitle"
                    value={readingTitle}
                    onChange={(e) => setReadingTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="readingContent">Content:</label>
                  <textarea
                    key="readingContent"
                    id="readingContent"
                    value={readingContent}
                    onChange={(e) => setReadingContent(e.target.value)}
                  />
                </div>
                <button type="submit">Add Reading</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddReadingModal;
