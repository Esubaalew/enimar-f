import React, { useState } from 'react';
import '../styles/AddQuestionModal.css';

const AddQuestionModal = ({ isOpen, onClose, onAddQuestion, subsectionId }) => {
  const [questionText, setQuestionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const questionData = {
        text: questionText,
        subsection: subsectionId
      };

      await onAddQuestion(questionData);
      onClose(); // Close the modal after successful addition
    } catch (error) {
      setErrorMessage('Failed to add question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setQuestionText('');
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="question-modal-overlay">
          <div className="question-modal-content">
            <div className="add-question-modal">
              <h2>Add Question</h2>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="question">Question:</label>
                  <input
                    type="text"
                    id="question"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" disabled={loading}>
                    {loading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      'Add Question'
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

export default AddQuestionModal;
