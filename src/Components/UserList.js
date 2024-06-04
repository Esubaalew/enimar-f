import React from 'react';

const UserList = ({ users }) => {
  return (
    <div className="user-list">
      <h2>Users to Follow</h2>
      {users.map(user => (
        <div key={user.id} className="user-item">
          <h3>{user.username}</h3>
          <p>{user.bio}</p>
        </div>
      ))}
    </div>
  );
};

export default UserList;
