import React, { useState } from 'react';
import { editFirstName, editLastName } from '../API/settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const AddPersonalModal = ({ user, onClose }) => {
    const accessToken = JSON.parse(localStorage.getItem('user'))?.access;
    const [firstName, setFirstName] = useState(user.first_name);
    const [lastName, setLastName] = useState(user.last_name);
    const [loading, setLoading] = useState(false);
    const handleSavePersonalInfo = async () => {
        setLoading(true);
        try {
            await editFirstName(user.id, firstName, accessToken); 
            await editLastName(user.id, lastName, accessToken); 
            setLoading(false); 
            onClose(); 
        } catch (error) {
            setLoading(false);
            console.error('Error updating personal info:', error);
            alert('Failed to update personal info. Please try again.');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Edit Personal Info</h2>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    disabled={loading} 
                />
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    disabled={loading} 
                />
                <div className="modal-actions">
                    <button onClick={handleSavePersonalInfo} disabled={loading}>
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

export default AddPersonalModal;
