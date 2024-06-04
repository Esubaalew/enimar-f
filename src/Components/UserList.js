import React from 'react';
import ProfileIcon from './ProfileIcon';
import '../styles/UserList.css';

const UserList = ({ users }) => {
  return (
    <div className="user-list">
      <div className="user-list-container">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-avatar">
              <ProfileIcon firstName={user?.first_name} lastName={user?.last_name} />
            </div>
            <div className="user-info">
              <h3>{user.first_name + " " + user.last_name}</h3>
              <button className="follow-button">Follow</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
