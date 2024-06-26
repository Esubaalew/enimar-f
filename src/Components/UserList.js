import React from 'react';
import '../styles/UserList.css';
import { Link } from 'react-router-dom';

const UserList = ({ users }) => {
  const filteredUsers = users.filter(user => user.is_teacher || user.is_student);

  const getInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`;
  };

  return (
    <div className="user-list">
      <h1>Suggested Users</h1>
      <div className="user-list-container">
        {filteredUsers.map(user => (
          <Link to={`/user/${user.username}`} key={user.id} className="user-card-link">
            <div className="user-card">
              <div className="initials-avatar">
                {getInitials(user.first_name, user.last_name)}
              </div>
              <div className="user-info">
                <h3>{user.first_name + " " + user.last_name}</h3>
                <button className="follow-button">Follow</button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserList;
