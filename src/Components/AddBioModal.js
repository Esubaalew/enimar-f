import React, { useState } from 'react';
import { editBio } from '../API/settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const AddBioModal = ({ user, onClose }) => {
    const accessToken = JSON.parse(localStorage.getItem('user'))?.access;
    const [bio, setBio] = useState(user.bio);
    const [loading, setLoading] = useState(false);
    const handleSaveBio = async () => {
        setLoading(true);
        try {
            await editBio(user.id, bio, accessToken); 
            setLoading(false); 
            onClose(); 
        } catch (error) {
            setLoading(false); 
            console.error('Error updating bio:', error);
            alert('Failed to update bio. Please try again.');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Edit Bio</h2>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
                <div className="modal-actions">
                    <button onClick={handleSaveBio} disabled={loading}>
                        {loading ? (
                            <FontAwesomeIcon icon={faSpinner} spin /> 
                        ) : (
                            'Save'
                        )}
                    </button>
                    <button onClick={onClose} disabled={loading}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AddBioModal;
