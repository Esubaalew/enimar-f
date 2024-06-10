// Header.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBook, faComments } from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="Hheader">
      <div className="Hlogo">
        <div className="Hlogo-bing">A</div> {/* Bing Icon Placeholder */}
        <span className="Hlogo-text">Acme</span>
      </div>
      <nav className="Hnav">
        <ul className="Hnav-list">
          <li className="Hnav-item">
            <a href="#users" className="Hnav-link">
              <FontAwesomeIcon icon={faUser} className="Hnav-icon" /> Users
            </a>
          </li>
          <li className="Hnav-item">
            <a href="#courses" className="Hnav-link">
              <FontAwesomeIcon icon={faBook} className="Hnav-icon" /> Courses
            </a>
          </li>
          <li className="Hnav-item">
            <a href="#chat" className="Hnav-link">
              <FontAwesomeIcon icon={faComments} className="Hnav-icon" /> Chat
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
