import React from 'react';
import { Link } from 'react-router-dom'; 
import '../styles/Profil.css';

const Profile = ({ user }) => {
  const { first_name, last_name, bio, username, is_teacher } = user;
  const initials = `${first_name[0]}${last_name[0]}`;

  return (
    <Link to={`/user/${username}`} className="CMprofile-card-link">
      <div className="CMprofile-card">
        <div className="CMprofile-picture">{initials}</div>
        <div className="CMprofile-info">
          <h2 className="CMname">
            {first_name} {last_name}
            {is_teacher && <span className="CMteacher-check">t &#10003;</span>}
          </h2>
          <p className="CMusername">@{username}</p>
          <p className="CMbio">{bio}</p>
          <button className="CMfollow-button">Follow</button>
        </div>
      </div>
    </Link>
  );
};

export default Profile;
