import React, { useState } from 'react';
import { editUsername } from '../API/settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const AddUsernameModal = ({ user, onClose }) => {
    const accessToken = JSON.parse(localStorage.getItem('user'))?.access;
    const [username, setUsername] = useState(user.username);
    const [loading, setLoading] = useState(false);

    const handleSaveUsername = async () => {
        setLoading(true); 
        try {
            await editUsername(user.id, username, accessToken);
            setLoading(false); 
           
            onClose(); 
        } catch (error) {
            setLoading(false);
            console.error('Error updating username:', error);
            alert('Failed to update username. Please try again.');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Change Username</h2>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading} 
                />
                <div className="modal-actions">
                    <button onClick={handleSaveUsername} disabled={loading}>
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

export default AddUsernameModal;
