import React, { useState, useEffect } from 'react';
import { getLoggedInUser } from '../API/auth';
import AddBioModal from './AddBioModal';
import AddPersonalModal from './AddPersonalModal';
import AddUsernameModal from './AddUsernameModal';
import '../styles/SettingsPage.css';

const SettingsPage = () => {
    const accessToken = JSON.parse(localStorage.getItem('user'))?.access;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showBioModal, setShowBioModal] = useState(false);
    const [showPersonalModal, setShowPersonalModal] = useState(false);
    const [showUsernameModal, setShowUsernameModal] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getLoggedInUser(accessToken);
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [accessToken]);

    const handleOpenBioModal = () => {
        setShowBioModal(true);
    };

    const handleOpenPersonalModal = () => {
        setShowPersonalModal(true);
    };

    const handleOpenUsernameModal = () => {
        setShowUsernameModal(true);
    };

    if (loading) {
        return <div className="ssp-settings-page">Loading...</div>;
    }

    if (!user) {
        return <div className="ssp-settings-page">User not found.</div>;
    }

    return (
        <div className="ssp-settings-page">
            <div className="ssp-profile-section">
                <div className="ssp-user-avatar">
                    {user.first_name.charAt(0)}
                    {user.last_name.charAt(0)}
                </div>
                <div className="ssp-profile-info">
                    <div className="ssp-user-name">{`${user.first_name} ${user.last_name}`}</div>
                    <div className="ssp-user-username">@{user.username}</div>
                </div>
            </div>
            <div className="ssp-settings-section" onClick={handleOpenPersonalModal}>
                <h3>Personal Info</h3>
            </div>
            <div className="ssp-settings-section" onClick={handleOpenUsernameModal}>
                <h3>Username</h3>
            </div>
            <div className="ssp-settings-section" onClick={handleOpenBioModal}>
                <h3>Bio</h3>
            </div>
            {showPersonalModal && <AddPersonalModal user={user} onClose={() => setShowPersonalModal(false)} />}
            {showUsernameModal && <AddUsernameModal user={user} onClose={() => setShowUsernameModal(false)} />}
            {showBioModal && <AddBioModal user={user} onClose={() => setShowBioModal(false)} />}
        </div>
    );
};

export default SettingsPage;
