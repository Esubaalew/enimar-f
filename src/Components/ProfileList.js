import React, { useState, useEffect } from 'react';
import Profile from './Profile';
import '../styles/ProfileList.css';
import { getAllUsers } from '../API/users';
import { useNavigate } from 'react-router-dom';
import { Triangle } from 'react-loader-spinner';

const Profiles = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('teachers');
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user'));
  const accessToken = userData ? userData.access : null;

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const allUsers = await getAllUsers(accessToken);
        const filteredTeachers = allUsers.filter(user => user.is_teacher);
        const filteredStudents = allUsers.filter(user => user.is_student);
        setTeachers(filteredTeachers);
        setStudents(filteredStudents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching all users:', error.message);
        navigate('/in');
      }
    };

    fetchAllUsers();
  }, [accessToken, navigate]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="CMprofiles-container">
      <h1>All Profiles</h1>
      <div className="CMtabs">
        <button className={`CMtab ${activeTab === 'teachers' ? 'active' : ''}`} onClick={() => handleTabClick('teachers')}>Teachers</button>
        <button className={`CMtab ${activeTab === 'students' ? 'active' : ''}`} onClick={() => handleTabClick('students')}>Students</button>
      </div>
      {loading ? (
        <div className="CMspinner-container">
          <Triangle visible={true} height="100" width="100" color="#007bff" ariaLabel="rotating-triangles-loading" wrapperStyle={{}} wrapperClass="" />
          <p className="CMloading-text">Getting users...</p>
        </div>
      ) : (
        <div className="CMprofiles">
          {activeTab === 'teachers' && teachers.map(user => (
            <Profile key={user.id} user={user} />
          ))}
          {activeTab === 'students' && students.map(user => (
            <Profile key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profiles;
