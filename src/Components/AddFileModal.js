import React, { useState } from 'react';
import '../styles/AddFileModal.css';

const AddFileModal = ({ isOpen, onClose, onAddFile, subsectionId }) => {
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fileData = new FormData();
    fileData.append('file_name', fileName);
    fileData.append('file_url', fileUrl);
    fileData.append('subsection', subsectionId);

    try {
      await onAddFile(fileData);
      setSuccessMessage('File added successfully!');
      setFileName('');
      setFileUrl(null);
      setLoading(false);
    } catch (error) {
      setErrorMessage('Failed to add file. Please try again.');
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
        <div className="file-modal-overlay" onClick={closeModal}>
          <div className="file-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="add-file-modal">
              <h2>Add File</h2>
              {successMessage && <p className="success-message">{successMessage}</p>}
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="fileName">File Name:</label>
                  <input
                    key="fileName"
                    type="text"
                    id="fileName"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fileUrl">File:</label>
                  <input
                    key="fileUrl"
                    type="file"
                    id="fileUrl"
                    onChange={(e) => setFileUrl(e.target.files[0])}
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" disabled={loading}>
                    {loading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      'Add File'
                    )}
                  </button>
                  <button type="button" onClick={closeModal} disabled={loading}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddFileModal;
