import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import PostModal from './PostModal';
import PostCard from './PostCard';
import CourseList from './CourseList';
import UserList from './UserList';
import CourseModal from './CourseModal';
import { getAllUsers } from '../API/users';
import { getLoggedInUser } from '../API/auth';
import { getPosts } from '../API/posts';
import { getAllCourses } from '../API/courses';
import '../styles/Home.css';

const Home = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
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
            getAllUsers(accessToken),
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

  const openPostModal = (event) => {
    if (event.currentTarget === event.target) {
      setIsPostModalOpen(true);
    }
  };

  const openCourseModal = (event) => {
    if (event.currentTarget === event.target) {
      setIsCourseModalOpen(true);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`;
  };

  return (
    <div className="home-container">
      <Header />
      <div className="main-content">
        <div className="post-section">
          <div className="create-post-card" onClick={openPostModal}>
            {user && (
              <div className="initials-icon">
                {getInitials(user.first_name, user.last_name)}
              </div>
            )}
            <input type="text" placeholder="What's on your mind?" />
            <button type="button">Post</button>
          </div>
          {user?.is_teacher && (
            <div className="create-post-card" onClick={openCourseModal}>
              {user && (
                <div className="initials-icon">
                  {getInitials(user.first_name, user.last_name)}
                </div>
              )}
              <input type="text" placeholder="Create a new course" />
              <button type="button">Create</button>
            </div>
          )}
          {isPostModalOpen && <PostModal onClose={() => setIsPostModalOpen(false)} />}
          {isCourseModalOpen && <CourseModal onClose={() => setIsCourseModalOpen(false)} />}
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <div className="sidebar">
          {!user?.is_teacher && <CourseList courses={courses} />}
          <UserList users={users} />
        </div>
      </div>
    </div>
  );
};

export default Home;
