import React, { useState, useEffect } from 'react';
import PostModal from './PostModal';
import { useNavigate } from 'react-router-dom';
import ProfileIcon from './ProfileIcon';
import { getLoggedInUser } from '../API/auth';
import '../styles/Home.css';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = JSON.parse(localStorage.getItem('user'))?.access;
    if (accessToken) {
      getLoggedInUser(accessToken)
        .then(userData => {
          setUser(userData);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          // // Optionally navigate to login page or show a message
          // navigate('/login'); 
        });
    } else {
      navigate('/login'); 
    }
  }, [navigate]);

  const openModal = (event) => {
    if (event.currentTarget === event.target) {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="create-post-card" onClick={openModal}>
      <ProfileIcon firstName={user?.first_name} lastName={user?.last_name} />
      <input type="text" placeholder="What's on your mind?" />
      {isModalOpen && <PostModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Home;
