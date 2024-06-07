import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseById } from '../API/courses';
import '../styles/CourseDashboard.css';

const CourseDashboard = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = JSON.parse(localStorage.getItem('user')).access;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const fetchedCourse = await getCourseById(id, accessToken);
        setCourse(fetchedCourse);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, accessToken]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="course-dashboard-container">
      <h1>Course Dashboard</h1>
      <div className="course-details">
        <h2>{course.title}</h2>
        <p>Description: {course.description}</p>
        <p>Price: ${course.price}</p>
        <p>Teacher: {course.teacher}</p>
        {/* Add more course details as needed */}
      </div>
      {/* Add buttons or links for editing course details */}
    </div>
  );
};

export default CourseDashboard;
