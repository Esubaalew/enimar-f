import React, { useState } from 'react';
import '../styles/ConfirmPublishModal.css';

const ConfirmPublishModal = ({ isOpen, onRequestClose, onConfirm, error }) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm(); 
      setShowSuccessMessage(true);
      setTimeout(() => {
        onRequestClose(); 
        setShowSuccessMessage(false); 
      }, 1500); 
    } catch (error) {
      console.error('Error publishing course:', error);

    }
  };

  return (
    <div className="CCMmodal-overlay">
      <div className="CCMmodal-content">
        <h2>Confirm Publish</h2>
        <p>Are you sure you want to publish this course?</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {showSuccessMessage && (
          <p className="success-message">Course published successfully!</p>
        )}
        <button onClick={handleConfirm}>Yes, Publish</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmPublishModal;
