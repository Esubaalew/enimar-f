import React from 'react';
import '../styles/ConfirmPublishModal.css';

const ConfirmPublishModal = ({ isOpen, onRequestClose, onConfirm, error }) => {
  if (!isOpen) return null;

  return (
    <div className="CCMmodal-overlay">
      <div className="CCMmodal-content">
        <h2>Confirm Publish</h2>
        <p>Are you sure you want to publish this course?</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={onConfirm}>Yes, Publish</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmPublishModal;
