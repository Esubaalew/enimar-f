import React, { useState } from 'react';
import '../styles/AddSectionModal.css'; 

const AddSectionModal = ({ isOpen, onClose, onAddSection, courseId }) => {
  const [sectionName, setSectionName] = useState('');
  const [sectionDescription, setSectionDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAddSection({ name: sectionName, description: sectionDescription, course: courseId });
      setSuccessMessage('Section added successfully!');
      setSectionName('');
      setSectionDescription('');
    } catch (error) {
      setErrorMessage('Failed to add section. Please try again.');
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
        <div className="Semodal-overlay" onClick={closeModal}>
          <div className="Semodal-content" onClick={(e) => e.stopPropagation()}>
            <div className="add-section-modal">
              <h2>Add Section</h2>
              {successMessage && <p className="success-message">{successMessage}</p>}
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="sectionName">Name:</label>
                  <input
                    key="sectionName"
                    type="text"
                    id="sectionName"
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="sectionDescription">Description:</label>
                  <textarea
                    key="sectionDescription"
                    id="sectionDescription"
                    value={sectionDescription}
                    onChange={(e) => setSectionDescription(e.target.value)}
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" disabled={loading}>
                    {loading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      'Add Section'
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

export default AddSectionModal;
