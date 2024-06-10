import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBook, faComments, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { getLoggedInUser } from '../API/auth';
import '../styles/Header.css';

const Header = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const accessToken = JSON.parse(localStorage.getItem('user'))?.access;
    if (accessToken) {
      getLoggedInUser(accessToken)
        .then(userData => {
          setUsername(userData.username);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, []);

  return (
    <header className="Hheader">
      <div className="Hlogo">
        <div className="Hlogo-bing">E</div>
        <span className="Hlogo-text">Enimar</span>
      </div>
      <nav className="Hnav">
        <ul className="Hnav-list">
          <li className="Hnav-item">
            <a href="/community" className="Hnav-link">
              <FontAwesomeIcon icon={faUser} className="Hnav-icon" /> Users
            </a>
          </li>
          <li className="Hnav-item">
            <a href="/coursesS" className="Hnav-link">
              <FontAwesomeIcon icon={faBook} className="Hnav-icon" /> Courses
            </a>
          </li>
          <li className="Hnav-item">
            <a href="/chat" className="Hnav-link">
              <FontAwesomeIcon icon={faComments} className="Hnav-icon" /> Chat
            </a>
          </li>
          {username && (
            <li className="Hnav-item">
              <a href={`/user/${username}`} className="Hnav-link">
                <FontAwesomeIcon icon={faUserCircle} className="Hnav-icon" /> Me
              </a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
