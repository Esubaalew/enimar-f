import React, { useState } from 'react';
import '../styles/AddChoiceModal.css';

const AddChoiceModal = ({ isOpen, onClose, onSubmit, questionId }) => {
  const [choiceText, setChoiceText] = useState('');
  const [isCorrect, setIsCorrect] = useState(false); // State for is_correct field
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const choiceData = {
        text: choiceText,
        question: questionId,
        is_correct: isCorrect,
      };

      await onSubmit(choiceData);
      setChoiceText('');
      setIsCorrect(false);
      setLoading(false);
      setErrorMessage(null);
    } catch (error) {
      console.error('Error adding choice:', error);
      setErrorMessage('Failed to add choice. Please try again.');
      setLoading(false);
    }
  };

  const closeModal = () => {
    setChoiceText('');
    setIsCorrect(false);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="choice-modal-overlay">
          <div className="choice-modal-content">
            <div className="add-choice-modal">
              <h2>Add Choice</h2>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="choice">Choice:</label>
                  <input
                    type="text"
                    id="choice"
                    value={choiceText}
                    onChange={(e) => setChoiceText(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="isCorrect">Is Correct:</label>
                  <input
                    type="checkbox"
                    id="isCorrect"
                    checked={isCorrect}
                    onChange={(e) => setIsCorrect(e.target.checked)}
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" disabled={loading}>
                    {loading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      'Add Choice'
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

export default AddChoiceModal;
