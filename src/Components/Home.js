import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import PostModal from './PostModal';
import ProfileIcon from './ProfileIcon';
import PostCard from './PostCard';
import CourseList from './CourseList';
import UserList from './UserList';
import { getAllUsers } from '../API/users';
import { getLoggedInUser } from '../API/auth';
import { getPosts } from '../API/posts';
import { getAllCourses } from '../API/courses';
import '../styles/Home.css';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = JSON.parse(localStorage.getItem('user'))?.access;
    if (accessToken) {
      getLoggedInUser(accessToken)
        .then(userData => {
          setUser(userData);
          return Promise.all([
            getPosts(accessToken),
            getAllCourses(accessToken),
            getAllUsers(accessToken)
          ]);
        })
        .then(([postsData, coursesData, usersData]) => {
          setPosts(postsData);
          setCourses(coursesData);
          setUsers(usersData);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          navigate('/in'); 
        });
    } else {
      navigate('/in'); 
    }
  }, [navigate]);

  const openModal = (event) => {
    if (event.currentTarget === event.target) {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="home-container">
      <Header />
      <div className="main-content">
        <div className="post-section">
          <div className="create-post-card" onClick={openModal}>
            <ProfileIcon firstName={user?.first_name} lastName={user?.last_name} />
            <input type="text" placeholder="What's on your mind?" />
            <button type="button">Post</button>
          </div>
          {isModalOpen && <PostModal onClose={() => setIsModalOpen(false)} />}
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <div className="sidebar">
          <CourseList courses={courses} />
          <UserList users={users} />
        </div>
      </div>
    </div>
  );
};

export default Home;
