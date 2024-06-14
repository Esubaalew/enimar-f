import React, { useState } from 'react';
import '../styles/AddSubsectionModal.css';

const AddSubsectionModal = ({ isOpen, onClose, onAddSubsection, sectionId }) => {
  const [subsectionName, setSubsectionName] = useState('');
  const [subsectionContent, setSubsectionContent] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAddSubsection({ name: subsectionName, content: subsectionContent, section: sectionId });
      setSuccessMessage('Subsection added successfully!');
      setSubsectionName('');
      setSubsectionContent('');
    } catch (error) {
      setErrorMessage('Failed to add subsection. Please try again.');
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
        <div className="Submodal-overlay" onClick={closeModal}>
          <div className="Submodal-content" onClick={(e) => e.stopPropagation()}>
            <div className="add-subsection-modal">
              <h2>Add Subsection</h2>
              {successMessage && <p className="success-message">{successMessage}</p>}
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="subsectionName">Name:</label>
                  <input
                    type="text"
                    id="subsectionName"
                    value={subsectionName}
                    onChange={(e) => setSubsectionName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subsectionContent">Content:</label>
                  <textarea
                    id="subsectionContent"
                    value={subsectionContent}
                    onChange={(e) => setSubsectionContent(e.target.value)}
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" disabled={loading}>
                    {loading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      'Add Subsection'
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

export default AddSubsectionModal;
