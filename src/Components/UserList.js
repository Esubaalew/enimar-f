import React from 'react';
import ProfileIcon from './ProfileIcon';
import '../styles/UserList.css';

const UserList = ({ users }) => {

  const filteredUsers = users.filter(user => user.is_teacher || user.is_student);

  return (
    <div className="user-list">
      <h1> Suggested Users</h1>
      <div className="user-list-container">
        {filteredUsers.map(user => (
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
